import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/auth';

const ProfessionalRegister = () => {
  const [form, setForm] = useState({ 
    username: '', 
    email: '', 
    password: '', 
    first_name: '', 
    last_name: '', 
    role: 'PARTICIPANT' 
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const roleOptions = [
    { value: 'PARTICIPANT', label: 'Participant', icon: '🎯' },
    { value: 'JUDGE', label: 'Judge', icon: '⚖️' },
    { value: 'COMMITTEE', label: 'Committee', icon: '📋' },
    { value: 'ADMIN', label: 'Administrator', icon: '👑' }
  ];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await register(form);
      setSuccess('Account created successfully! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      if (err.response && err.response.data) {
        const messages = Object.entries(err.response.data)
          .map(([field, msg]) => `${field}: ${Array.isArray(msg) ? msg.join(', ') : msg}`)
          .join(' | ');
        setError(messages);
      } else {
        setError('Registration failed. Please check your details and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    authPage: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f8fafc 0%, #ecfdf5 100%)',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden'
    },
    authContainer: {
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(20px)',
      borderRadius: '32px',
      boxShadow: '0 40px 80px rgba(0, 0, 0, 0.12)',
      border: '1px solid rgba(255, 255, 255, 0.8)',
      overflow: 'hidden',
      width: '100%',
      maxWidth: '500px',
      padding: '40px',
      zIndex: 2
    },
    authHeader: {
      textAlign: 'center',
      marginBottom: '32px'
    },
    authLogo: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px',
      marginBottom: '16px'
    },
    logoIcon: {
      fontSize: '36px',
      background: 'linear-gradient(135deg, #34d399 0%, #10b981 100%)',
      backgroundClip: 'text',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      filter: 'drop-shadow(0 4px 8px rgba(52, 211, 153, 0.2))'
    },
    logoText: {
      fontSize: '28px',
      fontWeight: '900',
      background: 'linear-gradient(135deg, #1e293b 0%, #475569 100%)',
      backgroundClip: 'text',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      letterSpacing: '-1px'
    },
    authTitle: {
      fontSize: '32px',
      fontWeight: '800',
      color: '#1e293b',
      marginBottom: '12px',
      letterSpacing: '-0.5px'
    },
    authSubtitle: {
      color: '#64748b',
      fontSize: '16px',
      lineHeight: '1.5'
    },
    formGroup: {
      marginBottom: '20px',
      position: 'relative'
    },
    formLabel: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '8px',
      fontWeight: '600',
      color: '#374151',
      fontSize: '14px',
      transition: 'color 0.2s ease'
    },
    labelIcon: {
      fontSize: '16px',
      opacity: 0.8
    },
    inputContainer: {
      position: 'relative'
    },
    formControl: {
      width: '100%',
      padding: '16px 20px',
      borderRadius: '16px',
      border: '2px solid #e5e7eb',
      background: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(10px)',
      fontSize: '16px',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      fontFamily: 'inherit',
      outline: 'none'
    },
    passwordToggle: {
      position: 'absolute',
      right: '16px',
      top: '50%',
      transform: 'translateY(-50%)',
      background: 'none',
      border: 'none',
      color: '#64748b',
      cursor: 'pointer',
      fontSize: '18px',
      padding: '4px',
      borderRadius: '6px',
      transition: 'all 0.2s ease'
    },
    roleSelector: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '16px',
      marginTop: '12px'
    },
    roleOption: {
      display: 'block',
      cursor: 'pointer',
      position: 'relative'
    },
    roleInput: {
      position: 'absolute',
      opacity: 0,
      pointerEvents: 'none'
    },
    roleContent: {
      background: '#f8fafc',
      border: '2px solid #e5e7eb',
      borderRadius: '16px',
      padding: '20px',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      position: 'relative',
      overflow: 'hidden'
    },
    roleContentSelected: {
      borderColor: '#34d399',
      background: 'rgba(52, 211, 153, 0.05)',
      boxShadow: '0 0 0 4px rgba(52, 211, 153, 0.1)',
      transform: 'translateY(-2px)'
    },
    roleHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '8px'
    },
    roleIcon: {
      fontSize: '24px',
      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
    },
    roleName: {
      fontWeight: '700',
      color: '#1e293b',
      fontSize: '16px'
    },
    roleDesc: {
      fontSize: '13px',
      color: '#64748b',
      lineHeight: '1.4',
      marginBottom: '12px'
    },
    navigationButtons: {
      display: 'flex',
      gap: '12px',
      marginTop: '24px'
    },
    btn: {
      padding: '16px 24px',
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: '600',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px'
    },
    btnPrimary: {
      background: 'linear-gradient(135deg, #34d399 0%, #10b981 100%)',
      color: 'white',
      boxShadow: '0 8px 24px rgba(52, 211, 153, 0.3)',
      flex: 1
    },
    btnSecondary: {
      background: '#f8fafc',
      color: '#64748b',
      border: '1px solid #e5e7eb',
      flex: 1
    },
    spinner: {
      width: '20px',
      height: '20px',
      border: '2px solid rgba(255, 255, 255, 0.3)',
      borderTop: '2px solid white',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    },
    authFooter: {
      textAlign: 'center'
    },
    footerText: {
      color: '#64748b',
      fontSize: '14px'
    },
    authLink: {
      color: '#34d399',
      textDecoration: 'none',
      fontWeight: '600',
      transition: 'all 0.2s ease'
    }
  };

  return (
    <>
      <div style={styles.authPage}>
        <div style={styles.authContainer}>
          <div style={styles.authHeader}>
            <div style={styles.authLogo}>
              <span style={styles.logoIcon}>🏆</span>
              <span style={styles.logoText}>JudgeFlow</span>
            </div>
            <h1 style={styles.authTitle}>Create Account</h1>
            <p style={styles.authSubtitle}>
              Join thousands of professionals managing competitions worldwide
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {error && (
              <div style={{color: '#dc2626', marginBottom: 16, fontWeight: 600}}>
                {error}
              </div>
            )}
            {success && (
              <div style={{color: '#065f46', marginBottom: 16, fontWeight: 600}}>
                {success}
              </div>
            )}
            <div style={styles.formGroup}>
              <label htmlFor="first_name" style={styles.formLabel}>
                <span style={styles.labelIcon}>👤</span>
                First Name
              </label>
              <input
                id="first_name"
                type="text"
                name="first_name"
                style={styles.formControl}
                value={form.first_name}
                onChange={handleChange}
                placeholder="Enter first name"
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label htmlFor="last_name" style={styles.formLabel}>
                <span style={styles.labelIcon}>👤</span>
                Last Name
              </label>
              <input
                id="last_name"
                type="text"
                name="last_name"
                style={styles.formControl}
                value={form.last_name}
                onChange={handleChange}
                placeholder="Enter last name"
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label htmlFor="email" style={styles.formLabel}>
                <span style={styles.labelIcon}>✉️</span>
                Email Address
              </label>
              <input
                id="email"
                type="email"
                name="email"
                style={styles.formControl}
                value={form.email}
                onChange={handleChange}
                placeholder="your@email.com"
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label htmlFor="username" style={styles.formLabel}>
                <span style={styles.labelIcon}>👤</span>
                Username
              </label>
              <input
                id="username"
                type="text"
                name="username"
                style={styles.formControl}
                value={form.username}
                onChange={handleChange}
                placeholder="Choose a unique username"
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label htmlFor="password" style={styles.formLabel}>
                <span style={styles.labelIcon}>🔒</span>
                Password
              </label>
              <div style={styles.inputContainer}>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  style={styles.formControl}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Create a strong password"
                  required
                />
                <button
                  type="button"
                  style={styles.passwordToggle}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>
                <span style={styles.labelIcon}>🎭</span>
                Choose Your Role
              </label>
              <div style={styles.roleSelector}>
                {roleOptions.map((role) => (
                  <label key={role.value} style={styles.roleOption}>
                    <input
                      type="radio"
                      name="role"
                      value={role.value}
                      checked={form.role === role.value}
                      onChange={handleChange}
                      style={styles.roleInput}
                    />
                    <div style={{
                      ...styles.roleContent,
                      ...(form.role === role.value ? styles.roleContentSelected : {})
                    }}>
                      <div style={styles.roleHeader}>
                        <span style={styles.roleIcon}>{role.icon}</span>
                        <span style={styles.roleName}>{role.label}</span>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
            <button type="submit" style={{...styles.btn, ...styles.btnPrimary, width: '100%', marginTop: 16}} disabled={loading}>
              {loading ? (
                <>
                  <div style={styles.spinner}></div>
                  Creating...
                </>
              ) : (
                <>
                  <span>🚀</span>
                  Create Account
                </>
              )}
            </button>
          </form>
          <div style={styles.authFooter}>
            <p style={styles.footerText}>
              Already have an account?{' '}
              <Link to="/login" style={styles.authLink}>
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfessionalRegister;