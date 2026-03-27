import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService, getStoredUser, saveStoredUser } from '../services/api';
import './Auth.css';

const roleOptions = [
  { value: 'parent', label: 'Parent' },
  { value: 'child', label: 'Child' },
];

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'parent',
    patientAccessCode: '',
  });
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
      const response = await authService.register(formData);
      saveStoredUser(response.data);
      navigate('/dashboard', { replace: true });
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <section className="auth-panel auth-panel-copy">
        <div>
          <p className="auth-eyebrow">Secure Access</p>
          <h1>Register as a parent or child using a patient access code.</h1>
          <p className="auth-copy">
            Care managers create patients and share access codes. Parent and child accounts must use
            that patient access code to register.
          </p>
        </div>
      </section>

      <section className="auth-panel auth-panel-form">
        <div className="auth-card">
          <h2>Register</h2>
          <p className="auth-subtitle">Create an account and sign in automatically.</p>

          {errorMessage && <div className="status-banner status-error">{errorMessage}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>
            <label>
              Full Name
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Riya Sharma"
                required
              />
            </label>

            <label>
              Email
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="riya@example.com"
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
                placeholder="Minimum 6 characters"
                minLength="6"
                required
              />
            </label>

            <label>
              Role
              <select name="role" value={formData.role} onChange={handleChange}>
                {roleOptions.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
            </label>

            {formData.role !== 'careManager' && (
              <label>
                Patient Access Code
                <input
                  type="text"
                  name="patientAccessCode"
                  value={formData.patientAccessCode}
                  onChange={handleChange}
                  placeholder="Example: EHM-A1B2C3"
                  required
                />
              </label>
            )}

            {formData.role === 'parent' && (
              <p className="auth-note">
                Only one parent account can be created for each patient access code.
              </p>
            )}

            <button type="submit" className="primary-button" disabled={isSubmitting}>
              {isSubmitting ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="auth-footer">
            Already registered? <Link to="/login">Login here</Link>
          </p>
        </div>
      </section>
    </div>
  );
}

export default Register;
