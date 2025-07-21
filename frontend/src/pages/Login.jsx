import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/auth';
import { AuthContext } from '../contexts/AuthContext';

const ProfessionalLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
      setError('Invalid credentials. Please check your username and password.');
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
    
    authBackground: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 0
    },
    
    backgroundPattern: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundImage: `
        linear-gradient(rgba(52, 211, 153, 0.05) 1px, transparent 1px),
        linear-gradient(90deg, rgba(52, 211, 153, 0.05) 1px, transparent 1px)
      `,
      backgroundSize: '50px 50px',
      animation: 'backgroundFloat 20s ease-in-out infinite'
    },
    
    floatingShapes: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      overflow: 'hidden',
      zIndex: 1
    },
    
    authContainer: {
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(20px)',
      borderRadius: '32px',
      boxShadow: '0 40px 80px rgba(0, 0, 0, 0.12)',
      border: '1px solid rgba(255, 255, 255, 0.8)',
      overflow: 'hidden',
      width: '100%',
      maxWidth: '1100px',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      minHeight: '700px',
      position: 'relative',
      zIndex: 2,
      animation: 'slideInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
    },
    
    authContent: {
      padding: '60px 50px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    },
    
    authHeader: {
      textAlign: 'center',
      marginBottom: '40px'
    },
    
    authLogo: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px',
      marginBottom: '32px'
    },
    
    logoIcon: {
      fontSize: '36px',
      background: 'linear-gradient(135deg, #34d399 0%, #10b981 100%)',
      backgroundClip: 'text',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      filter: 'drop-shadow(0 4px 8px rgba(52, 211, 153, 0.2))',
      animation: 'gentle-bounce 3s ease-in-out infinite'
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
    
    authForm: {
      marginBottom: '32px'
    },
    
    formGroup: {
      marginBottom: '24px',
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
    
    formControlFocused: {
      borderColor: '#34d399',
      background: 'rgba(255, 255, 255, 0.95)',
      boxShadow: '0 0 0 4px rgba(52, 211, 153, 0.1)',
      transform: 'translateY(-2px)'
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
    
    btn: {
      width: '100%',
      padding: '18px 24px',
      borderRadius: '16px',
      fontSize: '16px',
      fontWeight: '600',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
      position: 'relative',
      overflow: 'hidden'
    },
    
    btnPrimary: {
      background: 'linear-gradient(135deg, #34d399 0%, #10b981 100%)',
      color: 'white',
      boxShadow: '0 8px 24px rgba(52, 211, 153, 0.3)',
      marginTop: '8px'
    },
    
    btnLoading: {
      opacity: 0.8,
      cursor: 'not-allowed'
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
      fontSize: '14px',
      marginBottom: '16px'
    },
    
    authLink: {
      color: '#34d399',
      textDecoration: 'none',
      fontWeight: '600',
      transition: 'all 0.2s ease',
      position: 'relative'
    },
    
    socialLogin: {
      marginTop: '24px',
      paddingTop: '24px',
      borderTop: '1px solid #e5e7eb'
    },
    
    socialTitle: {
      textAlign: 'center',
      color: '#64748b',
      fontSize: '14px',
      marginBottom: '16px'
    },
    
    socialButtons: {
      display: 'flex',
      gap: '12px'
    },
    
    socialBtn: {
      flex: 1,
      padding: '12px',
      borderRadius: '12px',
      border: '1px solid #e5e7eb',
      background: 'white',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '14px',
      fontWeight: '500'
    },
    
    authVisual: {
      background: 'linear-gradient(135deg, #34d399 0%, #10b981 100%)',
      color: 'white',
      padding: '60px 40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden'
    },
    
    visualPattern: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E") repeat',
      animation: 'patternMove 25s linear infinite'
    },
    
    visualContent: {
      textAlign: 'center',
      zIndex: 2,
      position: 'relative'
    },
    
    visualIcon: {
      fontSize: '80px',
      marginBottom: '32px',
      display: 'block',
      animation: 'float 4s ease-in-out infinite',
      filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.2))'
    },
    
    visualTitle: {
      fontSize: '32px',
      fontWeight: '800',
      marginBottom: '16px',
      letterSpacing: '-0.5px'
    },
    
    visualDescription: {
      fontSize: '18px',
      opacity: 0.9,
      lineHeight: '1.6',
      marginBottom: '40px',
      maxWidth: '350px'
    },
    
    visualFeatures: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: '16px'
    },
    
    featureItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      fontSize: '16px',
      fontWeight: '500'
    },
    
    featureIcon: {
      fontSize: '20px'
    },
    
    alert: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '16px 20px',
      borderRadius: '12px',
      marginBottom: '24px',
      fontSize: '14px',
      fontWeight: '500'
    },
    
    alertDanger: {
      background: 'rgba(239, 68, 68, 0.1)',
      color: '#dc2626',
      border: '1px solid rgba(239, 68, 68, 0.2)'
    },
    
    alertIcon: {
      fontSize: '18px'
    }
  };

  const keyframes = `
    @keyframes backgroundFloat {
      0%, 100% { transform: translate(0, 0); }
      50% { transform: translate(25px, 25px); }
    }
    
    @keyframes slideInUp {
      from {
        opacity: 0;
        transform: translateY(60px) scale(0.95);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }
    
    @keyframes gentle-bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-8px); }
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    @keyframes patternMove {
      0% { transform: translate(0, 0); }
      100% { transform: translate(60px, 60px); }
    }
    
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-15px); }
    }
  `;

  return (
    <>
      <style>{keyframes}</style>
      
      <div style={styles.authPage}>
        <div style={styles.authBackground}>
          <div style={styles.backgroundPattern}></div>
          <div style={styles.floatingShapes}>
            <div style={{
              position: 'absolute',
              top: '15%',
              left: '8%',
              width: '120px',
              height: '120px',
              background: 'linear-gradient(135deg, rgba(52, 211, 153, 0.1), rgba(16, 185, 129, 0.1))',
              borderRadius: '50%',
              animation: 'float 8s ease-in-out infinite'
            }}></div>
            <div style={{
              position: 'absolute',
              bottom: '20%',
              right: '15%',
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(37, 99, 235, 0.1))',
              borderRadius: '50%',
              animation: 'float 6s ease-in-out infinite 2s'
            }}></div>
          </div>
        </div>
        
        <div style={styles.authContainer}>
          <div style={styles.authContent}>
            <div style={styles.authHeader}>
              <div style={styles.authLogo}>
                <span style={styles.logoIcon}>🏆</span>
                <span style={styles.logoText}>JudgeFlow</span>
              </div>
              <h1 style={styles.authTitle}>Welcome Back</h1>
              <p style={styles.authSubtitle}>
                Sign in to your account to access your dashboard and continue managing competitions
              </p>
            </div>

            <form style={styles.authForm} onSubmit={handleSubmit}>
              {error && (
                <div style={{...styles.alert, ...styles.alertDanger}}>
                  <span style={styles.alertIcon}>⚠️</span>
                  {error}
                </div>
              )}

              <div style={styles.formGroup}>
                <label 
                  htmlFor="username" 
                  style={{
                    ...styles.formLabel,
                    color: focusedField === 'username' ? '#34d399' : '#374151'
                  }}
                >
                  <span style={styles.labelIcon}>👤</span>
                  Username
                </label>
                <div style={styles.inputContainer}>
                  <input
                    id="username"
                    type="text"
                    style={{
                      ...styles.formControl,
                      ...(focusedField === 'username' ? styles.formControlFocused : {})
                    }}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onFocus={() => setFocusedField('username')}
                    onBlur={() => setFocusedField('')}
                    required
                    autoFocus
                    placeholder="Enter your username"
                  />
                </div>
              </div>

              <div style={styles.formGroup}>
                <label 
                  htmlFor="password" 
                  style={{
                    ...styles.formLabel,
                    color: focusedField === 'password' ? '#34d399' : '#374151'
                  }}
                >
                  <span style={styles.labelIcon}>🔒</span>
                  Password
                </label>
                <div style={styles.inputContainer}>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    style={{
                      ...styles.formControl,
                      ...(focusedField === 'password' ? styles.formControlFocused : {}),
                      paddingRight: '60px'
                    }}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField('')}
                    required
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    style={{
                      ...styles.passwordToggle,
                      color: showPassword ? '#34d399' : '#64748b'
                    }}
                    onClick={() => setShowPassword(!showPassword)}
                    onMouseEnter={(e) => {
                      e.target.style.background = '#f3f4f6';
                      e.target.style.color = '#34d399';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'none';
                      e.target.style.color = showPassword ? '#34d399' : '#64748b';
                    }}
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>

              <button 
                type="submit" 
                style={{
                  ...styles.btn,
                  ...styles.btnPrimary,
                  ...(loading ? styles.btnLoading : {})
                }}
                disabled={loading}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.target.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 12px 32px rgba(52, 211, 153, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.target.style.background = 'linear-gradient(135deg, #34d399 0%, #10b981 100%)';
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 8px 24px rgba(52, 211, 153, 0.3)';
                  }
                }}
              >
                {loading ? (
                  <>
                    <div style={styles.spinner}></div>
                    Signing in...
                  </>
                ) : (
                  <>
                    <span style={{ fontSize: '18px' }}>🚀</span>
                    Sign In
                  </>
                )}
              </button>
            </form>

            <div style={styles.authFooter}>
              <p style={styles.footerText}>
                Don't have an account?{' '}
                <Link 
                  to="/register" 
                  style={styles.authLink}
                  onMouseEnter={(e) => {
                    e.target.style.color = '#10b981';
                    e.target.style.textDecoration = 'underline';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = '#34d399';
                    e.target.style.textDecoration = 'none';
                  }}
                >
                  Create account
                </Link>
              </p>
              
              <div style={styles.socialLogin}>
                <p style={styles.socialTitle}>Or continue with</p>
                <div style={styles.socialButtons}>
                  <button 
                    style={styles.socialBtn}
                    onMouseEnter={(e) => {
                      e.target.style.background = '#f8fafc';
                      e.target.style.borderColor = '#34d399';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'white';
                      e.target.style.borderColor = '#e5e7eb';
                    }}
                  >
                    🌐 Google
                  </button>
                  <button 
                    style={styles.socialBtn}
                    onMouseEnter={(e) => {
                      e.target.style.background = '#f8fafc';
                      e.target.style.borderColor = '#34d399';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'white';
                      e.target.style.borderColor = '#e5e7eb';
                    }}
                  >
                    💼 Microsoft
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div style={styles.authVisual}>
            <div style={styles.visualPattern}></div>
            <div style={styles.visualContent}>
              <div style={styles.visualIcon}>🎯</div>
              <h3 style={styles.visualTitle}>Professional Platform</h3>
              <p style={styles.visualDescription}>
                Access your personalized dashboard with advanced analytics, real-time collaboration, and enterprise-grade security.
              </p>
              <div style={styles.visualFeatures}>
                <div style={styles.featureItem}>
                  <span style={styles.featureIcon}>⚡</span>
                  <span>Lightning Fast Performance</span>
                </div>
                <div style={styles.featureItem}>
                  <span style={styles.featureIcon}>🔐</span>
                  <span>Bank-Level Security</span>
                </div>
                <div style={styles.featureItem}>
                  <span style={styles.featureIcon}>📊</span>
                  <span>Advanced Analytics</span>
                </div>
                <div style={styles.featureItem}>
                  <span style={styles.featureIcon}>🌐</span>
                  <span>Global Collaboration</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfessionalLogin;