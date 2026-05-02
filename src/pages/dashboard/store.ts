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
];

export const CRISIS_LINES = [
  { icon: '📞', name: 'iCall – TISS',          sub: 'Mon–Sat 8am–10pm', num: '9152987821'    },
  { icon: '🆘', name: 'Vandrevala Foundation', sub: '24/7 crisis support', num: '1860-2662-345' },
  { icon: '💬', name: 'Snehi NGO',             sub: 'Emotional support',   num: '044-24640050' },
  { icon: '🏥', name: 'NIMHANS',               sub: 'National helpline',   num: '080-46110007' },
];

export const RESOURCES = [
  { icon:'🧘', title:'Breathing Exercises',  desc:'Quick 4-7-8 breathing to calm your nervous system in under 3 minutes.', tag:'Anxiety',     tagBg:'#F5E8EC', tagC:'#6B2A3A', url:'https://www.healthline.com/health/4-7-8-breathing' },
  { icon:'📓', title:'Journaling Prompts',   desc:'Daily prompts to help you process emotions and build self-awareness.',   tag:'Reflection',  tagBg:'#EDE8FF', tagC:'#5B3FD4', url:'https://positivepsychology.com/journaling-prompts-mental-health/' },
  { icon:'🌙', title:'Sleep Hygiene',        desc:'Science-backed tips for better rest and improved mental clarity.',       tag:'Sleep',       tagBg:'#E6FAF9', tagC:'#0F6E56', url:'https://www.sleepfoundation.org/sleep-hygiene' },
  { icon:'🤝', title:'Peer Support',         desc:'Connect with communities of students and young professionals.',         tag:'Social',      tagBg:'#EBF2F7', tagC:'#2A5A72', url:'https://www.7cups.com/' },
  { icon:'🎧', title:'Guided Meditations',   desc:'Free sessions from 3 to 20 minutes for any time of day.',              tag:'Mindfulness', tagBg:'#EDFBF2', tagC:'#2E6B40', url:'https://www.headspace.com/meditation/guided-meditation' },
  { icon:'📚', title:'Self-Help Library',    desc:'Curated articles, videos and worksheets on common mental health topics.',tag:'Education',   tagBg:'#FFF8EC', tagC:'#8C6010', url:'https://www.mind.org.uk/information-support/' },
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

// ── Store ───────────────────────────────────────────────────────────────────────
// NOTE: Sample/demo data has been removed. Guests always see an empty app.
// Each logged-in user's data is stored under a userId-scoped localStorage key.

export interface Entry {
  id: number; date: string; mood: string; emoji: string; moodVal: number;
  text: string; risk: string; score: number; emotions: string[]; recommendations: string[];
}

/** Returns a localStorage key scoped to the user. Guests use a shared 'mc_entries_guest' bucket. */
function storeKey(userId: string | null | undefined): string {
  if (!userId) return 'mc_entries_guest';
  return `mc_entries_${userId}`;
}

export const Store = {
  /** Returns entries for the given user. Guests use the 'mc_entries_guest' localStorage key. */
  getEntries(userId: string | null | undefined): Entry[] {
    const key = storeKey(userId);
    try { const r = localStorage.getItem(key); return r ? JSON.parse(r) : []; }
    catch { return []; }
  },
  save(entries: Entry[], userId: string | null | undefined) {
    localStorage.setItem(storeKey(userId), JSON.stringify(entries));
  },
  addEntry(e: Omit<Entry, 'id'>, userId: string | null | undefined): Entry[] {
    const all = this.getEntries(userId);
    const newEntry = { ...e, id: Date.now() } as Entry;
    all.unshift(newEntry);
    this.save(all, userId);
    // Notify same-tab listeners (window.storage only fires in OTHER tabs).
    try { window.dispatchEvent(new CustomEvent('mc:entry-added', { detail: { userId } })); } catch { /* ignore */ }
    return all;
  },
  getStats(userId: string | null | undefined) {
    const entries = this.getEntries(userId);
    const scores = entries.map(x => x.score);
    const avg = scores.length ? Math.round(scores.reduce((a,b)=>a+b,0)/scores.length) : 0;
    const hasData = entries.length > 0;
    const wellness = hasData ? Math.max(0, 100 - avg) : 0;

    // ── Correct streak: count consecutive calendar days ending today ──────────
    // entries[0] is newest (unshift adds to front), so dates are newest-first.
    // De-duplicate to one entry per date, then walk backwards.
    const uniqueDates: string[] = Array.from<string>(new Set(entries.map(e => e.date))).sort(); // asc YYYY-MM-DD
    let streak = 0;
    if (uniqueDates.length > 0) {
      const today = new Date().toISOString().slice(0, 10);
      const lastDate = uniqueDates[uniqueDates.length - 1];
      // Only count streak if the user checked in today or yesterday (otherwise it's broken)
      const daysSinceLast = Math.round(
        (new Date(today).getTime() - new Date(lastDate).getTime()) / 86_400_000
      );
      if (daysSinceLast <= 1) {
        streak = 1;
        for (let i = uniqueDates.length - 1; i > 0; i--) {
          const diff = Math.round(
            (new Date(uniqueDates[i]).getTime() - new Date(uniqueDates[i - 1]).getTime()) / 86_400_000
          );
          if (diff === 1) streak++;
          else break;
        }
      }
    }

    // ── Latest entry's actual numeric risk score ───────────────────────────────
    // entries[0] = newest entry (most recent check-in).
    const latestScore = hasData ? entries[0].score : 0;

    return { avg, streak, latest: entries[0]?.risk ?? 'none', wellness, total: entries.length, latestScore };
  },
  getLast7(userId: string | null | undefined): Entry[] { return this.getEntries(userId).slice(0,7).reverse(); },

  /**
   * Remove legacy unscoped keys and anonymous guest data from localStorage.
   * Call once on app start to ensure no residual guest data bleeds through.
   */
  purgeGuestData() {
    try {
      // Remove the old anonymous ID used by earlier versions
      localStorage.removeItem('mc_anon_id');
      // Remove the old unscoped entry key used before userId-scoping was added
      localStorage.removeItem('mc_entries');
      // Remove any anon-scoped entry keys (mc_entries_anon_*)
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('mc_entries_anon_')) keysToRemove.push(key);
      }
      keysToRemove.forEach(k => localStorage.removeItem(k));
    } catch { /* ignore storage errors */ }
  },
};

