import { useEffect, useRef } from 'react';
import { Store, RISK_CONFIG, shortDate } from './store';

declare global { interface Window { Chart: any } }

function TopBar({ title, sub }: { title: string; sub: string }) {
  const now = new Date().toLocaleDateString('en-IN', { weekday:'short', month:'short', day:'numeric', year:'numeric' });
  return (
    <div className="mc-topbar">
      <div>
        <h1>{title}</h1>
        <p>{sub}</p>
      </div>
      <div className="mc-topbar-right">
        <div className="mc-date-badge">{now}</div>
        <div className="mc-notif-btn">🔔<div className="mc-notif-dot" /></div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, unit, trend, trendType, accent, delay }:
  { icon:string; label:string; value:number; unit:string; trend:string; trendType:'good'|'warn'|'bad'; accent:string; delay:string }) {
  const valRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!valRef.current) return;
    let s = 0, target = value;
    const step = target / (1200 / 16);
    const t = setInterval(() => {
      s += step;
      if (s >= target) { if (valRef.current) valRef.current.textContent = Math.round(target) + unit; clearInterval(t); }
      else { if (valRef.current) valRef.current.textContent = Math.floor(s) + unit; }
    }, 16);
    return () => clearInterval(t);
  }, [value, unit]);

  return (
    <div className={`mc-stat-card ${accent} ${delay}`}>
      <div className="mc-stat-icon">{icon}</div>
      <div className="mc-stat-label">{label}</div>
      <div className="mc-stat-value" ref={valRef}>{value}{unit}</div>
      <div className={`mc-stat-trend mc-trend-${trendType}`}>{trend}</div>
    </div>
  );
}

function TrendChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<any>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!canvasRef.current || !window.Chart) return;
      if (chartRef.current) { chartRef.current.destroy(); chartRef.current = null; }
      const entries = Store.getLast7();
      const labels = entries.map(x => shortDate(x.date));
      const wellness = entries.map(x => Math.max(0, 100 - x.score));
      const risk = entries.map(x => x.score);
      chartRef.current = new window.Chart(canvasRef.current, {
        type: 'line',
        data: {
          labels,
          datasets: [
            { label:'Wellness', data:wellness, borderColor:'#7C5CFC', backgroundColor:'rgba(124,92,252,.07)', tension:.45, pointBackgroundColor:'#7C5CFC', pointRadius:4, pointHoverRadius:7, fill:true, borderWidth:2.5 },
            { label:'Risk Score', data:risk, borderColor:'#FF6B9D', backgroundColor:'rgba(255,107,157,.04)', tension:.45, pointBackgroundColor:'#FF6B9D', pointRadius:4, pointHoverRadius:7, fill:true, borderWidth:2, borderDash:[5,4] },
          ],
        },
        options: {
          responsive:true, maintainAspectRatio:false, animation:{duration:1600,easing:'easeInOutQuart'},
          interaction:{mode:'index',intersect:false},
          plugins:{legend:{display:true,position:'top',labels:{font:{family:'Outfit',size:11},boxWidth:12,padding:14,color:'#6B6880'}},tooltip:{backgroundColor:'#fff',titleColor:'#1A1630',bodyColor:'#6B6880',borderColor:'rgba(124,92,252,.2)',borderWidth:1,padding:12,cornerRadius:10}},
          scales:{y:{min:0,max:100,grid:{color:'rgba(0,0,0,.04)'},ticks:{font:{family:'Outfit',size:10},color:'#A8A4BC'},border:{display:false}},x:{grid:{display:false},ticks:{font:{family:'Outfit',size:10},color:'#A8A4BC'},border:{display:false}}},
        },
      });
    }, 350);
    return () => { clearTimeout(timer); if (chartRef.current) chartRef.current.destroy(); };
  }, []);

  return <div className="mc-chart-wrap"><canvas ref={canvasRef} /></div>;
}

