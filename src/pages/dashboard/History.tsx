import { useState } from 'react';
import { Store, RISK_CONFIG, EMOTION_COLORS, formatDate } from './store';
import type { Entry } from './store';

function EntryCard({ entry, index }: { entry: Entry; index: number }) {
  const [open, setOpen] = useState(false);
  const cfg = RISK_CONFIG[entry.risk] ?? RISK_CONFIG.low;

  return (
    <div className={`mc-entry-card${open ? ' open' : ''}`} style={{animationDelay:`${index*.07}s`}}>
      <div className="mc-entry-row" onClick={() => setOpen(!open)}>
        <div className="mc-entry-emoji">{entry.emoji}</div>
        <div className="mc-entry-info">
          <div className="mc-entry-date">{formatDate(entry.date)}</div>
          <div className="mc-entry-mood">{entry.mood}</div>
          <div className="mc-entry-snip">{entry.text}</div>
        </div>
        <div className="mc-entry-score" style={{background:cfg.bg,color:cfg.tc}}>{entry.score}</div>
        <div className="mc-expand-icon">▾</div>
      </div>
      <div className={`mc-entry-detail${open ? ' open' : ''}`}>
        <div className="mc-entry-detail-inner">
          <p className="mc-entry-full-text">"{entry.text}"</p>
          {entry.emotions?.length > 0 && (
            <div className="mc-emotion-tags" style={{marginBottom:10}}>
              {entry.emotions.map((e,i) => {
                const ec = EMOTION_COLORS[e?.toLowerCase()] ?? {bg:'#F1EFE8',c:'#5F5E5A'};
                return <span key={i} className="mc-etag" style={{background:ec.bg,color:ec.c}}>{e}</span>;
              })}
            </div>
          )}
          <div style={{display:'inline-flex',alignItems:'center',gap:6,padding:'6px 14px',borderRadius:100,fontSize:11,fontWeight:600,background:cfg.bg,color:cfg.tc,marginBottom:10}}>
            {cfg.icon} {cfg.label} · Score {entry.score}/100
          </div>
          {entry.recommendations?.length > 0 && (
            <div>
              <div className="mc-entry-recs-label">Tips from that day</div>
              <ul style={{listStyle:'none'}}>
                {entry.recommendations.map((r,i) => (
                  <li key={i} style={{fontSize:12,color:'var(--ink)',padding:'4px 0',display:'flex',gap:6}}>
                    <span style={{color:'var(--pu)',fontWeight:700}}>→</span>{r}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function History() {
  const [filter, setFilter] = useState('All');
  const allEntries = Store.getEntries();
  const filtered = filter === 'All' ? allEntries : allEntries.filter(e => e.risk === filter.toLowerCase());
  const now = new Date().toLocaleDateString('en-IN', { weekday:'short', month:'short', day:'numeric', year:'numeric' });

  return (
    <>
      <div className="mc-topbar">
        <div><h1>Entry History</h1><p>A full log of your daily check-ins.</p></div>
        <div className="mc-topbar-right">
          <div className="mc-date-badge">{now}</div>
          <div className="mc-notif-btn">🔔<div className="mc-notif-dot"/></div>
        </div>
      </div>

      <div className="mc-filter-row">
        {['All','Low','Moderate','High'].map(f => (
          <button key={f} className={`mc-filter-btn${filter===f?' active':''}`} onClick={() => setFilter(f)}>{f}</button>
        ))}
        <span className="mc-filter-count">{filtered.length} {filtered.length===1?'entry':'entries'}</span>
      </div>

      {filtered.length === 0
        ? <p style={{textAlign:'center',color:'var(--ink3)',padding:32}}>No entries found for this filter.</p>
        : filtered.map((e,i) => (
            <div key={e.id}>
              <EntryCard entry={e} index={i} />
            </div>
          ))
      }
    </>
  );
}
