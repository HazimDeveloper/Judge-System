import React, { useEffect, useState, useContext } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ProfessionalAdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/api/dashboard/stats/');
        setStats(res.data);
      } catch (err) {
        setError('Failed to load dashboard stats.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const handleExport = async () => {
    try {
      const res = await api.get('/api/dashboard/export-scores/', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'scores_report.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('Failed to export scores.');
    }
  };

  // Chart data for submissions per competition
  const competitionLabels = stats?.competition_submissions?.map(c => c.competition) || [];
  const competitionCounts = stats?.competition_submissions?.map(c => c.count) || [];
  const competitionChartData = {
    labels: competitionLabels,
    datasets: [
      {
        label: 'Submissions',
        data: competitionCounts,
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
        borderRadius: 6,
      },
    ],
  };
  const competitionChartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Submissions per Competition' },
    },
    scales: {
      y: { beginAtZero: true, ticks: { stepSize: 1 } },
    },
  };

  const styles = {
    dashboard: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
      padding: '40px 40px 80px 40px'
    },
    
    header: {
      marginBottom: '48px'
    },
    
    welcomeSection: {
      background: 'linear-gradient(135deg, #34d399 0%, #10b981 100%)',
      borderRadius: '24px',
      padding: '40px',
      color: 'white',
      marginBottom: '32px',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 20px 40px rgba(52, 211, 153, 0.15)'
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
    
    welcomePattern: {
      position: 'absolute',
      top: 0,
      right: 0,
      width: '400px',
      height: '100%',
      background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E") repeat',
      opacity: 0.3
    },
    
    titleSection: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '32px'
    },
    
    title: {
      fontSize: '28px',
      fontWeight: '800',
      color: '#1e293b',
      margin: 0,
      letterSpacing: '-0.5px'
    },
    
    titleIcon: {
      fontSize: '32px',
      marginRight: '12px',
      background: 'linear-gradient(135deg, #34d399 0%, #10b981 100%)',
      backgroundClip: 'text',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent'
    },
    
    actionButtons: {
      display: 'flex',
      gap: '16px'
    },
    
    btn: {
      padding: '12px 24px',
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: '600',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      textDecoration: 'none'
    },
    
    btnPrimary: {
      background: 'linear-gradient(135deg, #34d399 0%, #10b981 100%)',
      color: 'white',
      boxShadow: '0 4px 12px rgba(52, 211, 153, 0.25)'
    },
    
    btnSecondary: {
      background: 'white',
      color: '#64748b',
      border: '1px solid #e2e8f0',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
    },
    
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '24px',
      marginBottom: '48px'
    },
    
    statCard: {
      background: 'white',
      borderRadius: '20px',
      padding: '32px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.06)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      position: 'relative',
      overflow: 'hidden',
      cursor: 'pointer'
    },
    
    statCardHover: {
      transform: 'translateY(-4px)',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.12)'
    },
    
    statHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '24px'
    },
    
    statIcon: {
      width: '56px',
      height: '56px',
      borderRadius: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '24px',
      color: 'white',
      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15)'
    },
    
    statTrend: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      padding: '6px 12px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '600'
    },
    
    trendPositive: {
      background: 'rgba(16, 185, 129, 0.1)',
      color: '#059669'
    },
    
    trendNegative: {
      background: 'rgba(239, 68, 68, 0.1)',
      color: '#dc2626'
    },
    
    statValue: {
      fontSize: '36px',
      fontWeight: '900',
      color: '#1e293b',
      marginBottom: '8px',
      lineHeight: '1'
    },
    
    statLabel: {
      fontSize: '16px',
      color: '#64748b',
      fontWeight: '600',
      marginBottom: '16px'
    },
    
    statDescription: {
      fontSize: '14px',
      color: '#94a3b8',
      lineHeight: '1.5'
    },
    
    chartsSection: {
      display: 'grid',
      gridTemplateColumns: '2fr 1fr',
      gap: '32px',
      marginBottom: '48px'
    },
    
    chartCard: {
      background: 'white',
      borderRadius: '20px',
      padding: '32px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.06)'
    },
    
    chartHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '24px'
    },
    
    chartTitle: {
      fontSize: '20px',
      fontWeight: '700',
      color: '#1e293b'
    },
    
    chartSubtitle: {
      fontSize: '14px',
      color: '#64748b',
      marginTop: '4px'
    },
    
    chartPlaceholder: {
      height: '300px',
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#94a3b8',
      fontSize: '16px',
      fontWeight: '500',
      border: '2px dashed #e2e8f0'
    },
    
    activityCard: {
      background: 'white',
      borderRadius: '20px',
      padding: '32px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.06)'
    },
    
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
      borderRadius: '12px',
      background: '#f8fafc',
      border: '1px solid #e2e8f0',
      transition: 'all 0.2s ease'
    },
    
    activityAvatar: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #34d399 0%, #10b981 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '16px',
      fontWeight: '600'
    },
    
    activityContent: {
      flex: 1
    },
    
    activityName: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#1e293b',
      marginBottom: '2px'
    },
    
    activityAction: {
      fontSize: '13px',
      color: '#64748b'
    },
    
    activityTime: {
      fontSize: '12px',
      color: '#94a3b8',
      fontWeight: '500'
    },
    
    quickActions: {
      background: 'white',
      borderRadius: '20px',
      padding: '32px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.06)'
    },
    
    quickActionsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '16px'
    },
    
    quickActionItem: {
      padding: '20px',
      borderRadius: '12px',
      border: '1px solid #e2e8f0',
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      textAlign: 'center'
    },
    
    quickActionIcon: {
      fontSize: '32px',
      marginBottom: '12px',
      display: 'block'
    },
    
    quickActionLabel: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#1e293b',
      marginBottom: '4px'
    },
    
    quickActionDesc: {
      fontSize: '12px',
      color: '#64748b'
    },
    
    loadingSpinner: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      fontSize: '18px',
      color: '#64748b'
    },
    
    spinner: {
      width: '40px',
      height: '40px',
      border: '4px solid #f1f5f9',
      borderTop: '4px solid #34d399',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      marginRight: '16px'
    },
    
    errorCard: {
      background: 'white',
      borderRadius: '20px',
      padding: '48px',
      border: '1px solid #fed7d7',
      boxShadow: '0 8px 24px rgba(239, 68, 68, 0.1)',
      textAlign: 'center',
      color: '#dc2626'
    }
  };

  const keyframes = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `;

  if (loading) {
    return (
      <>
        <style>{keyframes}</style>
        <div style={styles.loadingSpinner}>
          <div style={styles.spinner}></div>
          Loading dashboard data...
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <style>{keyframes}</style>
        <div style={styles.dashboard}>
          <div style={styles.errorCard}>
            <h2>⚠️ Error Loading Dashboard</h2>
            <p>{error}</p>
            <button 
              style={{...styles.btn, ...styles.btnPrimary, marginTop: '20px'}}
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        </div>
      </>
    );
  }

  const StatCard = ({ icon, title, value, trend, description, color, onClick }) => {
    const [isHovered, setIsHovered] = useState(false);
    
    return (
      <div 
        style={{
          ...styles.statCard,
          ...(isHovered ? styles.statCardHover : {})
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onClick}
      >
        <div style={styles.statHeader}>
          <div style={{
            ...styles.statIcon,
            background: color
          }}>
            {icon}
          </div>
          {trend && (
            <div style={{
              ...styles.statTrend,
              ...(trend > 0 ? styles.trendPositive : styles.trendNegative)
            }}>
              <span>{trend > 0 ? '↗️' : '↘️'}</span>
              <span>{Math.abs(trend)}%</span>
            </div>
          )}
        </div>
        <div style={styles.statValue}>{value || '--'}</div>
        <div style={styles.statLabel}>{title}</div>
        <div style={styles.statDescription}>{description}</div>
      </div>
    );
  };

  return (
    <>
      <style>{keyframes}</style>
      <div style={styles.dashboard}>
        {/* Welcome Section */}
        <div style={styles.welcomeSection}>
          <div style={styles.welcomePattern}></div>
          <div style={styles.welcomeContent}>
            <h1 style={styles.welcomeTitle}>
              Welcome back, {user?.username || 'Admin'}! 👋
            </h1>
            <p style={styles.welcomeSubtitle}>
              Here's what's happening with your platform today. You have {stats?.total_submissions || 0} submissions to review.
            </p>
          </div>
        </div>

        {/* Title Section */}
        <div style={styles.titleSection}>
          <h2 style={styles.title}>
            <span style={styles.titleIcon}>📊</span>
            Dashboard Overview
          </h2>
          <div style={styles.actionButtons}>
            <button 
              style={{...styles.btn, ...styles.btnSecondary}}
              onClick={() => window.print()}
              onMouseEnter={(e) => {
                e.target.style.background = '#f1f5f9';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'white';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              <span>🖨️</span>
              Print Report
            </button>
            <button 
              style={{...styles.btn, ...styles.btnPrimary}}
              onClick={handleExport}
              onMouseEnter={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 24px rgba(52, 211, 153, 0.35)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #34d399 0%, #10b981 100%)';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 12px rgba(52, 211, 153, 0.25)';
              }}
            >
              <span>📊</span>
              Export Data
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div style={styles.statsGrid}>
          <StatCard
            icon="👥"
            title="Total Participants"
            value={stats?.total_participants}
            trend={12}
            description="Active users in the system"
            color="linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)"
            onClick={() => navigate('/admin/users')}
          />
          <StatCard
            icon="📄"
            title="Total Submissions"
            value={stats?.total_submissions}
            trend={8}
            description="Projects submitted for review"
            color="linear-gradient(135deg, #34d399 0%, #10b981 100%)"
            onClick={() => navigate('/admin/submissions')}
          />
          <StatCard
            icon="⭐"
            title="Average Score"
            value={stats?.average_score ? stats.average_score.toFixed(1) : '--'}
            trend={-3}
            description="Overall submission quality"
            color="linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
            onClick={() => navigate('/admin/scoring')}
          />
          <StatCard
            icon="🏆"
            title="Competitions"
            value="4"
            trend={25}
            description="Active competitions running"
            color="linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)"
            onClick={() => navigate('/admin/competitions')}
          />
        </div>

        {/* Submissions per Competition Chart */}
        <div style={{ margin: '40px 0' }}>
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '32px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 8px 24px rgba(0,0,0,0.06)'
          }}>
            <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b', marginBottom: '16px' }}>
              Submissions per Competition
            </h3>
            {competitionLabels.length > 0 ? (
              <Bar data={competitionChartData} options={competitionChartOptions} height={120} />
            ) : (
              <div style={{ color: '#94a3b8', fontStyle: 'italic', textAlign: 'center', padding: 32 }}>
                No competition submission data available.
              </div>
            )}
          </div>
        </div>

        {/* Charts Section */}
        <div style={styles.chartsSection}>
          <div style={styles.chartCard}>
            <div style={styles.chartHeader}>
              <div>
                <h3 style={styles.chartTitle}>Submission Trends</h3>
                <p style={styles.chartSubtitle}>Weekly submission activity</p>
              </div>
            </div>
            <div style={styles.chartPlaceholder}>
              📈 Chart visualization would go here
            </div>
          </div>

          <div style={styles.activityCard}>
            <div style={styles.chartHeader}>
              <div>
                <h3 style={styles.chartTitle}>Recent Activity</h3>
                <p style={styles.chartSubtitle}>Latest system events</p>
              </div>
            </div>
            <div style={styles.activityList}>
              {[
                { name: 'John Doe', action: 'submitted a new project', time: '2 min ago' },
                { name: 'Jane Smith', action: 'completed review', time: '5 min ago' },
                { name: 'Mike Johnson', action: 'updated score', time: '12 min ago' },
                { name: 'Sarah Wilson', action: 'created competition', time: '1 hour ago' }
              ].map((activity, index) => (
                <div 
                  key={index} 
                  style={styles.activityItem}
                  onMouseEnter={(e) => {
                    e.target.style.background = '#ecfdf5';
                    e.target.style.borderColor = '#34d399';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = '#f8fafc';
                    e.target.style.borderColor = '#e2e8f0';
                  }}
                >
                  <div style={styles.activityAvatar}>
                    {activity.name.charAt(0)}
                  </div>
                  <div style={styles.activityContent}>
                    <div style={styles.activityName}>{activity.name}</div>
                    <div style={styles.activityAction}>{activity.action}</div>
                  </div>
                  <div style={styles.activityTime}>{activity.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={styles.quickActions}>
          <div style={styles.chartHeader}>
            <div>
              <h3 style={styles.chartTitle}>Quick Actions</h3>
              <p style={styles.chartSubtitle}>Common administrative tasks</p>
            </div>
          </div>
          <div style={styles.quickActionsGrid}>
            {[
              { icon: '👥', label: 'Manage Users', desc: 'Add or edit users', path: '/admin/users' },
              { icon: '🏆', label: 'New Competition', desc: 'Create competition', path: '/admin/competitions' },
              { icon: '📊', label: 'View Reports', desc: 'Generate reports', path: '/admin/scoring' },
              { icon: '⚙️', label: 'Settings', desc: 'System configuration', path: '/admin/settings' }
            ].map((action, index) => (
              <div 
                key={index}
                style={styles.quickActionItem}
                onClick={() => navigate(action.path)}
                onMouseEnter={(e) => {
                  e.target.style.background = 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)';
                  e.target.style.borderColor = '#34d399';
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 16px rgba(52, 211, 153, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)';
                  e.target.style.borderColor = '#e2e8f0';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <span style={styles.quickActionIcon}>{action.icon}</span>
                <div style={styles.quickActionLabel}>{action.label}</div>
                <div style={styles.quickActionDesc}>{action.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfessionalAdminDashboard;