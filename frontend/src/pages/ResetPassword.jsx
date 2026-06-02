import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const initialToken = params.get('token') || '';

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      token: initialToken,
      newPassword: '',
      confirmPassword: ''
    }
  });

  const newPasswordValue = watch('newPassword');

  useEffect(() => {
    if (initialToken) {
      setValue('token', initialToken);
    }
  }, [initialToken, setValue]);

  const onSubmit = async (data) => {
    try {
      await api.post('/users/resetPassword', {
        token: data.token,
        newPassword: data.newPassword,
      });
      alert('Password reset successfully. Please login with your new password.');
      navigate('/login');
    } catch (error) {
      alert(error.response?.data?.error || 'Password reset failed.');
    }
  };

  return (
    <div style={{ maxWidth: '420px', margin: '50px auto' }}>
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Reset Token</label>
          <input
            {...register('token', { required: 'Reset token is required' })}
            placeholder="Paste your reset token here"
          />
          {errors.token && <p style={{ color: 'red' }}>{errors.token.message}</p>}
        </div>

        <div style={{ marginTop: '12px' }}>
          <label>New Password</label>
          <input
            type="password"
            {...register('newPassword', {
              required: 'New password is required',
              minLength: { value: 6, message: 'Password must be at least 6 characters' }
            })}
          />
          {errors.newPassword && <p style={{ color: 'red' }}>{errors.newPassword.message}</p>}
        </div>

        <div style={{ marginTop: '12px' }}>
          <label>Confirm New Password</label>
          <input
            type="password"
            {...register('confirmPassword', {
              required: 'Please confirm your password',
              validate: (value) => value === newPasswordValue || 'Passwords must match'
            })}
          />
          {errors.confirmPassword && <p style={{ color: 'red' }}>{errors.confirmPassword.message}</p>}
        </div>

        <button type="submit" disabled={isSubmitting} style={{ marginTop: '20px' }}>
          {isSubmitting ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>

      <p style={{ marginTop: '24px' }}>
        Back to <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default ResetPassword;
