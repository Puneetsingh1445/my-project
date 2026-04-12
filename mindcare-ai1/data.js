const MOODS = [
  { emoji: '😊', label: 'Happy',   val: 5 },
  { emoji: '😌', label: 'Calm',    val: 4 },
  { emoji: '😐', label: 'Neutral', val: 3 },
  { emoji: '😟', label: 'Worried', val: 2 },
  { emoji: '😢', label: 'Sad',     val: 1 },
]

const QUESTIONS = [
  { id: 'sleep',    text: 'How was your sleep last night?',         opts: ['Great', 'Okay', 'Poor', 'Very poor'] },
  { id: 'stress',   text: 'How stressed did you feel today?',       opts: ['Not at all', 'A little', 'Quite a bit', 'Extremely'] },
  { id: 'social',   text: 'Have you connected with someone today?', opts: ['Yes, meaningfully', 'Briefly', 'Not really', 'Feeling isolated'] },
  { id: 'appetite', text: 'How was your appetite today?',           opts: ['Normal', 'Slightly off', 'Hardly ate', "Didn't care to eat"] },
]

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊', section: 'main' },
  { id: 'checkin',   label: 'Check In',  icon: '✅', section: 'main' },
  { id: 'history',   label: 'History',   icon: '📓', section: 'main' },
  { id: 'progress',  label: 'Progress',  icon: '📈', section: 'health' },
  { id: 'resources', label: 'Resources', icon: '🛡️', section: 'support' },
]

const CRISIS_LINES = [
  { icon: '📞', name: 'iCall – TISS',          sub: 'Mon–Sat, 8am–10pm',  num: '9152987821'    },
  { icon: '🆘', name: 'Vandrevala Foundation',  sub: '24/7 crisis support', num: '1860-2662-345' },
  { icon: '💬', name: 'Snehi NGO',              sub: 'Emotional support',   num: '044-24640050'  },
  { icon: '🏥', name: 'NIMHANS',               sub: 'National helpline',   num: '080-46110007'  },
]

const RESOURCES = [
  { icon: '🧘', title: 'Breathing Exercises',  desc: 'Quick 4-7-8 breathing to calm your nervous system in under 3 minutes.',   tag: 'Anxiety',    tagBg: '#F5E8EC', tagC: '#6B2A3A' },
  { icon: '📓', title: 'Journaling Prompts',   desc: 'Daily prompts to help you process emotions and build self-awareness.',     tag: 'Reflection', tagBg: '#EDE8FF', tagC: '#5B3FD4' },
  { icon: '🌙', title: 'Sleep Hygiene',        desc: 'Science-backed tips for better rest and improved mental clarity.',         tag: 'Sleep',      tagBg: '#E6FAF9', tagC: '#0F6E56' },
  { icon: '🤝', title: 'Peer Support',         desc: 'Connect with communities of students and young professionals.',            tag: 'Social',     tagBg: '#EBF2F7', tagC: '#2A5A72' },
  { icon: '🎧', title: 'Guided Meditations',   desc: 'Free sessions from 3 to 20 minutes for any time of day.',                 tag: 'Mindfulness',tagBg: '#EDFBF2', tagC: '#2E6B40' },
  { icon: '📚', title: 'Self-Help Library',    desc: 'Curated articles, videos and worksheets on common mental health topics.',  tag: 'Education',  tagBg: '#FFF8EC', tagC: '#8C6010' },
]

const RISK_CONFIG = {
  low:      { label: "Low Risk — You're doing well",  icon: '✦',  bg: '#EDF7F0', bar: '#52C97A', tc: '#1A6B3A', pill: 'green'  },
  moderate: { label: 'Moderate Risk — Stay mindful',  icon: '🌤', bg: '#FFF8EC', bar: '#FFB547', tc: '#7A5010', pill: 'amber'  },
  high:     { label: 'High Risk — Support available', icon: '⚠️', bg: '#FFF0F5', bar: '#FF6B9D', tc: '#8C1040', pill: 'rose'   },
}

