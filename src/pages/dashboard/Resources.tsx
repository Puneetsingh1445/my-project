import { RESOURCES, CRISIS_LINES } from './store';

export default function Resources() {
  const now = new Date().toLocaleDateString('en-IN', { weekday:'short', month:'short', day:'numeric', year:'numeric' });

  return (
    <>
      <div className="mc-topbar">
        <div><h1>Resources &amp; Support</h1><p>Tools, guides, and helplines curated for your wellbeing.</p></div>
        <div className="mc-topbar-right">
          <div className="mc-date-badge">{now}</div>
          <div className="mc-notif-btn">🔔<div className="mc-notif-dot"/></div>
        </div>
      </div>

      {/* Hero banner */}
      <div className="mc-resources-hero mc-d1">
        <h3>You're doing great by checking in 🌿</h3>
        <p style={{fontSize:14,color:'var(--ink2)',lineHeight:1.65,marginTop:4}}>
          Mental health is a journey. These resources can support you every step of the way.
        </p>
      </div>

      {/* Resource cards */}
      <div className="mc-res-grid">
        {RESOURCES.map((r, i) => (
          <div key={i} className="mc-res-card" style={{animationDelay:`${.1+i*.08}s`}}>
            <div className="mc-res-icon">{r.icon}</div>
            <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:8,marginBottom:6}}>
              <div className="mc-res-title">{r.title}</div>
              <span className="mc-res-tag" style={{background:r.tagBg,color:r.tagC,flexShrink:0}}>{r.tag}</span>
            </div>
            <div className="mc-res-desc">{r.desc}</div>
            <a className="mc-res-link" href="#" onClick={e=>e.preventDefault()}>Explore →</a>
          </div>
        ))}
      </div>

      {/* Crisis helplines */}
      <div className="mc-card mc-d7">
        <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:18}}>
          <div style={{width:42,height:42,borderRadius:10,background:'var(--rol)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:20}}>🆘</div>
          <div>
            <div className="mc-card-title">Crisis Helplines</div>
            <div className="mc-card-sub">Available if you need immediate support</div>
          </div>
        </div>
        <div className="mc-grid-2" style={{gap:10}}>
          {CRISIS_LINES.map((l,i) => (
            <div key={i} className="mc-crisis-line" style={{animationDelay:`${.2+i*.08}s`}}>
              <div className="mc-crisis-icon">{l.icon}</div>
              <div style={{flex:1,minWidth:0}}>
                <div className="mc-crisis-name">{l.name}</div>
                <div className="mc-crisis-num">{l.num}</div>
                <div style={{fontSize:10,color:'var(--ink3)'}}>{l.sub}</div>
              </div>
              <button className="mc-crisis-call">Call</button>
            </div>
          ))}
        </div>
        <div style={{marginTop:14,padding:14,background:'var(--rol)',border:'1px solid rgba(255,107,157,.2)',borderRadius:'var(--rxs)'}}>
          <p style={{fontSize:12,color:'#CC2060',lineHeight:1.6}}>
            <strong>If you're in immediate danger</strong>, please call emergency services (112) or go to your nearest hospital.
            You are not alone — help is always available.
          </p>
        </div>
      </div>
    </>
  );
}
