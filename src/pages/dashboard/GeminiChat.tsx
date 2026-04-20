/**
 * GeminiChat.tsx — Production-ready Gemini chat for Sanctuary AI
 *
 * Architecture guarantees:
 *   1. API is ONLY called from sendMessage() — never from useEffect or render.
 *   2. MODULE_IS_SENDING (module-level bool) prevents ANY second call while one
 *      is in flight, even across React StrictMode double-invocations.
 *   3. 5-second cooldown (MODULE_LAST_CALL) enforced at module scope.
 *   4. Debounced click handler prevents double-click spam.
 *   5. Model: gemini-1.5-flash (stable, fast, lower rate-limit risk).
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI } from '@google/genai';

// ─── Types ────────────────────────────────────────────────────────────────────
interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  ts: number;
  streaming?: boolean;
}

// ─── Module-level singletons (survive every React re-render) ──────────────────
let MODULE_IS_SENDING = false;   // hard mutex — set BEFORE first await
let MODULE_LAST_CALL  = 0;       // ms timestamp of last attempt (success or fail)

// ─── Constants ────────────────────────────────────────────────────────────────
const MODEL        = 'gemini-1.5-flash'; // stable, fast, lower quota cost
const COOLDOWN_MS  = 5000;               // 5 s between messages
const DEBOUNCE_MS  = 400;                // ignore clicks within 400 ms of each other

const SYSTEM_PROMPT =
  `You are Sanctuary, a warm and compassionate AI mental health companion.
You help users understand their emotions, manage stress, and build emotional resilience.
Keep responses concise (2–4 sentences), empathetic, and supportive.
Never diagnose or replace professional care — always encourage professional help for serious concerns.
Use a calm, friendly tone and occasionally ask a follow-up question to keep the user engaged.`;

const SUGGESTIONS = [
  "I'm feeling anxious about something",
  'Help me calm down right now',
  "I can't stop overthinking",
  'How do I deal with work stress?',
  'I need motivation today',
  'Talk me through a breathing exercise',
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function makeId()      { return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`; }
function nowSecs()     { return Math.ceil(COOLDOWN_MS / 1000); }
function msLeft()      { return Math.max(0, COOLDOWN_MS - (Date.now() - MODULE_LAST_CALL)); }
function cooldownSecs(){ return Math.ceil(msLeft() / 1000); }

function makeWelcome(): ChatMessage {
  return {
    id:   'welcome',
    role: 'assistant',
    text: "Hi there 💜 I'm Sanctuary, your AI mental health companion. How are you feeling today? You can share anything — I'm here to listen.",
    ts:   Date.now(),
  };
}

function isRateLimit(msg: string) {
  const lower = msg.toLowerCase();
  return (
    msg.includes('429') ||
    lower.includes('quota') ||
    lower.includes('rate limit') ||
    lower.includes('too many') ||
    lower.includes('resource_exhausted')
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function GeminiChat() {
  // ── State ──────────────────────────────────────────────────────────────────
  const [messages,     setMessages]     = useState<ChatMessage[]>([makeWelcome()]);
  const [input,        setInput]        = useState('');
  const [isSending,    setIsSending]    = useState(false);  // UI loading state
  const [showTyping,   setShowTyping]   = useState(false);  // typing indicator bubble
  const [cooldown,     setCooldown]     = useState(0);      // seconds remaining
  const [error,        setError]        = useState('');

  // ── Refs (never trigger re-renders) ────────────────────────────────────────
  const abortRef         = useRef(false);
  const lastClickRef     = useRef(0);                       // debounce tracker
  const cooldownTick     = useRef<ReturnType<typeof setInterval> | null>(null);
  const messagesSnapshot = useRef<ChatMessage[]>(messages); // stale-closure-free history
  const bottomRef        = useRef<HTMLDivElement>(null);
  const textareaRef      = useRef<HTMLTextAreaElement>(null);

  // Keep snapshot in sync — pure mirror, zero API calls
  useEffect(() => { messagesSnapshot.current = messages; }, [messages]);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, showTyping]);

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 140)}px`;
  }, [input]);

  // Clean up interval on unmount
  useEffect(() => () => { if (cooldownTick.current) clearInterval(cooldownTick.current); }, []);

  // ── Cooldown countdown UI ──────────────────────────────────────────────────
  function startCooldownUI() {
    if (cooldownTick.current) clearInterval(cooldownTick.current);
    setCooldown(nowSecs());
    cooldownTick.current = setInterval(() => {
      const rem = cooldownSecs();
      setCooldown(rem);
      if (rem <= 0) {
        clearInterval(cooldownTick.current!);
        cooldownTick.current = null;
      }
    }, 250); // poll at 250 ms for smooth bar
  }

  // ── Core send function ─────────────────────────────────────────────────────
  // ONLY called from explicit user gestures (button click / Enter key).
  // Never called from useEffect, never called on render.
  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim();

    // ── Guards ──────────────────────────────────────────────────────────────

    // 1. Empty input
    if (!trimmed) return;

    // 2. Debounce: ignore if user clicked again within 400 ms
    const now = Date.now();
    if (now - lastClickRef.current < DEBOUNCE_MS) {
      console.log('[GeminiChat] debounce — ignored rapid click');
      return;
    }
    lastClickRef.current = now;

    // 3. Hard mutex (module-level — survives StrictMode double-invoke)
    if (MODULE_IS_SENDING) {
      console.log('[GeminiChat] mutex — request already in flight');
      return;
    }

    // 4. Cooldown
    const remaining = msLeft();
    if (remaining > 0) {
      console.log(`[GeminiChat] cooldown — ${Math.ceil(remaining / 1000)}s left`);
      setError(`Please wait ${Math.ceil(remaining / 1000)}s before sending another message.`);
      return;
    }

    // ── LOCK (synchronous — before any await) ────────────────────────────
    MODULE_IS_SENDING = true;
    abortRef.current  = false;

    console.log(`[GeminiChat] 🚀 API CALLED • model=${MODEL} • "${trimmed.slice(0, 60)}"`);

    // Update UI
    setError('');
    setIsSending(true);
    setShowTyping(true);
    setInput('');

    // Append user message
    const userMsg: ChatMessage = { id: makeId(), role: 'user', text: trimmed, ts: Date.now() };
    setMessages(prev => [...prev, userMsg]);

    // Placeholder for streaming AI bubble (appended after typing indicator hides)
    const aiId = makeId();

    try {
      // Validate API key
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
      if (!apiKey || apiKey.trim() === '' || apiKey === 'your_gemini_api_key_here') {
        throw new Error('VITE_GEMINI_API_KEY is not configured. Add it to .env and restart the dev server.');
      }

      const client = new GoogleGenAI({ apiKey });

      // Build prior-turn history (exclude streaming / welcome messages)
      const history = messagesSnapshot.current
        .filter(m => m.id !== 'welcome' && !m.streaming && m.text.trim() !== '')
        .map(m => ({
          role:  m.role === 'user' ? ('user' as const) : ('model' as const),
          parts: [{ text: m.text }],
        }));

      console.log(`[GeminiChat] history: ${history.length} turns`);

      const chat = client.chats.create({
        model:  MODEL,
        config: { systemInstruction: SYSTEM_PROMPT },
        history,
      });

      // Replace typing bubble with real streaming bubble
      setShowTyping(false);
      const aiMsg: ChatMessage = { id: aiId, role: 'assistant', text: '', ts: Date.now(), streaming: true };
      setMessages(prev => [...prev, aiMsg]);

      // Stream response
      let fullText = '';
      const stream = await chat.sendMessageStream({ message: trimmed });

      for await (const chunk of stream) {
        if (abortRef.current) {
          console.log('[GeminiChat] ⛔ stream aborted');
          break;
        }
        fullText += chunk.text ?? '';
        // Update only the AI bubble — no other state touched
        setMessages(prev =>
          prev.map(m => m.id === aiId ? { ...m, text: fullText } : m)
        );
      }

      // Mark streaming complete
      setMessages(prev =>
        prev.map(m => m.id === aiId ? { ...m, streaming: false } : m)
      );

      console.log(`[GeminiChat] ✅ done — ${fullText.length} chars`);

    } catch (err: unknown) {
      setShowTyping(false);
      // Remove empty AI bubble
      setMessages(prev => prev.filter(m => m.id !== aiId));

      const raw = err instanceof Error ? err.message : String(err);

      if (isRateLimit(raw)) {
        console.warn('[GeminiChat] ⚠️ rate limit:', raw);
        setError('Too many requests, please wait a moment before sending another message.');
      } else {
        console.error('[GeminiChat] ❌ error:', raw);
        setError('Something went wrong. Please try again.');
      }

    } finally {
      // ── UNLOCK ──────────────────────────────────────────────────────────
      MODULE_IS_SENDING = false;
      MODULE_LAST_CALL  = Date.now();   // always record, even on error
      setIsSending(false);
      setShowTyping(false);
      startCooldownUI();                // start 5 s countdown
      console.log('[GeminiChat] 🔓 unlocked');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // stable ref: relies only on module vars, refs, and setters

  // ── Event handlers — the ONLY entry points into sendMessage() ─────────────

  const handleSendClick = useCallback(() => {
    sendMessage(input);
  }, [input, sendMessage]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }, [input, sendMessage]);

  const handleSuggestion = useCallback((s: string) => {
    sendMessage(s);
  }, [sendMessage]);

  const handleClear = useCallback(() => {
    abortRef.current  = true;    // stop active stream
    MODULE_IS_SENDING = false;   // release lock
    if (cooldownTick.current) {
      clearInterval(cooldownTick.current);
      cooldownTick.current = null;
    }
    const welcome = makeWelcome();
    setMessages([welcome]);
    messagesSnapshot.current = [welcome];
    setInput('');
    setError('');
    setIsSending(false);
    setShowTyping(false);
    setCooldown(0);
    MODULE_LAST_CALL = 0;
    console.log('[GeminiChat] 🗑 cleared');
  }, []);

  // ── Derived ────────────────────────────────────────────────────────────────
  const isBusy  = isSending || cooldown > 0;
  const canSend = !isBusy && input.trim().length > 0;
  const totalCooldownSecs = nowSecs();

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="mc-chat-root">

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="mc-chat-header">
        <div className="mc-chat-header-left">
          <div className="mc-chat-avatar-orb">💜</div>
          <div>
            <div className="mc-chat-title">Sanctuary AI</div>
            <div className="mc-chat-subtitle">
              <span className={`mc-chat-status-dot${isSending ? ' typing' : ''}`} />
              {isSending
                ? 'AI is typing…'
                : cooldown > 0
                  ? `Ready in ${cooldown}s…`
                  : 'Mental Health Companion · Online'}
            </div>
          </div>
        </div>
        <button
          className="mc-chat-clear-btn"
          onClick={handleClear}
          title="Clear conversation"
        >
          🗑 Clear
        </button>
      </div>

      {/* ── Message list ───────────────────────────────────────────────── */}
      <div className="mc-chat-messages">
        {messages.map(msg => (
          <div key={msg.id} className={`mc-chat-row ${msg.role}`}>
            {msg.role === 'assistant' && <div className="mc-chat-ai-orb">💜</div>}
            <div className={`mc-chat-bubble ${msg.role}`}>
              <span className="mc-chat-bubble-text">
                {msg.text || (msg.streaming ? '' : '…')}
                {msg.streaming && <span className="mc-chat-cursor" />}
              </span>
              {!msg.streaming && (
                <div className="mc-chat-bubble-time">
                  {new Date(msg.ts).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {showTyping && (
          <div className="mc-chat-row assistant">
            <div className="mc-chat-ai-orb">💜</div>
            <div className="mc-chat-bubble assistant mc-chat-typing-bubble">
              <span className="mc-chat-typing-dots">
                <span /><span /><span />
              </span>
            </div>
          </div>
        )}

        {/* Error banner */}
        {error && (
          <div className="mc-chat-error" role="alert">
            ⚠️ {error}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* ── Suggestion chips (fresh chat only) ─────────────────────────── */}
      {messages.length === 1 && (
        <div className="mc-chat-suggestions">
          {SUGGESTIONS.map(s => (
            <button
              key={s}
              className="mc-chat-suggestion"
              onClick={() => handleSuggestion(s)}
              disabled={isBusy}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* ── Input area ─────────────────────────────────────────────────── */}
      <div className="mc-chat-input-area">
        <div className="mc-chat-input-row">
          <textarea
            ref={textareaRef}
            id="gemini-chat-input"
            className="mc-chat-textarea"
            placeholder={
              isSending  ? 'AI is typing…' :
              cooldown   ? `You can write again in ${cooldown}s…` :
              "Share how you're feeling… (Enter to send, Shift+Enter for new line)"
            }
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isBusy}
            rows={1}
            aria-label="Chat input"
          />

          <button
            id="gemini-chat-send"
            className={`mc-chat-send-btn${isBusy ? ' busy' : ''}`}
            onClick={handleSendClick}
            disabled={!canSend}
            aria-label={
              isSending  ? 'AI is typing…' :
              cooldown   ? `Wait ${cooldown}s…` :
              'Send message'
            }
            title={
              isSending  ? 'AI is typing…' :
              cooldown   ? `Wait ${cooldown}s…` :
              'Send message'
            }
          >
            {isSending ? (
              <svg className="mc-chat-spinner" width="22" height="22" viewBox="0 0 22 22" fill="none">
                <circle cx="11" cy="11" r="9" stroke="rgba(255,255,255,0.3)" strokeWidth="2.5" />
                <path d="M11 2a9 9 0 0 1 9 9" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            ) : cooldown > 0 ? (
              <span className="mc-chat-cooldown-num">{cooldown}</span>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>
        </div>

        {/* 5-second cooldown drain bar */}
        {cooldown > 0 && !isSending && (
          <div className="mc-chat-cooldown-bar-wrap" role="progressbar" aria-valuenow={cooldown} aria-valuemax={totalCooldownSecs}>
            <div
              className="mc-chat-cooldown-bar"
              style={{ width: `${(cooldown / totalCooldownSecs) * 100}%` }}
            />
          </div>
        )}

        <div className="mc-chat-disclaimer">
          Sanctuary AI is an emotional support tool, not a substitute for professional mental health care.
        </div>
      </div>

    </div>
  );
}
