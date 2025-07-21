import React from 'react';
import { Link } from 'react-router-dom';

// CSS-in-JS styles object
const styles = {
  homePage: {
    minHeight: '100vh'
  },
  
  heroSection: {
    position: 'relative',
    minHeight: '90vh',
    display: 'flex',
    alignItems: 'center',
    overflow: 'hidden'
  },
  
  heroBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1
  },
  
  heroGrid: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `
      linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
      linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
    `,
    backgroundSize: '50px 50px',
    animation: 'gridMove 20s linear infinite'
  },
  
  heroContent: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '4rem',
    alignItems: 'center',
    padding: '5rem 0',
    maxWidth: '1200px',
    margin: '0 auto',
    paddingLeft: '1.5rem',
    paddingRight: '1.5rem'
  },
  
  heroText: {
    zIndex: 1
  },
  
  titleMain: {
    display: 'block',
    fontSize: '4rem',
    fontWeight: 900,
    background: 'linear-gradient(135deg, #34d399, #059669)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    lineHeight: 1.1,
    marginBottom: '0.5rem'
  },
  
  titleSub: {
    display: 'block',
    fontSize: '1.5rem',
    fontWeight: 600,
    color: '#475569',
    letterSpacing: '-0.5px'
  },
  
  heroDescription: {
    fontSize: '1.25rem',
    color: '#475569',
    lineHeight: 1.7,
    marginBottom: '2rem',
    maxWidth: '600px'
  },
  
  heroButtons: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '3rem'
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
    transition: 'all 0.25s ease-out',
    position: 'relative',
    overflow: 'hidden'
  },
  
  btnPrimary: {
    background: 'linear-gradient(135deg, #34d399, #059669)',
    color: 'white',
    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)'
  },
  
  btnSecondary: {
    background: '#f1f5f9',
    color: '#334155',
    border: '1px solid #cbd5e1'
  },
  
  heroStats: {
    display: 'flex',
    gap: '2rem'
  },
  
  statItem: {
    textAlign: 'center'
  },
  
  statValue: {
    fontSize: '2rem',
    fontWeight: 800,
    color: '#34d399',
    display: 'block'
  },
  
  statLabel: {
    fontSize: '0.875rem',
    color: '#64748b',
    fontWeight: 500
  },
  
  heroVisual: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  
  dashboardMockup: {
    background: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(20px)',
    borderRadius: '1.5rem',
    boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    border: '1px solid #e2e8f0',
    overflow: 'hidden',
    transform: 'perspective(1000px) rotateY(-15deg) rotateX(5deg)',
    transition: 'all 0.4s ease-out',
    width: '400px',
    height: '300px'
  },
  
  featuresSection: {
    padding: '5rem 0',
    background: 'rgba(255, 255, 255, 0.5)',
    backdropFilter: 'blur(20px)'
  },
  
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1.5rem'
  },
  
  sectionHeader: {
    textAlign: 'center',
    marginBottom: '4rem'
  },
  
  sectionTitle: {
    fontSize: '2.5rem',
    fontWeight: 800,
    color: '#1e293b',
    marginBottom: '1rem'
  },
  
  sectionSubtitle: {
    fontSize: '1.125rem',
    color: '#475569',
    maxWidth: '600px',
    margin: '0 auto',
    lineHeight: 1.6
  },
  
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '2rem'
  },
  
  featureCard: {
    background: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(20px)',
    borderRadius: '1rem',
    padding: '2rem',
    border: '1px solid #e2e8f0',
    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    transition: 'all 0.25s ease-out',
    textAlign: 'center'
  },
  
  featureIcon: {
    fontSize: '3rem',
    marginBottom: '1.5rem',
    display: 'block'
  },
  
  featureTitle: {
    fontSize: '1.25rem',
    fontWeight: 700,
    color: '#1e293b',
    marginBottom: '1rem'
  },
  
  featureDescription: {
    color: '#475569',
    lineHeight: 1.6,
    fontSize: '1rem'
  },
  
  ctaSection: {
    padding: '5rem 0',
    background: 'linear-gradient(135deg, #34d399, #059669)',
    color: 'white',
    textAlign: 'center'
  },
  
  ctaContent: {
    maxWidth: '600px',
    margin: '0 auto'
  },
  
  ctaTitle: {
    fontSize: '2.5rem',
    fontWeight: 800,
    marginBottom: '1.5rem'
  },
  
  ctaDescription: {
    fontSize: '1.125rem',
    marginBottom: '2rem',
    opacity: 0.9,
    lineHeight: 1.6
  },
  
  ctaButtons: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center'
  }
};

