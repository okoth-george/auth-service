import axios from 'axios';

const api = axios.create({
  // Fallback points to port 5000 where your Express service runs in your compose stack
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// =========================================================================
// 🌐 GLOBAL RESPONSE INTERCEPTOR
// =========================================================================
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If the login request fails (e.g., wrong password or locked out)
    if (error.response?.status === 401) {
      console.warn('[FarmFlow Auth] Credentials rejected by Node validation service.');
    }
    
    return Promise.reject(error);
  }
);

export default api;