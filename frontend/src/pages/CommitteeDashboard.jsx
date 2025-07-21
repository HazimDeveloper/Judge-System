import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Container, Row, Col, Card, Spinner, Alert, Form } from 'react-bootstrap';

// Embedded CSS styles
const styles = {
  dashboard: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%)',
    padding: '2rem 0'
  },
  
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1.5rem'
  },
  
  dashboardHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: '3rem',
    gap: '2rem'
  },
  
  headerContent: {
    flex: 1
  },
  
  dashboardTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    fontSize: '2.5rem',
    fontWeight: 900,
    color: '#1e293b',
    marginBottom: '0.5rem',
    lineHeight: 1.1
  },
  
  titleIcon: {
    fontSize: '2rem',
    background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  
  dashboardSubtitle: {
    fontSize: '1.125rem',
    color: '#475569',
    lineHeight: 1.6,
    maxWidth: '500px'
  },
  
  headerActions: {
    display: 'flex',
    gap: '0.75rem',
    alignItems: 'flex-start'
  },
  
  dashboardLoading: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh',
    textAlign: 'center'
  },
  
  dashboardError: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh',
    textAlign: 'center'
  },
  
  errorIcon: {
    fontSize: '4rem',
    marginBottom: '1rem'
  },
  
  errorTitle: {
    color: '#1e293b',
    marginBottom: '0.5rem',
    fontSize: '1.5rem',
    fontWeight: 700
  },
  
  errorMessage: {
    color: '#475569',
    marginBottom: '1.5rem',
    maxWidth: '400px'
  },
  
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #e2e8f0',
    borderTop: '4px solid #3b82f6',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '2rem auto'
  },
  
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '1.5rem',
    marginBottom: '3rem'
  },
  
  statCard: {
    background: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(20px)',
    borderRadius: '1rem',
    padding: '2rem',
    border: '1px solid #e2e8f0',
    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    transition: 'all 0.25s ease-out',
    position: 'relative',
    overflow: 'hidden'
  },
  
  statCardBefore: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: 'linear-gradient(90deg, #3b82f6, #2563eb)'
  },
  
  statHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '1.5rem'
  },
  
  statIcon: {
    fontSize: '2.5rem'
  },
  
  statTrend: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
    padding: '0.25rem 0.5rem',
    borderRadius: '0.5rem',
    fontSize: '0.75rem',
    fontWeight: 600
  },
  
  statTrendPositive: {
    background: 'rgba(16, 185, 129, 0.1)',
    color: '#065f46'
  },
  
  statTrendNegative: {
    background: 'rgba(239, 68, 68, 0.1)',
    color: '#991b1b'
  },
  
  statTrendNeutral: {
    background: 'rgba(156, 163, 175, 0.1)',
    color: '#374151'
  },
  
  statContent: {
    textAlign: 'center'
  },
  
  statValue: {
    fontSize: '2.5rem',
    fontWeight: 800,
    color: '#1e293b',
    lineHeight: 1,
    marginBottom: '0.5rem'
  },
  
  statLabel: {
    color: '#475569',
    fontWeight: 600,
    fontSize: '0.875rem',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  
  dashboardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '2rem',
    marginBottom: '3rem'
  },
  
  dashboardSection: {
    display: 'flex',
    flexDirection: 'column'
  },
  
  modernCard: {
    background: 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(20px)',
    borderRadius: '1.5rem',
    border: '1px solid #e2e8f0',
    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    transition: 'all 0.25s ease-out',
    overflow: 'hidden'
  },
  
  cardHeader: {
    padding: '1.5rem 2rem',
    borderBottom: '1px solid #e2e8f0',
    background: 'linear-gradient(135deg, #f8fafc, #eff6ff)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  
  cardTitle: {
    fontSize: '1.25rem',
    fontWeight: 700,
    color: '#1e293b',
    margin: 0
  },
  
  cardBadge: {
    background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
    color: 'white',
    padding: '0.25rem 0.75rem',
    borderRadius: '0.5rem',
    fontSize: '0.75rem',
    fontWeight: 600
  },
  
  cardBody: {
    padding: '2rem'
  },
  
  activityList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  
  activityItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem',
    background: '#f8fafc',
    borderRadius: '0.75rem',
    border: '1px solid #e2e8f0',
    transition: 'all 0.15s ease-out'
  },
  
  activityAvatar: {
    width: '48px',
    height: '48px',
    background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: 700,
    fontSize: '1.125rem',
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
  },
  
  activityContent: {
    flex: 1
  },
  
  activityName: {
    fontWeight: 600,
    color: '#1e293b',
    marginBottom: '0.25rem'
  },
  
  activityDetail: {
    fontSize: '0.875rem',
    color: '#475569'
  },
  
  activityBadge: {
    background: '#3b82f6',
    color: 'white',
    padding: '0.25rem 0.75rem',
    borderRadius: '0.5rem',
    fontSize: '0.75rem',
    fontWeight: 600,
    boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)'
  },
  
  progressSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  
  progressItem: {
    background: '#f8fafc',
    borderRadius: '0.75rem',
    padding: '1rem',
    border: '1px solid #e2e8f0'
  },
  
  progressHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '0.75rem'
  },
  
  progressLabel: {
    fontWeight: 600,
    color: '#1e293b',
    fontSize: '0.875rem'
  },
  
  progressValue: {
    fontSize: '0.875rem',
    fontWeight: 600,
    color: '#3b82f6'
  },
  
  progressBar: {
    width: '100%',
    height: '8px',
    background: '#e2e8f0',
    borderRadius: '0.25rem',
    overflow: 'hidden'
  },
  
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #3b82f6, #2563eb)',
    borderRadius: '0.25rem',
    transition: 'width 0.5s ease-out'
  },
  
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem'
  },
  
  metricItem: {
    background: '#f8fafc',
    borderRadius: '0.75rem',
    padding: '1rem',
    border: '1px solid #e2e8f0',
    textAlign: 'center'
  },
  
  metricValue: {
    fontSize: '1.5rem',
    fontWeight: 800,
    color: '#3b82f6',
    marginBottom: '0.25rem'
  },
  
  metricLabel: {
    fontSize: '0.75rem',
    color: '#475569',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  
  statusList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem'
  },
  
  statusItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0.75rem 1rem',
    background: '#f8fafc',
    borderRadius: '0.75rem',
    border: '1px solid #e2e8f0'
  },
  
  statusLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontWeight: 500,
    color: '#334155',
    fontSize: '0.875rem'
  },
  
  statusIcon: {
    fontSize: '1rem'
  },
  
  statusValue: {
    fontWeight: 600,
    fontSize: '0.875rem'
  },
  
  statusValueGood: {
    color: '#10b981'
  },
  
  statusValueWarning: {
    color: '#f59e0b'
  },
  
  statusValueDanger: {
    color: '#ef4444'
  },
  
  emptyState: {
    textAlign: 'center',
    padding: '3rem 1.5rem'
  },
  
  emptyIcon: {
    fontSize: '4rem',
    marginBottom: '1rem',
    opacity: 0.5
  },
  
  emptyMessage: {
    color: '#64748b',
    fontSize: '1rem',
    lineHeight: 1.6,
    maxWidth: '300px',
    margin: '0 auto'
  },
  
  btn: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.5rem',
    borderRadius: '0.75rem',
    fontWeight: 600,
    fontSize: '0.875rem',
    textDecoration: 'none',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.15s ease-out',
    position: 'relative',
    overflow: 'hidden'
  },
  
  btnPrimary: {
    background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
    color: 'white',
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
  },
  
  btnSecondary: {
    background: '#f1f5f9',
    color: '#334155',
    border: '1px solid #cbd5e1'
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
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .stat-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
  }
  
  .modern-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
  }
  
  .activity-item:hover {
    background: #eff6ff;
    border-color: #bfdbfe;
    transform: translateX(4px);
  }
  
  .btn-primary:hover {
    background: linear-gradient(135deg, #2563eb, #1d4ed8);
    transform: translateY(-2px);
    box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  }
  
  .btn-secondary:hover {
    background: #e2e8f0;
    transform: translateY(-2px);
  }
  
  @media (max-width: 1024px) {
    .dashboard-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 1.5rem;
    }
    
    .dashboard-grid {
      grid-template-columns: 1fr;
    }
    
    .stats-grid {
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    }
    
    .metrics-grid {
      grid-template-columns: 1fr;
    }
  }
  
  @media (max-width: 768px) {
    .dashboard {
      padding: 1.5rem 0;
    }
    
    .dashboard-title {
      font-size: 2rem;
    }
    
    .stats-grid {
      grid-template-columns: 1fr;
      gap: 1rem;
    }
    
    .dashboard-grid {
      gap: 1.5rem;
    }
    
    .stat-card {
      padding: 1.5rem;
    }
    
    .stat-value {
      font-size: 2rem;
    }
    
    .activity-item {
      padding: 0.75rem;
    }
    
    .activity-avatar {
      width: 40px;
      height: 40px;
      font-size: 1rem;
    }
  }
  
  @media (max-width: 480px) {
    .container {
      padding: 0 1rem;
    }
    
    .dashboard-header {
      gap: 1rem;
    }
    
    .dashboard-title {
      font-size: 1.75rem;
    }
    
    .stat-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.5rem;
    }
    
    .metrics-grid {
      grid-template-columns: 1fr;
    }
  }
