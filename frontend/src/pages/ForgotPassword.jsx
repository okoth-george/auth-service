import { useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../api/axios';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [statusMessage, setStatusMessage] = useState('');
  const [statusVariant, setStatusVariant] = useState('');
  const [token, setToken] = useState('');
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    setStatusMessage('');
    setStatusVariant('');
    setToken('');
    try {
      const response = await api.post('/users/forgotPassword', data);
      setStatusVariant('success');
      setStatusMessage(response.data.message || 'Reset token generated successfully.');
      setToken(response.data.resetToken || '');
    } catch (error) {
      setStatusVariant('error');
      setStatusMessage(error.response?.data?.error || 'Unable to generate reset token.');
    }
  };

  const formErrorMessages = Object.values(errors || {}).map((e) => e.message).filter(Boolean);

  return (
    <>
      <div className="rp-root">
        <aside className="rp-left" aria-hidden="true">
          <div className="rp-left-inner">
            <div className="rp-card-brand">Auth API</div>
            <h2 className="rp-heading">Forgot password?</h2>
            <p className="rp-subheading">Request a secure token and reset your password with confidence.</p>
            <ul className="rp-badges">
              <li>Fast one-click recovery</li>
              <li>Secure token delivery</li>
              <li>Designed for modern auth flows</li>
            </ul>
          </div>
          <div className="rp-left-glow" />
        </aside>

        <div className="rp-divider" aria-hidden="true" />

        <main className="rp-right">
          <div className="rp-card" role="region" aria-labelledby="rp-heading">
            <div className="rp-card-brand">Auth API</div>
            <h1 id="rp-heading" className="rp-heading">Forgot Password</h1>
            <p className="rp-subheading">Enter your username to generate a password reset token.</p>

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="rp-field">
                <label htmlFor="forgot-username" className="rp-label">Username</label>
                <input
                  id="forgot-username"
                  className="rp-input"
                  {...register('username', { required: 'Username is required' })}
                  aria-invalid={errors.username ? 'true' : 'false'}
                />
              </div>

              {formErrorMessages.length > 0 && (
                <div className="rp-error" role="alert" aria-live="assertive">
                  <strong className="rp-error-title">Please correct the following</strong>
                  <ul className="rp-error-list">
                    {formErrorMessages.map((m, idx) => <li key={idx}>{m}</li>)}
                  </ul>
                </div>
              )}

              {statusMessage && (
                <div className={`rp-status rp-status-${statusVariant}`} role="status" aria-live="polite">
                  {statusMessage}
                </div>
              )}

              <div className="rp-actions">
                <button type="submit" disabled={isSubmitting} className={`rp-button ${isSubmitting ? 'is-loading' : ''}`}>
                  <span className="rp-button-text">Send Reset Token</span>
                  <span className="rp-spinner" aria-hidden="true" />
                </button>
              </div>
            </form>

            {token && (
              <div className="rp-token">
                <span className="rp-token-title">Reset Token</span>
                <pre className="rp-pre">{token}</pre>
                <p className="rp-note">
                  Use this token on the <Link to={`/reset-password?token=${encodeURIComponent(token)}`} className="rp-link">Reset Password</Link> page.
                </p>
              </div>
            )}

            <div className="rp-footer-links">
              <p className="rp-back">
                Remembered your password?{' '}
                <Link to="/login" className="rp-link">Login</Link>
              </p>
            </div>
          </div>
        </main>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Syne:wght@600;700;800&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body, #root { height: 100%; width: 100%; }

        :root {
          --bg-canvas:      #0a0a0f;
          --bg-left:        #0d0d14;
          --card-bg:        #111118;
          --input-bg:       #1a1a24;
          --accent:         #c8f064;
          --accent-dark:    #a8d845;
          --accent-glow:    rgba(200,240,100,0.12);
          --primary-text:   #f0eee8;
          --secondary-text: #8a8894;
          --muted-text:     #5a5868;
          --border:         rgba(255,255,255,0.08);
          --border-hover:   rgba(255,255,255,0.16);
          --error:          #ff6b6b;
          --error-bg:       rgba(255,107,107,0.1);
          --error-border:   rgba(255,107,107,0.2);
        }

        .rp-root {
          display: flex;
          min-height: 100vh;
          width: 100%;
          background-color: var(--bg-canvas);
          color: var(--primary-text);
          font-family: 'DM Sans', system-ui, sans-serif;
          -webkit-font-smoothing: antialiased;
        }

        .rp-left { display: none; }
        .rp-divider { display: none; }

        .rp-right {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          padding: 2rem 1.25rem;
          background-color: var(--bg-canvas);
          background-image: radial-gradient(ellipse at top right, rgba(200,240,100,0.07) 0%, transparent 60%);
        }

        .rp-card {
          width: 100%;
          max-width: 440px;
          background: var(--card-bg);
          border-radius: 20px;
          padding: 2rem 1.5rem;
          border: 1px solid var(--border);
          box-shadow: 0 8px 40px rgba(0,0,0,0.5);
        }

        .rp-card-brand {
          font-size: 26px;
          color: var(--accent);
          margin-bottom: 1.25rem;
          font-family: 'Syne', sans-serif;
          line-height: 1;
        }

        .rp-heading {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 22px;
          letter-spacing: -0.3px;
          color: var(--primary-text);
          margin-bottom: 0.25rem;
        }

        .rp-subheading {
          font-size: 14px;
          color: var(--secondary-text);
          margin-bottom: 1.75rem;
          line-height: 1.5;
        }

        .rp-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 1.2rem;
        }

        .rp-label {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--secondary-text);
          font-weight: 500;
        }

        .rp-input {
          width: 100%;
          height: 48px;
          background: var(--input-bg);
          border: 1px solid var(--border);
          padding: 0 0.95rem;
          border-radius: 12px;
          color: var(--primary-text);
          font-size: 15px;
          font-family: 'DM Sans', sans-serif;
          transition: border-color 150ms ease, box-shadow 150ms ease;
        }

        .rp-input::placeholder { color: var(--muted-text); }
        .rp-input:hover { border-color: var(--border-hover); }
        .rp-input:focus {
          outline: none;
          border-color: var(--accent);
          box-shadow: 0 0 0 3px var(--accent-glow);
        }

        .rp-error {
          background: var(--error-bg);
          border: 1px solid var(--error-border);
          border-radius: 12px;
          padding: 10px 14px;
          color: var(--error);
          font-size: 13px;
          margin-bottom: 1.2rem;
        }

        .rp-error-title {
          display: block;
          font-weight: 600;
          margin-bottom: 4px;
        }

        .rp-error-list {
          padding-left: 1.1rem;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .rp-status {
          margin-bottom: 1.2rem;
          padding: 10px 14px;
          border-radius: 12px;
          font-size: 13px;
          line-height: 1.4;
        }

        .rp-status-success {
          background: rgba(107,255,184,0.08);
          border: 1px solid rgba(107,255,184,0.2);
          color: #6bffb8;
        }

        .rp-status-error {
          background: var(--error-bg);
          border: 1px solid var(--error-border);
          color: var(--error);
        }

        .rp-actions { width: 100%; margin-bottom: 1.5rem; }

        .rp-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          height: 48px;
          cursor: pointer;
          border-radius: 12px;
          background: var(--accent);
          color: #0a0a0a;
          border: none;
          font-weight: 700;
          font-size: 15px;
          font-family: 'DM Sans', sans-serif;
          transition: background 180ms ease-out, transform 120ms ease, box-shadow 180ms ease-out;
        }

        .rp-button:hover:not([disabled]) {
          background: var(--accent-dark);
          box-shadow: 0 4px 20px rgba(200,240,100,0.18);
        }

        .rp-button:active:not([disabled]) { transform: scale(0.99); }

        .rp-button:focus {
          outline: none;
          box-shadow: 0 0 0 3px var(--accent-glow);
        }

        .rp-button[disabled] {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .rp-button-text { line-height: 1; }

        .rp-spinner {
          display: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          border: 2px solid rgba(10,10,10,0.2);
          border-top-color: #0a0a0a;
          animation: rp-spin 0.6s linear infinite;
          flex-shrink: 0;
        }

        .rp-button.is-loading .rp-button-text { opacity: 0.35; }
        .rp-button.is-loading .rp-spinner     { display: inline-block; }

        @keyframes rp-spin { to { transform: rotate(360deg); } }

        .rp-token {
          margin-top: 1.2rem;
          background: rgba(255,255,255,0.03);
          padding: 1rem;
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,0.06);
        }

        .rp-token-title { display: block; margin-bottom: 0.75rem; font-weight: 700; color: var(--primary-text); }

        .rp-pre {
          margin: 0.8rem 0;
          background: #16161e;
          color: var(--primary-text);
          border-radius: 12px;
          padding: 1rem;
          overflow-x: auto;
          font-size: 0.95rem;
        }

        .rp-footer-links { margin-top: 1.5rem; }

        .rp-back { margin: 0; color: var(--secondary-text); font-size: 0.95rem; }

        .rp-link { color: var(--accent); text-decoration: underline; text-underline-offset: 4px; }

        .rp-left-inner { position: relative; top: 50%; transform: translateY(-50%); max-width: 420px; }
        .rp-badges { margin: 24px 0 0; padding: 0; list-style: none; display: grid; gap: 12px; color: var(--secondary-text); font-size: 14px; line-height: 1.6; }
        .rp-left-glow { position: absolute; top: 12%; right: -8%; width: 280px; height: 280px; background: radial-gradient(circle at top right, rgba(200,240,100,0.08), transparent 40%); filter: blur(40px); pointer-events:none; }

        @media (min-width: 900px) {
          .rp-left { display: block; width: 40%; padding: 4rem; background: linear-gradient(160deg, var(--bg-canvas) 0%, var(--bg-left) 100%); position: relative; }
          .rp-divider { display: block; width: 1px; background: rgba(255,255,255,0.06); }
          .rp-right { padding: 4rem 3.5rem; }
        }
      `}</style>
    </>
  );
};

export default ForgotPassword;