export default function DashboardHome({ userName = 'there' }: { userName?: string }) {
  const { avg, streak, latest, wellness } = Store.getStats();
  const entries = Store.getEntries();
  const latestRisk = latest as 'low'|'moderate'|'high';

  const paths = [
    { icon:'🧘', name:'Daily Meditation', pct:60, color:'#7C5CFC' },
    { icon:'🏃', name:'Physical Exercise', pct:85, color:'#4ECDC4' },
    { icon:'📓', name:'Journaling',        pct:40, color:'#FFB547' },
  ];

  const recs = [
    { icon:'🧘', title:'Try 4-7-8 breathing',      desc:'Inhale 4s, hold 7s, exhale 8s. Reduces cortisol fast.' },
    { icon:'🌿', title:'Take a 10-minute walk',    desc:'A short outdoor walk boosts serotonin and mood.' },
    { icon:'📵', title:'Digital detox after 9 PM', desc:'Reduce screen time before bed for better sleep.' },
  ];

  const currentRiskScore = latestRisk==='low'?18:latestRisk==='moderate'?52:82;

  useEffect(() => {
    // animate progress bars
    setTimeout(() => {
      document.querySelectorAll<HTMLElement>('.mc-pb-fill[data-pct]').forEach(el => {
        el.style.width = el.dataset.pct + '%';
      });
    }, 400);
  }, []);

  return (
    <>
      <TopBar title={`Hello, ${userName} 👋`} sub="How are you feeling today? Let's check in." />

      {/* Stats */}
      <div className="mc-stat-grid">
        <StatCard icon="🧠" label="Wellness Score" value={wellness} unit="%" trend={wellness>60?'↑ Feeling good':'↓ Low this week'} trendType={wellness>60?'good':'bad'} accent="purple" delay="mc-d1" />
        <StatCard icon="📊" label="Avg Risk Score" value={avg}     unit=""  trend={avg<40?'↓ Below threshold':'↑ Needs attention'} trendType={avg<40?'good':'warn'} accent="teal" delay="mc-d2" />
        <StatCard icon="🔥" label="Day Streak"     value={streak}  unit="d" trend="Keep checking in!" trendType="good" accent="amber" delay="mc-d3" />
        <StatCard icon="💆" label="Current Risk"   value={currentRiskScore} unit="" trend={latestRisk==='low'?'✦ Low risk':latestRisk==='moderate'?'~ Moderate':'⚠ High risk'} trendType={latestRisk==='low'?'good':latestRisk==='moderate'?'warn':'bad'} accent="rose" delay="mc-d4" />
      </div>

      {/* Chart + Path */}
      <div className="mc-grid-3">
        <div className="mc-card mc-d5">
          <div className="mc-card-header">
            <div><div className="mc-card-title">Mood Trend</div><div className="mc-card-sub">Last 7 days</div></div>
            <span className="mc-pill mc-pg">Live data</span>
          </div>
          <TrendChart />
        </div>
        <div className="mc-card mc-d6">
          <div className="mc-card-header">
            <div><div className="mc-card-title">Active Path</div><div className="mc-card-sub">This week's habits</div></div>
            <span className="mc-pill mc-pp">This week</span>
          </div>
          {paths.map((p,i) => (
            <div className="mc-path-item" key={i}>
              <div className="mc-path-top">
                <span className="mc-path-name">{p.icon} {p.name}</span>
                <span className="mc-path-pct" style={{color:p.color}}>{p.pct}%</span>
              </div>
              <div className="mc-pb-wrap">
                <div className="mc-pb-fill" data-pct={p.pct} style={{background:`linear-gradient(90deg,${p.color},${p.color}99)`}} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recs + History */}
      <div className="mc-grid-2">
        <div className="mc-card mc-d7">
          <div className="mc-card-header">
            <div><div className="mc-card-title">Recommendations</div><div className="mc-card-sub">Personalised for you</div></div>
            <span className="mc-pill mc-pp">AI-generated</span>
          </div>
          {recs.map((r,i) => (
            <div key={i} className="mc-rec-card" style={{animationDelay:`${.4+i*.1}s`}}>
              <div className="mc-rec-card-icon">{r.icon}</div>
              <div><div className="mc-rec-card-title">{r.title}</div><div className="mc-rec-card-desc">{r.desc}</div></div>
            </div>
          ))}
        </div>
        <div className="mc-card mc-d7">
          <div className="mc-card-header">
            <div><div className="mc-card-title">Recent Entries</div><div className="mc-card-sub">Your mood history</div></div>
            <span className="mc-pill mc-pp">Last 5</span>
          </div>
          <div className="mc-history-list">
            {entries.slice(0,5).map((e,i) => {
              const cfg = RISK_CONFIG[e.risk] ?? RISK_CONFIG.low;
              return (
                <div key={e.id} className="mc-history-row" style={{animationDelay:`${.05*i}s`}}>
                  <div className="mc-history-emoji">{e.emoji}</div>
                  <div style={{flex:1,minWidth:0}}>
                    <div className="mc-history-date">{shortDate(e.date)}</div>
                    <div className="mc-history-mood">{e.mood}</div>
                    <div className="mc-history-snip">{e.text}</div>
                  </div>
                  <span className="mc-pill" style={{background:cfg.bg,color:cfg.tc}}>{e.risk}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
