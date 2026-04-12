function renderDashboard() {
  const { avg, streak, latest, wellness, total } = Store.getStats()
  const latestEntry = Store.getEntries()[0]

  document.getElementById('page-dashboard').innerHTML = `

    ${renderTopBar('Hello, Alex 👋', 'How are you feeling today? Let\'s check in.')}

    <!-- Stats -->
    <div class="stat-grid">
      ${renderStatCard('🧠','Wellness Score', wellness, '%', wellness>60?'↑ Feeling good':'↓ Low this week', wellness>60?'good':'bad','purple','delay-1')}
      ${renderStatCard('📊','Avg Risk Score', avg, '', avg<40?'↓ Below threshold':'↑ Needs attention', avg<40?'good':'warn','teal','delay-2')}
      ${renderStatCard('🔥','Day Streak', streak, 'd', 'Keep checking in!','good','amber','delay-3')}
      ${renderStatCard('💆','Current Risk', latest==='low'?18:latest==='moderate'?52:82, '', latest==='low'?'✦ Low risk':latest==='moderate'?'~ Moderate':'⚠ High risk', latest==='low'?'good':latest==='moderate'?'warn':'bad','rose','delay-4')}
    </div>

    <!-- Chart + Path -->
    <div class="grid-3">
      <div class="card delay-5">
        ${sectionHeader('Mood Trend','Last 7 days','Live data','green')}
        <div class="chart-wrap">
          <div class="chart-loading" id="trend-loading">
            <div class="dot"></div><div class="dot"></div><div class="dot"></div>
          </div>
          <canvas id="trend-chart" style="display:none"></canvas>
        </div>
      </div>
      <div class="card delay-6">
        ${sectionHeader('Active Path','This week\'s habits','This week')}
        ${renderActivePath()}
      </div>
    </div>

    <!-- Recs + History -->
    <div class="grid-2">
      <div class="card delay-7">
        ${sectionHeader('Recommendations','Personalised for you','AI-generated')}
        ${renderDefaultRecs()}
      </div>
      <div class="card delay-7">
        ${sectionHeader('Recent Entries','Your mood history','Last 5')}
        ${renderHistoryList(Store.getEntries().slice(0,5))}
      </div>
    </div>
  `

  // Animate stat counters
  document.querySelectorAll('.stat-value[data-target]').forEach(el => {
    const target = parseFloat(el.dataset.target)
    const unit = el.dataset.unit || ''
    countUp(el, target, 1200, unit)
  })

  // Animate progress bars
  setTimeout(() => {
    document.querySelectorAll('.progress-fill[data-pct]').forEach(el => {
      animateBar(el, el.dataset.pct, 0)
    })
  }, 400)

  // Load chart with delay
  setTimeout(() => {
    document.getElementById('trend-loading').style.display = 'none'
    const canvas = document.getElementById('trend-chart')
    if (canvas) {
      canvas.style.display = 'block'
      buildTrendChart('trend-chart')
    }
  }, 350)
}

function renderStatCard(icon, label, value, unit, trend, trendType, accent, delayClass) {
  return `
  <div class="stat-card ${accent} ${delayClass}">
    <div class="stat-icon">${icon}</div>
    <div class="stat-label">${label}</div>
    <div class="stat-value" data-target="${value}" data-unit="${unit}">${value}${unit}</div>
    <div class="stat-trend trend-${trendType}">${trend}</div>
  </div>`
}

function renderActivePath() {
  const paths = [
    { icon:'🧘', name:'Daily Meditation', pct:60, color:'#7C5CFC' },
    { icon:'🏃', name:'Physical Exercise', pct:85, color:'#4ECDC4' },
    { icon:'📓', name:'Journaling',        pct:40, color:'#FFB547' },
  ]
  return paths.map((p,i) => `
    <div class="path-item">
      <div class="path-top">
        <span class="path-name">${p.icon} ${p.name}</span>
        <span class="path-pct" style="color:${p.color}">${p.pct}%</span>
      </div>
      <div class="progress-wrap">
        <div class="progress-fill" data-pct="${p.pct}" style="background:linear-gradient(90deg,${p.color},${p.color}99)"></div>
      </div>
    </div>`).join('')
}

