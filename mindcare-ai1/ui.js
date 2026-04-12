function toast(msg, type = 'success') {
  const container = document.getElementById('toast-container')
  const el = document.createElement('div')
  el.className = `toast ${type}`
  el.textContent = (type === 'success' ? '✓  ' : '✕  ') + msg
  container.appendChild(el)
  setTimeout(() => {
    el.style.animation = 'toastOut .3s forwards'
    setTimeout(() => el.remove(), 300)
  }, 3000)
}

// ─── COUNT-UP ANIMATION ───────────────────────────────────────────────────────

function countUp(el, target, duration = 1200, suffix = '') {
  let start = 0
  const isFloat = !Number.isInteger(target)
  const step = target / (duration / 16)
  const timer = setInterval(() => {
    start += step
    if (start >= target) {
      el.textContent = (isFloat ? target.toFixed(1) : target) + suffix
      clearInterval(timer)
    } else {
      el.textContent = (isFloat ? start.toFixed(1) : Math.floor(start)) + suffix
    }
  }, 16)
}

// ─── PROGRESS BAR ─────────────────────────────────────────────────────────────

function animateBar(el, pct, delay = 0) {
  setTimeout(() => { el.style.width = pct + '%' }, delay)
}

// ─── FORMAT DATE ──────────────────────────────────────────────────────────────

function formatDate(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
}

function shortDate(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })
}

function todayStr() {
  return new Date().toISOString().slice(0,10)
}

// ─── PILL HTML ────────────────────────────────────────────────────────────────

function pillHtml(text, color = 'purple') {
  return `<span class="pill pill-${color}">${text}</span>`
}

// ─── EMOTION TAG HTML ──────────────────────────────────────────────────────────

function emotionTagHtml(label, delay = 0) {
  const c = EMOTION_COLORS[label?.toLowerCase()] ?? { bg: '#F1EFE8', c: '#5F5E5A' }
  return `<span class="emotion-tag" style="background:${c.bg};color:${c.c};animation-delay:${delay}s">${label}</span>`
}

// ─── RISK BADGE HTML ───────────────────────────────────────────────────────────

function riskBadgeHtml(risk) {
  const cfg = RISK_CONFIG[risk] ?? RISK_CONFIG.low
  return `<span class="pill pill-${cfg.pill}">${cfg.label.split('—')[0].trim()}</span>`
}

// ─── SECTION HEADER ───────────────────────────────────────────────────────────

function sectionHeader(title, sub, pillText, pillColor = 'purple') {
  return `
    <div class="card-header">
      <div>
        <div class="card-title">${title}</div>
        ${sub ? `<div class="card-sub">${sub}</div>` : ''}
      </div>
      ${pillText ? pillHtml(pillText, pillColor) : ''}
    </div>`
}

// ─── LOADING DOTS ─────────────────────────────────────────────────────────────

function loadingHtml(label = 'Reading your emotional patterns…') {
  return `<div class="loading-wrap">
    <div class="dots"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div>
    <div class="loading-text">${label}</div>
  </div>`
}
