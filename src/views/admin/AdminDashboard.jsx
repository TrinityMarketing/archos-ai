'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts';
import './AdminDashboard.css';

/* ------------------------------------------------------------------ */
/*  Custom Recharts tooltip                                           */
/* ------------------------------------------------------------------ */
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip-label">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="chart-tooltip-value" style={{ color: entry.color }}>
          {entry.name}: <span>{typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}</span>
        </p>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Helpers & shared components                                       */
/* ------------------------------------------------------------------ */
const STATUS_COLORS = {
  new: { bg: 'rgba(59,130,246,0.15)', color: '#60a5fa' },
  contacted: { bg: 'rgba(245,158,11,0.15)', color: '#fbbf24' },
  qualified: { bg: 'rgba(34,197,94,0.15)', color: '#4ade80' },
  converted: { bg: 'rgba(200,169,126,0.15)', color: '#c8a97e' },
  lost: { bg: 'rgba(239,68,68,0.15)', color: '#f87171' },
  active: { bg: 'rgba(34,197,94,0.15)', color: '#4ade80' },
  completed: { bg: 'rgba(59,130,246,0.15)', color: '#60a5fa' },
  abandoned: { bg: 'rgba(239,68,68,0.15)', color: '#f87171' },
};

const SOURCE_COLORS = {
  chatbot: { bg: 'rgba(168,85,247,0.15)', color: '#c084fc' },
  form: { bg: 'rgba(6,182,212,0.15)', color: '#22d3ee' },
};

function Badge({ type, value }) {
  const palette = type === 'source' ? SOURCE_COLORS : STATUS_COLORS;
  const style = palette[value] || { bg: 'rgba(138,138,138,0.15)', color: '#8a8a8a' };
  return <span className="badge" style={{ background: style.bg, color: style.color }}>{value}</span>;
}

function Avatar({ name }) {
  const initials = (name || '?').split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);
  return <div className="avatar">{initials}</div>;
}

function fmtDate(d) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function DetailRow({ label, value }) {
  return (
    <div className="detail-section">
      <div className="detail-label">{label}</div>
      <div className="detail-value">{value}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Sidebar icons (simple SVGs)                                       */
/* ------------------------------------------------------------------ */
const icons = {
  dashboard: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
    </svg>
  ),
  leads: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  conversations: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
  analytics: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  ),
  site: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  ),
  logout: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
  search: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  close: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
};

