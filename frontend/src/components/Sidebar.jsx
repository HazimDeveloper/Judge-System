import React, { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const ProfessionalSidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);

  if (!user) return null;

  const sidebarLinks = {
    ADMIN: [
      { path: '/dashboard', label: 'Dashboard', icon: '📊', description: 'Overview & Analytics' },
      { path: '/admin/users', label: 'Users', icon: '👥', description: 'Manage Users' },
      { path: '/admin/submissions', label: 'Submissions', icon: '📄', description: 'View All Submissions' },
      { path: '/admin/scoring', label: 'Scoring', icon: '⭐', description: 'Review Scores' },
      { path: '/admin/competitions', label: 'Competitions', icon: '🏆', description: 'Manage Competitions' }
    ],
    JUDGE: [
      { path: '/dashboard', label: 'Dashboard', icon: '📊', description: 'Your Overview' },
      { path: '/judge/submissions', label: 'Review', icon: '⚖️', description: 'Review Submissions' },
      { path: '/judge/schedule', label: 'Schedule', icon: '📅', description: 'Your Schedule' }
    ],
    COMMITTEE: [
      { path: '/dashboard', label: 'Dashboard', icon: '📊', description: 'Committee Overview' },
      { path: '/committee/oversight', label: 'Oversight', icon: '👁️', description: 'Monitor Progress' },
      { path: '/committee/reports', label: 'Reports', icon: '📋', description: 'Generate Reports' }
    ],
    PARTICIPANT: [
      { path: '/dashboard', label: 'Dashboard', icon: '📊', description: 'Your Dashboard' },
      { path: '/participant/submissions', label: 'My Work', icon: '📝', description: 'Your Submissions' },
      { path: '/participant/feedback', label: 'Feedback', icon: '💬', description: 'Judge Feedback' }
    ]
  };

  const links = sidebarLinks[user.role] || [];

  // Define all styles
  const styles = {
    sidebar: {
      width: isCollapsed ? '80px' : '320px',
      height: '100vh',
      background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
      borderRight: '1px solid #e2e8f0',
      position: 'fixed',
      left: 0,
      top: 0,
      zIndex: 1000,
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      boxShadow: '4px 0 24px rgba(0, 0, 0, 0.06)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    },
    
    header: {
      padding: '28px 24px',
      borderBottom: '1px solid #e2e8f0',
      background: 'linear-gradient(135deg, #34d399 0%, #10b981 100%)',
      color: 'white',
      position: 'relative'
    },
    
    brand: {
      display: 'flex',
      alignItems: 'center',
      gap: '14px',
      fontSize: '22px',
      fontWeight: '800',
      textDecoration: 'none',
      color: 'white',
      letterSpacing: '-0.5px'
    },
    
    brandIcon: {
      fontSize: '32px',
      filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.15))',
      animation: 'gentle-pulse 3s ease-in-out infinite'
    },
    
    brandText: {
      display: isCollapsed ? 'none' : 'block',
      background: 'linear-gradient(145deg, #ffffff 0%, #f0fdfa 100%)',
      backgroundClip: 'text',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent'
    },
    
    collapseBtn: {
      position: 'absolute',
      right: '-14px',
      top: '50%',
      transform: 'translateY(-50%)',
      width: '28px',
      height: '28px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #34d399 0%, #10b981 100%)',
      border: '2px solid white',
      color: 'white',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '14px',
      fontWeight: 'bold',
      boxShadow: '0 4px 12px rgba(52, 211, 153, 0.3)',
      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      zIndex: 10
    },
    
    nav: {
      flex: 1,
      padding: '32px 0',
      overflow: 'hidden',
      position: 'relative'
    },
    
    navLink: {
      display: 'flex',
      alignItems: 'center',
      gap: '18px',
      padding: '16px 24px',
      margin: '6px 16px',
      borderRadius: '14px',
      textDecoration: 'none',
      color: '#64748b',
      fontSize: '15px',
      fontWeight: '500',
      transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
      position: 'relative',
      overflow: 'hidden',
      cursor: 'pointer'
    },
    
    navLinkActive: {
      background: 'linear-gradient(135deg, #34d399 0%, #10b981 100%)',
      color: 'white',
      boxShadow: '0 8px 24px rgba(52, 211, 153, 0.25)',
      transform: 'translateY(-2px) translateX(4px)',
      border: '1px solid rgba(255, 255, 255, 0.2)'
    },
    
    linkIcon: {
      fontSize: '22px',
      minWidth: '22px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.2s ease'
    },
    
    linkContent: {
      display: isCollapsed ? 'none' : 'flex',
      flexDirection: 'column',
      gap: '2px',
      flex: 1
    },
    
    linkText: {
      fontSize: '15px',
      fontWeight: '600',
      lineHeight: '1.2'
    },
    
    linkDescription: {
      fontSize: '12px',
      opacity: 0.8,
      lineHeight: '1.2'
    },
    
    footer: {
      padding: '24px',
      borderTop: '1px solid #e2e8f0',
      background: 'linear-gradient(145deg, #f8fafc 0%, #f1f5f9 100%)'
    },
    
    userCard: {
      display: 'flex',
      alignItems: 'center',
      gap: '14px',
      padding: '16px',
      borderRadius: '16px',
      background: 'white',
      border: '1px solid #e2e8f0',
      marginBottom: '16px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
      transition: 'all 0.2s ease'
    },
    
    userAvatar: {
      width: '48px',
      height: '48px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #34d399 0%, #10b981 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '18px',
      fontWeight: '700',
      boxShadow: '0 4px 12px rgba(52, 211, 153, 0.25)',
      border: '2px solid white'
    },
    
    userInfo: {
      display: isCollapsed ? 'none' : 'flex',
      flexDirection: 'column',
      flex: 1,
      gap: '2px'
    },
    
    userName: {
      fontSize: '15px',
      fontWeight: '700',
      color: '#1e293b',
      margin: 0,
      lineHeight: '1.2'
    },
    
    userRole: {
      fontSize: '12px',
      color: '#64748b',
      textTransform: 'uppercase',
      letterSpacing: '0.8px',
      fontWeight: '600',
      margin: 0
    },
    
    userStatus: {
      fontSize: '11px',
      color: '#34d399',
      fontWeight: '500',
      margin: 0
    },
    
    logoutBtn: {
      width: '100%',
      padding: '12px 16px',
      borderRadius: '12px',
      border: 'none',
      background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      color: 'white',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
      boxShadow: '0 4px 12px rgba(239, 68, 68, 0.2)'
    },
    
    tooltip: {
      position: 'absolute',
      left: '90px',
      background: '#1e293b',
      color: 'white',
      padding: '8px 12px',
      borderRadius: '8px',
      fontSize: '13px',
      fontWeight: '500',
      whiteSpace: 'nowrap',
      opacity: 0,
      visibility: 'hidden',
      transition: 'all 0.2s ease',
      zIndex: 1000,
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      pointerEvents: 'none'
    },
    
    tooltipVisible: {
      opacity: 1,
      visibility: 'visible',
      transform: 'translateX(8px)'
    }
  };

  const getRoleIcon = (role) => {
    const icons = {
      ADMIN: '👑',
      JUDGE: '⚖️',
      COMMITTEE: '📋',
      PARTICIPANT: '🎯'
    };
    return icons[role] || '👤';
  };

  const getRoleColor = (role) => {
    const colors = {
      ADMIN: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
      JUDGE: 'linear-gradient(135deg, #34d399 0%, #10b981 100%)',
      COMMITTEE: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      PARTICIPANT: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
    };
    return colors[role] || 'linear-gradient(135deg, #34d399 0%, #10b981 100%)';
  };

  // Add keyframes for animations
  const keyframes = `
    @keyframes gentle-pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }
    
    @keyframes slide-in {
      from { transform: translateX(-20px); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `;

  return (
    <>
      <style>{keyframes}</style>
      <div style={styles.sidebar}>
        {/* Header */}
        <div style={styles.header}>
          <Link to="/" style={styles.brand}>
            <span style={styles.brandIcon}>🏆</span>
            <span style={styles.brandText}>JudgeFlow</span>
          </Link>
          
          <button 
            style={styles.collapseBtn}
            onClick={() => setIsCollapsed(!isCollapsed)}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-50%) scale(1.1)';
              e.target.style.boxShadow = '0 6px 20px rgba(52, 211, 153, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(-50%) scale(1)';
              e.target.style.boxShadow = '0 4px 12px rgba(52, 211, 153, 0.3)';
            }}
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? '→' : '←'}
          </button>
        </div>

        {/* Navigation */}
        <nav style={styles.nav}>
          {links.map((link, index) => {
            const isActive = location.pathname === link.path;
            return (
              <div 
                key={link.path} 
                style={{ position: 'relative' }}
                onMouseEnter={() => setHoveredLink(index)}
                onMouseLeave={() => setHoveredLink(null)}
              >
                <Link
                  to={link.path}
                  style={{
                    ...styles.navLink,
                    ...(isActive ? styles.navLinkActive : {}),
                    ...(!isActive && hoveredLink === index ? {
                      background: 'linear-gradient(135deg, #f0fdfa 0%, #ecfdf5 100%)',
                      color: '#34d399',
                      transform: 'translateX(8px)',
                      boxShadow: '0 4px 12px rgba(52, 211, 153, 0.1)'
                    } : {})
                  }}
                >
                  <span style={{
                    ...styles.linkIcon,
                    ...(isActive ? { transform: 'scale(1.1)' } : {})
                  }}>
                    {link.icon}
                  </span>
                  
                  <div style={styles.linkContent}>
                    <span style={styles.linkText}>{link.label}</span>
                    <span style={styles.linkDescription}>{link.description}</span>
                  </div>
                </Link>
                
                {/* Tooltip for collapsed state */}
                {isCollapsed && hoveredLink === index && (
                  <div style={{
                    ...styles.tooltip,
                    ...styles.tooltipVisible,
                    top: '50%',
                    transform: 'translateY(-50%) translateX(8px)'
                  }}>
                    {link.label}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        <div style={styles.footer}>
          <div 
            style={styles.userCard}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.05)';
            }}
          >
            <div style={{
              ...styles.userAvatar,
              background: getRoleColor(user.role)
            }}>
              {getRoleIcon(user.role)}
            </div>
            
            <div style={styles.userInfo}>
              <p style={styles.userName}>{user.username}</p>
              <p style={styles.userRole}>{user.role}</p>
              <p style={styles.userStatus}>● Online</p>
            </div>
          </div>
          
          <button 
            style={styles.logoutBtn}
            onClick={logout}
            onMouseEnter={(e) => {
              e.target.style.background = 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)';
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 8px 24px rgba(239, 68, 68, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.2)';
            }}
          >
            <span style={{ fontSize: '16px' }}>🚪</span>
            {!isCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </div>
    </>
  );
};

export default ProfessionalSidebar;