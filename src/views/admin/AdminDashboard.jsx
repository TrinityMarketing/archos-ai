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
   HOOK: Fetch Vercel Analytics
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

/* ==================================================================
   DASHBOARD TAB
   ================================================================== */
function DashboardTab() {
  const { source: analyticsSource, data: vercelData, loading } = useVercelAnalytics('30d');

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
        <StatCard label="Total Leads" value="0" change="Leads will appear here" />
        <StatCard label="Conversations" value="0" change="Chats will appear here" />
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

      {chartData.length === 0 && !loading && (
        <div className="empty-state-card">
          <p className="empty-state-text">No traffic data yet. Analytics will appear here once your site receives visitors.</p>
        </div>
      )}
    </div>
  );
}

/* ==================================================================
   LEADS TAB
   ================================================================== */
function LeadsTab() {
  return (
    <div className="tab-content">
      <h1 className="tab-title">Leads</h1>
      <div className="empty-state-card">
        <div className="empty-state-icon">{icons.leads}</div>
        <h3 className="empty-state-heading">No leads yet</h3>
        <p className="empty-state-text">
          Leads captured by the chatbot and contact form will appear here.
          Once your lead pipeline is connected, you&apos;ll see real-time data.
        </p>
      </div>
    </div>
  );
}

/* ==================================================================
   CONVERSATIONS TAB
   ================================================================== */
function ConversationsTab() {
  return (
    <div className="tab-content">
      <h1 className="tab-title">Conversations</h1>
      <div className="empty-state-card">
        <div className="empty-state-icon">{icons.conversations}</div>
        <h3 className="empty-state-heading">No conversations yet</h3>
        <p className="empty-state-text">
          Chatbot conversations will appear here once visitors start interacting
          with the AI assistant on your site.
        </p>
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
