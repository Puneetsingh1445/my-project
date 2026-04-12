let trendChartInstance    = null
let doughnutChartInstance = null
let barChartInstance      = null

function buildTrendChart(canvasId) {
  const canvas = document.getElementById(canvasId)
  if (!canvas) return
  if (trendChartInstance) { trendChartInstance.destroy(); trendChartInstance = null }

  const entries  = Store.getLast7()
  const labels   = entries.map(e => shortDate(e.date))
  const wellness = entries.map(e => Math.max(0, 100 - e.score))
  const scores   = entries.map(e => e.score)

  trendChartInstance = new Chart(canvas, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Wellness',
          data: wellness,
          borderColor: '#7C5CFC',
          backgroundColor: 'rgba(124,92,252,.07)',
          tension: 0.45,
          pointBackgroundColor: '#7C5CFC',
          pointRadius: 4, pointHoverRadius: 7,
          fill: true, borderWidth: 2.5,
        },
        {
          label: 'Risk Score',
          data: scores,
          borderColor: '#FF6B9D',
          backgroundColor: 'rgba(255,107,157,.04)',
          tension: 0.45,
          pointBackgroundColor: '#FF6B9D',
          pointRadius: 4, pointHoverRadius: 7,
          fill: true, borderWidth: 2,
          borderDash: [5,4],
        },
      ],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      animation: { duration: 1600, easing: 'easeInOutQuart' },
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { display: true, position: 'top', labels: { font: { family: 'Outfit', size: 11 }, boxWidth: 12, padding: 14, color: '#6B6880' } },
        tooltip: { backgroundColor: '#fff', titleColor: '#1A1630', bodyColor: '#6B6880', borderColor: 'rgba(124,92,252,.2)', borderWidth: 1, padding: 12, cornerRadius: 10, titleFont: { family: 'Outfit', weight: '600' }, bodyFont: { family: 'Outfit', size: 11 } },
      },
      scales: {
        y: { min: 0, max: 100, grid: { color: 'rgba(0,0,0,.04)' }, ticks: { font: { family: 'Outfit', size: 10 }, color: '#A8A4BC' }, border: { display: false } },
        x: { grid: { display: false }, ticks: { font: { family: 'Outfit', size: 10 }, color: '#A8A4BC' }, border: { display: false } },
      },
    },
  })
}

function buildDoughnutChart(canvasId) {
  const canvas = document.getElementById(canvasId)
  if (!canvas) return
  if (doughnutChartInstance) { doughnutChartInstance.destroy(); doughnutChartInstance = null }

  const entries = Store.getEntries()
  const counts  = entries.reduce((a,e) => { a[e.risk] = (a[e.risk]??0)+1; return a }, { low:0, moderate:0, high:0 })

  doughnutChartInstance = new Chart(canvas, {
    type: 'doughnut',
    data: {
      labels: ['Low Risk', 'Moderate', 'High Risk'],
      datasets: [{ data: [counts.low, counts.moderate, counts.high], backgroundColor: ['#52C97A','#FFB547','#FF6B9D'], borderWidth: 0, hoverOffset: 8 }],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      animation: { duration: 1400, easing: 'easeInOutQuart' },
      cutout: '68%',
      plugins: {
        legend: { position: 'bottom', labels: { font: { family: 'Outfit', size: 11 }, padding: 14, color: '#6B6880' } },
        tooltip: { backgroundColor: '#fff', titleColor: '#1A1630', bodyColor: '#6B6880', borderColor: 'rgba(124,92,252,.2)', borderWidth: 1, padding: 10, cornerRadius: 10, titleFont: { family: 'Outfit', weight: '600' }, bodyFont: { family: 'Outfit', size: 11 } },
      },
    },
  })
}

function buildBarChart(canvasId) {
  const canvas = document.getElementById(canvasId)
  if (!canvas) return
  if (barChartInstance) { barChartInstance.destroy(); barChartInstance = null }

  const entries = Store.getEntries().slice().reverse().slice(-10)
  const labels  = entries.map(e => shortDate(e.date))
  const bgColors = entries.map(e =>
    e.risk==='low'?'rgba(82,201,122,.75)': e.risk==='moderate'?'rgba(255,181,71,.75)':'rgba(255,107,157,.75)')

  barChartInstance = new Chart(canvas, {
    type: 'bar',
    data: {
      labels,
      datasets: [{ label: 'Risk Score', data: entries.map(e=>e.score), backgroundColor: bgColors, borderRadius: 8, borderSkipped: false }],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      animation: { duration: 1400, easing: 'easeInOutQuart' },
      plugins: { legend: { display: false }, tooltip: { backgroundColor:'#fff', titleColor:'#1A1630', bodyColor:'#6B6880', borderColor:'rgba(124,92,252,.2)', borderWidth:1, padding:10, cornerRadius:10, titleFont:{family:'Outfit',weight:'600'}, bodyFont:{family:'Outfit',size:11} } },
      scales: {
        y: { min:0, max:100, grid:{color:'rgba(0,0,0,.04)'}, ticks:{font:{family:'Outfit',size:10},color:'#A8A4BC'}, border:{display:false} },
        x: { grid:{display:false}, ticks:{font:{family:'Outfit',size:10},color:'#A8A4BC'}, border:{display:false} },
      },
    },
  })
}
