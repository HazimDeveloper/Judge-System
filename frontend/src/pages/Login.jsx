import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/auth';
import { AuthContext } from '../contexts/AuthContext';

// Embedded CSS styles
const styles = {
  authPage: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    background: 'linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%)'
  },
  
  authBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1
  },
  
  authGrid: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `
      linear-gradient(rgba(59, 130, 246, 0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(59, 130, 246, 0.05) 1px, transparent 1px)
    `,
    backgroundSize: '40px 40px',
    animation: 'gridFloat 15s ease-in-out infinite'
  },
  
  authContainer: {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    borderRadius: '1.5rem',
    boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    border: '1px solid #e2e8f0',
    overflow: 'hidden',
    width: '100%',
    maxWidth: '900px',
    margin: '1.5rem',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    minHeight: '600px'
  },
  
  authContent: {
    padding: '3rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  
  authHeader: {
    textAlign: 'center',
    marginBottom: '2rem'
  },
  
  authLogo: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.75rem',
    marginBottom: '1.5rem'
  },
  
  logoIcon: {
    fontSize: '2rem',
    background: 'linear-gradient(135deg, #34d399, #059669)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  
  logoText: {
    fontSize: '1.5rem',
    fontWeight: 800,
    background: 'linear-gradient(135deg, #1e293b, #475569)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  
  authTitle: {
    fontSize: '2rem',
    fontWeight: 800,
    color: '#1e293b',
    marginBottom: '0.5rem'
  },
  
  authSubtitle: {
    color: '#475569',
    fontSize: '1rem'
  },
  
  authForm: {
    marginBottom: '1.5rem'
  },
  
  formGroup: {
    marginBottom: '1.5rem'
  },
  
  formLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '0.75rem',
    fontWeight: 600,
    color: '#334155',
    fontSize: '0.875rem'
  },
  
  labelIcon: {
    fontSize: '1rem'
  },
  
  formControl: {
    width: '100%',
    padding: '1rem',
    border: '2px solid #cbd5e1',
    borderRadius: '0.75rem',
    background: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(10px)',
    fontSize: '1rem',
    transition: 'all 0.15s ease-out',
    fontFamily: 'inherit'
  },
  
  formControlFocus: {
    outline: 'none',
    borderColor: '#34d399',
    background: 'rgba(255, 255, 255, 0.95)',
    boxShadow: '0 0 0 4px #dbeafe'
  },
  
  btn: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    padding: '1rem 2rem',
    borderRadius: '0.75rem',
    fontWeight: 600,
    fontSize: '1rem',
    textDecoration: 'none',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.15s ease-out',
    position: 'relative',
    overflow: 'hidden'
  },
  
  btnPrimary: {
    background: 'linear-gradient(135deg, #34d399, #059669)',
    color: 'white',
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    width: '100%'
  },
  
  authSubmit: {
    marginTop: '1rem'
  },
  
  spinner: {
    width: '16px',
    height: '16px',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    borderTop: '2px solid white',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginRight: '0.5rem'
  },
  
  authFooter: {
    textAlign: 'center'
  },
  
  authLinkText: {
    color: '#475569',
    fontSize: '0.875rem'
  },
  
  authLink: {
    color: '#2563eb',
    textDecoration: 'none',
    fontWeight: 600,
    transition: 'all 0.15s ease-out'
  },
  
  authVisual: {
    background: 'linear-gradient(135deg, #34d399, #059669)',
    color: 'white',
    padding: '3rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden'
  },
  
  visualContent: {
    textAlign: 'center',
    zIndex: 1,
    position: 'relative'
  },
  
  visualIcon: {
    fontSize: '4rem',
    marginBottom: '1.5rem',
    display: 'block',
    animation: 'bounce 2s infinite'
  },
  
  visualTitle: {
    fontSize: '2rem',
    fontWeight: 800,
    marginBottom: '1rem'
  },
  
  visualDescription: {
    fontSize: '1.125rem',
    opacity: 0.9,
    lineHeight: 1.6,
    marginBottom: '2rem',
    maxWidth: '300px'
  },
  
  visualFeatures: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  
  featureItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    fontWeight: 500
  },
  
  featureIcon: {
    fontSize: '1.25rem'
  },
  
  alert: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '1rem 1.5rem',
    borderRadius: '0.75rem',
    marginBottom: '1.5rem',
    fontWeight: 500
  },
  
  alertIcon: {
    fontSize: '1.25rem'
  },
  
  alertDanger: {
    background: 'rgba(239, 68, 68, 0.1)',
    color: '#991b1b',
    border: '1px solid rgba(239, 68, 68, 0.3)'
  }
};

