import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET || 'archos-admin-secret-key-change-in-production'
);
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'archos2024';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { password } = req.body || {};

    if (!password || password !== ADMIN_PASSWORD) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = await new SignJWT({ role: 'admin' })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('24h')
      .setIssuedAt()
      .sign(JWT_SECRET);

    res.setHeader('Set-Cookie', [
      `admin-token=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=86400${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`,
    ]);

    return res.status(200).json({ success: true });
  }

  if (req.method === 'DELETE') {
    res.setHeader('Set-Cookie', [
      'admin-token=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0',
    ]);
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
