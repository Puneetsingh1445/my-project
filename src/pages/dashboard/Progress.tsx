import { useEffect, useRef } from 'react';
import { Store, shortDate } from './store';

declare global { interface Window { Chart: any } }

function useChart(id: string, buildFn: (canvas: HTMLCanvasElement) => any) {
  const chartRef = useRef<any>(null);
  useEffect(() => {
    const t = setTimeout(() => {
      const canvas = document.getElementById(id) as HTMLCanvasElement;
      if (!canvas || !window.Chart) return;
      if (chartRef.current) { chartRef.current.destroy(); chartRef.current = null; }
      chartRef.current = buildFn(canvas);
    }, 300);
    return () => { clearTimeout(t); if (chartRef.current) chartRef.current.destroy(); };
  }, []);
}

function DoughnutChart() {
  useChart('mc-doughnut', canvas => {
    const entries = Store.getEntries();
    const ct = entries.reduce((a: any, x) => { a[x.risk] = (a[x.risk]??0)+1; return a; }, {low:0,moderate:0,high:0});
    return new window.Chart(canvas, {
      type:'doughnut',
      data:{ labels:['Low Risk','Moderate','High Risk'], datasets:[{data:[ct.low,ct.moderate,ct.high],backgroundColor:['#52C97A','#FFB547','#FF6B9D'],borderWidth:0,hoverOffset:8}] },
      options:{ responsive:true,maintainAspectRatio:false,animation:{duration:1400,easing:'easeInOutQuart'},cutout:'68%',plugins:{ legend:{position:'bottom',labels:{font:{family:'Outfit',size:11},padding:14,color:'#6B6880'}},tooltip:{backgroundColor:'#fff',titleColor:'#1A1630',bodyColor:'#6B6880',borderColor:'rgba(124,92,252,.2)',borderWidth:1,padding:12,cornerRadius:10} } },
    });
  });
  return <div className="mc-chart-wrap"><canvas id="mc-doughnut" /></div>;
}

function BarChart() {
  useChart('mc-bar', canvas => {
    const entries = Store.getEntries().slice().reverse().slice(-10);
    const bg = entries.map((x) => x.risk==='low'?'rgba(82,201,122,.75)':x.risk==='moderate'?'rgba(255,181,71,.75)':'rgba(255,107,157,.75)');
    return new window.Chart(canvas, {
      type:'bar',
      data:{ labels:entries.map(x=>shortDate(x.date)), datasets:[{label:'Risk Score',data:entries.map(x=>x.score),backgroundColor:bg,borderRadius:8,borderSkipped:false}] },
      options:{ responsive:true,maintainAspectRatio:false,animation:{duration:1400,easing:'easeInOutQuart'},plugins:{legend:{display:false},tooltip:{backgroundColor:'#fff',titleColor:'#1A1630',bodyColor:'#6B6880',borderColor:'rgba(124,92,252,.2)',borderWidth:1,padding:12,cornerRadius:10}},scales:{y:{min:0,max:100,grid:{color:'rgba(0,0,0,.04)'},ticks:{font:{family:'Outfit',size:10},color:'#A8A4BC'},border:{display:false}},x:{grid:{display:false},ticks:{font:{family:'Outfit',size:10},color:'#A8A4BC'},border:{display:false}}} },
    });
  });
  return <div className="mc-chart-wrap"><canvas id="mc-bar" /></div>;
}

