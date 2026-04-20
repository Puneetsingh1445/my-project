// ── Data Constants ─────────────────────────────────────────────────────────────

export const MOODS = [
  { emoji: '😊', label: 'Happy',   val: 5 },
  { emoji: '😌', label: 'Calm',    val: 4 },
  { emoji: '😐', label: 'Neutral', val: 3 },
  { emoji: '😟', label: 'Worried', val: 2 },
  { emoji: '😢', label: 'Sad',     val: 1 },
];

export const QUESTIONS = [
  { id: 'sleep',    text: 'How was your sleep last night?',         opts: ['Great','Okay','Poor','Very poor'] },
  { id: 'stress',   text: 'How stressed did you feel today?',       opts: ['Not at all','A little','Quite a bit','Extremely'] },
  { id: 'social',   text: 'Have you connected with someone today?', opts: ['Yes, meaningfully','Briefly','Not really','Feeling isolated'] },
  { id: 'appetite', text: 'How was your appetite today?',           opts: ['Normal','Slightly off','Hardly ate','Didn\'t care to eat'] },
];

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊', sec: 'main'    },
  { id: 'checkin',   label: 'Check In',  icon: '✅', sec: 'main'    },
  { id: 'history',   label: 'History',   icon: '📓', sec: 'main'    },
  { id: 'progress',  label: 'Progress',  icon: '📈', sec: 'health'  },
  { id: 'resources', label: 'Resources', icon: '🛡️', sec: 'support' },
  { id: 'chat',      label: 'AI Chat',   icon: '💬', sec: 'support' },
];

export const CRISIS_LINES = [
  { icon: '📞', name: 'iCall – TISS',          sub: 'Mon–Sat 8am–10pm', num: '9152987821'    },
  { icon: '🆘', name: 'Vandrevala Foundation', sub: '24/7 crisis support', num: '1860-2662-345' },
  { icon: '💬', name: 'Snehi NGO',             sub: 'Emotional support',   num: '044-24640050' },
  { icon: '🏥', name: 'NIMHANS',               sub: 'National helpline',   num: '080-46110007' },
];

export const RESOURCES = [
  { icon:'🧘', title:'Breathing Exercises',  desc:'Quick 4-7-8 breathing to calm your nervous system in under 3 minutes.', tag:'Anxiety',     tagBg:'#F5E8EC', tagC:'#6B2A3A' },
  { icon:'📓', title:'Journaling Prompts',   desc:'Daily prompts to help you process emotions and build self-awareness.',   tag:'Reflection',  tagBg:'#EDE8FF', tagC:'#5B3FD4' },
  { icon:'🌙', title:'Sleep Hygiene',        desc:'Science-backed tips for better rest and improved mental clarity.',       tag:'Sleep',       tagBg:'#E6FAF9', tagC:'#0F6E56' },
  { icon:'🤝', title:'Peer Support',         desc:'Connect with communities of students and young professionals.',         tag:'Social',      tagBg:'#EBF2F7', tagC:'#2A5A72' },
  { icon:'🎧', title:'Guided Meditations',   desc:'Free sessions from 3 to 20 minutes for any time of day.',              tag:'Mindfulness', tagBg:'#EDFBF2', tagC:'#2E6B40' },
  { icon:'📚', title:'Self-Help Library',    desc:'Curated articles, videos and worksheets on common mental health topics.',tag:'Education',   tagBg:'#FFF8EC', tagC:'#8C6010' },
];

export const RISK_CONFIG: Record<string, { label: string; icon: string; bg: string; bar: string; tc: string; pill: string }> = {
  low:      { label: "Low Risk — You're doing well",  icon: '✦',  bg: '#EDF7F0', bar: '#52C97A', tc: '#1A6B3A', pill: 'pg' },
  moderate: { label: 'Moderate Risk — Stay mindful',  icon: '🌤', bg: '#FFF8EC', bar: '#FFB547', tc: '#7A5010', pill: 'pa' },
  high:     { label: 'High Risk — Support available', icon: '⚠️', bg: '#FFF0F5', bar: '#FF6B9D', tc: '#8C1040', pill: 'pr' },
};

