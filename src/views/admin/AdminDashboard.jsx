'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, LineChart, Line,
  PieChart, Pie, Cell,
} from 'recharts';
import { mockLeads, mockConversations, mockAnalytics } from '../../data/mockData';
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
/*  Status / source badge component                                   */
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
  manual: { bg: 'rgba(138,138,138,0.15)', color: '#8a8a8a' },
};

function Badge({ type, value }) {
  const palette = type === 'source' ? SOURCE_COLORS : STATUS_COLORS;
  const style = palette[value] || { bg: 'rgba(138,138,138,0.15)', color: '#8a8a8a' };
  return (
    <span className="badge" style={{ background: style.bg, color: style.color }}>
      {value}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Initials avatar                                                   */
/* ------------------------------------------------------------------ */
function Avatar({ name }) {
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
  return <div className="avatar">{initials}</div>;
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
/*  PIE chart colors                                                  */
/* ------------------------------------------------------------------ */
const PIE_COLORS = ['#c8a97e', '#60a5fa', '#4ade80', '#fbbf24', '#f87171'];

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */
function fmtDate(d) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function timeAgo(d) {
  const diff = Date.now() - new Date(d).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

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
   DASHBOARD TAB
   ================================================================== */
function DashboardTab() {
  const totalLeads = mockLeads.length;
  const converted = mockLeads.filter((l) => l.status === 'converted').length;
  const conversionRate = totalLeads ? Math.round((converted / totalLeads) * 100) : 0;
  const activeChats = mockConversations.filter((c) => c.status === 'active').length;
  const totalChats = mockConversations.length;
  const totalViews = mockAnalytics.reduce((s, d) => s + d.pageViews, 0);

  const sourceData = useMemo(() => {
    const counts = {};
    mockLeads.forEach((l) => { counts[l.source] = (counts[l.source] || 0) + 1; });
    return Object.entries(counts).map(([name, count]) => ({ name, count }));
  }, []);

  const recentLeads = useMemo(() => [...mockLeads].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 6), []);
  const recentConvos = useMemo(() => [...mockConversations].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 4), []);

  return (
    <div className="tab-content">
      <h1 className="tab-title">Dashboard</h1>

      {/* Stat cards */}
      <div className="stat-grid">
        <StatCard label="Total Leads" value={totalLeads} change="+3 this week" />
        <StatCard label="Conversion Rate" value={`${conversionRate}%`} change="+2% vs last month" />
        <StatCard label="Active Chats" value={`${activeChats} of ${totalChats}`} />
        <StatCard label="Page Views (30d)" value={totalViews.toLocaleString()} change="+12% vs prior" />
      </div>

      {/* Charts row */}
      <div className="chart-row">
        <div className="chart-card wide">
          <h3 className="chart-card-title">Traffic Overview</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={mockAnalytics}>
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

        <div className="chart-card narrow">
          <h3 className="chart-card-title">Lead Sources</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={sourceData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#1e1e1e" />
              <XAxis type="number" stroke="#5a5a5a" tick={{ fill: '#5a5a5a', fontSize: 11 }} />
              <YAxis dataKey="name" type="category" stroke="#5a5a5a" tick={{ fill: '#8a8a8a', fontSize: 12 }} width={70} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" fill="#c8a97e" radius={[0, 2, 2, 0]} name="Leads" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent activity */}
      <div className="chart-row">
        <div className="chart-card wide">
          <h3 className="chart-card-title">Recent Leads</h3>
          <div className="recent-list">
            {recentLeads.map((lead) => (
              <div key={lead.id} className="recent-item">
                <Avatar name={lead.name} />
                <div className="recent-item-info">
                  <span className="recent-item-name">{lead.name}</span>
                  <span className="recent-item-sub">{lead.company}</span>
                </div>
                <Badge type="status" value={lead.status} />
              </div>
            ))}
          </div>
        </div>

        <div className="chart-card narrow">
          <h3 className="chart-card-title">Recent Conversations</h3>
          <div className="recent-list">
            {recentConvos.map((c) => (
              <div key={c.id} className="recent-item">
                <div className="recent-item-info">
                  <span className="recent-item-name">{c.name}</span>
                  <span className="recent-item-sub recent-item-msg">{c.messages[c.messages.length - 1]?.text?.slice(0, 60)}...</span>
                </div>
                <Badge type="status" value={c.status} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==================================================================
   LEADS TAB
   ================================================================== */
function LeadsTab() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [viewMode, setViewMode] = useState('table');
  const [selectedLead, setSelectedLead] = useState(null);

  const filtered = useMemo(() => {
    return mockLeads.filter((l) => {
      const matchSearch =
        !search ||
        l.name.toLowerCase().includes(search.toLowerCase()) ||
        l.email.toLowerCase().includes(search.toLowerCase()) ||
        l.company.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'all' || l.status === statusFilter;
      const matchSource = sourceFilter === 'all' || l.source === sourceFilter;
      return matchSearch && matchStatus && matchSource;
    });
  }, [search, statusFilter, sourceFilter]);

  /* Map view: group by state */
  const groupedByState = useMemo(() => {
    const groups = {};
    filtered.forEach((l) => {
      const state = l.location?.split(',').pop()?.trim() || 'Unknown';
      if (!groups[state]) groups[state] = [];
      groups[state].push(l);
    });
    return Object.entries(groups).sort((a, b) => b[1].length - a[1].length);
  }, [filtered]);

  const maxPerState = groupedByState.length ? Math.max(...groupedByState.map(([, v]) => v.length)) : 1;

  return (
    <div className="tab-content">
      <h1 className="tab-title">Leads</h1>

      {/* Toolbar */}
      <div className="leads-toolbar">
        <div className="search-box">
          {icons.search}
          <input
            type="text"
            placeholder="Search leads..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="filter-select">
          <option value="all">All Statuses</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="qualified">Qualified</option>
          <option value="converted">Converted</option>
          <option value="lost">Lost</option>
        </select>

        <select value={sourceFilter} onChange={(e) => setSourceFilter(e.target.value)} className="filter-select">
          <option value="all">All Sources</option>
          <option value="chatbot">Chatbot</option>
          <option value="form">Form</option>
          <option value="manual">Manual</option>
        </select>

        <div className="view-toggle">
          <button className={viewMode === 'table' ? 'active' : ''} onClick={() => setViewMode('table')}>Table</button>
          <button className={viewMode === 'map' ? 'active' : ''} onClick={() => setViewMode('map')}>Map</button>
        </div>
      </div>

      <div className="leads-body">
        {/* Table view */}
        {viewMode === 'table' && (
          <div className={`leads-table-wrap ${selectedLead ? 'with-detail' : ''}`}>
            <table className="leads-table">
              <thead>
                <tr>
                  <th>Name / Email</th>
                  <th>Company</th>
                  <th>Source</th>
                  <th>Status</th>
                  <th>Location</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((lead) => (
                  <tr
                    key={lead.id}
                    className={selectedLead?.id === lead.id ? 'selected' : ''}
                    onClick={() => setSelectedLead(lead)}
                  >
                    <td>
                      <div className="lead-name-cell">
                        <Avatar name={lead.name} />
                        <div>
                          <div className="cell-primary">{lead.name}</div>
                          <div className="cell-secondary">{lead.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>{lead.company}</td>
                    <td><Badge type="source" value={lead.source} /></td>
                    <td><Badge type="status" value={lead.status} /></td>
                    <td className="cell-secondary">{lead.location}</td>
                    <td className="cell-secondary">{fmtDate(lead.date)}</td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan="6" className="empty-row">No leads match your filters.</td></tr>
                )}
              </tbody>
            </table>

            {/* Detail panel */}
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

                  <div className="detail-section">
                    <div className="detail-label">Company</div>
                    <div className="detail-value">{selectedLead.company}</div>
                  </div>
                  <div className="detail-section">
                    <div className="detail-label">Phone</div>
                    <div className="detail-value">{selectedLead.phone || 'N/A'}</div>
                  </div>
                  <div className="detail-section">
                    <div className="detail-label">Location</div>
                    <div className="detail-value">{selectedLead.location}</div>
                  </div>
                  <div className="detail-section">
                    <div className="detail-label">Source</div>
                    <Badge type="source" value={selectedLead.source} />
                  </div>
                  <div className="detail-section">
                    <div className="detail-label">Status</div>
                    <Badge type="status" value={selectedLead.status} />
                  </div>
                  <div className="detail-section">
                    <div className="detail-label">Date Added</div>
                    <div className="detail-value">{fmtDate(selectedLead.date)}</div>
                  </div>
                  {selectedLead.notes && (
                    <div className="detail-section">
                      <div className="detail-label">Notes</div>
                      <div className="detail-value detail-notes">{selectedLead.notes}</div>
                    </div>
                  )}
                  {selectedLead.value && (
                    <div className="detail-section">
                      <div className="detail-label">Value</div>
                      <div className="detail-value">${selectedLead.value.toLocaleString()}</div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Map view */}
        {viewMode === 'map' && (
          <div className="leads-map-grid">
            {groupedByState.map(([state, leads]) => (
              <div key={state} className="map-state-card">
                <div className="map-state-header">
                  <span className="map-state-name">{state}</span>
                  <span className="map-state-count">{leads.length} lead{leads.length !== 1 ? 's' : ''}</span>
                </div>
                <div className="map-state-bar-wrap">
                  <div
                    className="map-state-bar"
                    style={{ width: `${(leads.length / maxPerState) * 100}%` }}
                  />
                </div>
                <div className="map-state-leads">
                  {leads.map((l) => (
                    <div key={l.id} className="map-lead-row">
                      <span className="map-lead-name">{l.name}</span>
                      <Badge type="status" value={l.status} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ==================================================================
   CONVERSATIONS TAB
   ================================================================== */
function ConversationsTab() {
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => {
    if (filter === 'all') return mockConversations;
    return mockConversations.filter((c) => c.status === filter);
  }, [filter]);

  const activeConvo = selected || filtered[0] || null;

  return (
    <div className="tab-content conversations-layout">
      {/* Left list */}
      <div className="convo-list-panel">
        <div className="convo-filter-bar">
          {['all', 'active', 'completed', 'abandoned'].map((f) => (
            <button
              key={f}
              className={`convo-filter-btn ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <div className="convo-list">
          {filtered.map((c) => (
            <div
              key={c.id}
              className={`convo-list-item ${activeConvo?.id === c.id ? 'active' : ''}`}
              onClick={() => setSelected(c)}
            >
              <div className="convo-list-item-top">
                <span className="convo-list-name">{c.name}</span>
                <Badge type="status" value={c.status} />
              </div>
              <p className="convo-list-preview">{c.messages[c.messages.length - 1]?.text?.slice(0, 80)}...</p>
              <span className="convo-list-date">{fmtDate(c.date)}</span>
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="convo-empty">No conversations found.</p>
          )}
        </div>
      </div>

      {/* Right chat view */}
      <div className="convo-chat-panel">
        {activeConvo ? (
          <>
            <div className="convo-chat-header">
              <div>
                <h3 className="convo-chat-name">{activeConvo.name}</h3>
                <span className="convo-chat-email">{activeConvo.email}</span>
              </div>
              <div className="convo-chat-meta">
                <span>{fmtDate(activeConvo.date)}</span>
                {activeConvo.duration && <span>{activeConvo.duration}</span>}
                <Badge type="status" value={activeConvo.status} />
              </div>
            </div>
            <div className="convo-chat-messages">
              {activeConvo.messages.map((msg, i) => (
                <div key={i} className={`chat-bubble ${msg.sender === 'bot' ? 'bot' : 'user'}`}>
                  <div className="chat-bubble-inner">
                    <p>{msg.text}</p>
                    {msg.time && <span className="chat-bubble-time">{msg.time}</span>}
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
  const totals = useMemo(() => {
    const pv = mockAnalytics.reduce((s, d) => s + d.pageViews, 0);
    const uv = mockAnalytics.reduce((s, d) => s + d.uniqueVisitors, 0);
    const avgBounce = mockAnalytics.length
      ? (mockAnalytics.reduce((s, d) => s + (d.bounceRate || 0), 0) / mockAnalytics.length).toFixed(1)
      : 0;
    const avgSession = mockAnalytics.length
      ? (mockAnalytics.reduce((s, d) => s + (d.avgSessionDuration || 0), 0) / mockAnalytics.length).toFixed(0)
      : 0;
    return { pv, uv, avgBounce, avgSession };
  }, []);

  /* Daily new leads (count by date) */
  const dailyLeads = useMemo(() => {
    const counts = {};
    mockLeads.forEach((l) => {
      const d = l.date?.split('T')[0];
      if (d) counts[d] = (counts[d] || 0) + 1;
    });
    return Object.entries(counts)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, count]) => ({ date, count }));
  }, []);

  /* Lead pipeline */
  const pipeline = useMemo(() => {
    const counts = {};
    mockLeads.forEach((l) => { counts[l.status] = (counts[l.status] || 0) + 1; });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, []);

  /* Funnel */
  const funnel = [
    { label: 'Visitors', value: totals.pv },
    { label: 'Engaged', value: Math.round(totals.pv * 0.45) },
    { label: 'Lead', value: mockLeads.length },
    { label: 'Qualified', value: mockLeads.filter((l) => l.status === 'qualified' || l.status === 'converted').length },
    { label: 'Converted', value: mockLeads.filter((l) => l.status === 'converted').length },
  ];
  const maxFunnel = funnel[0].value || 1;

  return (
    <div className="tab-content">
      <h1 className="tab-title">Analytics</h1>

      {/* Stat cards */}
      <div className="stat-grid">
        <StatCard label="Page Views" value={totals.pv.toLocaleString()} />
        <StatCard label="Unique Visitors" value={totals.uv.toLocaleString()} />
        <StatCard label="Avg Bounce Rate" value={`${totals.avgBounce}%`} />
        <StatCard label="Avg Session Duration" value={`${totals.avgSession}s`} />
      </div>

      {/* Large traffic chart */}
      <div className="chart-card full">
        <h3 className="chart-card-title">Traffic Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={mockAnalytics}>
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

      {/* 3 smaller charts */}
      <div className="chart-row thirds">
        <div className="chart-card">
          <h3 className="chart-card-title">Bounce Rate</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={mockAnalytics}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e1e1e" />
              <XAxis dataKey="date" stroke="#5a5a5a" tick={{ fill: '#5a5a5a', fontSize: 10 }} />
              <YAxis stroke="#5a5a5a" tick={{ fill: '#5a5a5a', fontSize: 10 }} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="bounceRate" stroke="#c8a97e" strokeWidth={2} dot={false} name="Bounce %" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3 className="chart-card-title">Daily New Leads</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={dailyLeads}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e1e1e" />
              <XAxis dataKey="date" stroke="#5a5a5a" tick={{ fill: '#5a5a5a', fontSize: 10 }} />
              <YAxis stroke="#5a5a5a" tick={{ fill: '#5a5a5a', fontSize: 10 }} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" fill="#c8a97e" radius={[2, 2, 0, 0]} name="Leads" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3 className="chart-card-title">Lead Pipeline</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={pipeline}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
                nameKey="name"
              >
                {pipeline.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="pie-legend">
            {pipeline.map((p, i) => (
              <div key={p.name} className="pie-legend-item">
                <span className="pie-dot" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                <span>{p.name} ({p.value})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Conversion funnel */}
      <div className="chart-card full">
        <h3 className="chart-card-title">Conversion Funnel</h3>
        <div className="funnel">
          {funnel.map((step, i) => (
            <div key={step.label} className="funnel-step">
              <div className="funnel-label">
                <span>{step.label}</span>
                <span className="funnel-value">{step.value.toLocaleString()}</span>
              </div>
              <div className="funnel-bar-wrap">
                <div
                  className="funnel-bar"
                  style={{
                    width: `${(step.value / maxFunnel) * 100}%`,
                    opacity: 1 - i * 0.15,
                  }}
                />
              </div>
              {i < funnel.length - 1 && (
                <span className="funnel-rate">
                  {((funnel[i + 1].value / step.value) * 100).toFixed(1)}%
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
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
