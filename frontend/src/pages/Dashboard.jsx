import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const DJANGO_URL = import.meta.env.VITE_DJANGO_URL || 'http://localhost:8000';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [statusMessage, setStatusMessage] = useState('');
  const [statusVariant, setStatusVariant] = useState('');

  const displayName = useMemo(() => {
    if (!user) return 'Guest';
    return typeof user === 'string' ? user : user.username || user.name || 'User';
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleContinueToApp = () => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      setStatusVariant('error');
      setStatusMessage('Session expired. Redirecting to login...');
      setTimeout(() => navigate('/login'), 900);
      return;
    }
    window.location.href = `${DJANGO_URL}/auth/callback/?token=${encodeURIComponent(accessToken)}`;
  };

  return (
    <div className="rp-root">
      <div className="rp-card" role="region" aria-labelledby="rp-heading">
        <h1 id="rp-heading" className="rp-heading">Welcome, {displayName}!</h1>
        <p className="rp-note">You are authenticated with the Express Auth API.</p>
        <p className="rp-muted">The token below will be sent to Django to establish your session there.</p>

        {statusMessage && (
          <div className={`rp-status rp-status-${statusVariant}`} role="status" aria-live="polite">
            {statusMessage}
          </div>
        )}

        <div className="rp-actions">
          <button onClick={handleContinueToApp} className="rp-button">
            <span>Continue to Main Django App</span>
          </button>

          <button onClick={handleLogout} className="rp-button rp-destructive">
            <span>Logout</span>
          </button>
        </div>
      </div>

      <style>{` 
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Syne:wght@700;800&display=swap');
        :root{ --bg-canvas:#0a0a0f; --card-bg:#111118; --input-bg:#1a1a24; --accent:#c8f064; --primary-text:#f0eee8; --secondary-text:#8a8894; --muted-text:#5a5868; --border-default:rgba(255,255,255,0.08); --border-hover:rgba(255,255,255,0.16); --error:#ff6b6b; }
        .rp-root{ min-height:100vh; display:flex; align-items:center; justify-content:center; padding:2rem 1rem; background-color:var(--bg-canvas); background-image: radial-gradient(at top right, rgba(200,240,100,0.06), transparent 60%); color:var(--primary-text); font-family:'DM Sans', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; }
        .rp-card{ width:100%; max-width:520px; background:var(--card-bg); border-radius:20px; padding:2.5rem; border:1px solid var(--border-default); box-shadow:0 6px 24px rgba(0,0,0,0.45); }
        .rp-heading{ font-family:'Syne', 'DM Sans', sans-serif; font-weight:800; font-size:1.5rem; margin:0 0 0.6rem 0; color:var(--primary-text); }
        .rp-note{ margin:0 0 0.6rem 0; color:var(--primary-text); }
        .rp-muted{ margin:0 0 1.2rem 0; color:var(--secondary-text); font-size:0.95rem; }
        .rp-status{ margin-top: 16px; padding: 14px 16px; border-radius: 14px; background: rgba(200,240,100,0.08); color: var(--primary-text); border: 1px solid rgba(200,240,100,0.24); font-size: 0.95rem; }
        .rp-status-error{ background: rgba(255,107,107,0.12); border-color: rgba(255,107,107,0.24); color: #ffb6b6; }
        .rp-status-success{ background: rgba(107,255,184,0.12); border-color: rgba(107,255,184,0.24); color: #b8ffdd; }
        .rp-actions{ display:flex; flex-direction:column; gap:0.75rem; }
        .rp-button{ width:100%; display:inline-flex; align-items:center; justify-content:center; gap:0.6rem; cursor:pointer; border-radius:12px; padding:0.85rem 1rem; background: linear-gradient(180deg, var(--accent), #a8d84f 80%); color:#0a0a0a; border:1px solid rgba(0,0,0,0.12); font-weight:700; transition: transform 120ms ease, box-shadow 180ms ease-out, opacity 180ms ease-out; }
        .rp-button:hover{ box-shadow:0 6px 18px rgba(200,240,100,0.08); border-color:var(--border-hover); }
        .rp-button:active{ transform: scale(0.99); }
        .rp-button:focus{ outline:none; box-shadow:0 0 0 6px rgba(200,240,100,0.12); }
        .rp-destructive{ background: linear-gradient(180deg, #ff6b6b, #e95656 80%); color:#0a0a0a; }
      `}</style>
    </div>
  );
};

export default Dashboard;
