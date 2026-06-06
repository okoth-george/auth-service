import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '../schemas/authSchema';
import api from '../api/axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
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
      // 1. POST credentials to your Node Auth API (/users/login maps to your controller)
      const response = await api.post('/users/login', data);
      
      // 2. Extract the secure, short-lived authorization code from the response
      const { code } = response.data;
      
      if (code) {
        // 🚀 Pass the code to AuthContext, which instantly triggers the 
        // server-to-server exchange callback redirect to Django!
        login({ code });
      } else {
        alert('Authentication failed: Security server did not return a verification code.');
      }
      
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