export const EMOTION_COLORS: Record<string, { bg: string; c: string }> = {
  stressed:    { bg:'#FDF0E8', c:'#7A4010' }, anxious:    { bg:'#F5E8EC', c:'#6B2A3A' },
  sad:         { bg:'#EBF2F7', c:'#2A5A72' }, hopeful:    { bg:'#EDF7F0', c:'#2E6B40' },
  calm:        { bg:'#EDF7F0', c:'#2E6B40' }, neutral:    { bg:'#F1EFE8', c:'#5F5E5A' },
  happy:       { bg:'#EDF7F0', c:'#2E6B40' }, overwhelmed:{ bg:'#FBF4E8', c:'#7A5320' },
  content:     { bg:'#EDF7F0', c:'#2E6B40' }, grateful:   { bg:'#EDF7F0', c:'#2E6B40' },
  isolated:    { bg:'#EBF2F7', c:'#2A5A72' }, hopeless:   { bg:'#F5E8EC', c:'#6B2A3A' },
  joyful:      { bg:'#EDF7F0', c:'#2E6B40' }, energised:  { bg:'#E6FAF9', c:'#0F6E56' },
  mixed:       { bg:'#F1EFE8', c:'#5F5E5A' }, uncertain:  { bg:'#F1EFE8', c:'#5F5E5A' },
};

// ── Sample data ─────────────────────────────────────────────────────────────────

export const SAMPLE_ENTRIES = [
  { id:1,  date:'2026-03-13', mood:'Happy',   emoji:'😊', moodVal:5, text:'Had a really productive study session today. Feeling grateful and energised.', risk:'low',      score:22, emotions:['content','grateful'],        recommendations:['Maintain this positive momentum','Keep your sleep schedule consistent','Celebrate small wins today'] },
  { id:2,  date:'2026-03-12', mood:'Worried', emoji:'😟', moodVal:2, text:'Exam stress is building up a lot. Hard to focus on anything.',                  risk:'moderate', score:58, emotions:['stressed','anxious'],         recommendations:['Try 4-7-8 breathing exercises','Break tasks into smaller steps','Reach out to a study group'] },
  { id:3,  date:'2026-03-11', mood:'Calm',    emoji:'😌', moodVal:4, text:'Went for a long walk, felt much better after. Nature really helps.',             risk:'low',      score:18, emotions:['calm','hopeful'],             recommendations:['Continue daily walks','Practice gratitude journaling','Connect with a friend'] },
  { id:4,  date:'2026-03-10', mood:'Sad',     emoji:'😢', moodVal:1, text:"Couldn't focus all day. Feeling disconnected and hopeless.",                     risk:'high',     score:82, emotions:['sad','hopeless','isolated'], recommendations:['Please reach out to a counsellor','Talk to someone you trust','Take a break from academic pressure'] },
  { id:5,  date:'2026-03-09', mood:'Neutral', emoji:'😐', moodVal:3, text:'Average day, nothing notable happened.',                                          risk:'low',      score:30, emotions:['neutral'],                   recommendations:['Try something new today','Set one small goal','Check in with a friend'] },
  { id:6,  date:'2026-03-08', mood:'Happy',   emoji:'😊', moodVal:5, text:'Great session with friends. Laughed a lot, felt very connected.',                 risk:'low',      score:14, emotions:['joyful','energised'],         recommendations:['Keep nurturing social bonds','Maintain this energy','Journal about what made you happy'] },
  { id:7,  date:'2026-03-07', mood:'Worried', emoji:'😟', moodVal:2, text:'Deadline pressure is overwhelming. Feeling behind on everything.',               risk:'moderate', score:62, emotions:['overwhelmed','anxious'],      recommendations:['Prioritise your task list','Take short breaks every 45 min','Deep breathing before sleep'] },
];

// ── Store ───────────────────────────────────────────────────────────────────────

export interface Entry {
  id: number; date: string; mood: string; emoji: string; moodVal: number;
  text: string; risk: string; score: number; emotions: string[]; recommendations: string[];
}

const STORE_KEY = 'mc_entries';

export const Store = {
  getEntries(): Entry[] {
    try { const r = localStorage.getItem(STORE_KEY); return r ? JSON.parse(r) : [...SAMPLE_ENTRIES]; }
    catch { return [...SAMPLE_ENTRIES]; }
  },
  save(entries: Entry[]) { localStorage.setItem(STORE_KEY, JSON.stringify(entries)); },
  addEntry(e: Omit<Entry, 'id'>): Entry[] {
    const all = this.getEntries();
    const newEntry = { ...e, id: Date.now() } as Entry;
    all.unshift(newEntry);
    this.save(all);
    return all;
  },
  getStats() {
    const entries = this.getEntries();
    const scores = entries.map(x => x.score);
    const avg = scores.length ? Math.round(scores.reduce((a,b)=>a+b,0)/scores.length) : 0;
    return { avg, streak: entries.length, latest: entries[0]?.risk ?? 'low', wellness: Math.max(0,100-avg), total: entries.length };
  },
  getLast7(): Entry[] { return this.getEntries().slice(0,7).reverse(); },
};

// ── Helpers ─────────────────────────────────────────────────────────────────────

export const todayStr = () => new Date().toISOString().slice(0,10);