export default function Progress() {
  const { avg, streak, wellness, total } = Store.getStats();
  const now = new Date().toLocaleDateString('en-IN', { weekday:'short', month:'short', day:'numeric', year:'numeric' });

  const goals = [
    { icon:'🧘', label:'Meditate daily',      target:30, done:18, unit:'days'     },
    { icon:'🏃', label:'Exercise 4× a week',  target:16, done:12, unit:'sessions' },
    { icon:'😴', label:'Sleep 7–8 hours',      target:30, done:20, unit:'nights'   },
    { icon:'📓', label:'Journal every day',    target:30, done:12, unit:'entries'  },
  ];

  const stats: { icon:string; label:string; value:number; unit:string; trend:string; trendType:'good'|'warn'|'bad'; accent:string; delay:string }[] = [
    { icon:'📝', label:'Total Entries',  value:total,    unit:'',  trend:'All-time',               trendType:'good', accent:'purple', delay:'mc-d1' },
    { icon:'📊', label:'Avg Risk Score', value:avg,      unit:'',  trend:avg<40?'↓ Below threshold':'Needs attention', trendType:avg<40?'good':'warn', accent:'teal',   delay:'mc-d2' },
    { icon:'🧠', label:'Wellness Index', value:wellness, unit:'%', trend:'Overall score',           trendType:'good', accent:'amber',  delay:'mc-d3' },
    { icon:'🔥', label:'Day Streak',     value:streak,   unit:'d', trend:'Keep going!',             trendType:'good', accent:'rose',   delay:'mc-d4' },
  ];

  useEffect(() => {
    // count-up
    stats.forEach(s => {
      const el = document.getElementById(`mc-stat-${s.label.replace(/\s/g,'-')}`);
      if (!el) return;
      let cur = 0; const target = s.value; const step = target / (1200/16);
      const t = setInterval(() => {
        cur += step;
        if (cur >= target) { el.textContent = Math.round(target) + s.unit; clearInterval(t); }
        else el.textContent = Math.floor(cur) + s.unit;
      }, 16);
    });
    // progress bars
    setTimeout(() => {
      document.querySelectorAll<HTMLElement>('.mc-pb-fill[data-pct]').forEach(el => { el.style.width = el.dataset.pct + '%'; });
    }, 400);
  }, []);

  return (
    <>
      <div className="mc-topbar">
        <div><h1>Your Progress</h1><p>Track how your mental wellbeing has changed over time.</p></div>
        <div className="mc-topbar-right">
          <div className="mc-date-badge">{now}</div>
          <div className="mc-notif-btn">🔔<div className="mc-notif-dot"/></div>
        </div>
      </div>

      <div className="mc-stat-grid">
        {stats.map(s => (
          <div key={s.label} className={`mc-stat-card ${s.accent} ${s.delay}`}>
            <div className="mc-stat-icon">{s.icon}</div>
            <div className="mc-stat-label">{s.label}</div>
            <div className="mc-stat-value" id={`mc-stat-${s.label.replace(/\s/g,'-')}`}>{s.value}{s.unit}</div>
            <div className={`mc-stat-trend mc-trend-${s.trendType}`}>{s.trend}</div>
          </div>
        ))}
      </div>

      <div className="mc-grid-2">
        <div className="mc-card mc-d5">
          <div className="mc-card-header">
            <div><div className="mc-card-title">Risk Distribution</div><div className="mc-card-sub">All-time breakdown</div></div>
            <span className="mc-pill mc-pp">Doughnut</span>
          </div>
          <DoughnutChart />
        </div>
        <div className="mc-card mc-d6">
          <div className="mc-card-header">
            <div><div className="mc-card-title">Score History</div><div className="mc-card-sub">Last 10 check-ins</div></div>
            <span className="mc-pill mc-pp">Bar chart</span>
          </div>
          <BarChart />
        </div>
      </div>

      <div className="mc-card mc-d7">
        <div className="mc-card-header">
          <div><div className="mc-card-title">Monthly Goals</div><div className="mc-card-sub">Your wellness habits this month</div></div>
          <span className="mc-pill mc-pg">March 2026</span>
        </div>
        <div className="mc-goal-grid">
          {goals.map((g,i) => {
            const pct = Math.round(g.done/g.target*100);
            const color = pct>=70?'#52C97A':pct>=40?'#FFB547':'#FF6B9D';
            return (
              <div key={i}>
                <div className="mc-goal-top">
                  <span className="mc-goal-name">{g.icon} {g.label}</span>
                  <span className="mc-goal-meta">{g.done}/{g.target} {g.unit}</span>
                </div>
                <div className="mc-pb-wrap">
                  <div className="mc-pb-fill" data-pct={pct} style={{background:`linear-gradient(90deg,${color},${color}99)`}} />
                </div>
                <div className="mc-goal-pct">{pct}% complete</div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