`;

const StatCard = ({ icon, title, value, trend, color }) => {
  const colorStyles = {
    primary: { background: 'linear-gradient(90deg, #3b82f6, #2563eb)' },
    success: { background: 'linear-gradient(90deg, #10b981, #059669)' },
    warning: { background: 'linear-gradient(90deg, #f59e0b, #d97706)' },
    info: { background: 'linear-gradient(90deg, #06b6d4, #0891b2)' }
  };

  const getTrendStyle = (trend) => {
    if (trend > 0) return styles.statTrendPositive;
    if (trend < 0) return styles.statTrendNegative;
    return styles.statTrendNeutral;
  };

  const getTrendIcon = (trend) => {
    if (trend > 0) return '↗️';
    if (trend < 0) return '↘️';
    return '➡️';
  };

  return (
    <div style={styles.statCard} className="stat-card">
      <div style={{...styles.statCardBefore, ...colorStyles[color]}}></div>
      <div style={styles.statHeader}>
        <div style={styles.statIcon}>{icon}</div>
        {typeof trend === 'number' && (
          <div style={{...styles.statTrend, ...getTrendStyle(trend)}}>
            <span>{getTrendIcon(trend)}</span>
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      <div style={styles.statContent}>
        <div style={styles.statValue}>{value || '--'}</div>
        <div style={styles.statLabel}>{title}</div>
      </div>
    </div>
  );
};

const ActivityCard = ({ title, data, emptyMessage }) => (
  <div style={styles.modernCard} className="modern-card">
    <div style={styles.cardHeader}>
      <h3 style={styles.cardTitle}>{title}</h3>
      <div style={styles.cardBadge}>
        {data?.length || 0} Active
      </div>
    </div>
    <div style={styles.cardBody}>
      {data && data.length > 0 ? (
        <div style={styles.activityList}>
          {data.map((item, index) => (
            <div key={index} style={styles.activityItem} className="activity-item">
              <div style={styles.activityAvatar}>
                <span>{item['judge__user__username']?.charAt(0).toUpperCase() || 'J'}</span>
              </div>
              <div style={styles.activityContent}>
                <div style={styles.activityName}>{item['judge__user__username'] || 'Judge'}</div>
                <div style={styles.activityDetail}>{item.count} submissions reviewed</div>
              </div>
              <div style={styles.activityBadge}>
                <span>{item.count}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>📊</div>
          <p style={styles.emptyMessage}>{emptyMessage}</p>
        </div>
      )}
    </div>
  </div>
);

const ProgressCard = ({ title }) => (
  <div style={styles.modernCard} className="modern-card">
    <div style={styles.cardHeader}>
      <h3 style={styles.cardTitle}>{title}</h3>
    </div>
    <div style={styles.cardBody}>
      <div style={styles.progressSection}>
        <div style={styles.progressItem}>
          <div style={styles.progressHeader}>
            <span style={styles.progressLabel}>Submissions Reviewed</span>
            <span style={styles.progressValue}>75%</span>
          </div>
          <div style={styles.progressBar}>
            <div style={{...styles.progressFill, width: '75%'}}></div>
          </div>
        </div>
        
        <div style={styles.progressItem}>
          <div style={styles.progressHeader}>
            <span style={styles.progressLabel}>Judges Active</span>
            <span style={styles.progressValue}>90%</span>
          </div>
          <div style={styles.progressBar}>
            <div style={{...styles.progressFill, width: '90%'}}></div>
          </div>
        </div>
        
        <div style={styles.progressItem}>
          <div style={styles.progressHeader}>
            <span style={styles.progressLabel}>Competition Progress</span>
            <span style={styles.progressValue}>60%</span>
          </div>
          <div style={styles.progressBar}>
            <div style={{...styles.progressFill, width: '60%'}}></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const MetricsCard = ({ title }) => (
  <div style={styles.modernCard} className="modern-card">
    <div style={styles.cardHeader}>
      <h3 style={styles.cardTitle}>{title}</h3>
    </div>
    <div style={styles.cardBody}>
      <div style={styles.metricsGrid}>
        <div style={styles.metricItem}>
          <div style={styles.metricValue}>4.2</div>
          <div style={styles.metricLabel}>Avg Score</div>
        </div>
        <div style={styles.metricItem}>
          <div style={styles.metricValue}>2.5</div>
          <div style={styles.metricLabel}>Avg Time (days)</div>
        </div>
        <div style={styles.metricItem}>
          <div style={styles.metricValue}>12</div>
          <div style={styles.metricLabel}>Pending Reviews</div>
        </div>
        <div style={styles.metricItem}>
          <div style={styles.metricValue}>95%</div>
          <div style={styles.metricLabel}>Quality Rate</div>
        </div>
      </div>
    </div>
  </div>
);

const SystemStatusCard = ({ title }) => (
  <div style={styles.modernCard} className="modern-card">
    <div style={styles.cardHeader}>
      <h3 style={styles.cardTitle}>{title}</h3>
    </div>
    <div style={styles.cardBody}>
      <div style={styles.statusList}>
        <div style={styles.statusItem}>
          <div style={styles.statusLabel}>
            <span style={styles.statusIcon}>🟢</span>
            Platform Status
          </div>
          <div style={{...styles.statusValue, ...styles.statusValueGood}}>
            Operational
          </div>
        </div>
        
        <div style={styles.statusItem}>
          <div style={styles.statusLabel}>
            <span style={styles.statusIcon}>🟡</span>
            Submission Queue
          </div>
          <div style={{...styles.statusValue, ...styles.statusValueWarning}}>
            12 Pending
          </div>
        </div>
        
        <div style={styles.statusItem}>
          <div style={styles.statusLabel}>
            <span style={styles.statusIcon}>🟢</span>
            Judge Availability
          </div>
          <div style={{...styles.statusValue, ...styles.statusValueGood}}>
            8/10 Active
          </div>
        </div>
        
        <div style={styles.statusItem}>
          <div style={styles.statusLabel}>
            <span style={styles.statusIcon}>🟢</span>
            System Load
          </div>
          <div style={{...styles.statusValue, ...styles.statusValueGood}}>
            Normal
          </div>
        </div>
      </div>
    </div>
  </div>
);

const CommitteeDashboard = () => {
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

  if (loading) {
    return (
      <>
        <style>{cssStyles}</style>
        <div style={styles.dashboardLoading}>
          <div style={styles.spinner}></div>
          <p>Loading committee dashboard...</p>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <style>{cssStyles}</style>
        <div style={styles.dashboardError}>
          <div style={styles.errorIcon}>⚠️</div>
          <h2 style={styles.errorTitle}>Error Loading Dashboard</h2>
          <p style={styles.errorMessage}>{error}</p>
          <button style={{...styles.btn, ...styles.btnPrimary}} className="btn-primary" onClick={() => window.location.reload()}>
            Try Again
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{cssStyles}</style>
      
      <div style={styles.dashboard}>
        <div style={styles.container}>
          <div style={styles.dashboardHeader}>
            <div style={styles.headerContent}>
              <h1 style={styles.dashboardTitle}>
                <span style={styles.titleIcon}>📋</span>
                Committee Dashboard
              </h1>
              <p style={styles.dashboardSubtitle}>
                Monitor competition progress and oversee judging activities with comprehensive insights.
              </p>
            </div>
            <div style={styles.headerActions}>
              <button 
                style={{...styles.btn, ...styles.btnSecondary}}
                className="btn-secondary"
                onClick={() => window.print()}
              >
                <span>🖨️</span>
                Print Report
              </button>
            </div>
          </div>

          <div style={styles.statsGrid}>
            <StatCard
              icon="👥"
              title="Total Participants"
              value={stats?.total_participants}
              trend={12}
              color="primary"
            />
            <StatCard
              icon="📄"
              title="Total Submissions"
              value={stats?.total_submissions}
              trend={8}
              color="success"
            />
            <StatCard
              icon="⭐"
              title="Average Score"
              value={stats?.average_score ? stats.average_score.toFixed(2) : '--'}
              trend={-3}
              color="warning"
            />
            <StatCard
              icon="📊"
              title="Review Progress"
              value="75%"
              trend={15}
              color="info"
            />
          </div>

          <div style={styles.dashboardGrid}>
            <div style={styles.dashboardSection}>
              <ActivityCard
                title="Judge Performance"
                data={stats?.judge_activity}
                emptyMessage="No judge activity to display. Activity will appear here once judges start reviewing submissions."
              />
            </div>

            <div style={styles.dashboardSection}>
              <ProgressCard title="Competition Progress" />
            </div>
          </div>

          <div style={styles.dashboardGrid}>
            <div style={styles.dashboardSection}>
              <MetricsCard title="Key Metrics" />
            </div>

            <div style={styles.dashboardSection}>
              <SystemStatusCard title="System Status" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CommitteeDashboard;