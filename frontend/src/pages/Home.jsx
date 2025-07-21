import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ProfessionalHome = () => {
  const [currentFeature, setCurrentFeature] = useState(0);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % 6);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const styles = {
    homePage: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
      overflow: 'hidden'
    },
    
    heroSection: {
      position: 'relative',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      overflow: 'hidden',
      background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 50%, #ecfdf5 100%)'
    },
    
    heroBackground: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 0
    },
    
    heroGrid: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundImage: `
        linear-gradient(rgba(52, 211, 153, 0.08) 1px, transparent 1px),
        linear-gradient(90deg, rgba(52, 211, 153, 0.08) 1px, transparent 1px)
      `,
      backgroundSize: '60px 60px',
      animation: 'gridFlow 25s linear infinite',
      transform: `translateY(${scrollY * 0.5}px)`
    },
    
    heroShapes: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      overflow: 'hidden',
      zIndex: 1
    },
    
    heroContainer: {
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '0 40px',
      position: 'relative',
      zIndex: 2
    },
    
    heroContent: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '80px',
      alignItems: 'center',
      padding: '120px 0'
    },
    
    heroText: {
      animation: 'fadeInUp 1s ease-out'
    },
    
    heroTitle: {
      fontSize: '64px',
      fontWeight: '900',
      lineHeight: '1.1',
      marginBottom: '24px',
      letterSpacing: '-2px'
    },
    
    titleMain: {
      display: 'block',
      background: 'linear-gradient(135deg, #34d399 0%, #10b981 50%, #059669 100%)',
      backgroundClip: 'text',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundSize: '200% 200%',
      animation: 'gradientShift 3s ease-in-out infinite'
    },
    
    titleSub: {
      display: 'block',
      color: '#475569',
      fontSize: '36px',
      fontWeight: '700',
      marginTop: '8px'
    },
    
    heroDescription: {
      fontSize: '20px',
      color: '#64748b',
      lineHeight: '1.7',
      marginBottom: '40px',
      maxWidth: '600px'
    },
    
    heroButtons: {
      display: 'flex',
      gap: '20px',
      marginBottom: '60px'
    },
    
    btn: {
      padding: '18px 36px',
      borderRadius: '16px',
      fontSize: '16px',
      fontWeight: '600',
      textDecoration: 'none',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '12px',
      position: 'relative',
      overflow: 'hidden'
    },
    
    btnPrimary: {
      background: 'linear-gradient(135deg, #34d399 0%, #10b981 100%)',
      color: 'white',
      boxShadow: '0 8px 32px rgba(52, 211, 153, 0.3)',
      transform: 'perspective(1000px) rotateX(0deg)'
    },
    
    btnSecondary: {
      background: 'rgba(255, 255, 255, 0.9)',
      color: '#374151',
      border: '2px solid #e5e7eb',
      backdropFilter: 'blur(10px)'
    },
    
    heroStats: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '40px'
    },
    
    statItem: {
      textAlign: 'center'
    },
    
    statValue: {
      fontSize: '32px',
      fontWeight: '900',
      color: '#34d399',
      display: 'block',
      marginBottom: '8px'
    },
    
    statLabel: {
      fontSize: '14px',
      color: '#64748b',
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '1px'
    },
    
    heroVisual: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative'
    },
    
    dashboardMockup: {
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(20px)',
      borderRadius: '32px',
      boxShadow: '0 40px 80px rgba(0, 0, 0, 0.12)',
      border: '1px solid rgba(255, 255, 255, 0.8)',
      overflow: 'hidden',
      transform: 'perspective(1000px) rotateY(-15deg) rotateX(5deg)',
      transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
      width: '500px',
      height: '350px',
      position: 'relative'
    },
    
    mockupHeader: {
      background: 'linear-gradient(135deg, #f8fafc 0%, #ecfdf5 100%)',
      padding: '20px 24px',
      borderBottom: '1px solid #e2e8f0',
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    
    mockupDots: {
      display: 'flex',
      gap: '8px'
    },
    
    mockupDot: {
      width: '12px',
      height: '12px',
      borderRadius: '50%'
    },
    
    mockupContent: {
      padding: '24px',
      height: 'calc(100% - 80px)',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    },
    
    mockupCards: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '12px'
    },
    
    mockupCard: {
      padding: '16px 12px',
      borderRadius: '12px',
      color: 'white',
      fontWeight: '600',
      fontSize: '12px',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden'
    },
    
    mockupChart: {
      flex: 1,
      display: 'flex',
      alignItems: 'end',
      justifyContent: 'center',
      gap: '8px'
    },
    
    chartBar: {
      width: '24px',
      background: 'linear-gradient(to top, #34d399, #6ee7b7)',
      borderRadius: '4px',
      transition: 'all 1s ease-in-out'
    },
    
    featuresSection: {
      padding: '120px 0',
      background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
      position: 'relative'
    },
    
    container: {
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '0 40px'
    },
    
    sectionHeader: {
      textAlign: 'center',
      marginBottom: '80px'
    },
    
    sectionTitle: {
      fontSize: '48px',
      fontWeight: '900',
      color: '#1e293b',
      marginBottom: '20px',
      letterSpacing: '-1px'
    },
    
    sectionSubtitle: {
      fontSize: '20px',
      color: '#64748b',
      maxWidth: '700px',
      margin: '0 auto',
      lineHeight: '1.6'
    },
    
    featuresGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
      gap: '40px'
    },
    
    featureCard: {
      background: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(20px)',
      borderRadius: '24px',
      padding: '40px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.06)',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden'
    },
    
    featureIcon: {
      fontSize: '48px',
      marginBottom: '24px',
      display: 'block',
      filter: 'drop-shadow(0 4px 8px rgba(52, 211, 153, 0.2))'
    },
    
    featureTitle: {
      fontSize: '24px',
      fontWeight: '700',
      color: '#1e293b',
      marginBottom: '16px'
    },
    
    featureDescription: {
      color: '#64748b',
      lineHeight: '1.6',
      fontSize: '16px'
    },
    
    ctaSection: {
      padding: '120px 0',
      background: 'linear-gradient(135deg, #34d399 0%, #10b981 100%)',
      color: 'white',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden'
    },
    
    ctaBackground: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E") repeat',
      animation: 'patternFloat 20s linear infinite'
    },
    
    ctaContent: {
      maxWidth: '800px',
      margin: '0 auto',
      position: 'relative',
      zIndex: 2
    },
    
    ctaTitle: {
      fontSize: '48px',
      fontWeight: '900',
      marginBottom: '24px',
      letterSpacing: '-1px'
    },
    
    ctaDescription: {
      fontSize: '20px',
      marginBottom: '40px',
      opacity: 0.9,
      lineHeight: '1.6'
    },
    
    ctaButtons: {
      display: 'flex',
      gap: '20px',
      justifyContent: 'center'
    }
  };

  const keyframes = `
    @keyframes gridFlow {
      0% { transform: translate(0, 0); }
      100% { transform: translate(60px, 60px); }
    }
    
    @keyframes gradientShift {
      0%, 100% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
    }
    
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(40px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    @keyframes patternFloat {
      0% { transform: translate(0, 0); }
      100% { transform: translate(60px, 60px); }
    }
    
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-20px); }
    }
    
    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }
  `;

  const FeatureCard = ({ icon, title, description, delay = 0 }) => {
    const [isVisible, setIsVisible] = useState(false);
    
    useEffect(() => {
      const timer = setTimeout(() => setIsVisible(true), delay);
      return () => clearTimeout(timer);
    }, [delay]);

    return (
      <div 
        style={{
          ...styles.featureCard,
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(40px)'
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = 'translateY(-12px) scale(1.02)';
          e.target.style.boxShadow = '0 40px 80px rgba(0, 0, 0, 0.12)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'translateY(0) scale(1)';
          e.target.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.06)';
        }}
      >
        <div style={styles.featureIcon}>{icon}</div>
        <h3 style={styles.featureTitle}>{title}</h3>
        <p style={styles.featureDescription}>{description}</p>
      </div>
    );
  };

  const StatItem = ({ value, label, delay = 0 }) => {
    const [count, setCount] = useState(0);
    const targetValue = parseInt(value.replace(/\D/g, ''));

    useEffect(() => {
      const timer = setTimeout(() => {
        const interval = setInterval(() => {
          setCount(prev => {
            if (prev >= targetValue) {
              clearInterval(interval);
              return targetValue;
            }
            return prev + Math.ceil(targetValue / 50);
          });
        }, 50);
        return () => clearInterval(interval);
      }, delay);
      return () => clearTimeout(timer);
    }, [targetValue, delay]);

    return (
      <div style={styles.statItem}>
        <div style={styles.statValue}>
          {value.includes('+') ? `${count}+` : 
           value.includes('/') ? `${count}/7` : 
           value.includes('%') ? `${count}%` : count}
        </div>
        <div style={styles.statLabel}>{label}</div>
      </div>
    );
  };

  return (
    <>
      <style>{keyframes}</style>
      
      <div style={styles.homePage}>
        {/* Hero Section */}
        <section style={styles.heroSection}>
          <div style={styles.heroBackground}>
            <div style={styles.heroGrid}></div>
            <div style={styles.heroShapes}>
              <div style={{
                position: 'absolute',
                top: '10%',
                left: '5%',
                width: '200px',
                height: '200px',
                background: 'linear-gradient(135deg, rgba(52, 211, 153, 0.1), rgba(16, 185, 129, 0.1))',
                borderRadius: '50%',
                animation: 'float 6s ease-in-out infinite'
              }}></div>
              <div style={{
                position: 'absolute',
                bottom: '20%',
                right: '10%',
                width: '150px',
                height: '150px',
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(37, 99, 235, 0.1))',
                borderRadius: '50%',
                animation: 'float 8s ease-in-out infinite 2s'
              }}></div>
            </div>
          </div>
          
          <div style={styles.heroContainer}>
            <div style={styles.heroContent}>
              <div style={styles.heroText}>
                <h1 style={styles.heroTitle}>
                  <span style={styles.titleMain}>JudgeFlow</span>
                  <span style={styles.titleSub}>Professional</span>
                </h1>
                
                <p style={styles.heroDescription}>
                  The most advanced competition management platform designed for modern organizations. 
                  Streamline judging processes, enhance collaboration, and deliver exceptional results with our cutting-edge technology.
                </p>
                
                <div style={styles.heroButtons}>
                  <Link 
                    to="/register" 
                    style={{...styles.btn, ...styles.btnPrimary}}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-4px) perspective(1000px) rotateX(10deg)';
                      e.target.style.boxShadow = '0 20px 60px rgba(52, 211, 153, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0) perspective(1000px) rotateX(0deg)';
                      e.target.style.boxShadow = '0 8px 32px rgba(52, 211, 153, 0.3)';
                    }}
                  >
                    <span style={{ fontSize: '20px' }}>🚀</span>
                    Start Free Trial
                  </Link>
                  <Link 
                    to="/login" 
                    style={{...styles.btn, ...styles.btnSecondary}}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'rgba(255, 255, 255, 1)';
                      e.target.style.transform = 'translateY(-4px)';
                      e.target.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'rgba(255, 255, 255, 0.9)';
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    <span style={{ fontSize: '18px' }}>🔐</span>
                    Sign In
                  </Link>
                </div>
                
                <div style={styles.heroStats}>
                  <StatItem value="10000+" label="Active Users" delay={500} />
                  <StatItem value="24/7" label="Support" delay={1000} />
                  <StatItem value="99%" label="Uptime" delay={1500} />
                </div>
              </div>
              
              <div style={styles.heroVisual}>
                <div 
                  style={styles.dashboardMockup}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'perspective(1000px) rotateY(-8deg) rotateX(2deg) scale(1.05)';
                    e.target.style.boxShadow = '0 60px 120px rgba(0, 0, 0, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'perspective(1000px) rotateY(-15deg) rotateX(5deg) scale(1)';
                    e.target.style.boxShadow = '0 40px 80px rgba(0, 0, 0, 0.12)';
                  }}
                >
                  <div style={styles.mockupHeader}>
                    <div style={styles.mockupDots}>
                      <div style={{...styles.mockupDot, background: '#ef4444'}}></div>
                      <div style={{...styles.mockupDot, background: '#f59e0b'}}></div>
                      <div style={{...styles.mockupDot, background: '#34d399'}}></div>
                    </div>
                  </div>
                  <div style={styles.mockupContent}>
                    <div style={styles.mockupCards}>
                      <div style={{
                        ...styles.mockupCard,
                        background: 'linear-gradient(135deg, #34d399, #10b981)'
                      }}>
                        <div style={{ fontSize: '20px', marginBottom: '8px' }}>📊</div>
                        <div>Analytics</div>
                      </div>
                      <div style={{
                        ...styles.mockupCard,
                        background: 'linear-gradient(135deg, #3b82f6, #2563eb)'
                      }}>
                        <div style={{ fontSize: '20px', marginBottom: '8px' }}>⚖️</div>
                        <div>Judging</div>
                      </div>
                      <div style={{
                        ...styles.mockupCard,
                        background: 'linear-gradient(135deg, #f59e0b, #d97706)'
                      }}>
                        <div style={{ fontSize: '20px', marginBottom: '8px' }}>🏆</div>
                        <div>Results</div>
                      </div>
                    </div>
                    <div style={styles.mockupChart}>
                      {[40, 70, 45, 80, 60, 90, 55].map((height, index) => (
                        <div 
                          key={index}
                          style={{
                            ...styles.chartBar,
                            height: `${height}%`,
                            animationDelay: `${index * 0.2}s`,
                            animation: 'pulse 2s ease-in-out infinite'
                          }}
                        ></div>
                      ))}
                    </div>
                  </div>
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
                Powerful features designed to transform your competition management experience with enterprise-grade reliability and intuitive design.
              </p>
            </div>
            
            <div style={styles.featuresGrid}>
              <FeatureCard
                icon="🎯"
                title="Intelligent Management"
                description="AI-powered insights and real-time analytics provide unprecedented visibility into your competition processes with automated workflow optimization."
                delay={100}
              />
              <FeatureCard
                icon="⚡"
                title="Lightning Fast"
                description="Cloud-native architecture ensures instant response times and seamless scalability, handling thousands of submissions with zero downtime."
                delay={300}
              />
              <FeatureCard
                icon="🔒"
                title="Enterprise Security"
                description="Bank-level encryption, multi-factor authentication, and SOC2 compliance protect your sensitive data with military-grade security."
                delay={500}
              />
              <FeatureCard
                icon="📊"
                title="Advanced Analytics"
                description="Comprehensive reporting suite with customizable dashboards, predictive insights, and export capabilities for data-driven decisions."
                delay={700}
              />
              <FeatureCard
                icon="🌐"
                title="Global Collaboration"
                description="Multi-language support, timezone handling, and real-time collaboration tools enable seamless international competition management."
                delay={900}
              />
              <FeatureCard
                icon="🚀"
                title="Continuous Innovation"
                description="Regular feature updates, API integrations, and cutting-edge technology ensure you always have access to the latest capabilities."
                delay={1100}
              />
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section style={styles.ctaSection}>
          <div style={styles.ctaBackground}></div>
          <div style={styles.container}>
            <div style={styles.ctaContent}>
              <h2 style={styles.ctaTitle}>Ready to Transform Your Competitions?</h2>
              <p style={styles.ctaDescription}>
                Join thousands of organizations worldwide who trust JudgeFlow for their most important competitions. Start your free trial today and experience the future of competition management.
              </p>
              <div style={styles.ctaButtons}>
                <Link 
                  to="/register" 
                  style={{
                    ...styles.btn,
                    background: 'rgba(255, 255, 255, 1)',
                    color: '#059669',
                    fontWeight: '700'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-4px) scale(1.05)';
                    e.target.style.boxShadow = '0 20px 40px rgba(255, 255, 255, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0) scale(1)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  🚀 Start Free Trial
                </Link>
                <Link 
                  to="/login" 
                  style={{
                    ...styles.btn,
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    border: '2px solid rgba(255, 255, 255, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                    e.target.style.transform = 'translateY(-4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  🔐 Sign In
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default ProfessionalHome;