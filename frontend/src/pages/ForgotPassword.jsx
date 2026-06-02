import { useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../api/axios';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [message, setMessage] = useState('');
  const [token, setToken] = useState('');
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    setMessage('');
    setToken('');
    try {
      const response = await api.post('/users/forgotPassword', data);
      setMessage(response.data.message || 'Reset token generated successfully.');
      setToken(response.data.resetToken || '');
    } catch (error) {
      setMessage(error.response?.data?.error || 'Unable to generate reset token.');
    }
  };

  return (
    <div style={{ maxWidth: '420px', margin: '50px auto' }}>
      <h2>Forgot Password</h2>
      <p>Enter your username to generate a password reset token.</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Username</label>
          <input {...register('username', { required: 'Username is required' })} />
          {errors.username && <p style={{ color: 'red' }}>{errors.username.message}</p>}
        </div>

        <button type="submit" disabled={isSubmitting} style={{ marginTop: '18px' }}>
          {isSubmitting ? 'Sending...' : 'Send Reset Token'}
        </button>
      </form>

      {message && <p style={{ marginTop: '16px' }}>{message}</p>}
      {token && (
        <div style={{ marginTop: '16px' }}>
          <strong>Reset Token:</strong>
          <pre style={{ background: '#222', color: '#fff', padding: '12px', borderRadius: '8px' }}>{token}</pre>
          <p>
            Use this token on the <Link to={`/reset-password?token=${encodeURIComponent(token)}`}>Reset Password</Link> page.
          </p>
        </div>
      )}

      <p style={{ marginTop: '24px' }}>
        Remembered your password? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default ForgotPassword;
