import { useState, useRef } from 'react';
import { MOODS, QUESTIONS, CRISIS_LINES, RISK_CONFIG, EMOTION_COLORS, Store, analyseWellbeing, todayStr } from './store';
import { addMood } from '../../lib/moods';
import { useAuth } from '../../lib/auth';

interface MoodOption { emoji: string; label: string; val: number; }

function showToast(msg: string, type: 'success' | 'error' = 'success') {
  const container = document.getElementById('mc-toast-container');
  if (!container) return;
  const el = document.createElement('div');
  el.className = `mc-toast ${type}`;
  el.textContent = (type === 'success' ? '✓  ' : '✕  ') + msg;
  container.appendChild(el);
  setTimeout(() => {
    el.style.opacity = '0';
    el.style.transform = 'translateX(30px)';
    el.style.transition = 'all .3s';
    setTimeout(() => el.remove(), 300);
  }, 3500);
}

export default function CheckIn() {
  const { user } = useAuth();

  const [selectedMood, setSelectedMood] = useState<MoodOption | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [charCount, setCharCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [analysed, setAnalysed] = useState(false);
  const textRef = useRef<HTMLTextAreaElement>(null);

  const isReady = selectedMood && charCount > 10 && Object.keys(answers).length === QUESTIONS.length;

  const recs = [
    { icon: '🧘', title: 'Try 4-7-8 breathing',      desc: 'Inhale 4s, hold 7s, exhale 8s.' },
    { icon: '🌿', title: 'Take a 10-minute walk',    desc: 'Boosts serotonin and mood.' },
    { icon: '📵', title: 'Digital detox after 9 PM', desc: 'Better sleep, better mind.' },
  ];

  // ── Reset the form ──────────────────────────────────────────────────────────
  const resetForm = () => {
    setSelectedMood(null);
    setAnswers({});
    setCharCount(0);
    setResult(null);
    setAnalysed(false);
    if (textRef.current) textRef.current.value = '';
  };

  // ── Persist mood to Supabase ────────────────────────────────────────────────
  const persistMood = async (moodLabel: string, noteText: string) => {
    // Determine user_id: prefer auth user, fall back to anonymous identifier
    const userId = user?.id ?? localStorage.getItem('mc_anon_id') ?? (() => {
      const id = `anon_${Date.now()}`;
      localStorage.setItem('mc_anon_id', id);
      return id;
    })();

    setSaving(true);
    const result = await addMood(userId, moodLabel, noteText);
    setSaving(false);

    if (result.success) {
      showToast('Mood saved to your profile ✦', 'success');
    } else {
      // Non-blocking: log locally even if cloud save fails
      console.warn('[CheckIn] Supabase save skipped:', result.error);
      showToast('Saved locally (cloud sync unavailable)', 'error');
    }
  };

  // ── Main analyse + save handler ─────────────────────────────────────────────
  const handleAnalyse = async () => {
    if (!isReady || !textRef.current) return;
    setLoading(true);
    setResult(null);

    const text = textRef.current.value;

    // 1. Run AI analysis
    const res = await analyseWellbeing({ mood: selectedMood!, text, answers });
    setResult(res);
    setLoading(false);
    setAnalysed(true);

    // 2. Save to local store
    Store.addEntry({
      date: todayStr(),
      mood: selectedMood!.label,
      emoji: selectedMood!.emoji,
      moodVal: selectedMood!.val,
      text,
      risk: res.riskLevel,
      score: res.score,
      emotions: res.emotions,
      recommendations: res.recommendations,
    });

    showToast('Check-in saved!', 'success');

    // 3. Persist to Supabase (non-blocking)
    await persistMood(selectedMood!.label, text);

    // 4. Animate score bar
    setTimeout(() => {
      const fill = document.getElementById('mc-score-bar-fill');
      if (fill) fill.style.width = res.score + '%';
    }, 100);
  };

  const now = new Date().toLocaleDateString('en-IN', {
    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
  });

  return (
    <>
      {/* Topbar */}
      <div className="mc-topbar">
        <div>
          <h1>Daily Check-In</h1>
          <p>Take a moment to reflect on how you're feeling.</p>
        </div>
        <div className="mc-topbar-right">
          <div className="mc-date-badge">{now}</div>
          <div className="mc-notif-btn">🔔<div className="mc-notif-dot" /></div>
        </div>
      </div>

      <div className="mc-grid-3">
        {/* ── Left: Check-in form ─────────────────────────────────────────── */}
        <div className="mc-card mc-d1">
          <div className="mc-card-header">
            <div>
              <div className="mc-card-title">Today's Check-In</div>
              <div className="mc-card-sub">Log your mood and feelings</div>
            </div>
            <span className="mc-pill mc-pp">Daily</span>
          </div>

          {/* — Supabase status badge — */}
          {user && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#52C97A', display: 'inline-block' }} />
              <span style={{ fontSize: 11, color: '#52C97A', fontWeight: 600 }}>
                Syncing to cloud — {user.email ?? user.id.slice(0, 8)}
              </span>
            </div>
          )}

          {/* — Mood selector — */}
          <div className="mc-field-label">How are you feeling?</div>
          <div className="mc-mood-grid">
            {MOODS.map(m => (
              <button
                key={m.label}
                className={`mc-mood-btn${selectedMood?.label === m.label ? ' selected' : ''}`}
                onClick={() => setSelectedMood(m)}
              >
                <span className="mc-mood-emoji">{m.emoji}</span>
                <span className="mc-mood-label">{m.label}</span>
              </button>
            ))}
          </div>

          {/* — Journal — */}
          <div className="mc-field-label">What's on your mind?</div>
          <textarea
            ref={textRef}
            id="checkin-journal"
            className="mc-journal-textarea"
            placeholder="Write freely — how was your day? This is your safe space…"
            onChange={e => setCharCount(e.target.value.length)}
          />
          <div className="mc-char-count">
            {charCount} characters{charCount > 0 && charCount < 10 ? ' (min 10)' : ''}
          </div>

          {/* — Quick quiz — */}
          <div className="mc-field-label">Quick check-in</div>
          {QUESTIONS.map(q => (
            <div key={q.id} className="mc-quiz-q">
              <div className="mc-quiz-text">{q.text}</div>
              <div className="mc-quiz-opts">
                {q.opts.map(o => (
                  <button
                    key={o}
                    className={`mc-quiz-opt${answers[q.id] === o ? ' selected' : ''}`}
                    onClick={() => setAnswers(prev => ({ ...prev, [q.id]: o }))}
                  >
                    {o}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* — Action buttons — */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button
              id="checkin-analyse-btn"
              className="mc-btn-primary"
              disabled={!isReady || loading || saving}
              onClick={handleAnalyse}
              style={{ flex: 1 }}
            >
              {loading
                ? '⏳ Analysing…'
                : saving
                  ? '☁ Saving…'
                  : analysed
                    ? '✓ Analysed — Retry?'
                    : '✦ Analyse My Wellbeing'}
            </button>

            {analysed && (
              <button
                id="checkin-reset-btn"
                className="mc-btn-primary"
                onClick={resetForm}
                style={{ flex: '0 0 auto', background: 'rgba(255,255,255,0.07)', color: '#aaa', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                ↺ New Entry
              </button>
            )}
          </div>

          {/* — Loading indicator — */}
          {loading && (
            <div className="mc-loading-wrap">
              <div className="mc-dots">
                <div className="mc-dot" /><div className="mc-dot" /><div className="mc-dot" />
              </div>
              <div className="mc-loading-text">Reading your emotional patterns…</div>
            </div>
          )}

          {/* — Saving indicator — */}
          {saving && !loading && (
            <div className="mc-loading-wrap">
              <div className="mc-dots">
                <div className="mc-dot" /><div className="mc-dot" /><div className="mc-dot" />
              </div>
              <div className="mc-loading-text">Syncing to Supabase…</div>
            </div>
          )}

          {/* — Result card — */}
          {result && !loading && (() => {
            const cfg = RISK_CONFIG[result.riskLevel] ?? RISK_CONFIG.low;
            return (
              <div className={`mc-result-card ${result.riskLevel}`}>
                <div className="mc-result-top">
                  <div className="mc-result-icon">{cfg.icon}</div>
                  <div className="mc-result-meta">
                    <div className="mc-result-risk-label">Risk Level</div>
                    <div className="mc-result-title">{cfg.label}</div>
                  </div>
                  <div className="mc-result-score">{result.score}</div>
                </div>
                <div className="mc-score-bar-bg">
                  <div className="mc-score-bar-fill" id="mc-score-bar-fill" style={{ background: cfg.bar }} />
                </div>
                <div className="mc-emotion-tags">
                  {(result.emotions ?? []).map((e: string, i: number) => {
                    const ec = EMOTION_COLORS[e?.toLowerCase()] ?? { bg: '#F1EFE8', c: '#5F5E5A' };
                    return (
                      <span key={i} className="mc-etag"
                        style={{ background: ec.bg, color: ec.c, animationDelay: `${i * .08}s` }}>
                        {e}
                      </span>
                    );
                  })}
                </div>
                <div className="mc-ai-insight">{result.aiInsight}</div>
                <div className="mc-rec-label">Personalised Tips</div>
                <ul className="mc-rec-list">
                  {(result.recommendations ?? []).map((r: string, i: number) => (
                    <li key={i} className="mc-rec-item" style={{ animationDelay: `${.4 + i * .1}s` }}>{r}</li>
                  ))}
                </ul>
                {result.riskLevel === 'high' && (
                  <div className="mc-crisis-banner">
                    <div className="mc-crisis-title">💙 You're not alone — help is here</div>
                    {CRISIS_LINES.slice(0, 3).map((l, i) => (
                      <div key={i} className="mc-crisis-line" style={{ animationDelay: `${.5 + i * .08}s` }}>
                        <div className="mc-crisis-icon">{l.icon}</div>
                        <div>
                          <div className="mc-crisis-name">{l.name}</div>
                          <div className="mc-crisis-num">{l.num} · {l.sub}</div>
                        </div>
                        <button className="mc-crisis-call">Call</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })()}
        </div>

        {/* ── Right: Recommendations ──────────────────────────────────────── */}
        <div className="mc-card mc-d2">
          <div className="mc-card-header">
            <div>
              <div className="mc-card-title">Recommendations</div>
              <div className="mc-card-sub">Personalised for you</div>
            </div>
            <span className="mc-pill mc-pp">AI-generated</span>
          </div>
          {(result?.recommendations ?? recs.map(r => r.title)).map((r: string, i: number) => {
            const icons = ['🧘', '💡', '🌿'];
            return (
              <div key={i} className="mc-rec-card" style={{ animationDelay: `${i * .1}s` }}>
                <div className="mc-rec-card-icon">{icons[i] ?? '✦'}</div>
                <div>
                  <div className="mc-rec-card-title">{result ? `Tip ${i + 1}` : recs[i]?.title}</div>
                  <div className="mc-rec-card-desc">{result ? r : recs[i]?.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
