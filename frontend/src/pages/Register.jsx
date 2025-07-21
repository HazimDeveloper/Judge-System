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
  const [focusedField, setFocusedField] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();

  const roleOptions = [
    { 
      value: 'PARTICIPANT', 
      label: 'Participant', 
      icon: '🎯', 
      description: 'Submit and track your competition entries',
      features: ['Project Submission', 'Real-time Feedback', 'Progress Tracking']
    },
    { 
      value: 'JUDGE', 
      label: 'Judge', 
      icon: '⚖️', 
      description: 'Evaluate submissions with advanced tools',
      features: ['Scoring Interface', 'Detailed Analytics', 'Collaboration Tools']
    },
    { 
      value: 'COMMITTEE', 
      label: 'Committee', 
      icon: '📋', 
      description: 'Monitor and oversee competition progress',
      features: ['Competition Oversight', 'Reports & Analytics', 'Process Management']
    },
    { 
      value: 'ADMIN', 
      label: 'Administrator', 
      icon: '👑', 
      description: 'Full system access and management',
      features: ['User Management', 'System Configuration', 'Advanced Analytics']
    }
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
      setError('Registration failed. Please check your details and try again.');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
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
      backgroundSize: '40px 40px',
      animation: 'backgroundFloat 25s ease-in-out infinite'
    },
    
    authContainer: {
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(20px)',
      borderRadius: '32px',
      boxShadow: '0 40px 80px rgba(0, 0, 0, 0.12)',
      border: '1px solid rgba(255, 255, 255, 0.8)',
      overflow: 'hidden',
      width: '100%',
      maxWidth: '1200px',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      minHeight: '800px',
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
      marginBottom: '24px'
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
    
    stepIndicator: {
      display: 'flex',
      justifyContent: 'center',
      gap: '12px',
      marginBottom: '32px'
    },
    
    stepDot: {
      width: '12px',
      height: '12px',
      borderRadius: '50%',
      background: '#e5e7eb',
      transition: 'all 0.3s ease'
    },
    
    stepDotActive: {
      background: 'linear-gradient(135deg, #34d399 0%, #10b981 100%)',
      transform: 'scale(1.2)'
    },
    
    authForm: {
      marginBottom: '24px'
    },
    
    formRow: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '16px',
      marginBottom: '24px'
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
    
    roleFeatures: {
      display: 'flex',
      flexDirection: 'column',
      gap: '4px'
    },
    
    roleFeature: {
      fontSize: '11px',
      color: '#34d399',
      fontWeight: '500',
      display: 'flex',
      alignItems: 'center',
      gap: '6px'
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
      marginBottom: '32px',
      maxWidth: '350px'
    },
    
    visualStats: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '24px'
    },
    
    statItem: {
      textAlign: 'center'
    },
    
    statNumber: {
      display: 'block',
      fontSize: '24px',
      fontWeight: '800',
      marginBottom: '4px'
    },
    
    statLabel: {
      fontSize: '12px',
      opacity: 0.8,
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
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
    
    alertSuccess: {
      background: 'rgba(16, 185, 129, 0.1)',
      color: '#065f46',
      border: '1px solid rgba(16, 185, 129, 0.2)'
    },
    
    alertDanger: {
      background: 'rgba(239, 68, 68, 0.1)',
      color: '#dc2626',
      border: '1px solid rgba(239, 68, 68, 0.2)'
    }
  };

  const keyframes = `
    @keyframes backgroundFloat {
      0%, 100% { transform: translate(0, 0); }
      50% { transform: translate(20px, 20px); }
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

  const renderStep1 = () => (
    <>
      <div style={styles.formRow}>
        <div style={styles.formGroup}>
          <label 
            htmlFor="first_name" 
            style={{
              ...styles.formLabel,
              color: focusedField === 'first_name' ? '#34d399' : '#374151'
            }}
          >
            <span style={styles.labelIcon}>👨</span>
            First Name
          </label>
          <input
            id="first_name"
            type="text"
            name="first_name"
            style={{
              ...styles.formControl,
              ...(focusedField === 'first_name' ? styles.formControlFocused : {})
            }}
            value={form.first_name}
            onChange={handleChange}
            onFocus={() => setFocusedField('first_name')}
            onBlur={() => setFocusedField('')}
            placeholder="Enter first name"
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label 
            htmlFor="last_name" 
            style={{
              ...styles.formLabel,
              color: focusedField === 'last_name' ? '#34d399' : '#374151'
            }}
          >
            <span style={styles.labelIcon}>👩</span>
            Last Name
          </label>
          <input
            id="last_name"
            type="text"
            name="last_name"
            style={{
              ...styles.formControl,
              ...(focusedField === 'last_name' ? styles.formControlFocused : {})
            }}
            value={form.last_name}
            onChange={handleChange}
            onFocus={() => setFocusedField('last_name')}
            onBlur={() => setFocusedField('')}
            placeholder="Enter last name"
            required
          />
        </div>
      </div>

      <div style={styles.formGroup}>
        <label 
          htmlFor="email" 
          style={{
            ...styles.formLabel,
            color: focusedField === 'email' ? '#34d399' : '#374151'
          }}
        >
          <span style={styles.labelIcon}>✉️</span>
          Email Address
        </label>
        <input
          id="email"
          type="email"
          name="email"
          style={{
            ...styles.formControl,
            ...(focusedField === 'email' ? styles.formControlFocused : {})
          }}
          value={form.email}
          onChange={handleChange}
          onFocus={() => setFocusedField('email')}
          onBlur={() => setFocusedField('')}
          placeholder="your@email.com"
          required
        />
      </div>
    </>
  );

  const renderStep2 = () => (
    <>
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
        <input
          id="username"
          type="text"
          name="username"
          style={{
            ...styles.formControl,
            ...(focusedField === 'username' ? styles.formControlFocused : {})
          }}
          value={form.username}
          onChange={handleChange}
          onFocus={() => setFocusedField('username')}
          onBlur={() => setFocusedField('')}
          placeholder="Choose a unique username"
          required
        />
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
            name="password"
            style={{
              ...styles.formControl,
              ...(focusedField === 'password' ? styles.formControlFocused : {}),
              paddingRight: '60px'
            }}
            value={form.password}
            onChange={handleChange}
            onFocus={() => setFocusedField('password')}
            onBlur={() => setFocusedField('')}
            placeholder="Create a strong password"
            required
          />
          <button
            type="button"
            style={{
              ...styles.passwordToggle,
              color: showPassword ? '#34d399' : '#64748b'
            }}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? '👁️' : '👁️‍🗨️'}
          </button>
        </div>
      </div>
    </>
  );

  const renderStep3 = () => (
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
              <p style={styles.roleDesc}>{role.description}</p>
              <div style={styles.roleFeatures}>
                {role.features.map((feature, index) => (
                  <div key={index} style={styles.roleFeature}>
                    <span>✓</span>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <>
      <style>{keyframes}</style>
      
      <div style={styles.authPage}>
        <div style={styles.authBackground}>
          <div style={styles.backgroundPattern}></div>
        </div>
        
        <div style={styles.authContainer}>
          <div style={styles.authContent}>
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

            <div style={styles.stepIndicator}>
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  style={{
                    ...styles.stepDot,
                    ...(step <= currentStep ? styles.stepDotActive : {})
                  }}
                ></div>
              ))}
            </div>

            <form style={styles.authForm} onSubmit={handleSubmit}>
              {error && (
                <div style={{...styles.alert, ...styles.alertDanger}}>
                  <span>⚠️</span>
                  {error}
                </div>
              )}

              {success && (
                <div style={{...styles.alert, ...styles.alertSuccess}}>
                  <span>✅</span>
                  {success}
                </div>
              )}

              {currentStep === 1 && renderStep1()}
              {currentStep === 2 && renderStep2()}
              {currentStep === 3 && renderStep3()}

              {currentStep < 3 ? (
                <div style={styles.navigationButtons}>
                  {currentStep > 1 && (
                    <button 
                      type="button"
                      style={styles.btnSecondary}
                      onClick={prevStep}
                    >
                      ← Previous
                    </button>
                  )}
                  <button 
                    type="button"
                    style={styles.btnPrimary}
                    onClick={nextStep}
                  >
                    Next →
                  </button>
                </div>
              ) : (
                <div style={styles.navigationButtons}>
                  <button 
                    type="button"
                    style={styles.btnSecondary}
                    onClick={prevStep}
                  >
                    ← Previous
                  </button>
                  <button 
                    type="submit" 
                    style={styles.btnPrimary}
                    disabled={loading}
                  >
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
                </div>
              )}
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

          <div style={styles.authVisual}>
            <div style={styles.visualPattern}></div>
            <div style={styles.visualContent}>
              <div style={styles.visualIcon}>🌟</div>
              <h3 style={styles.visualTitle}>Join the Future</h3>
              <p style={styles.visualDescription}>
                Experience next-generation competition management with advanced features and enterprise-grade security.
              </p>
              <div style={styles.visualStats}>
                <div style={styles.statItem}>
                  <span style={styles.statNumber}>10K+</span>
                  <span style={styles.statLabel}>Active Users</span>
                </div>
                <div style={styles.statItem}>
                  <span style={styles.statNumber}>500+</span>
                  <span style={styles.statLabel}>Competitions</span>
                </div>
                <div style={styles.statItem}>
                  <span style={styles.statNumber}>99.9%</span>
                  <span style={styles.statLabel}>Uptime</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfessionalRegister;