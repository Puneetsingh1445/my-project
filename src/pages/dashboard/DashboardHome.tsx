import { useEffect, useRef, useState } from 'react';
import type { User } from '@supabase/supabase-js';
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
    if (target === 0) { if (valRef.current) valRef.current.textContent = '0' + unit; return; }
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

function TrendChart({ userId, entryCount }: { userId: string | null | undefined; entryCount: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<any>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!canvasRef.current || !window.Chart) return;
      if (chartRef.current) { chartRef.current.destroy(); chartRef.current = null; }
      const entries = Store.getLast7(userId);
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
    // entryCount is intentionally included so the chart rebuilds on every new check-in
  }, [userId, entryCount]);

  return <div className="mc-chart-wrap"><canvas ref={canvasRef} /></div>;
}

/** Shown whenever there is no data to display (guest or new user with 0 check-ins). */
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

export default function DashboardHome({ userName = 'there', user }: { userName?: string; user?: User | null }) {
  const userId = user?.id ?? null;
  const isGuest = !userId;

  // entryVersion increments whenever a new entry is saved (same-tab OR cross-tab).
  // This forces a re-render so all derived stats read fresh data from the Store.
  const [entryVersion, setEntryVersion] = useState(0);

  useEffect(() => {
    // ① Same-tab: Store.addEntry dispatches this custom event immediately after writing.
    const onEntryAdded = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.userId === userId) setEntryVersion(v => v + 1);
    };
    // ② Cross-tab: the standard storage event fires in every tab except the originating one.
    const onStorage = (e: StorageEvent) => {
      // Covers both authenticated users and guests (mc_entries_guest)
      const expectedKey = userId ? `mc_entries_${userId}` : 'mc_entries_guest';
      if (e.key === expectedKey) setEntryVersion(v => v + 1);
    };
    window.addEventListener('mc:entry-added', onEntryAdded);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener('mc:entry-added', onEntryAdded);
      window.removeEventListener('storage', onStorage);
    };
  }, [userId]);

  // Re-read fresh data from Store on every render (entryVersion forces re-render).
  const { avg, streak, wellness, latestScore } = Store.getStats(userId);
  const entries = Store.getEntries(userId);
  // latestRisk is only meaningful when there is at least one entry.
  // 'none' acts as a sentinel so downstream code can distinguish "no data" from "low risk".
  const latestRisk = entries.length > 0
    ? (entries[0]?.risk as 'low' | 'moderate' | 'high')
    : 'none' as const;

  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  const handleAskAI = async () => {
    const prompt = aiPrompt.trim() || 'Give me a helpful mental health tip for a student.';
    setAiLoading(true);
    setAiResponse('');
    try {
      const { askGemini } = await import('../../gemini.js');
      const res = await askGemini(prompt);
      const text = typeof res === 'string' ? res : JSON.stringify(res);
      setAiResponse(text);
    } catch (err: any) {
      setAiResponse('Error: ' + (err?.message || String(err)));
    } finally {
      setAiLoading(false);
    }
  };

  const recs = [
    { icon:'🧘', title:'Try 4-7-8 breathing',      desc:'Inhale 4s, hold 7s, exhale 8s. Reduces cortisol fast.' },
    { icon:'🌿', title:'Take a 10-minute walk',    desc:'A short outdoor walk boosts serotonin and mood.' },
    { icon:'📵', title:'Digital detox after 9 PM', desc:'Reduce screen time before bed for better sleep.' },
  ];

  // Current Risk = actual score of the most recent entry (0 when no data).
  const currentRiskScore = entries.length === 0 ? 0 : latestScore;

  useEffect(() => {
    if (entries.length === 0) return;
    setTimeout(() => {
      document.querySelectorAll<HTMLElement>('.mc-pb-fill[data-pct]').forEach(el => {
        el.style.width = el.dataset.pct + '%';
      });
    }, 400);
  }, [entries.length]);

  return (
    <>
      <TopBar title={`Hello, ${userName} 👋`} sub="How are you feeling today? Let's check in." />

      {/* Guest mode notice — subtle, non-blocking */}
      {isGuest && (
        <div style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 16px', marginBottom:16, borderRadius:10, background:'rgba(124,92,252,0.07)', border:'1px solid rgba(124,92,252,0.15)', fontSize:13, color:'var(--ink2)' }}>
          <span style={{ fontSize:16 }}>👤</span>
          <span><strong>Guest mode</strong> — your data is saved locally. <span style={{ color:'#7C5CFC', fontWeight:600 }}>Log in</span> to sync across devices.</span>
        </div>
      )}

      {/* Stats — show real data for both guests and logged-in users */}
      <div className="mc-stat-grid">
        <StatCard icon="🧠" label="Wellness Score" value={wellness} unit="%" trend={entries.length === 0 ? 'No data yet' : wellness>60?'↑ Feeling good':'↓ Low this week'} trendType={entries.length === 0 ?'good':wellness>60?'good':'bad'} accent="purple" delay="mc-d1" />
        <StatCard icon="📊" label="Avg Risk Score" value={avg}     unit=""  trend={entries.length === 0 ? 'No data yet' : avg<40?'↓ Below threshold':'↑ Needs attention'} trendType={entries.length === 0 ?'good':avg<40?'good':'warn'} accent="teal" delay="mc-d2" />
        <StatCard icon="🔥" label="Day Streak"     value={streak}  unit="d" trend={entries.length === 0 ? 'No data yet' : streak === 1 ? 'Started today!' : 'Keep it up!'} trendType="good" accent="amber" delay="mc-d3" />
        <StatCard icon="💆" label="Current Risk"
          value={currentRiskScore}
          unit=""
          trend={
            entries.length === 0    ? 'No data yet'
            : latestRisk === 'low'      ? '✦ Low risk'
            : latestRisk === 'moderate' ? '~ Moderate'
            : '⚠ High risk'
          }
          trendType={
            entries.length === 0    ? 'good'
            : latestRisk === 'low'      ? 'good'
            : latestRisk === 'moderate' ? 'warn'
            : 'bad'
          }
          accent="rose" delay="mc-d4" />
      </div>

      {/* Mood Trend Chart */}
      <div className="mc-grid-3">
        <div className="mc-card mc-d5">
          <div className="mc-card-header">
            <div><div className="mc-card-title">Mood Trend</div><div className="mc-card-sub">Last 7 days</div></div>
            <span className="mc-pill mc-pg">{isGuest ? 'Guest mode' : 'Live data'}</span>
          </div>
          {entries.length === 0
            ? <EmptyState message="No check-ins yet. Complete your first check-in to see your trend." />
            : <TrendChart userId={userId} entryCount={entries.length + entryVersion} />
          }
        </div>
        <div className="mc-card mc-d6">
          <div className="mc-card-header">
            <div><div className="mc-card-title">Active Path</div><div className="mc-card-sub">This week's habits</div></div>
            <span className="mc-pill mc-pp">This week</span>
          </div>
          {[
            { icon:'🧘', name:'Daily Meditation', pct:0, color:'#7C5CFC' },
            { icon:'🏃', name:'Physical Exercise', pct:0, color:'#4ECDC4' },
            { icon:'📓', name:'Journaling',        pct:0, color:'#FFB547' },
          ].map((p,i) => (
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

      {/* Gemini AI Assistant */}
      <div className="mc-card" style={{ marginBottom: 20 }}>
        <div className="mc-card-header">
          <div><div className="mc-card-title">Gemini AI Assistant</div><div className="mc-card-sub">Ask anything to your personal AI</div></div>
          <span className="mc-pill mc-pp">AI Support</span>
        </div>
        <div style={{ marginTop: 10 }}>
          <input
            type="text"
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(124,92,252,0.2)', background: 'transparent', outline: 'none', color: 'inherit', fontSize: '14px' }}
            placeholder="Type your question..."
          />
          <button
            onClick={handleAskAI}
            disabled={aiLoading}
            style={{ marginTop: 10, padding: '10px 20px', background: '#7C5CFC', color: 'white', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}
          >
            {aiLoading ? 'Thinking...' : 'Send'}
          </button>
        </div>
        {aiResponse && (
          <div style={{ marginTop: 15, padding: 15, background: 'rgba(124,92,252,0.05)', borderRadius: 8, fontSize: 14, lineHeight: 1.6 }}>
            <div style={{ fontWeight: 600, marginBottom: 5 }}>AI Response:</div>
            <div style={{ whiteSpace: 'pre-wrap' }}>{aiResponse}</div>
          </div>
        )}
      </div>

      {/* Recs + Recent Entries */}
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
            {entries.length === 0 ? (
              <EmptyState message="No check-ins yet. Start your first check-in!" />
            ) : (
              entries.slice(0,5).map((e,i) => {
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
              })
            )}
          </div>
        </div>
      </div>
    </>
  );
}