/* ------------------------------------------------------------------ */
/*  Main component                                                    */
/* ------------------------------------------------------------------ */
export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  /* Auth check */
  useEffect(() => {
    fetch('/api/admin/verify')
      .then((r) => { if (!r.ok) throw new Error(); })
      .catch(() => router.push('/admin/login'));
  }, [router]);

  /* Sign out */
  const handleSignOut = async () => {
    try { await fetch('/api/admin/auth', { method: 'DELETE' }); } catch { /* ignore */ }
    router.push('/');
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: icons.dashboard },
    { id: 'leads', label: 'Leads', icon: icons.leads },
    { id: 'conversations', label: 'Conversations', icon: icons.conversations },
    { id: 'analytics', label: 'Analytics', icon: icons.analytics },
  ];

  return (
    <div className="admin-layout">
      {/* Mobile overlay */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-top">
          <div className="sidebar-logo">
            <span className="sidebar-logo-text">ARCHOS AI</span>
            <span className="sidebar-logo-sub">ADMIN PANEL</span>
          </div>
          <button className="sidebar-close-btn" onClick={() => setSidebarOpen(false)}>
            {icons.close}
          </button>
        </div>

        <nav className="sidebar-nav">
          {tabs.map((t) => (
            <button
              key={t.id}
              className={`sidebar-nav-item ${activeTab === t.id ? 'active' : ''}`}
              onClick={() => { setActiveTab(t.id); setSidebarOpen(false); }}
            >
              {t.icon}
              <span>{t.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <Link href="/" className="sidebar-nav-item" target="_blank" rel="noopener noreferrer">
            {icons.site}
            <span>View Site</span>
          </Link>
          <button className="sidebar-nav-item" onClick={handleSignOut}>
            {icons.logout}
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="admin-content">
        {/* Mobile header */}
        <div className="admin-mobile-header">
          <button className="hamburger-btn" onClick={() => setSidebarOpen(true)}>
            <span /><span /><span />
          </button>
          <span className="mobile-title">{tabs.find((t) => t.id === activeTab)?.label}</span>
        </div>

        {activeTab === 'dashboard' && <DashboardTab />}
        {activeTab === 'leads' && <LeadsTab />}
        {activeTab === 'conversations' && <ConversationsTab />}
        {activeTab === 'analytics' && <AnalyticsTab />}
      </main>
    </div>
  );
}

/* ==================================================================
   HOOKS
   ================================================================== */
function useVercelAnalytics(period = '30d') {
  const [analytics, setAnalytics] = useState({ source: 'mock', data: null, loading: true });

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/admin/analytics?period=${period}`)
      .then((r) => r.json())
      .then((json) => { if (!cancelled) setAnalytics({ ...json, loading: false }); })
      .catch(() => { if (!cancelled) setAnalytics({ source: 'mock', data: null, loading: false }); });
    return () => { cancelled = true; };
  }, [period]);

  return analytics;
}

function useLeads() {
  const [state, setState] = useState({ leads: [], loading: true });

  useEffect(() => {
    let cancelled = false;
    fetch('/api/admin/leads')
      .then((r) => r.json())
      .then((json) => { if (!cancelled) setState({ leads: json.leads || [], loading: false }); })
      .catch(() => { if (!cancelled) setState({ leads: [], loading: false }); });
    return () => { cancelled = true; };
  }, []);

  return state;
}

function useConversations() {
  const [state, setState] = useState({ conversations: [], loading: true });

  useEffect(() => {
    let cancelled = false;
    fetch('/api/admin/conversations')
      .then((r) => r.json())
      .then((json) => { if (!cancelled) setState({ conversations: json.conversations || [], loading: false }); })
      .catch(() => { if (!cancelled) setState({ conversations: [], loading: false }); });
    return () => { cancelled = true; };
  }, []);

  return state;
}

/* ==================================================================
   DASHBOARD TAB
   ================================================================== */
function DashboardTab() {
  const { source: analyticsSource, data: vercelData, loading } = useVercelAnalytics('30d');
  const { leads, loading: leadsLoading } = useLeads();
  const { conversations, loading: convosLoading } = useConversations();

  const totalViews = vercelData?.overview?.pageViews ?? 0;
  const uniqueVisitors = vercelData?.overview?.visitors ?? 0;

  const chartData = useMemo(() => {
    if (vercelData?.timeseries?.data) {
      return vercelData.timeseries.data.map((d) => ({
        date: new Date(d.timestamp || d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        pageViews: d.pageViews ?? d.visitors ?? 0,
        uniqueVisitors: d.visitors ?? d.uniqueVisitors ?? 0,
      }));
    }
    return [];
  }, [vercelData]);

  const recentLeads = useMemo(() => leads.slice(0, 6), [leads]);

  return (
    <div className="tab-content">
      <h1 className="tab-title">Dashboard</h1>

      {analyticsSource === 'mock' && !loading && (
        <div className="analytics-notice">
          No analytics data available. Add <code>VERCEL_ANALYTICS_TOKEN</code> in Vercel env vars for live analytics.
        </div>
      )}

      {/* Stat cards */}
      <div className="stat-grid">
        <StatCard label="Page Views (30d)" value={totalViews.toLocaleString()} change={analyticsSource === 'vercel' ? 'Live data' : undefined} />
        <StatCard label="Unique Visitors (30d)" value={uniqueVisitors.toLocaleString()} change={analyticsSource === 'vercel' ? 'Live data' : undefined} />
        <StatCard label="Total Leads" value={leadsLoading ? '...' : leads.length.toString()} />
        <StatCard label="Conversations" value={convosLoading ? '...' : conversations.length.toString()} />
      </div>

      {/* Traffic chart */}
      {chartData.length > 0 && (
        <div className="chart-card full">
          <h3 className="chart-card-title">Traffic Overview {analyticsSource === 'vercel' && <span className="live-badge">LIVE</span>}</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="gradGold" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#c8a97e" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#c8a97e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e1e1e" />
              <XAxis dataKey="date" stroke="#5a5a5a" tick={{ fill: '#5a5a5a', fontSize: 11 }} />
              <YAxis stroke="#5a5a5a" tick={{ fill: '#5a5a5a', fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="pageViews" stroke="#c8a97e" fill="url(#gradGold)" name="Page Views" />
              <Area type="monotone" dataKey="uniqueVisitors" stroke="#8a8a8a" fill="transparent" name="Unique Visitors" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Recent leads */}
      {recentLeads.length > 0 && (
        <div className="chart-card full">
          <h3 className="chart-card-title">Recent Leads</h3>
          <div className="recent-list">
            {recentLeads.map((lead) => (
              <div key={lead.id} className="recent-item">
                <Avatar name={lead.name} />
                <div className="recent-item-info">
                  <span className="recent-item-name">{lead.name}</span>
                  <span className="recent-item-sub">{lead.company || lead.email}</span>
                </div>
                <Badge type="source" value={lead.source} />
              </div>
            ))}
          </div>
        </div>
      )}

      {chartData.length === 0 && leads.length === 0 && !loading && !leadsLoading && (
        <div className="empty-state-card">
          <p className="empty-state-text">No data yet. Analytics and leads will appear here as your site gets traffic.</p>
        </div>
      )}
    </div>
  );
}

/* ==================================================================
   LEADS TAB
   ================================================================== */
function LeadsTab() {
  const { leads, loading } = useLeads();
  const [search, setSearch] = useState('');
  const [selectedLead, setSelectedLead] = useState(null);

  const filtered = useMemo(() => {
    if (!search) return leads;
    const q = search.toLowerCase();
    return leads.filter((l) =>
      l.name?.toLowerCase().includes(q) ||
      l.email?.toLowerCase().includes(q) ||
      l.company?.toLowerCase().includes(q)
    );
  }, [leads, search]);

  if (loading) {
    return <div className="tab-content"><h1 className="tab-title">Leads</h1><p className="empty-state-text">Loading...</p></div>;
  }

  if (leads.length === 0) {
    return (
      <div className="tab-content">
        <h1 className="tab-title">Leads</h1>
        <div className="empty-state-card">
          <div className="empty-state-icon">{icons.leads}</div>
          <h3 className="empty-state-heading">No leads yet</h3>
          <p className="empty-state-text">
            Leads captured by the chatbot and contact form will appear here automatically.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="tab-content">
      <h1 className="tab-title">Leads ({leads.length})</h1>

      <div className="leads-toolbar">
        <div className="search-box">
          {icons.search}
          <input type="text" placeholder="Search leads..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="leads-body">
        <div className={`leads-table-wrap ${selectedLead ? 'with-detail' : ''}`}>
          <table className="leads-table">
            <thead>
              <tr>
                <th>Name / Email</th>
                <th>Company</th>
                <th>Source</th>
                <th>Score</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((lead) => (
                <tr key={lead.id} className={selectedLead?.id === lead.id ? 'selected' : ''} onClick={() => setSelectedLead(lead)}>
                  <td>
                    <div className="lead-name-cell">
                      <Avatar name={lead.name} />
                      <div>
                        <div className="cell-primary">{lead.name}</div>
                        <div className="cell-secondary">{lead.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>{lead.company || '—'}</td>
                  <td><Badge type="source" value={lead.source} /></td>
                  <td><span className={`score-badge score-${lead.priority || 'medium'}`}>{lead.score || 0}</span></td>
                  <td className="cell-secondary">{fmtDate(lead.created_at)}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan="5" className="empty-row">No leads match your search.</td></tr>
              )}
            </tbody>
          </table>

          {selectedLead && (
            <div className="lead-detail-panel">
              <div className="detail-header">
                <h3>Lead Details</h3>
                <button className="detail-close" onClick={() => setSelectedLead(null)}>{icons.close}</button>
              </div>
              <div className="detail-body">
                <div className="detail-avatar-row">
                  <Avatar name={selectedLead.name} />
                  <div>
                    <div className="detail-name">{selectedLead.name}</div>
                    <div className="detail-email">{selectedLead.email}</div>
                  </div>
                </div>
                {selectedLead.company && <DetailRow label="Company" value={selectedLead.company} />}
                {selectedLead.role && <DetailRow label="Role" value={selectedLead.role} />}
                {selectedLead.revenue && <DetailRow label="Revenue" value={selectedLead.revenue} />}
                {selectedLead.interest && <DetailRow label="Interest" value={selectedLead.interest} />}
                {selectedLead.timeline && <DetailRow label="Timeline" value={selectedLead.timeline} />}
                <DetailRow label="Source" value={selectedLead.source} />
                <DetailRow label="Score" value={`${selectedLead.score || 0} (${selectedLead.priority || 'medium'})`} />
                {selectedLead.message && <DetailRow label="Notes" value={selectedLead.message} />}
                <DetailRow label="Date" value={fmtDate(selectedLead.created_at)} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ==================================================================
   CONVERSATIONS TAB
   ================================================================== */
function ConversationsTab() {
  const { conversations, loading } = useConversations();
  const [selected, setSelected] = useState(null);

  const activeConvo = selected || conversations[0] || null;

  if (loading) {
    return <div className="tab-content"><h1 className="tab-title">Conversations</h1><p className="empty-state-text">Loading...</p></div>;
  }

  if (conversations.length === 0) {
    return (
      <div className="tab-content">
        <h1 className="tab-title">Conversations</h1>
        <div className="empty-state-card">
          <div className="empty-state-icon">{icons.conversations}</div>
          <h3 className="empty-state-heading">No conversations yet</h3>
          <p className="empty-state-text">
            Chatbot conversations will appear here once visitors start interacting with the AI assistant on your site.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="tab-content conversations-layout">
      <div className="convo-list-panel">
        <div className="convo-list">
          {conversations.map((c) => (
            <div
              key={c.id}
              className={`convo-list-item ${activeConvo?.id === c.id ? 'active' : ''}`}
              onClick={() => setSelected(c)}
            >
              <div className="convo-list-item-top">
                <span className="convo-list-name">{c.visitor_name || 'Anonymous'}</span>
                <Badge type="status" value={c.status} />
              </div>
              <p className="convo-list-preview">
                {Array.isArray(c.messages) && c.messages.length > 0
                  ? c.messages[c.messages.length - 1]?.content?.slice(0, 80)
                  : 'No messages'}...
              </p>
              <span className="convo-list-date">{fmtDate(c.created_at)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="convo-chat-panel">
        {activeConvo ? (
          <>
            <div className="convo-chat-header">
              <div>
                <h3 className="convo-chat-name">{activeConvo.visitor_name || 'Anonymous'}</h3>
                <span className="convo-chat-email">{activeConvo.visitor_email || ''}</span>
              </div>
              <div className="convo-chat-meta">
                <span>{fmtDate(activeConvo.created_at)}</span>
                <Badge type="status" value={activeConvo.status} />
              </div>
            </div>
            <div className="convo-chat-messages">
              {Array.isArray(activeConvo.messages) && activeConvo.messages.map((msg, i) => (
                <div key={i} className={`chat-bubble ${msg.role === 'bot' ? 'bot' : 'user'}`}>
                  <div className="chat-bubble-inner">
                    <p>{msg.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="convo-empty-state">
            <p>Select a conversation to view</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ==================================================================
   ANALYTICS TAB
   ================================================================== */
function AnalyticsTab() {
  const [period, setPeriod] = useState('30d');
  const { source: analyticsSource, data: vercelData, loading } = useVercelAnalytics(period);

  const totals = useMemo(() => {
    if (vercelData?.overview) {
      return {
        pv: vercelData.overview.pageViews ?? 0,
        uv: vercelData.overview.visitors ?? 0,
        avgBounce: vercelData.overview.bounceRate ?? 0,
        avgSession: vercelData.overview.avgDuration ?? 0,
      };
    }
    return { pv: 0, uv: 0, avgBounce: 0, avgSession: 0 };
  }, [vercelData]);

  const chartData = useMemo(() => {
    if (vercelData?.timeseries?.data) {
      return vercelData.timeseries.data.map((d) => ({
        date: new Date(d.timestamp || d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        pageViews: d.pageViews ?? d.visitors ?? 0,
        uniqueVisitors: d.visitors ?? d.uniqueVisitors ?? 0,
      }));
    }
    return [];
  }, [vercelData]);

  return (
    <div className="tab-content">
      <div className="tab-title-row">
        <h1 className="tab-title">Analytics</h1>
        <div className="period-selector">
          {['24h', '7d', '30d', '90d'].map((p) => (
            <button key={p} className={`period-btn ${period === p ? 'active' : ''}`} onClick={() => setPeriod(p)}>
              {p}
            </button>
          ))}
        </div>
      </div>

      {analyticsSource === 'mock' && !loading && (
        <div className="analytics-notice">
          No analytics data available. Add <code>VERCEL_ANALYTICS_TOKEN</code> in Vercel env vars for live analytics.
        </div>
      )}

      {/* Stat cards */}
      <div className="stat-grid">
        <StatCard label="Page Views" value={totals.pv.toLocaleString()} change={analyticsSource === 'vercel' ? 'Live' : undefined} />
        <StatCard label="Unique Visitors" value={totals.uv.toLocaleString()} change={analyticsSource === 'vercel' ? 'Live' : undefined} />
        <StatCard label="Avg Bounce Rate" value={`${totals.avgBounce}%`} />
        <StatCard label="Avg Session Duration" value={`${totals.avgSession}s`} />
      </div>

      {/* Top Pages & Referrers */}
      {vercelData?.topPages?.data && (
        <div className="chart-row">
          <div className="chart-card wide">
            <h3 className="chart-card-title">Top Pages <span className="live-badge">LIVE</span></h3>
            <div className="top-list">
              {vercelData.topPages.data.slice(0, 8).map((page, i) => (
                <div key={i} className="top-list-item">
                  <span className="top-list-rank">{i + 1}</span>
                  <span className="top-list-name">{page.path || page.key}</span>
                  <span className="top-list-value">{(page.pageViews ?? page.visitors ?? page.count ?? 0).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
          {vercelData?.topReferrers?.data && (
            <div className="chart-card narrow">
              <h3 className="chart-card-title">Top Referrers <span className="live-badge">LIVE</span></h3>
              <div className="top-list">
                {vercelData.topReferrers.data.slice(0, 8).map((ref, i) => (
                  <div key={i} className="top-list-item">
                    <span className="top-list-rank">{i + 1}</span>
                    <span className="top-list-name">{ref.referrer || ref.key || 'Direct'}</span>
                    <span className="top-list-value">{(ref.pageViews ?? ref.visitors ?? ref.count ?? 0).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Traffic chart */}
      {chartData.length > 0 && (
        <div className="chart-card full">
          <h3 className="chart-card-title">Traffic Trend {analyticsSource === 'vercel' && <span className="live-badge">LIVE</span>}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="gradGold2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#c8a97e" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#c8a97e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e1e1e" />
              <XAxis dataKey="date" stroke="#5a5a5a" tick={{ fill: '#5a5a5a', fontSize: 11 }} />
              <YAxis stroke="#5a5a5a" tick={{ fill: '#5a5a5a', fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="pageViews" stroke="#c8a97e" fill="url(#gradGold2)" name="Page Views" />
              <Area type="monotone" dataKey="uniqueVisitors" stroke="#8a8a8a" fill="transparent" name="Unique Visitors" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {chartData.length === 0 && !loading && (
        <div className="empty-state-card">
          <p className="empty-state-text">No traffic data for this period. Analytics will populate as your site receives visitors.</p>
        </div>
      )}
    </div>
  );
}

/* ==================================================================
   STAT CARD
   ================================================================== */
function StatCard({ label, value, change }) {
  return (
    <div className="stat-card">
      <span className="stat-label">{label}</span>
      <span className="stat-value">{value}</span>
      {change && <span className="stat-change">{change}</span>}
    </div>
  );
}