function renderDefaultRecs() {
  const recs = [
    { icon:'🧘', title:'Try 4-7-8 breathing',      desc:'Inhale 4s, hold 7s, exhale 8s. Reduces cortisol fast.' },
    { icon:'🌿', title:'Take a 10-minute walk',    desc:'A short outdoor walk boosts serotonin and mood.' },
    { icon:'📵', title:'Digital detox after 9 PM', desc:'Reduce screen time before bed for better sleep.' },
  ]
  return recs.map((r,i) => `
    <div class="rec-card delay-${i+1}" style="animation-delay:${.4+i*.1}s">
      <div class="rec-card-icon">${r.icon}</div>
      <div>
        <div class="rec-card-title">${r.title}</div>
        <div class="rec-card-desc">${r.desc}</div>
      </div>
    </div>`).join('')
}

function renderHistoryList(entries) {
  if (!entries.length) return '<p style="color:var(--ink3);font-size:13px;text-align:center;padding:16px">No entries yet.</p>'
  return `<div class="history-list">${entries.map((e,i) => `
    <div class="history-row" style="animation-delay:${.05*i}s">
      <div class="history-emoji">${e.emoji}</div>
      <div style="flex:1;min-width:0">
        <div class="history-date">${shortDate(e.date)}</div>
        <div class="history-mood">${e.mood}</div>
        <div class="history-snip">${e.text}</div>
      </div>
      ${riskBadgeHtml(e.risk)}
    </div>`).join('')}</div>`
}

// ─── CHECK-IN PAGE ─────────────────────────────────────────────────────────────

let checkinState = { mood: null, answers: {} }

function renderCheckin() {
  document.getElementById('page-checkin').innerHTML = `
    ${renderTopBar('Daily Check-In','Take a moment to reflect on how you\'re feeling.')}
    <div class="grid-3">
      <div class="card delay-1" id="checkin-card">
        ${sectionHeader('Today\'s Check-In','Log your mood and feelings','Daily')}

        <div class="field-label">How are you feeling?</div>
        <div class="mood-grid" id="mood-grid">
          ${MOODS.map(m => `
            <button class="mood-btn" data-mood='${JSON.stringify(m)}' onclick="selectMood(this)">
              <span class="mood-emoji">${m.emoji}</span>
              <span class="mood-label">${m.label}</span>
            </button>`).join('')}
        </div>

        <div class="field-label">What's on your mind?</div>
        <textarea class="journal-textarea" id="journal-text" placeholder="Write freely — how was your day? This is your safe space…" oninput="checkReady()"></textarea>
        <div class="char-count" id="char-count">0 characters</div>

        <div class="field-label">Quick check-in</div>
        <div id="quiz-section">
          ${QUESTIONS.map(q => `
            <div class="quiz-q">
              <div class="quiz-text">${q.text}</div>
              <div class="quiz-opts">
                ${q.opts.map(o => `<button class="quiz-opt" data-qid="${q.id}" data-val="${o}" onclick="selectQuiz(this)">${o}</button>`).join('')}
              </div>
            </div>`).join('')}
        </div>

        <button class="btn-primary" id="analyse-btn" disabled onclick="runAnalysis()">✦ Analyse My Wellbeing</button>
        <div id="loading-area" style="display:none">${loadingHtml()}</div>
        <div id="result-area"></div>
      </div>

      <div class="card delay-2">
        ${sectionHeader('Recommendations','Personalised for you','AI-generated')}
        <div id="recs-panel">${renderDefaultRecs()}</div>
      </div>
    </div>
  `

  // Reset state
  checkinState = { mood: null, answers: {} }

  // Char counter
  document.getElementById('journal-text').addEventListener('input', function() {
    document.getElementById('char-count').textContent = this.value.length + ' characters' + (this.value.length < 10 && this.value.length > 0 ? ' (min 10)' : '')
  })
}

function selectMood(btn) {
  document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('selected'))
  btn.classList.add('selected')
  checkinState.mood = JSON.parse(btn.dataset.mood)
  checkReady()
}

function selectQuiz(btn) {
  document.querySelectorAll(`.quiz-opt[data-qid="${btn.dataset.qid}"]`).forEach(b => b.classList.remove('selected'))
  btn.classList.add('selected')
  checkinState.answers[btn.dataset.qid] = btn.dataset.val
  checkReady()
}

function checkReady() {
  const text = document.getElementById('journal-text')?.value.trim() ?? ''
  const allQ = Object.keys(checkinState.answers).length === QUESTIONS.length
  const btn  = document.getElementById('analyse-btn')
  if (btn) btn.disabled = !(checkinState.mood && text.length > 10 && allQ)
}

