'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import '../../../views/admin/AdminLogin.css';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        router.push('/admin');
      } else {
        setError('Invalid password');
      }
    } catch {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-login">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <h1 className="admin-login-logo">ARCHOS AI</h1>
          <p className="admin-login-subtitle">Admin Access</p>
        </div>
        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="admin-login-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              autoFocus
            />
          </div>
          {error && <p className="admin-login-error">{error}</p>}
          <button type="submit" disabled={loading || !password} className="btn btn-primary admin-login-btn">
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
        <a href="/" className="admin-login-back">&larr; Back to site</a>
      </div>
    </div>
  );
}
