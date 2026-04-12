import { useState, useCallback } from 'react';
import { useAuth } from '../../lib/auth';
import './dashboard.css';
import { NAV_ITEMS } from './store';
import DashboardHome from './DashboardHome';
import CheckIn from './CheckIn';
import History from './History';
import Progress from './Progress';
import Resources from './Resources';

type PageId = 'dashboard' | 'checkin' | 'history' | 'progress' | 'resources';

interface DashboardProps {
  onBack: () => void | Promise<void>;
}

export default function Dashboard({ onBack }: DashboardProps) {
  const [page, setPage] = useState<PageId>('dashboard');
  const { user, signOut } = useAuth();

  const goTo = useCallback((id: PageId) => setPage(id), []);

  // Derive display info from Supabase user_metadata (Google OAuth fills these)
  const displayName: string =
    user?.user_metadata?.full_name ??
    user?.user_metadata?.name ??
    user?.email?.split('@')[0] ??
    'Guest';
  const email: string   = user?.email ?? '';
  const avatarUrl: string | undefined = user?.user_metadata?.avatar_url;
  const initials: string = displayName
    .split(' ')
    .map((w: string) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'G';

  const handleSignOut = async () => {
    await signOut();
    await onBack();
  };

  const renderPage = () => {
    switch (page) {
      case 'dashboard': return <DashboardHome />;
      case 'checkin':   return <CheckIn />;
      case 'history':   return <History />;
      case 'progress':  return <Progress />;
      case 'resources': return <Resources />;
    }
  };

  const secs: { key: string; label: string }[] = [
    { key: 'main',    label: 'Main'    },
    { key: 'health',  label: 'Health'  },
    { key: 'support', label: 'Support' },
  ];

  return (
    <div className="mc-root">
      {/* Toast container */}
      <div id="mc-toast-container" className="mc-toast-container" />

      <div className="mc-app">
        {/* ── Sidebar ── */}
        <aside className="mc-sidebar">
          <div className="mc-logo">
            <div className="mc-logo-icon">💜</div>
            <div>
              <div className="mc-logo-name">MindCare</div>
              <div className="mc-logo-sub">Mental Health Portal</div>
            </div>
          </div>

          {/* Nav sections */}
          {secs.map(sec => {
            const items = NAV_ITEMS.filter(n => n.sec === sec.key);
            if (!items.length) return null;
            return (
              <div key={sec.key}>
                <div className="mc-nav-sec-label">{sec.label}</div>
                {items.map(item => (
                  <div
                    key={item.id}
                    className={`mc-nav-item${page === item.id ? ' active' : ''}`}
                    onClick={() => goTo(item.id as PageId)}
                  >
                    <span>{item.icon}</span> {item.label}
                  </div>
                ))}
              </div>
            );
          })}

          {/* Footer */}
          <div className="mc-sidebar-footer">
            {/* User row with real auth data */}
            <div className="mc-user-row" style={{marginBottom:10}}>
              <div className="mc-avatar" style={{overflow:'hidden',padding:avatarUrl?0:undefined}}>
                {avatarUrl
                  ? <img src={avatarUrl} alt={displayName} style={{width:'100%',height:'100%',objectFit:'cover'}} referrerPolicy="no-referrer" />
                  : initials
                }
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div className="mc-user-name" title={displayName} style={{overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
                  {displayName}
                </div>
                {email && (
                  <div className="mc-user-role" title={email} style={{overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
                    {email}
                  </div>
                )}
              </div>
            </div>

            {/* Sign out if logged in, otherwise back */}
            {user
              ? (
                <button className="mc-back-btn" onClick={handleSignOut} style={{width:'100%',justifyContent:'center'}}>
                  ↩ Sign Out
                </button>
              ) : (
                <button className="mc-back-btn" onClick={onBack} style={{width:'100%',justifyContent:'center'}}>
                  ← Back to Sanctuary AI
                </button>
              )
            }
          </div>
        </aside>

        {/* ── Main ── */}
        <main className="mc-main">
          <div className="mc-page" key={page}>
            {renderPage()}
          </div>
        </main>
      </div>

      {/* ── Mobile bottom nav ── */}
      <nav className="mc-mob-nav">
        <div className="mc-mob-items">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              className={`mc-mob-btn${page === item.id ? ' active' : ''}`}
              onClick={() => goTo(item.id as PageId)}
            >
              <span className="mc-mob-icon">{item.icon}</span>
              <span className="mc-mob-label">{item.label}</span>
            </button>
          ))}
          <button className="mc-mob-btn" onClick={onBack}>
            <span className="mc-mob-icon">←</span>
            <span className="mc-mob-label">Back</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