async function runAnalysis() {
  const text = document.getElementById('journal-text').value
  document.getElementById('analyse-btn').disabled = true
  document.getElementById('loading-area').style.display = 'block'
  document.getElementById('result-area').innerHTML = ''

  const result = await analyseWellbeing({ mood: checkinState.mood, text, answers: checkinState.answers })

  document.getElementById('loading-area').style.display = 'none'
  document.getElementById('result-area').innerHTML = buildResultCard(result)
  document.getElementById('analyse-btn').textContent = '✓ Analysed — Retry?'
  document.getElementById('analyse-btn').disabled = false

  // Animate score bar
  setTimeout(() => {
    const fill = document.getElementById('score-bar-fill')
    if (fill) fill.style.width = result.score + '%'
  }, 100)

  // Update recs panel
  if (result.recommendations?.length) {
    const icons = ['🧘','💡','🌿']
    document.getElementById('recs-panel').innerHTML = result.recommendations.map((r,i) => `
      <div class="rec-card" style="animation-delay:${i*.1}s">
        <div class="rec-card-icon">${icons[i]||'✦'}</div>
        <div>
          <div class="rec-card-title">Tip ${i+1}</div>
          <div class="rec-card-desc">${r}</div>
        </div>
      </div>`).join('')
  }

  // Save entry
  Store.addEntry({
    date: todayStr(), mood: checkinState.mood.label,
    emoji: checkinState.mood.emoji, moodVal: checkinState.mood.val,
    text, risk: result.riskLevel, score: result.score,
    emotions: result.emotions, recommendations: result.recommendations,
  })
  toast('Check-in saved!', 'success')
}

function buildResultCard(r) {
  const cfg = RISK_CONFIG[r.riskLevel] ?? RISK_CONFIG.low
  const emotions = (r.emotions||[]).map((e,i) => emotionTagHtml(e, i*.08)).join('')
  const recs = (r.recommendations||[]).map((rec,i) => `<li class="rec-item" style="animation-delay:${.4+i*.1}s">${rec}</li>`).join('')

  const crisisBanner = r.riskLevel === 'high' ? `
    <div class="crisis-banner">
      <div class="crisis-title">💙 You're not alone — help is here</div>
      ${CRISIS_LINES.slice(0,3).map((l,i) => `
        <div class="crisis-line" style="animation-delay:${.5+i*.08}s">
          <div class="crisis-icon">${l.icon}</div>
          <div>
            <div class="crisis-name">${l.name}</div>
            <div class="crisis-num">${l.num} · ${l.sub}</div>
          </div>
          <button class="crisis-call">Call</button>
        </div>`).join('')}
    </div>` : ''

  return `
    <div class="result-card ${r.riskLevel}">
      <div class="result-top">
        <div class="result-icon">${cfg.icon}</div>
        <div class="result-meta">
          <div class="result-risk-label">Risk Level</div>
          <div class="result-title">${cfg.label}</div>
        </div>
        <div class="result-score">${r.score}</div>
      </div>
      <div class="score-bar-bg">
        <div class="score-bar-fill" id="score-bar-fill" style="background:${cfg.bar}"></div>
      </div>
      <div class="emotion-tags">${emotions}</div>
      <div class="ai-insight">${r.aiInsight}</div>
      <div class="rec-label">Personalised Tips</div>
      <ul class="rec-list">${recs}</ul>
    </div>
    ${crisisBanner}`
}

// ─── PROGRESS PAGE ─────────────────────────────────────────────────────────────