// CSS keyframes (you can also put this in a <style> tag)
const cssKeyframes = `
  @keyframes gridMove {
    0% { transform: translate(0, 0); }
    100% { transform: translate(50px, 50px); }
  }
  
  .dashboard-mockup:hover {
    transform: perspective(1000px) rotateY(-10deg) rotateX(2deg) scale(1.05);
  }
  
  .feature-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
  }
  
  .btn:hover {
    transform: translateY(-2px);
  }
  
  .btn-primary:hover {
    background: linear-gradient(135deg, #2563eb, #1d4ed8);
    box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
  }
  
  .btn-secondary:hover {
    background: #e2e8f0;
    transform: translateY(-2px);
  }
`;

const FeatureCard = ({ icon, title, description }) => (
  <div style={styles.featureCard} className="feature-card">
    <div style={styles.featureIcon}>{icon}</div>
    <h3 style={styles.featureTitle}>{title}</h3>
    <p style={styles.featureDescription}>{description}</p>
  </div>
);

const StatItem = ({ value, label }) => (
  <div style={styles.statItem}>
    <div style={styles.statValue}>{value}</div>
    <div style={styles.statLabel}>{label}</div>
  </div>
);

const Home = () => {
  return (
    <>
      {/* Inject CSS keyframes */}
      <style>{cssKeyframes}</style>
      
      <div style={styles.homePage}>
        {/* Hero Section */}
        <section style={styles.heroSection}>
          <div style={styles.heroBackground}>
            <div style={styles.heroGrid}></div>
          </div>
          
          <div style={styles.container}>
            <div style={styles.heroContent}>
              <div style={styles.heroText}>
                <h1 style={{ marginBottom: '1.5rem' }}>
                  <span style={styles.titleMain}>JudgeFlow</span>
                  <span style={styles.titleSub}>Next-Gen Judging Platform</span>
                </h1>
                
                <p style={styles.heroDescription}>
                  Advanced competition management & judging platform with cutting-edge technology. 
                  A system designed for seamless workflow and real-time analytics for all stakeholders.
                </p>
                
                <div style={styles.heroButtons}>
                  <Link 
                    to="/register" 
                    style={{ ...styles.btn, ...styles.btnPrimary }}
                    className="btn-primary"
                  >
                    <span>🚀</span>
                    Get Started
                  </Link>
                  <Link 
                    to="/login" 
                    style={{ ...styles.btn, ...styles.btnSecondary }}
                    className="btn-secondary"
                  >
                    <span>🔐</span>
                    Sign In
                  </Link>
                </div>
                
                <div style={styles.heroStats}>
                  <StatItem value="4" label="User Roles" />
                  <StatItem value="100%" label="Real-time" />
                  <StatItem value="24/7" label="Support" />
                </div>
              </div>
              
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section style={styles.featuresSection}>
          <div style={styles.container}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>Why Choose JudgeFlow?</h2>
              <p style={styles.sectionSubtitle}>
                A platform specifically designed to streamline the judging process with cutting-edge technology
              </p>
            </div>
            
            <div style={styles.featuresGrid}>
              <FeatureCard
                icon="🎯"
                title="Transparent Management"
                description="Real-time dashboard for all roles with secure access control and comprehensive oversight."
              />
              <FeatureCard
                icon="⚡"
                title="Fast Assessment"
                description="Rubric-based scoring system that can be customized for various types of competitions."
              />
              <FeatureCard
                icon="📈"
                title="Real-time Analytics"
                description="Detailed reports and statistics with data visualization for informed decisions."
              />
              <FeatureCard
                icon="🔒"
                title="Secure Platform"
                description="Robust authentication with role-based access control to protect sensitive data."
              />
              <FeatureCard
                icon="📱"
                title="Responsive Design"
                description="Modern interface accessible from desktop, tablet, or mobile devices."
              />
              <FeatureCard
                icon="🏆"
                title="Transparent Results"
                description="Participants can view scores and feedback in a transparent manner."
              />
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section style={styles.ctaSection}>
          <div style={styles.container}>
            <div style={styles.ctaContent}>
              <h2 style={styles.ctaTitle}>Ready to Get Started?</h2>
              <p style={styles.ctaDescription}>
                Join thousands of users who trust JudgeFlow for their competition management needs
              </p>
              <div style={styles.ctaButtons}>
                <Link 
                  to="/register" 
                  style={{ ...styles.btn, ...styles.btnPrimary }}
                  className="btn-primary"
                >
                  Register Now
                </Link>
                <Link 
                  to="/login" 
                  style={{ ...styles.btn, ...styles.btnSecondary, background: 'rgba(255, 255, 255, 0.2)', color: 'white', border: '1px solid rgba(255, 255, 255, 0.3)' }}
                  className="btn-secondary"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;