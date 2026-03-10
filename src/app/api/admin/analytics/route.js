import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.ADMIN_JWT_SECRET || 'archos-admin-secret-2024');
const VERCEL_TOKEN = process.env.VERCEL_ANALYTICS_TOKEN;
const PROJECT_ID = process.env.VERCEL_PROJECT_ID || 'prj_tFVBdhD21sAucBKSx3XNZ424qqMu';
const TEAM_ID = process.env.VERCEL_TEAM_ID || 'team_IFVmvFw1VccZOoOBNVLlW7CK';

async function verifyAdmin() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin-token')?.value;
    if (!token) return false;
    await jwtVerify(token, JWT_SECRET);
    return true;
  } catch {
    return false;
  }
}

async function fetchVercelAnalytics(endpoint, params = {}) {
  if (!VERCEL_TOKEN) return null;

  const url = new URL(`https://api.vercel.com${endpoint}`);
  url.searchParams.set('projectId', PROJECT_ID);
  url.searchParams.set('teamId', TEAM_ID);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  try {
    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${VERCEL_TOKEN}` },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function GET(request) {
  const authed = await verifyAdmin();
  if (!authed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const period = searchParams.get('period') || '30d';

  // Calculate time range
  const now = Date.now();
  const periodMs = {
    '24h': 24 * 60 * 60 * 1000,
    '7d': 7 * 24 * 60 * 60 * 1000,
    '30d': 30 * 24 * 60 * 60 * 1000,
    '90d': 90 * 24 * 60 * 60 * 1000,
  };
  const from = now - (periodMs[period] || periodMs['30d']);

  if (!VERCEL_TOKEN) {
    return NextResponse.json({
      source: 'mock',
      message: 'Set VERCEL_ANALYTICS_TOKEN env var to enable real analytics',
      data: null,
    });
  }

  // Fetch multiple analytics endpoints in parallel
  const [overview, timeseries, topPages, topReferrers] = await Promise.all([
    fetchVercelAnalytics('/v1/web-analytics/overview', {
      from: from.toString(),
      to: now.toString(),
    }),
    fetchVercelAnalytics('/v1/web-analytics/timeseries', {
      from: from.toString(),
      to: now.toString(),
    }),
    fetchVercelAnalytics('/v1/web-analytics/top-pages', {
      from: from.toString(),
      to: now.toString(),
      limit: '10',
    }),
    fetchVercelAnalytics('/v1/web-analytics/top-referrers', {
      from: from.toString(),
      to: now.toString(),
      limit: '10',
    }),
  ]);

  // If all calls failed, return mock indicator
  if (!overview && !timeseries && !topPages && !topReferrers) {
    return NextResponse.json({
      source: 'mock',
      message: 'Unable to fetch Vercel Analytics. Check your VERCEL_ANALYTICS_TOKEN.',
      data: null,
    });
  }

  return NextResponse.json({
    source: 'vercel',
    data: {
      overview,
      timeseries,
      topPages,
      topReferrers,
      period,
    },
  });
}