// ── Helpers ─────────────────────────────────────────────────────────────────────

export const todayStr = () => new Date().toISOString().slice(0,10);

export const formatDate = (d: string) =>
  new Date(d).toLocaleDateString('en-IN', { weekday:'short', month:'short', day:'numeric', year:'numeric' });

export const shortDate = (d: string) =>
  new Date(d).toLocaleDateString('en-IN', { month:'short', day:'numeric' });

// ── Sentiment Scoring Engine ────────────────────────────────────────────────────
//
// Weights: mood 40% | text keywords 30% | quick-check answers 30%
// Score is a 0-100 RISK scale: low risk → 0-33, moderate → 34-66, high → 67-100
// Wellness = 100 - score   (so positive input → high wellness, negative → low)

const POSITIVE_WORDS = new Set([
  'happy','happiness','great','good','well','wonderful','amazing','excellent',
  'productive','excited','grateful','gratitude','joyful','joy','energised','energized',
  'content','contentment','hopeful','hope','peaceful','peace','relaxed','relaxing',
  'blessed','fantastic','terrific','cheerful','optimistic','love','loved','awesome',
  'splendid','brilliant','delighted','thrilled','positive','calm','fine','better',
  'improved','motivated','accomplished','proud','refreshed','rested','clear',
  'focused','inspired','confident','glad','pleased','enjoying','enjoyed','fun',
  'laugh','laughed','smiling','smile','alive','energetic','light','bright',
]);

const NEGATIVE_WORDS = new Set([
  'sad','sadness','stressed','stress','anxious','anxiety','tired','fatigue',
  'depressed','depression','lonely','loneliness','awful','terrible','horrible',
  'bad','worried','worry','overwhelmed','miserable','misery','exhausted','exhaustion',
  'hopeless','fearful','fear','angry','anger','frustrated','frustration','irritated',
  'broken','crying','cry','cried','struggling','struggle','failing','fail','failed',
  'helpless','worthless','empty','numb','lost','scared','afraid','nervous','tense',
  'upset','hurt','pain','suffer','suffering','dark','low','down','sick','ill',
  'weak','heavy','drained','burnt','burnout','burnedout','isolated','disconnected',
  'abandoned','rejected','hate','hated','dread','dreading','nauseous','panicking',
  'panic','restless','insomnia','sleepless','unmotivated','useless','failure',
]);

