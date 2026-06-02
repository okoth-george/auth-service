import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DJANGO_URL = import.meta.env.VITE_DJANGO_URL || 'http://localhost:8000';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const displayName = useMemo(() => {
    if (!user) return 'Guest';
    return typeof user === 'string' ? user : user.username || user.name || 'User';
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleContinueToApp = () => {
    // Get the accessToken from localStorage
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      alert('Session expired. Please login again.');
      navigate('/login');
      return;
    }
    
    // Redirect to Django with token as query parameter
    // Django's ExpressJWTAuthentication backend will handle token validation
    // and set the user session, then clean up the URL
    window.location.href = `${DJANGO_URL}/auth/callback/?token=${encodeURIComponent(accessToken)}`;
  };

  return (
    <div style={{ maxWidth: '520px', margin: '50px auto' }}>
      <h2>Welcome, {displayName}!</h2>
      <p>You are authenticated with the Express Auth API.</p>
      <p style={{ fontSize: '0.9em', color: '#666' }}>
        The token below will be sent to Django to establish your session there.
      </p>

      <button
        onClick={handleContinueToApp}
        style={{ marginTop: '20px', width: '100%' }}
      >
        Continue to Main Django App
      </button>

      <button
        onClick={handleLogout}
        style={{ marginTop: '12px', width: '100%', background: '#c0392b', color: '#fff' }}
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