export const formatDate = (d: string) =>
  new Date(d).toLocaleDateString('en-IN', { weekday:'short', month:'short', day:'numeric', year:'numeric' });

export const shortDate = (d: string) =>
  new Date(d).toLocaleDateString('en-IN', { month:'short', day:'numeric' });

export const FALLBACK_RESULT = {
  riskLevel: 'moderate', score: 45, emotions: ['uncertain', 'mixed'],
  summary: "I'm here for you. Can you tell me a bit more?",
  recommendations: [
    'Take a short breathing break',
    'Reach out to someone you trust',
    'Step outside for some fresh air',
  ],
  aiInsight: "Your feelings are valid. Take it one moment at a time. 💜",
};

// ── Module-level guard — prevents duplicate analysis calls ───────────────────
let ANALYSE_IN_FLIGHT = false;

// ── Extracts the first JSON object from any string (strips markdown fences) ──
function extractJSON(raw: string): any {
  // Remove ```json ... ``` or ``` ... ``` wrappers
  const stripped = raw.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
  // Find the first {...} block
  const start = stripped.indexOf('{');
  const end   = stripped.lastIndexOf('}');
  if (start === -1 || end === -1) throw new Error('No JSON object found in response');
  return JSON.parse(stripped.slice(start, end + 1));
}

export async function analyseWellbeing({
  mood, text, answers,
}: {
  mood: { label: string; val: number };
  text: string;
  answers: Record<string, string>;
}) {
  // Hard guard — only one analysis at a time
  if (ANALYSE_IN_FLIGHT) {
    console.log('[analyseWellbeing] already in flight — returning fallback');
    return FALLBACK_RESULT;
  }

  ANALYSE_IN_FLIGHT = true;
  console.log('[analyseWellbeing] 🚀 Calling Gemini 1.5-flash');

  const prompt =
    `You are a compassionate mental health screening assistant for students and young professionals.
Analyse the following check-in and return ONLY a valid JSON object — no preamble, no markdown, no comments.

User mood: ${mood.label} (score ${mood.val}/5)
Journal entry: "${text}"
Sleep: ${answers.sleep ?? 'unknown'}, Stress: ${answers.stress ?? 'unknown'}, Social: ${answers.social ?? 'unknown'}, Appetite: ${answers.appetite ?? 'unknown'}

Return exactly this JSON structure:
{
  "riskLevel": "low" | "moderate" | "high",
  "score": <integer 0-100, higher = more at-risk>,
  "emotions": ["word1", "word2"],
  "summary": "<one sentence, max 20 words>",
  "recommendations": ["<tip1 max 12 words>", "<tip2 max 12 words>", "<tip3 max 12 words>"],
  "aiInsight": "<one warm encouraging sentence, max 25 words>"
}`;

  const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY as string | undefined;

  if (!apiKey || apiKey.trim() === '' || apiKey === 'your_gemini_api_key_here') {
    console.warn('[analyseWellbeing] VITE_GEMINI_API_KEY not configured — using fallback');
    ANALYSE_IN_FLIGHT = false;
    return FALLBACK_RESULT;
  }

  try {
    const { GoogleGenAI } = await import('@google/genai');
    const client = new GoogleGenAI({ apiKey });

    // Single attempt, no auto-retry to avoid rate-limit hammering
    const response = await client.models.generateContent({
      model:    'gemini-1.5-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });

    const rawText = response.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    console.log('[analyseWellbeing] raw response:', rawText.slice(0, 300));

    if (!rawText.trim()) {
      console.warn('[analyseWellbeing] empty response — using fallback');
      return FALLBACK_RESULT;
    }

    const parsed = extractJSON(rawText);

    // Validate required fields
    const valid =
      typeof parsed.riskLevel === 'string' &&
      typeof parsed.score     === 'number' &&
      Array.isArray(parsed.emotions) &&
      Array.isArray(parsed.recommendations);

    if (!valid) {
      console.warn('[analyseWellbeing] invalid shape — using fallback', parsed);
      return FALLBACK_RESULT;
    }

    console.log('[analyseWellbeing] ✅ parsed:', parsed);
    return parsed;

  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);

    if (
      msg.includes('429') ||
      msg.toLowerCase().includes('quota') ||
      msg.toLowerCase().includes('rate limit') ||
      msg.toLowerCase().includes('resource_exhausted')
    ) {
      console.warn('[analyseWellbeing] ⚠️ Rate limit hit:', msg);
    } else {
      console.error('[analyseWellbeing] ❌ Error:', msg);
    }

    return FALLBACK_RESULT;

  } finally {
    ANALYSE_IN_FLIGHT = false;
    console.log('[analyseWellbeing] 🔓 unlocked');
  }
}

