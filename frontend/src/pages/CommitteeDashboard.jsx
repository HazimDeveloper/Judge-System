import React, { useEffect, useState } from 'react';
import api from '../services/api';

const ModernCommitteeDashboard = () => {
  const [competitions, setCompetitions] = useState([]);
  const [selectedCompetition, setSelectedCompetition] = useState('');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCompetitions = async () => {
      try {
        const res = await api.get('/api/competitions/');
        setCompetitions(res.data);
        if (res.data.length > 0) setSelectedCompetition(res.data[0].id);
      } catch (err) {
        setCompetitions([]);
      }
    };
    fetchCompetitions();
  }, []);

  useEffect(() => {
    if (!selectedCompetition) return;
    setLoading(true);
    setError('');
    const fetchStats = async () => {
      try {
        const res = await api.get(`/dashboard/stats/?competition=${selectedCompetition}`);
        setStats(res.data);
      } catch (err) {
        setError('Could not load dashboard stats. Please refresh the page.');
        setStats(null);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [selectedCompetition]);

  const handleCompetitionChange = (e) => {
    setSelectedCompetition(e.target.value);
  };

  const styles = {
    dashboard: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
      padding: '40px'
    },
    
    welcomeSection: {
      background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
      borderRadius: '24px',
      padding: '40px',
      color: 'white',
      marginBottom: '40px',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 20px 40px rgba(139, 92, 246, 0.15)'
    },
    
    welcomePattern: {
      position: 'absolute',
      top: 0,
      right: 0,
      width: '400px',
      height: '100%',
      background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E") repeat',
      opacity: 0.3
    },
    
    welcomeContent: {
      position: 'relative',
      zIndex: 2
    },
    
    welcomeTitle: {
      fontSize: '32px',
      fontWeight: '800',
      marginBottom: '12px',
      letterSpacing: '-0.5px'
    },
    
    welcomeSubtitle: {
      fontSize: '18px',
      opacity: 0.9,
      fontWeight: '500',
      lineHeight: '1.6'
    },
    
    controlsSection: {
      background: 'white',
      borderRadius: '20px',
      padding: '32px',
      marginBottom: '32px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.06)'
    },
    
    competitionSelector: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px'
    },
    
    selectorLabel: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#1e293b',
      minWidth: '120px'
    },
    
    select: {
      padding: '12px 16px',
      borderRadius: '12px',
      border: '2px solid #e5e7eb',
      background: 'white',
      fontSize: '16px',
      fontWeight: '500',
      color: '#374151',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      minWidth: '250px',
      outline: 'none'
    },
    
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '24px',
      marginBottom: '40px'
    },
    
    statCard: {
      background: 'white',
      borderRadius: '20px',
      padding: '32px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.06)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      position: 'relative',
      overflow: 'hidden'
    },
    
    statCardBefore: (color) => ({
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '4px',
      background: color
    }),
    
    statHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '20px'
    },
    
    statIcon: {
      width: '48px',
      height: '48px',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '20px',
      color: 'white'
    },
    
    statTrend: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      padding: '4px 8px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: '600'
    },
    
    statValue: {
      fontSize: '32px',
      fontWeight: '900',
      color: '#1e293b',
      marginBottom: '8px',
      lineHeight: '1'
    },
    
    statLabel: {
      fontSize: '14px',
      color: '#64748b',
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    },
    
    mainContent: {
      display: 'grid',
      gridTemplateColumns: '2fr 1fr',
      gap: '32px'
    },
    
    contentCard: {
      background: 'white',
      borderRadius: '24px',
      padding: '32px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.06)',
      transition: 'all 0.3s ease'
    },
    
    sectionTitle: {
      fontSize: '24px',
      fontWeight: '800',
      color: '#1e293b',
      marginBottom: '24px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    
    sectionIcon: {
      fontSize: '28px'
    },
    
    progressSection: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    },
    
    progressItem: {
      background: '#f8fafc',
      borderRadius: '16px',
      padding: '20px',
      border: '1px solid #e2e8f0'
    },
    
    progressHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '12px'
    },
    
    progressLabel: {
      fontWeight: '600',
      color: '#1e293b',
      fontSize: '16px'
    },
    
    progressValue: {
      fontSize: '16px',
      fontWeight: '700',
      color: '#8b5cf6'
    },
    
    progressBar: {
      width: '100%',
      height: '8px',
      background: '#e2e8f0',
      borderRadius: '4px',
      overflow: 'hidden'
    },
    
    progressFill: (width) => ({
      height: '100%',
      background: 'linear-gradient(90deg, #8b5cf6, #7c3aed)',
      borderRadius: '4px',
      width: `${width}%`,
      transition: 'width 0.5s ease-out'
    }),
    
    activityList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    },
    
    activityItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      padding: '16px',
      background: '#f8fafc',
      borderRadius: '12px',
      border: '1px solid #e2e8f0',
      transition: 'all 0.2s ease'
    },
    
    activityAvatar: {
      width: '48px',
      height: '48px',
      background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontWeight: '700',
      fontSize: '18px',
      boxShadow: '0 4px 12px rgba(139, 92, 246, 0.25)'
    },
    
    activityContent: {
      flex: 1
    },
    
    activityName: {
      fontWeight: '600',
      color: '#1e293b',
      marginBottom: '4px'
    },
    
    activityDetail: {
      fontSize: '14px',
      color: '#64748b'
    },
    
    activityBadge: {
      background: '#8b5cf6',
      color: 'white',
      padding: '6px 12px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '600'
    },
    
    emptyState: {
      textAlign: 'center',
      padding: '60px 20px',
      color: '#64748b'
    },
    
    emptyIcon: {
      fontSize: '64px',
      marginBottom: '16px',
      opacity: 0.5
    },
    
    emptyTitle: {
      fontSize: '20px',
      fontWeight: '600',
      marginBottom: '8px'
    },
    
    emptyDesc: {
      fontSize: '16px',
      lineHeight: '1.5'
    },
    
    loadingSpinner: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '400px',
      fontSize: '18px',
      color: '#64748b'
    },
    
    spinner: {
      width: '40px',
      height: '40px',
      border: '4px solid #f1f5f9',
      borderTop: '4px solid #8b5cf6',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      marginRight: '16px'
    },
    
    keyMetrics: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '16px',
      marginBottom: '24px'
    },
    
    metricItem: {
      background: '#f8fafc',
      borderRadius: '12px',
      padding: '16px',
      border: '1px solid #e2e8f0',
      textAlign: 'center'
    },
    
    metricValue: {
      fontSize: '24px',
      fontWeight: '800',
      color: '#8b5cf6',
      marginBottom: '4px'
    },
    
    metricLabel: {
      fontSize: '12px',
      color: '#64748b',
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    }
  };

  const keyframes = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;

  if (loading) {
    return (
      <>
        <style>{keyframes}</style>
        <div style={styles.loadingSpinner}>
          <div style={styles.spinner}></div>
          Loading committee dashboard...
        </div>
      </>
    );
  }

  const StatCard = ({ icon, title, value, trend, color }) => (
    <div 
      style={styles.statCard}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-8px)';
        e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.12)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.06)';
      }}
    >
      <div style={styles.statCardBefore(color)}></div>
      <div style={styles.statHeader}>
        <div style={{...styles.statIcon, background: color}}>
          {icon}
        </div>
        {trend && (
          <div style={{
            ...styles.statTrend,
            background: trend > 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            color: trend > 0 ? '#059669' : '#dc2626'
          }}>
            <span>{trend > 0 ? '↗️' : '↘️'}</span>
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      <div style={styles.statValue}>{value || '--'}</div>
      <div style={styles.statLabel}>{title}</div>
    </div>
  );

  const ProgressCard = ({ title }) => (
    <div style={styles.contentCard}>
      <h3 style={styles.sectionTitle}>
        <span style={styles.sectionIcon}>📊</span>
        {title}
      </h3>
      <div style={styles.progressSection}>
        <div style={styles.progressItem}>
          <div style={styles.progressHeader}>
            <span style={styles.progressLabel}>Submissions Reviewed</span>
            <span style={styles.progressValue}>75%</span>
          </div>
          <div style={styles.progressBar}>
            <div style={styles.progressFill(75)}></div>
          </div>
        </div>
        
        <div style={styles.progressItem}>
          <div style={styles.progressHeader}>
            <span style={styles.progressLabel}>Judges Active</span>
            <span style={styles.progressValue}>90%</span>
          </div>
          <div style={styles.progressBar}>
            <div style={styles.progressFill(90)}></div>
          </div>
        </div>
        
        <div style={styles.progressItem}>
          <div style={styles.progressHeader}>
            <span style={styles.progressLabel}>Competition Progress</span>
            <span style={styles.progressValue}>60%</span>
          </div>
          <div style={styles.progressBar}>
            <div style={styles.progressFill(60)}></div>
          </div>
        </div>
      </div>
      
      <div style={styles.keyMetrics}>
        <div style={styles.metricItem}>
          <div style={styles.metricValue}>4.2</div>
          <div style={styles.metricLabel}>Avg Score</div>
        </div>
        <div style={styles.metricItem}>
          <div style={styles.metricValue}>2.5</div>
          <div style={styles.metricLabel}>Avg Time (days)</div>
        </div>
      </div>
    </div>
  );

  const ActivityCard = ({ title, data, emptyMessage }) => (
    <div style={styles.contentCard}>
      <h3 style={styles.sectionTitle}>
        <span style={styles.sectionIcon}>👥</span>
        {title}
      </h3>
      {data && data.length > 0 ? (
        <div style={styles.activityList}>
          {data.map((item, index) => (
            <div 
              key={index} 
              style={styles.activityItem}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f3f4f6';
                e.currentTarget.style.borderColor = '#8b5cf6';
                e.currentTarget.style.transform = 'translateX(4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#f8fafc';
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.transform = 'translateX(0)';
              }}
            >
              <div style={styles.activityAvatar}>
                <span>{item['judge__user__username']?.charAt(0).toUpperCase() || 'J'}</span>
              </div>
              <div style={styles.activityContent}>
                <div style={styles.activityName}>{item['judge__user__username'] || 'Judge'}</div>
                <div style={styles.activityDetail}>{item.count} submissions reviewed</div>
              </div>
              <div style={styles.activityBadge}>
                {item.count}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>👥</div>
          <h4 style={styles.emptyTitle}>No Activity</h4>
          <p style={styles.emptyDesc}>{emptyMessage}</p>
        </div>
      )}
    </div>
  );

  return (
    <>
      <style>{keyframes}</style>
      
      <div style={styles.dashboard}>
        {/* Welcome Section */}
        <div style={styles.welcomeSection}>
          <div style={styles.welcomePattern}></div>
          <div style={styles.welcomeContent}>
            <h1 style={styles.welcomeTitle}>
              Committee Dashboard 📋
            </h1>
            <p style={styles.welcomeSubtitle}>
              Monitor competition progress and oversee judging activities with comprehensive insights and real-time analytics.
            </p>
          </div>
        </div>

        {/* Controls Section */}
        <div style={styles.controlsSection}>
          <div style={styles.competitionSelector}>
            <label style={styles.selectorLabel}>Competition:</label>
            <select 
              style={styles.select}
              value={selectedCompetition || ''}
              onChange={handleCompetitionChange}
              onFocus={(e) => {
                e.target.style.borderColor = '#8b5cf6';
                e.target.style.boxShadow = '0 0 0 4px rgba(139, 92, 246, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e5e7eb';
                e.target.style.boxShadow = 'none';
              }}
            >
              <option value="">Select a competition</option>
              {competitions.map(comp => (
                <option key={comp.id} value={comp.id}>{comp.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Stats Grid */}
        <div style={styles.statsGrid}>
          <StatCard
            icon="👥"
            title="Total Participants"
            value={stats?.total_participants}
            trend={12}
            color="linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)"
          />
          <StatCard
            icon="📄"
            title="Total Submissions"
            value={stats?.total_submissions}
            trend={8}
            color="linear-gradient(135deg, #34d399 0%, #10b981 100%)"
          />
          <StatCard
            icon="⭐"
            title="Average Score"
            value={stats?.average_score ? stats.average_score.toFixed(1) : '--'}
            trend={-3}
            color="linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
          />
          <StatCard
            icon="📊"
            title="Review Progress"
            value="75%"
            trend={15}
            color="linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)"
          />
        </div>

        {/* Main Content */}
        <div style={styles.mainContent}>
          <ProgressCard title="Competition Progress" />
          <ActivityCard
            title="Judge Performance"
            data={stats?.judge_activity}
            emptyMessage="No judge activity to display. Activity will appear here once judges start reviewing submissions."
          />
        </div>
      </div>
    </>
  );
};

export default ModernCommitteeDashboard;