function renderProgress() {
  const { avg, streak, wellness, total } = Store.getStats()
  const goals = [
    { icon:'🧘', label:'Meditate daily',       target:30, done:18, unit:'days'    },
    { icon:'🏃', label:'Exercise 4× a week',   target:16, done:12, unit:'sessions'},
    { icon:'😴', label:'Sleep 7–8 hours',       target:30, done:20, unit:'nights'  },
    { icon:'📓', label:'Journal every day',     target:30, done:12, unit:'entries' },
  ]

  document.getElementById('page-progress').innerHTML = `
    ${renderTopBar('Your Progress','Track how your mental wellbeing has changed over time.')}

    <div class="stat-grid">
      ${[
        ['📝','Total Entries',total,'','All-time','good','purple'],
        ['📊','Avg Risk Score',avg,'',''+( avg<40?'↓ Below threshold':'Needs attention'),avg<40?'good':'warn','teal'],
        ['🧠','Wellness Index',wellness,'%','Overall score','good','amber'],
        ['🔥','Day Streak',streak,'d','Keep going!','good','rose'],
      ].map(([icon,label,val,unit,trend,tt,accent],i) =>
        renderStatCard(icon,label,val,unit,trend,tt,accent,`delay-${i+1}`)
      ).join('')}
    </div>

    <div class="grid-2">
      <div class="card delay-5">
        ${sectionHeader('Risk Distribution','All-time breakdown','Doughnut')}
        <div class="chart-wrap">
          <canvas id="doughnut-chart"></canvas>
        </div>
      </div>
      <div class="card delay-6">
        ${sectionHeader('Score History','Last 10 check-ins','Bar chart')}
        <div class="chart-wrap">
          <canvas id="bar-chart"></canvas>
        </div>
      </div>
    </div>

    <div class="card delay-7">
      ${sectionHeader('Monthly Goals','Your wellness habits this month','March 2026','green')}
      <div class="goal-grid">
        ${goals.map((g,i) => {
          const pct = Math.round(g.done/g.target*100)
          const barColor = pct>=70?'#52C97A':pct>=40?'#FFB547':'#FF6B9D'
          return `
          <div class="goal-item">
            <div class="goal-top">
              <span class="goal-name">${g.icon} ${g.label}</span>
              <span class="goal-meta">${g.done}/${g.target} ${g.unit}</span>
            </div>
            <div class="progress-wrap">
              <div class="progress-fill" data-pct="${pct}" style="background:linear-gradient(90deg,${barColor},${barColor}99)"></div>
            </div>
            <div class="goal-pct">${pct}% complete</div>
          </div>`
        }).join('')}
      </div>
    </div>
  `

  // Count-ups
  document.querySelectorAll('.stat-value[data-target]').forEach(el => {
    countUp(el, parseFloat(el.dataset.target), 1200, el.dataset.unit||'')
  })

  // Progress bars
  setTimeout(() => {
    document.querySelectorAll('.progress-fill[data-pct]').forEach(el => animateBar(el, el.dataset.pct, 0))
  }, 400)

  // Charts
  setTimeout(() => { buildDoughnutChart('doughnut-chart'); buildBarChart('bar-chart') }, 300)
}

// ─── RESOURCES PAGE ────────────────────────────────────────────────────────────

function renderResources() {
  document.getElementById('page-resources').innerHTML = `
    ${renderTopBar('Resources & Support','Tools, guides, and helplines curated for your wellbeing.')}

    <div class="resources-hero delay-1">
      <h3>You're doing great by checking in 🌿</h3>
      <p style="font-size:14px;color:var(--ink2);line-height:1.65">
        Mental health is a journey. These resources can support you every step of the way.
      </p>
    </div>

    <div class="res-grid">
      ${RESOURCES.map((r,i) => `
        <div class="res-card" style="animation-delay:${.1+i*.08}s">
          <div class="res-icon">${r.icon}</div>
          <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:8px;margin-bottom:6px">
            <div class="res-title">${r.title}</div>
            <span class="res-tag" style="background:${r.tagBg};color:${r.tagC};flex-shrink:0">${r.tag}</span>
          </div>
          <div class="res-desc">${r.desc}</div>
          <a href="#" class="res-link" onclick="return false">Explore →</a>
        </div>`).join('')}
    </div>

    <div class="card delay-7">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:18px">
        <div style="width:42px;height:42px;border-radius:10px;background:var(--rose-l);display:flex;align-items:center;justify-content:center;font-size:20px">🆘</div>
        <div>
          <div class="card-title">Crisis Helplines</div>
          <div class="card-sub">Available if you need immediate support</div>
        </div>
      </div>
      <div class="grid-2" style="gap:10px">
        ${CRISIS_LINES.map((l,i) => `
          <div class="crisis-line" style="animation-delay:${.2+i*.08}s">
            <div class="crisis-icon">${l.icon}</div>
            <div style="flex:1;min-width:0">
              <div class="crisis-name">${l.name}</div>
              <div class="crisis-num">${l.num}</div>
              <div style="font-size:10px;color:var(--ink3)">${l.sub}</div>
            </div>
            <button class="crisis-call">Call</button>
          </div>`).join('')}
      </div>
      <div style="margin-top:14px;padding:14px;background:var(--rose-l);border:1px solid rgba(255,107,157,.2);border-radius:var(--r-xs)">
        <p style="font-size:12px;color:#CC2060;line-height:1.6">
          <strong>If you're in immediate danger</strong>, please call emergency services (112) or go to your nearest hospital.
          You are not alone — help is always available.
        </p>
      </div>
    </div>
  `
}