// CSS keyframes and additional styles
const cssStyles = `
  @keyframes gridFloat {
    0%, 100% { transform: translate(0, 0); }
    50% { transform: translate(20px, 20px); }
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
    40% { transform: translateY(-10px); }
    60% { transform: translateY(-5px); }
  }
  
  .auth-visual::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E") repeat;
    animation: patternMove 20s linear infinite;
  }
  
  @keyframes patternMove {
    0% { transform: translate(0, 0); }
    100% { transform: translate(60px, 60px); }
  }
  
  .btn-primary:hover {
    background: linear-gradient(135deg, #2563eb, #1d4ed8);
    transform: translateY(-2px);
    box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  }
  
  .auth-link:hover {
    color: #1d4ed8;
    text-decoration: underline;
  }
  
  @media (max-width: 1024px) {
    .auth-container {
      grid-template-columns: 1fr;
      max-width: 500px;
    }
    
    .auth-visual {
      display: none;
    }
  }
  
  @media (max-width: 768px) {
    .auth-content {
      padding: 2rem;
    }
    
    .auth-title {
      font-size: 1.75rem;
    }
    
    .auth-container {
      margin: 1rem;
      border-radius: 1rem;
    }
  }
`;

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState('');
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await login(username, password);
      setUser(await (await import('../services/auth')).getCurrentUser());
      navigate('/dashboard');
    } catch (err) {
      setError('Login failed. Please check your username and password, then try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFocus = (field) => {
    setFocusedField(field);
  };

  const handleBlur = () => {
    setFocusedField('');
  };

  return (
    <>
      <style>{cssStyles}</style>
      
      <div style={styles.authPage}>
        <div style={styles.authBackground}>
          <div style={styles.authGrid}></div>
        </div>
        
        <div style={styles.authContainer}>
          <div style={styles.authContent}>
            <div style={styles.authHeader}>
              <div style={styles.authLogo}>
                <span style={styles.logoIcon}>🏆</span>
                <span style={styles.logoText}>JudgeFlow</span>
              </div>
              <h1 style={styles.authTitle}>Welcome Back</h1>
              <p style={styles.authSubtitle}>Sign in to access your dashboard</p>
            </div>

            <form style={styles.authForm} onSubmit={handleSubmit}>
              {error && (
                <div style={{ ...styles.alert, ...styles.alertDanger }}>
                  <span style={styles.alertIcon}>⚠️</span>
                  {error}
                </div>
              )}

              <div style={styles.formGroup}>
                <label htmlFor="username" style={styles.formLabel}>
                  <span style={styles.labelIcon}>👤</span>
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  style={{
                    ...styles.formControl,
                    ...(focusedField === 'username' ? styles.formControlFocus : {})
                  }}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onFocus={() => handleFocus('username')}
                  onBlur={handleBlur}
                  required
                  autoFocus
                  placeholder="Enter your username"
                />
              </div>

              <div style={styles.formGroup}>
                <label htmlFor="password" style={styles.formLabel}>
                  <span style={styles.labelIcon}>🔒</span>
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  style={{
                    ...styles.formControl,
                    ...(focusedField === 'password' ? styles.formControlFocus : {})
                  }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => handleFocus('password')}
                  onBlur={handleBlur}
                  required
                  placeholder="Enter your password"
                />
              </div>

              <button 
                type="submit" 
                style={{ ...styles.btn, ...styles.btnPrimary, ...styles.authSubmit }}
                className="btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div style={styles.spinner}></div>
                    Signing in...
                  </>
                ) : (
                  <>
                    <span>🚀</span>
                    Sign In
                  </>
                )}
              </button>
            </form>

            <div style={styles.authFooter}>
              <p style={styles.authLinkText}>
                Don't have an account?{' '}
                <Link to="/register" style={styles.authLink} className="auth-link">
                  Create one here
                </Link>
              </p>
            </div>
          </div>

          <div style={styles.authVisual} className="auth-visual">
            <div style={styles.visualContent}>
              <div style={styles.visualIcon}>🎯</div>
              <h3 style={styles.visualTitle}>Streamlined Judging</h3>
              <p style={styles.visualDescription}>
                Access your personalized dashboard with real-time analytics and seamless workflow management.
              </p>
              <div style={styles.visualFeatures}>
                <div style={styles.featureItem}>
                  <span style={styles.featureIcon}>⚡</span>
                  <span>Real-time Updates</span>
                </div>
                <div style={styles.featureItem}>
                  <span style={styles.featureIcon}>🔐</span>
                  <span>Secure Access</span>
                </div>
                <div style={styles.featureItem}>
                  <span style={styles.featureIcon}>📊</span>
                  <span>Advanced Analytics</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;