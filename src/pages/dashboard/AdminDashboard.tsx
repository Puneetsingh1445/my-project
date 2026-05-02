import { useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { Store } from './store';

// ── Admin access is scoped to a single email ───────────────────────────────
const ADMIN_EMAIL = 'punitsingh55575@gmail.com';

interface AdminDashboardProps { user: User | null | undefined; }

// ── Stat card ──────────────────────────────────────────────────────────────
function AdminStat({ icon, label, value, sub, color }: {
  icon: string; label: string; value: string | number; sub: string; color: string;
}) {
  return (
    <div style={{
      background: 'var(--surface, #fff)',
      border: '1px solid rgba(124,92,252,0.12)',
      borderRadius: 16,
      padding: '20px 22px',
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
    }}>
      <div style={{
        width: 48, height: 48, borderRadius: 12,
        background: color + '18',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 22, flexShrink: 0,
      }}>{icon}</div>
      <div>
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink3, #A8A4BC)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 2 }}>{label}</div>
        <div style={{ fontSize: 26, fontWeight: 700, color: 'var(--ink, #1A1630)', lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: 11, color: 'var(--ink3, #A8A4BC)', marginTop: 3 }}>{sub}</div>
      </div>
    </div>
  );
}

// ── Collects aggregate stats from all mc_entries_* localStorage keys ───────
function collectAllStats() {
  const allUserKeys: string[] = [];
  const userEntries: { key: string; userId: string; count: number; latestDate: string; latestRisk: string }[] = [];
  let totalEntries = 0;
  let lowCount = 0, modCount = 0, highCount = 0;

  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key?.startsWith('mc_entries_')) continue;
      allUserKeys.push(key);
      const raw = localStorage.getItem(key);
      if (!raw) continue;
      const entries = JSON.parse(raw) as { date: string; risk: string }[];
      if (!Array.isArray(entries)) continue;
      totalEntries += entries.length;
      entries.forEach(e => {
        if (e.risk === 'low') lowCount++;
        else if (e.risk === 'moderate') modCount++;
        else if (e.risk === 'high') highCount++;
      });
      userEntries.push({
        key,
        userId: key.replace('mc_entries_', ''),
        count: entries.length,
        latestDate: entries[0]?.date ?? '—',
        latestRisk: entries[0]?.risk ?? '—',
      });
    }
  } catch { /* ignore */ }

  return { userEntries, totalEntries, lowCount, modCount, highCount };
}