const EMOTION_COLORS = {
  stressed:    { bg: '#FDF0E8', c: '#7A4010' },
  anxious:     { bg: '#F5E8EC', c: '#6B2A3A' },
  sad:         { bg: '#EBF2F7', c: '#2A5A72' },
  hopeful:     { bg: '#EDF7F0', c: '#2E6B40' },
  calm:        { bg: '#EDF7F0', c: '#2E6B40' },
  neutral:     { bg: '#F1EFE8', c: '#5F5E5A' },
  happy:       { bg: '#EDF7F0', c: '#2E6B40' },
  overwhelmed: { bg: '#FBF4E8', c: '#7A5320' },
  content:     { bg: '#EDF7F0', c: '#2E6B40' },
  grateful:    { bg: '#EDF7F0', c: '#2E6B40' },
  isolated:    { bg: '#EBF2F7', c: '#2A5A72' },
  hopeless:    { bg: '#F5E8EC', c: '#6B2A3A' },
  joyful:      { bg: '#EDF7F0', c: '#2E6B40' },
  energised:   { bg: '#E6FAF9', c: '#0F6E56' },
  mixed:       { bg: '#F1EFE8', c: '#5F5E5A' },
  uncertain:   { bg: '#F1EFE8', c: '#5F5E5A' },
}

// ─── SAMPLE ENTRIES ───────────────────────────────────────────────────────────

const SAMPLE_ENTRIES = [
  { id: 1, date: '2026-03-13', mood: 'Happy',   emoji: '😊', moodVal: 5, text: 'Had a really productive study session today. Feeling grateful and energised.', risk: 'low',      score: 22, emotions: ['content','grateful'],        recommendations: ['Maintain this positive momentum','Keep your sleep schedule consistent','Celebrate small wins today'] },
  { id: 2, date: '2026-03-12', mood: 'Worried',  emoji: '😟', moodVal: 2, text: 'Exam stress is building up a lot. Hard to focus on anything.',                risk: 'moderate', score: 58, emotions: ['stressed','anxious'],          recommendations: ['Try 4-7-8 breathing exercises','Break tasks into smaller steps','Reach out to a study group'] },
  { id: 3, date: '2026-03-11', mood: 'Calm',    emoji: '😌', moodVal: 4, text: 'Went for a long walk, felt much better after. Nature really helps.',           risk: 'low',      score: 18, emotions: ['calm','hopeful'],             recommendations: ['Continue daily walks','Practice gratitude journaling','Connect with a friend'] },
  { id: 4, date: '2026-03-10', mood: 'Sad',     emoji: '😢', moodVal: 1, text: "Couldn't focus all day. Feeling disconnected and hopeless.",                   risk: 'high',     score: 82, emotions: ['sad','hopeless','isolated'],  recommendations: ['Please reach out to a counsellor','Talk to someone you trust','Take a break from academic pressure'] },
  { id: 5, date: '2026-03-09', mood: 'Neutral',  emoji: '😐', moodVal: 3, text: 'Average day, nothing notable happened.',                                      risk: 'low',      score: 30, emotions: ['neutral'],                   recommendations: ['Try something new today','Set one small goal','Check in with a friend'] },
  { id: 6, date: '2026-03-08', mood: 'Happy',   emoji: '😊', moodVal: 5, text: 'Great session with friends. Laughed a lot, felt very connected.',             risk: 'low',      score: 14, emotions: ['joyful','energised'],         recommendations: ['Keep nurturing social bonds','Maintain this energy','Journal about what made you happy'] },
  { id: 7, date: '2026-03-07', mood: 'Worried',  emoji: '😟', moodVal: 2, text: 'Deadline pressure is overwhelming. Feeling behind on everything.',            risk: 'moderate', score: 62, emotions: ['overwhelmed','anxious'],      recommendations: ['Prioritise your task list','Take short breaks every 45 min','Deep breathing before sleep'] },
]

// ─── LOCAL STORE ──────────────────────────────────────────────────────────────

const Store = {
  _key: 'mindcare_entries',

  getEntries() {
    try {
      const raw = localStorage.getItem(this._key)
      return raw ? JSON.parse(raw) : [...SAMPLE_ENTRIES]
    } catch { return [...SAMPLE_ENTRIES] }
  },

  saveEntries(entries) {
    localStorage.setItem(this._key, JSON.stringify(entries))
  },

  addEntry(entry) {
    const entries = this.getEntries()
    entries.unshift({ ...entry, id: Date.now() })
    this.saveEntries(entries)
    return entries
  },

  getStats() {
    const entries = this.getEntries()
    const scores  = entries.map(e => e.score)
    const avg     = scores.length ? Math.round(scores.reduce((a,b)=>a+b,0)/scores.length) : 0
    const streak  = entries.length
    const latest  = entries[0]?.risk ?? 'low'
    const wellness= Math.max(0, 100 - avg)
    return { avg, streak, latest, wellness, total: entries.length }
  },

  getLast7() {
    return this.getEntries().slice(0,7).reverse()
  }
}
