import { useEffect, useRef } from 'react';
import type { User } from '@supabase/supabase-js';
import { Store, shortDate } from './store';

declare global { interface Window { Chart: any } }

interface ProgressProps { user?: User | null; }

function useChart(id: string, buildFn: (canvas: HTMLCanvasElement) => any, deps: any[] = []) {
  const chartRef = useRef<any>(null);
  useEffect(() => {
    const t = setTimeout(() => {
      const canvas = document.getElementById(id) as HTMLCanvasElement;
      if (!canvas || !window.Chart) return;
      if (chartRef.current) { chartRef.current.destroy(); chartRef.current = null; }
      chartRef.current = buildFn(canvas);
    }, 300);
    return () => { clearTimeout(t); if (chartRef.current) chartRef.current.destroy(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

function DoughnutChart({ userId }: { userId: string | null }) {
  useChart('mc-doughnut', canvas => {
    const entries = Store.getEntries(userId);
    const ct = entries.reduce((a: any, x) => { a[x.risk] = (a[x.risk]??0)+1; return a; }, {low:0,moderate:0,high:0});
    return new window.Chart(canvas, {
      type:'doughnut',
      data:{ labels:['Low Risk','Moderate','High Risk'], datasets:[{data:[ct.low,ct.moderate,ct.high],backgroundColor:['#52C97A','#FFB547','#FF6B9D'],borderWidth:0,hoverOffset:8}] },
      options:{ responsive:true,maintainAspectRatio:false,animation:{duration:1400,easing:'easeInOutQuart'},cutout:'68%',plugins:{ legend:{position:'bottom',labels:{font:{family:'Outfit',size:11},padding:14,color:'#6B6880'}},tooltip:{backgroundColor:'#fff',titleColor:'#1A1630',bodyColor:'#6B6880',borderColor:'rgba(124,92,252,.2)',borderWidth:1,padding:12,cornerRadius:10} } },
    });
  }, [userId]);
  return <div className="mc-chart-wrap"><canvas id="mc-doughnut" /></div>;
}

function BarChart({ userId }: { userId: string | null }) {
  useChart('mc-bar', canvas => {
    const entries = Store.getEntries(userId).slice().reverse().slice(-10);
    const bg = entries.map((x) => x.risk==='low'?'rgba(82,201,122,.75)':x.risk==='moderate'?'rgba(255,181,71,.75)':'rgba(255,107,157,.75)');
    return new window.Chart(canvas, {
      type:'bar',
      data:{ labels:entries.map(x=>shortDate(x.date)), datasets:[{label:'Risk Score',data:entries.map(x=>x.score),backgroundColor:bg,borderRadius:8,borderSkipped:false}] },
      options:{ responsive:true,maintainAspectRatio:false,animation:{duration:1400,easing:'easeInOutQuart'},plugins:{legend:{display:false},tooltip:{backgroundColor:'#fff',titleColor:'#1A1630',bodyColor:'#6B6880',borderColor:'rgba(124,92,252,.2)',borderWidth:1,padding:12,cornerRadius:10}},scales:{y:{min:0,max:100,grid:{color:'rgba(0,0,0,.04)'},ticks:{font:{family:'Outfit',size:10},color:'#A8A4BC'},border:{display:false}},x:{grid:{display:false},ticks:{font:{family:'Outfit',size:10},color:'#A8A4BC'},border:{display:false}}} },
    });
  }, [userId]);
  return <div className="mc-chart-wrap"><canvas id="mc-bar" /></div>;
}

function EmptyState({ message }: { message: string }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px 24px',
      gap: 12,
      textAlign: 'center',
      color: 'var(--ink3)',
    }}>
      <div style={{ fontSize: 40 }}>📭</div>
      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink2)' }}>{message}</div>
    </div>
  );
}

export default function Progress({ user }: ProgressProps) {
  const userId = user?.id ?? null;
  const isGuest = !userId;

  const { avg, streak, wellness, total } = Store.getStats(userId);
  const entries = Store.getEntries(userId);
  const now = new Date().toLocaleDateString('en-IN', { weekday:'short', month:'short', day:'numeric', year:'numeric' });

  const stats: { icon:string; label:string; value:number; unit:string; trend:string; trendType:'good'|'warn'|'bad'; accent:string; delay:string }[] = [
    { icon:'📝', label:'Total Entries',  value:total,    unit:'',  trend: total === 0 ? 'No data yet' : 'All-time',               trendType:'good', accent:'purple', delay:'mc-d1' },
    { icon:'📊', label:'Avg Risk Score', value:avg,      unit:'',  trend: total === 0 ? 'No data yet' : avg<40?'↓ Below threshold':'Needs attention', trendType:total === 0 ?'good':avg<40?'good':'warn', accent:'teal',   delay:'mc-d2' },
    { icon:'🧠', label:'Wellness Index', value:wellness, unit:'%', trend: total === 0 ? 'No data yet' : 'Overall score',           trendType:'good', accent:'amber',  delay:'mc-d3' },
    { icon:'🔥', label:'Day Streak',     value:streak,   unit:'d', trend: total === 0 ? 'No data yet' : streak === 1 ? 'Started today!' : 'Keep it up!', trendType:'good', accent:'rose',   delay:'mc-d4' },
  ];

  useEffect(() => {
    if (isGuest) return;
    // count-up for stat cards
    stats.forEach(s => {
      const el = document.getElementById(`mc-stat-${s.label.replace(/\s/g,'-')}`);
      if (!el) return;
      let cur = 0; const target = s.value; if (target === 0) { el.textContent = '0' + s.unit; return; }
      const step = target / (1200/16);
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
  }, [isGuest, total, avg, wellness, streak]);

  return (
    <>
      <div className="mc-topbar">
        <div><h1>Your Progress</h1><p>Track how your mental wellbeing has changed over time.</p></div>
        <div className="mc-topbar-right">
          <div className="mc-date-badge">{now}</div>
          <div className="mc-notif-btn">🔔<div className="mc-notif-dot"/></div>
        </div>
      </div>

      {/* Stats — zeros shown even for guests */}
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
          {entries.length === 0
            ? <EmptyState message="Complete your first check-in to see your risk distribution." />
            : <DoughnutChart userId={userId} />
          }
        </div>
        <div className="mc-card mc-d6">
          <div className="mc-card-header">
            <div><div className="mc-card-title">Score History</div><div className="mc-card-sub">Last 10 check-ins</div></div>
            <span className="mc-pill mc-pp">Bar chart</span>
          </div>
          {entries.length === 0
            ? <EmptyState message="Complete your first check-in to see your score history." />
            : <BarChart userId={userId} />
          }
        </div>
      </div>

      {/* Monthly Goals — hidden for guests */}
      {isGuest ? (
        <div className="mc-card mc-d7">
          <div className="mc-card-header">
            <div><div className="mc-card-title">Monthly Goals</div><div className="mc-card-sub">Your wellness habits this month</div></div>
          </div>
          <EmptyState message="No data available. Please login to track your progress." />
        </div>
      ) : (
        <div className="mc-card mc-d7">
          <div className="mc-card-header">
            <div><div className="mc-card-title">Monthly Goals</div><div className="mc-card-sub">Your wellness habits this month</div></div>
            <span className="mc-pill mc-pg">{new Date().toLocaleDateString('en-IN',{month:'long',year:'numeric'})}</span>
          </div>
          <div className="mc-goal-grid">
            {[
              { icon:'🧘', label:'Meditate daily',      target:entries.length, done:0, unit:'days'     },
              { icon:'🏃', label:'Exercise 4× a week',  target:entries.length, done:0, unit:'sessions' },
              { icon:'😴', label:'Sleep 7–8 hours',     target:entries.length, done:0, unit:'nights'   },
              { icon:'📓', label:'Journal every day',   target:Math.max(entries.length,1), done:entries.length, unit:'entries'  },
            ].map((g,i) => {
              const pct = g.target > 0 ? Math.round(g.done/g.target*100) : 0;
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
      )}
    </>
  );
}
