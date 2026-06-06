import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form'; // Added Controller
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '../schemas/authSchema';
import api from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import PasswordInput from '../components/PasswordInput';

const Register = () => {
  const navigate = useNavigate();
  const [statusMessage, setStatusMessage] = useState('');
  const [statusVariant, setStatusVariant] = useState('');
  const {
    register,
    control, // Grab control for Controller integration
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    setStatusMessage('');
    setStatusVariant('');
    try {
      const { confirmPassword: _, ...registerData } = data;
      await api.post('/users/register', registerData);
      setStatusVariant('success');
      setStatusMessage('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 900);
    } catch (error) {
      setStatusVariant('error');
      setStatusMessage(error.response?.data?.error || 'Registration failed');
    }
  };

  const formErrorMessages = Object.values(errors || {}).map((e) => e.message).filter(Boolean);

  return (
    <>
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
          width: 100%;
          min-height: 100vh;
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

        .rp-card-brand { font-size: 26px; color: var(--accent); margin-bottom: 1.25rem; font-family: 'Syne', sans-serif; line-height: 1; }
        .rp-heading { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 22px; letter-spacing: -0.3px; color: var(--primary-text); margin-bottom: 0.25rem; }
        .rp-subheading { font-size: 14px; color: var(--secondary-text); margin-bottom: 1.75rem; line-height: 1.5; }

        .rp-field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 1.2rem; }
        .rp-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--secondary-text); font-weight: 500; }

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
        .rp-input:hover        { border-color: var(--border-hover); }
        .rp-input:focus {
          outline: none;
          border-color: var(--accent);
          box-shadow: 0 0 0 3px var(--accent-glow);
        }

        .rp-error { background: var(--error-bg); border: 1px solid var(--error-border); border-radius: 12px; padding: 10px 14px; color: var(--error); font-size: 13px; margin-bottom: 1.2rem; }
        .rp-error-title { display: block; font-weight: 600; margin-bottom: 4px; }
        .rp-error-list { padding-left: 1.1rem; display: flex; flex-direction: column; gap: 2px; }
        .rp-status { margin-bottom: 1.2rem; padding: 10px 14px; border-radius: 12px; font-size: 13px; line-height: 1.4; }
        .rp-status-success { background: rgba(107,255,184,0.08); border: 1px solid rgba(107,255,184,0.2); color: #6bffb8; }
        .rp-status-error { background: var(--error-bg); border: 1px solid var(--error-border); color: var(--error); }

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

        .rp-button:hover:not([disabled]) { background: var(--accent-dark); box-shadow: 0 4px 20px rgba(200,240,100,0.18); }
        .rp-button:active:not([disabled]) { transform: scale(0.99); }
        .rp-button:focus { outline: none; box-shadow: 0 0 0 3px var(--accent-glow); }
        .rp-button[disabled] { opacity: 0.6; cursor: not-allowed; }

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

        .rp-back { color: var(--secondary-text); font-size: 13px; text-align: center; }
        .rp-link { color: var(--accent); text-decoration: none; font-size: 13px; transition: opacity 150ms; }
        .rp-link:hover { opacity: 0.7; }
        .rp-link:focus { outline: none; box-shadow: 0 0 0 2px var(--accent-glow); border-radius: 3px; }

        @media (min-width: 768px) {
          .rp-card    { padding: 2.5rem; }
          .rp-heading { font-size: 26px; }
        }

        @media (min-width: 1200px) {
          .rp-root { align-items: stretch; overflow: hidden; }
          .rp-left {
            display: flex;
            flex: 0 0 45%;
            align-items: center;
            position: relative;
            overflow: hidden;
            background: linear-gradient(155deg, #0a0a0f 0%, #0d0d14 60%, #0f0f18 100%);
          }
          .rp-left::after {
            content: '';
            position: absolute;
            top: -140px;
            right: -140px;
            width: 500px;
            height: 500px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(200,240,100,0.08) 0%, transparent 65%);
            pointer-events: none;
          }
          .rp-left::before {
            content: '';
            position: absolute;
            inset: 0;
            background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E");
            pointer-events: none;
          }
          .rp-left-inner { position: relative; z-index: 1; padding: 4rem; max-width: 480px; }
          .rp-left-brand { font-size: 30px; color: var(--accent); font-family: 'Syne', sans-serif; margin-bottom: 2.5rem; line-height: 1; }
          .rp-left-heading { font-family: 'Syne', sans-serif; font-size: 32px; font-weight: 800; letter-spacing: -0.5px; color: var(--primary-text); line-height: 1.15; margin-bottom: 1rem; }
          .rp-left-sub { font-size: 15px; color: var(--secondary-text); line-height: 1.7; margin-bottom: 2.5rem; max-width: 320px; }
          .rp-steps { list-style: none; display: flex; flex-direction: column; gap: 1.25rem; }
          .rp-step { display: flex; align-items: flex-start; gap: 14px; }
          .rp-step-num {
            width: 26px;
            height: 26px;
            border-radius: 50%;
            background: var(--accent-glow);
            border: 1px solid rgba(200,240,100,0.2);
            color: var(--accent);
            font-size: 11px;
            font-weight: 700;
            font-family: 'Syne', sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            margin-top: 1px;
          }
          .rp-step-text { font-size: 14px; color: var(--secondary-text); line-height: 1.5; }
          .rp-step-text strong { display: block; color: var(--primary-text); font-weight: 500; margin-bottom: 2px; }
          .rp-divider { display: block; width: 1px; align-self: stretch; background: rgba(255,255,255,0.05); flex-shrink: 0; }
          .rp-right { flex: 0 0 55%; min-height: 100vh; background-color: #111118; background-image: none; padding: 3rem 2rem; }
          .rp-card { max-width: 500px; background: transparent; border-color: transparent; box-shadow: none; padding: 2.5rem 2rem; }
          .rp-card-brand { display: none; }
          .rp-heading    { font-size: 28px; }
        }

        @media (min-width: 1920px) {
          .rp-root {
            max-width: 1400px;
            margin: 0 auto;
            box-shadow: -100vw 0 0 100vw var(--bg-canvas), 100vw 0 0 100vw var(--bg-canvas);
          }
          .rp-left-heading { font-size: 36px; }
          .rp-heading       { font-size: 30px; }
          .rp-subheading    { font-size: 16px; }
          .rp-left-sub      { font-size: 16px; }
        }
      `}</style>

      <div className="rp-root">
        <div className="rp-left" aria-hidden="true">
          <div className="rp-left-inner">
            <div className="rp-left-brand">⬡</div>
            <h2 className="rp-left-heading">Set up once.<br />Use everywhere.</h2>
            <p className="rp-left-sub">
              Your account unlocks every app in the ecosystem — one identity, zero repeated logins.
            </p>
            <ol className="rp-steps">
              <li className="rp-step">
                <span className="rp-step-num">1</span>
                <span className="rp-step-text">
                  <strong>Create your account</strong>
                  Username and password — that's all we need.
                </span>
              </li>
              <li className="rp-step">
                <span className="rp-step-num">2</span>
                <span className="rp-step-text">
                  <strong>Get your secure token</strong>
                  A signed JWT is issued on every login.
                </span>
              </li>
              <li className="rp-step">
                <span className="rp-step-num">3</span>
                <span className="rp-step-text">
                  <strong>Access any connected app</strong>
                  One login routes you everywhere automatically.
                </span>
              </li>
            </ol>
          </div>
        </div>

        <div className="rp-divider" aria-hidden="true" />

        <div className="rp-right">
          <div className="rp-card" role="region" aria-labelledby="rp-heading">
            <div className="rp-card-brand" aria-hidden="true">⬡</div>
            <h1 id="rp-heading" className="rp-heading">Create account</h1>
            <p className="rp-subheading">Join and get access to all your apps</p>

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="rp-field">
                <label htmlFor="reg-username" className="rp-label">Username</label>
                <input
                  id="reg-username"
                  className="rp-input"
                  placeholder="cool_username"
                  autoComplete="username"
                  {...register('username')}
                  aria-invalid={errors.username ? 'true' : 'false'}
                />
              </div>

              {/* Password Controller */}
              <div className="rp-field">
                <label htmlFor="reg-password" className="rp-label">Password</label>
                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <PasswordInput
                      id="reg-password"
                      placeholder="min. 8 characters"
                      autoComplete="new-password"
                      value={field.value || ''}
                      onChange={field.onChange}
                      aria-invalid={errors.password ? 'true' : 'false'}
                    />
                  )}
                />
              </div>

              {/* Confirm Password Controller */}
              <div className="rp-field">
                <label htmlFor="reg-confirm" className="rp-label">Confirm Password</label>
                <Controller
                  name="confirmPassword"
                  control={control}
                  render={({ field }) => (
                    <PasswordInput
                      id="reg-confirm"
                      placeholder="••••••••"
                      autoComplete="new-password"
                      value={field.value || ''}
                      onChange={field.onChange}
                      aria-invalid={errors.confirmPassword ? 'true' : 'false'}
                    />
                  )}
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
                <div className={`rp-status rp-status-${statusVariant}`} role="alert" aria-live="assertive">
                  {statusMessage}
                </div>
              )}

              <div className="rp-actions">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`rp-button ${isSubmitting ? 'is-loading' : ''}`}
                >
                  <span className="rp-button-text">Create account</span>
                  <span className="rp-spinner" aria-hidden="true" />
                </button>
              </div>
            </form>

            <p className="rp-back">
              Already have an account?{' '}
              <Link to="/login" className="rp-link">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;