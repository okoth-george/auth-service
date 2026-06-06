import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const item = localStorage.getItem('authUser');
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  });

  // 🔑 UPGRADED: Receives the secure one-time code from your Express login endpoint
  const login = ({ code }) => {
    if (!code) {
      console.error("Authentication Error: Secure exchange code missing.");
      return;
    }

    // Grab your Django backend callback URL from environment variables
    // In local development, this is typically: http://localhost:8000/auth/callback/
    const djangoCallbackUrl = import.meta.env.VITE_DJANGO_APP_URL || 'http://localhost:8000/auth/callback/';
    
    // 🚀 THE SECURE HANDSHAKE:
    // Instantly bounce the browser over to Django, carrying only the temporary short code.
    // Django will catch this code and swap it with Node privately behind the scenes!
    window.location.href = `${djangoCallbackUrl}?code=${code}`;
  };

  const logout = () => {
    localStorage.removeItem('authUser');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
  };

  useEffect(() => {
    if (!user) {
      localStorage.removeItem('authUser');
    }
  }, [user]);

  const value = useMemo(
    () => ({ user, login, logout, isAuthenticated: Boolean(user) }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
};