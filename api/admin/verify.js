import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET || 'archos-admin-secret-key-change-in-production'
);

function parseCookies(cookieHeader) {
  const cookies = {};
  if (!cookieHeader) return cookies;
  cookieHeader.split(';').forEach((c) => {
    const [key, ...val] = c.trim().split('=');
    if (key) cookies[key] = val.join('=');
  });
  return cookies;
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const cookies = parseCookies(req.headers.cookie);
  const token = cookies['admin-token'];

  if (!token) {
    return res.status(200).json({ authenticated: false });
  }

  try {
    await jwtVerify(token, JWT_SECRET);
    return res.status(200).json({ authenticated: true });
  } catch {
    return res.status(200).json({ authenticated: false });
  }
}
