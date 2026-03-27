import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { authService, getStoredUser, saveStoredUser } from '../services/api';
import './Auth.css';

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (getStoredUser()) {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  const handleChange = (event) => {
    setFormData((currentValue) => ({
      ...currentValue,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      const response = await authService.login(formData);
      saveStoredUser(response.data);
      sessionStorage.removeItem('careManagerLoginNoticeShown');
      navigate(location.state?.from || '/dashboard', { replace: true });
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <section className="auth-panel auth-panel-copy">
        <div>
          <p className="auth-eyebrow">Assignment Project</p>
          <h1>Login to review patients, alerts, and health history.</h1>
          <p className="auth-copy">
            The system uses JWT authentication, protected routes, and role-based access for care
            managers, parents, and children.
          </p>
        </div>
      </section>

      <section className="auth-panel auth-panel-form">
        <div className="auth-card">
          <h2>Login</h2>
          <p className="auth-subtitle">Enter your email and password to continue.</p>

          {errorMessage && <div className="status-banner status-error">{errorMessage}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>
            <label>
              Email
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="manager@example.com"
                required
              />
            </label>

            <label>
              Password
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
            </label>

            <button type="submit" className="primary-button" disabled={isSubmitting}>
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="auth-footer">
            Need an account? <Link to="/register">Create one</Link>
          </p>
        </div>
      </section>
    </div>
  );
}

export default Login;
