import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '../schemas/authSchema';
import api from '../api/axios'; // This is the improved axios.js we built
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting } 
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    try {
      // We don't need to send confirmPassword to the backend
      const { confirmPassword: _, ...registerData } = data;
      
      await api.post('/users/register', registerData);
      alert("Registration successful! Redirecting to login...");
      navigate('/login');
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto' }}>
      <h2>Create Account</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Username</label>
          <input {...register('username')} />
          {errors.username && <p style={{color: 'red'}}>{errors.username.message}</p>}
        </div>

        <div style={{ marginTop: '10px' }}>
          <label>Password</label>
          <input type="password" {...register('password')} />
          {errors.password && <p style={{color: 'red'}}>{errors.password.message}</p>}
        </div>

        <div style={{ marginTop: '10px' }}>
          <label>Confirm Password</label>
          <input type="password" {...register('confirmPassword')} />
          {errors.confirmPassword && <p style={{color: 'red'}}>{errors.confirmPassword.message}</p>}
        </div>

        <button type="submit" disabled={isSubmitting} style={{ marginTop: '20px' }}>
          {isSubmitting ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
};

export default Register;