// ─── GEMINI AI ASSISTANT ──────────────────────────────────────────────────────
// Uses REST API directly so it works without Vite bundling

const GEMINI_API_KEY = 'AIzaSyCPR-POjpSDoN6oU3Bns1Sf7uf979BHjS0';
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

async function askGemini(prompt) {
  const res = await fetch(GEMINI_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }]
    })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `HTTP ${res.status}`);
  }
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? 'No response received.';
}

window.askAI = async function() {
  const inputEl  = document.getElementById('ai-user-input');
  const outputEl = document.getElementById('ai-response-box');
  const btnEl    = document.getElementById('ai-send-btn');

  if (!outputEl) return;

  const prompt = (inputEl?.value?.trim())
    ? inputEl.value.trim()
    : 'Give me a helpful mental health tip for a student.';

  outputEl.style.display = 'block';
  outputEl.innerHTML = '<span style="color:var(--ink3)"><em>✦ Thinking…</em></span>';
  if (btnEl) btnEl.disabled = true;

  try {
    const text = await askGemini(prompt);
    outputEl.innerHTML = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>');
    if (inputEl) inputEl.value = '';
  } catch (err) {
    console.error('Gemini error:', err);
    outputEl.innerHTML = `<span style="color:var(--ro);">⚠ ${err.message}</span>`;
  } finally {
    if (btnEl) btnEl.disabled = false;
  }
};
