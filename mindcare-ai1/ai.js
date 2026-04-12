const AI_FALLBACK = {
  riskLevel: 'moderate',
  score: 45,
  emotions: ['uncertain', 'mixed'],
  summary: 'Unable to fully analyse — please try again.',
  recommendations: [
    'Take a short breathing break right now',
    'Reach out to someone you trust today',
    'Step outside for five minutes of fresh air',
  ],
  aiInsight: 'Your feelings are valid. Take it one moment at a time.',
}

async function analyseWellbeing({ mood, text, answers }) {
  const prompt = `You are a compassionate mental health screening assistant for students and young professionals.

Analyse the following check-in and return ONLY a valid JSON object — no preamble, no markdown fences.

User mood: ${mood.label} (score ${mood.val}/5)
Journal entry: "${text}"
Sleep quality: ${answers.sleep ?? 'not provided'}
Stress level: ${answers.stress ?? 'not provided'}
Social connection: ${answers.social ?? 'not provided'}
Appetite: ${answers.appetite ?? 'not provided'}

Return exactly this JSON shape:
{
  "riskLevel": "low" | "moderate" | "high",
  "score": <integer 0-100>,
  "emotions": [<2-3 single emotion words>],
  "summary": "<one sentence, max 20 words>",
  "recommendations": ["<tip 1, max 12 words>", "<tip 2, max 12 words>", "<tip 3, max 12 words>"],
  "aiInsight": "<one warm encouraging sentence, max 25 words>"
}`

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 600,
        messages: [{ role: 'user', content: prompt }],
      }),
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    const raw  = data.content.map(b => b.text ?? '').join('')
    return JSON.parse(raw.replace(/```json|```/g, '').trim())
  } catch (err) {
    console.warn('AI analysis failed, using fallback:', err)
    return AI_FALLBACK
  }
}