/** Risk contribution per answer option (0 = no risk, 100 = maximum risk). */
const ANSWER_RISK: Record<string, number> = {
  // sleep
  'Great': 5,   'Okay': 35,  'Poor': 70,  'Very poor': 90,
  // stress
  'Not at all': 5,  'A little': 30,  'Quite a bit': 65,  'Extremely': 90,
  // social
  'Yes, meaningfully': 5,  'Briefly': 30,  'Not really': 65,  'Feeling isolated': 90,
  // appetite
  'Normal': 5,  'Slightly off': 35,  'Hardly ate': 70,  "Didn't care to eat": 90,
};

/** Risk contribution per mood value (val 5=very positive, 1=very negative). */
const MOOD_RISK: Record<number, number> = { 5: 5, 4: 20, 3: 50, 2: 70, 1: 87 };

export interface CheckInInput {
  moodVal: number;                  // 1–5 (MOODS[].val)
  text: string;                     // free-text journal entry
  answers: Record<string, string>;  // quick check-in {sleep, stress, social, appetite}
}

/**
 * Deterministic, client-side sentiment scoring engine.
 * Returns a risk score 0-100 and a riskLevel label.
 *
 * This is the authoritative source for numeric scores — the AI is used
 * for qualitative enrichment only (emotions, recommendations, insight).
 */
export function scoreCheckIn({ moodVal, text, answers }: CheckInInput): {
  score: number;
  riskLevel: 'low' | 'moderate' | 'high';
} {
  // ① Mood component (40%)
  const moodScore = MOOD_RISK[moodVal] ?? 50;

  // ② Text sentiment component (30%) — keyword matching
  const words = text.toLowerCase().split(/\W+/).filter(Boolean);
  let pos = 0, neg = 0;
  for (const w of words) {
    if (POSITIVE_WORDS.has(w)) pos++;
    if (NEGATIVE_WORDS.has(w)) neg++;
  }
  const total = pos + neg;
  // If no sentiment words found, fall back to a mood-biased neutral
  const textScore = total === 0
    ? Math.min(100, moodScore + 10)   // bias toward mood when text is ambiguous
    : Math.round((neg / total) * 100);

  // ③ Quick check-in answers component (30%)
  const answerValues = Object.values(answers).map(a => ANSWER_RISK[a] ?? 50);
  const answersScore = answerValues.length
    ? Math.round(answerValues.reduce((a, b) => a + b, 0) / answerValues.length)
    : 50;

  // ④ Weighted combination
  const raw = moodScore * 0.4 + textScore * 0.3 + answersScore * 0.3;
  const score = Math.max(0, Math.min(100, Math.round(raw)));

  const riskLevel: 'low' | 'moderate' | 'high' =
    score <= 33 ? 'low' : score <= 66 ? 'moderate' : 'high';

  return { score, riskLevel };
}

export const FALLBACK_RESULT = {
  riskLevel: 'moderate', score: 50, emotions: ['uncertain','mixed'],
  summary: 'Unable to fully analyse.',
  recommendations: ['Take a short breathing break','Reach out to someone you trust','Step outside for fresh air'],
  aiInsight: 'Your feelings are valid. Take it one moment at a time.',
};

export async function analyseWellbeing({ mood, text, answers }: { mood: { label: string; val: number }; text: string; answers: Record<string,string> }) {
  const prompt = `You are a compassionate mental health screening assistant for students and young professionals.
Analyse the following check-in and return ONLY a valid JSON object, no preamble, no markdown.
User mood: ${mood.label} (score ${mood.val}/5)
Journal entry: "${text}"
Sleep: ${answers.sleep??'unknown'}, Stress: ${answers.stress??'unknown'}, Social: ${answers.social??'unknown'}, Appetite: ${answers.appetite??'unknown'}
Return exactly: {"riskLevel":"low"|"moderate"|"high","score":0-100,"emotions":["word1","word2"],"summary":"one sentence max 20 words","recommendations":["tip1 max 12 words","tip2","tip3"],"aiInsight":"one warm encouraging sentence max 25 words"}`;

  try {
    const r = await fetch('/api/analyse', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ prompt }) });
    if (!r.ok) throw new Error(String(r.status));
    const raw = await r.text();
    return JSON.parse(raw.replace(/```json|```/g,'').trim());
  } catch {
    return FALLBACK_RESULT;
  }
}