// ─── HISTORY PAGE ──────────────────────────────────────────────────────────────

let historyFilter = 'All'

function renderHistory() {
  document.getElementById('page-history').innerHTML = `
    ${renderTopBar('Entry History','A full log of your daily check-ins.')}

    <div class="filter-row">
      ${['All','Low','Moderate','High'].map(f => `
        <button class="filter-btn ${historyFilter===f?'active':''}" onclick="setHistoryFilter('${f}')">${f}</button>
      `).join('')}
      <span class="filter-count" id="filter-count"></span>
    </div>

    <div id="entries-list"></div>
  `
  renderEntries()
}

function setHistoryFilter(f) {
  historyFilter = f
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.toggle('active', b.textContent===f))
  renderEntries()
}

function renderEntries() {
  const all     = Store.getEntries()
  const entries = historyFilter === 'All' ? all : all.filter(e => e.risk === historyFilter.toLowerCase())
  document.getElementById('filter-count').textContent = `${entries.length} ${entries.length===1?'entry':'entries'}`
  document.getElementById('entries-list').innerHTML = entries.length
    ? entries.map((e,i) => buildEntryCard(e,i)).join('')
    : '<p style="text-align:center;color:var(--ink3);padding:32px">No entries found for this filter.</p>'
}

function buildEntryCard(e, i) {
  const cfg = RISK_CONFIG[e.risk] ?? RISK_CONFIG.low
  const emotions = (e.emotions||[]).map(em => emotionTagHtml(em)).join('')
  const recs = (e.recommendations||[]).map(r => `<li style="font-size:12px;color:var(--ink);padding:4px 0;display:flex;gap:6px"><span style="color:var(--purple);font-weight:700">→</span>${r}</li>`).join('')

  return `
  <div class="entry-card" style="margin-bottom:10px;animation-delay:${i*.07}s" id="entry-${e.id}">
    <div class="entry-row" onclick="toggleEntry(${e.id})">
      <div class="entry-emoji">${e.emoji}</div>
      <div class="entry-info">
        <div class="entry-date">${formatDate(e.date)}</div>
        <div class="entry-mood">${e.mood}</div>
        <div class="entry-snip">${e.text}</div>
      </div>
      <div class="entry-score-badge" style="background:${cfg.bg};color:${cfg.tc}">${e.score}</div>
      <div class="expand-icon">▾</div>
    </div>
    <div class="entry-detail" id="detail-${e.id}">
      <div class="entry-detail-inner">
        <p class="entry-full-text">"${e.text}"</p>
        ${emotions.length ? `<div class="emotion-tags" style="margin-bottom:10px">${emotions}</div>` : ''}
        <div style="display:inline-flex;align-items:center;gap:6px;padding:6px 14px;border-radius:100px;font-size:11px;font-weight:600;background:${cfg.bg};color:${cfg.tc};margin-bottom:10px">
          ${cfg.icon} ${cfg.label} · Score ${e.score}/100
        </div>
        ${recs ? `
          <div class="entry-recs">
            <div class="entry-recs-label">Tips from that day</div>
            <ul style="list-style:none">${recs}</ul>
          </div>` : ''}
      </div>
    </div>
  </div>`
}

function toggleEntry(id) {
  const card   = document.getElementById(`entry-${id}`)
  const detail = document.getElementById(`detail-${id}`)
  const isOpen = card.classList.contains('open')
  card.classList.toggle('open', !isOpen)
  detail.classList.toggle('open', !isOpen)
}

// ─── TOPBAR HELPER ─────────────────────────────────────────────────────────────

function renderTopBar(title, subtitle) {
  const now = new Date().toLocaleDateString('en-IN', { weekday:'short', month:'short', day:'numeric', year:'numeric' })
  return `
  <div class="topbar">
    <div>
      <h1>${title}</h1>
      <p>${subtitle}</p>
    </div>
    <div class="topbar-right">
      <div class="date-badge">${now}</div>
      <div class="notif-btn">🔔<div class="notif-dot"></div></div>
    </div>
  </div>`
}
