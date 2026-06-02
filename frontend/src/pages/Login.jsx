import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '../schemas/authSchema';
import api from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      const response = await api.post('/users/login', data);
      
      // Save tokens and user to localStorage (for future API calls)
      login(response.data);
      
      // Get Django URL from env or default to localhost:8000
      const DJANGO_URL = import.meta.env.VITE_DJANGO_URL || 'http://localhost:8000';
      const accessToken = response.data.accessToken;
      
      // Redirect to Django callback with token
      // Django's ExpressJWTAuthentication backend will:
      // 1. Read the token from URL query param
      // 2. Authenticate the user from token
      // 3. Store user in Django session
      // 4. Remove token from URL (clean redirect)
      window.location.href = `${DJANGO_URL}/auth/callback/?token=${encodeURIComponent(accessToken)}`;
    } catch (error) {
      alert(error.response?.data?.error || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div style={{ maxWidth: '420px', margin: '50px auto' }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Username</label>
          <input {...register('username')} />
          {errors.username && <p style={{ color: 'red' }}>{errors.username.message}</p>}
        </div>

        <div style={{ marginTop: '12px' }}>
          <label>Password</label>
          <input type="password" {...register('password')} />
          {errors.password && <p style={{ color: 'red' }}>{errors.password.message}</p>}
        </div>

        <button type="submit" disabled={isSubmitting} style={{ marginTop: '20px' }}>
          {isSubmitting ? 'Signing in...' : 'Login'}
        </button>
      </form>

      <div style={{ marginTop: '20px' }}>
        <Link to="/forgot-password">Forgot password?</Link>
      </div>
      <p style={{ marginTop: '12px' }}>
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
};

export default Login;