export default function AdminDashboard({ user }: AdminDashboardProps) {
  const [cleared, setCleared] = useState<string[]>([]);

  // ── Guard: only the owner can view this ────────────────────────────────
  if (!user || user.email !== ADMIN_EMAIL) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', padding: '80px 24px', textAlign: 'center', gap: 12,
      }}>
        <div style={{ fontSize: 48 }}>🔒</div>
        <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--ink)' }}>Access Denied</div>
        <div style={{ fontSize: 14, color: 'var(--ink3)', maxWidth: 320 }}>
          This page is restricted to the project administrator only.
        </div>
      </div>
    );
  }

  const { userEntries, totalEntries, lowCount, modCount, highCount } = collectAllStats();
  const totalUsers = userEntries.length;

  const handleClearUser = (key: string) => {
    if (!window.confirm(`Delete all entries for "${key}"?`)) return;
    localStorage.removeItem(key);
    setCleared(prev => [...prev, key]);
  };

  const visibleEntries = userEntries.filter(u => !cleared.includes(u.key));
  const now = new Date().toLocaleDateString('en-IN', { weekday:'short', month:'short', day:'numeric', year:'numeric' });

  const riskColor = (r: string) =>
    r === 'low' ? '#52C97A' : r === 'moderate' ? '#FFB547' : r === 'high' ? '#FF6B9D' : '#A8A4BC';

  return (
    <>
      {/* Top bar */}
      <div className="mc-topbar">
        <div>
          <h1>Admin Dashboard 🛡️</h1>
          <p>Platform overview — visible only to {ADMIN_EMAIL}</p>
        </div>
        <div className="mc-topbar-right">
          <div className="mc-date-badge">{now}</div>
          <span style={{
            padding: '4px 12px', borderRadius: 100, fontSize: 11, fontWeight: 700,
            background: 'rgba(124,92,252,0.12)', color: '#7C5CFC',
          }}>ADMIN</span>
        </div>
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14, marginBottom: 24 }}>
        <AdminStat icon="👥" label="Total Users"   value={totalUsers}   sub="localStorage buckets" color="#7C5CFC" />
        <AdminStat icon="📝" label="Total Entries" value={totalEntries} sub="all check-ins"         color="#4ECDC4" />
        <AdminStat icon="🟢" label="Low Risk"      value={lowCount}     sub="entries"               color="#52C97A" />
        <AdminStat icon="🟡" label="Moderate"      value={modCount}     sub="entries"               color="#FFB547" />
        <AdminStat icon="🔴" label="High Risk"     value={highCount}    sub="entries"               color="#FF6B9D" />
      </div>

      {/* User table */}
      <div className="mc-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '18px 22px', borderBottom: '1px solid rgba(124,92,252,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div className="mc-card-title">All User Buckets</div>
            <div className="mc-card-sub">localStorage data across all sessions</div>
          </div>
          <span className="mc-pill mc-pp">{visibleEntries.length} users</span>
        </div>

        {visibleEntries.length === 0 ? (
          <div style={{ padding: '40px 24px', textAlign: 'center', color: 'var(--ink3)', fontSize: 14 }}>
            No user data found in localStorage.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: 'rgba(124,92,252,0.04)' }}>
                  {['User / Session', 'Entries', 'Latest Date', 'Latest Risk', 'Action'].map(h => (
                    <th key={h} style={{ padding: '11px 18px', textAlign: 'left', fontWeight: 600, color: 'var(--ink3)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '.05em', borderBottom: '1px solid rgba(124,92,252,0.08)', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visibleEntries.map((u, i) => (
                  <tr key={u.key} style={{ borderBottom: '1px solid rgba(124,92,252,0.06)', background: i % 2 === 0 ? 'transparent' : 'rgba(124,92,252,0.015)' }}>
                    <td style={{ padding: '12px 18px', fontWeight: 500, color: 'var(--ink)', maxWidth: 280, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      <span title={u.userId}>{u.userId === 'guest' ? '👤 Guest' : `🔑 ${u.userId.slice(0, 20)}…`}</span>
                    </td>
                    <td style={{ padding: '12px 18px', color: 'var(--ink2)', fontWeight: 600 }}>{u.count}</td>
                    <td style={{ padding: '12px 18px', color: 'var(--ink3)' }}>{u.latestDate}</td>
                    <td style={{ padding: '12px 18px' }}>
                      <span style={{ padding: '3px 10px', borderRadius: 100, fontSize: 11, fontWeight: 600, background: riskColor(u.latestRisk) + '22', color: riskColor(u.latestRisk) }}>
                        {u.latestRisk}
                      </span>
                    </td>
                    <td style={{ padding: '12px 18px' }}>
                      <button
                        onClick={() => handleClearUser(u.key)}
                        style={{ padding: '5px 12px', borderRadius: 8, background: 'rgba(255,107,157,0.1)', color: '#CC2060', border: '1px solid rgba(255,107,157,0.2)', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}
                      >
                        🗑 Clear
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Footer note */}
      <div style={{ marginTop: 16, padding: '12px 16px', borderRadius: 10, background: 'rgba(124,92,252,0.05)', border: '1px solid rgba(124,92,252,0.1)', fontSize: 12, color: 'var(--ink3)' }}>
        ⚠️ This dashboard reads <strong>client-side localStorage only</strong>. For full backend analytics, query your Supabase dashboard directly.
      </div>
    </>
  );
}
