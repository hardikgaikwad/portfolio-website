/* ═══════════════════════════════════════════════════════════
   AdminLogin — Root Access Authentication Portal
   ═══════════════════════════════════════════════════════════ */

import { useState } from 'react';
import './Admin.css';

interface Props {
  onLogin: (user: string, pass: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}

export default function AdminLogin({ onLogin, loading, error }: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;
    try {
      await onLogin(username, password);
    } catch {
      // error handled by useAuth
    }
  };

  return (
    <div className="admin-login-wrapper">
      <div className="admin-login-box">
        <div className="admin-login-box__header">
          <div className="admin-login-box__dots">
            <span className="terminal__dot terminal__dot--close"></span>
            <span className="terminal__dot terminal__dot--min"></span>
            <span className="terminal__dot terminal__dot--max"></span>
          </div>
          <span className="admin-login-box__title">SYS_ROOT // AUTHENTICATE</span>
        </div>

        <div className="admin-login-box__body">
          <div className="admin-login-banner">
            <div className="admin-login-banner__code">SECURITY PROTOCOL: LEVEL 5 CLEARANCE</div>
            <div className="admin-login-banner__sub">RESTRICTED DOSSIER MANAGEMENT CONSOLE</div>
          </div>

          {error && (
            <div className="admin-login-alert">
              [ALERT] ACCESS DENIED: {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="admin-login-form">
            <div className="admin-login-field">
              <label className="admin-login-label">OPERATOR IDENTIFIER (USERNAME)</label>
              <input
                type="text"
                autoFocus
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="admin-login-input"
              />
            </div>

            <div className="admin-login-field">
              <label className="admin-login-label">ACCESS CIPHER (PASSWORD)</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="admin-login-input"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="admin-login-submit"
            >
              {loading ? 'VERIFYING CREDENTIALS...' : 'AUTHENTICATE ACCESS 🡭'}
            </button>
          </form>

          <div className="admin-login-footer">
            <span>RESTRICTED // AUTHORIZED ACCESS ONLY</span>
            <a href="/" className="admin-login-back-link">← RETURN TO TERMINAL</a>
          </div>
        </div>
      </div>
    </div>
  );
}
