import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import api from '../services/api';

const ProfessionalParticipantDashboard = () => {
  const { user } = useContext(AuthContext);
  const [submissions, setSubmissions] = useState([]);
  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formState, setFormState] = useState({ 
    title: '', 
    description: '', 
    competition_id: '', 
    link: '' 
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [submissionsRes, competitionsRes] = await Promise.all([
        api.get('/api/submissions/'),
        api.get('/api/submissions/competitions/')
      ]);
      setSubmissions(submissionsRes.data);
      setCompetitions(competitionsRes.data);
    } catch (err) {
      setError('Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const formData = new FormData();
      Object.keys(formState).forEach(key => {
        formData.append(key, formState[key]);
      });
      await api.post('/api/submissions/', formData);
      setShowModal(false);
      fetchData();
      setFormState({ title: '', description: '', competition_id: '', link: '' });
    } catch (err) {
      setError('Failed to submit project.');
    } finally {
      setSubmitting(false);
    }
  };

  const styles = {
    dashboard: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
      padding: '40px'
    },
    
    welcomeSection: {
      background: 'linear-gradient(135deg, #34d399 0%, #10b981 100%)',
      borderRadius: '24px',
      padding: '40px',
      color: 'white',
      marginBottom: '40px',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 20px 40px rgba(52, 211, 153, 0.15)'
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
      zIndex: 2,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    
    welcomeText: {
      flex: 1
    },
    
    welcomeTitle: {
      fontSize: '28px',
      fontWeight: '800',
      marginBottom: '8px',
      letterSpacing: '-0.5px'
    },
    
    welcomeSubtitle: {
      fontSize: '16px',
      opacity: 0.9,
      fontWeight: '500',
      lineHeight: '1.6'
    },
    
    welcomeAction: {
      background: 'rgba(255, 255, 255, 0.2)',
      color: 'white',
      border: 'none',
      padding: '16px 32px',
      borderRadius: '12px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    
    statsSection: {
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
    
    statCardHeader: {
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
    
    submissionsSection: {
      background: 'white',
      borderRadius: '24px',
      padding: '32px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.06)'
    },
    
    sectionHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '32px'
    },
    
    sectionTitle: {
      fontSize: '24px',
      fontWeight: '800',
      color: '#1e293b',
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    
    sectionIcon: {
      fontSize: '28px'
    },
    
    submissionsList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    },
    
    submissionCard: {
      background: '#f8fafc',
      borderRadius: '16px',
      padding: '24px',
      border: '1px solid #e2e8f0',
      transition: 'all 0.2s ease',
      position: 'relative'
    },
    
    submissionHeader: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      marginBottom: '16px'
    },
    
    submissionTitle: {
      fontSize: '18px',
      fontWeight: '700',
      color: '#1e293b',
      marginBottom: '4px'
    },
    
    submissionDate: {
      fontSize: '14px',
      color: '#64748b'
    },
    
    submissionStatus: {
      padding: '6px 12px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    },
    
    statusPending: {
      background: 'rgba(245, 158, 11, 0.1)',
      color: '#92400e'
    },
    
    statusReviewing: {
      background: 'rgba(59, 130, 246, 0.1)',
      color: '#1e40af'
    },
    
    statusCompleted: {
      background: 'rgba(16, 185, 129, 0.1)',
      color: '#065f46'
    },
    
    submissionDescription: {
      color: '#64748b',
      lineHeight: '1.6',
      marginBottom: '16px'
    },
    
    submissionFooter: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    
    submissionScore: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '8px 16px',
      background: 'linear-gradient(135deg, #34d399 0%, #10b981 100%)',
      color: 'white',
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: '600'
    },
    
    submissionActions: {
      display: 'flex',
      gap: '8px'
    },
    
    actionBtn: {
      padding: '8px 16px',
      borderRadius: '8px',
      fontSize: '12px',
      fontWeight: '500',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    },
    
    actionBtnPrimary: {
      background: '#34d399',
      color: 'white'
    },
    
    actionBtnSecondary: {
      background: '#f1f5f9',
      color: '#64748b'
    },
    
    sidebar: {
      display: 'flex',
      flexDirection: 'column',
      gap: '24px'
    },
    
    sidebarCard: {
      background: 'white',
      borderRadius: '20px',
      padding: '24px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.06)'
    },
    
    quickActions: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px'
    },
    
    quickAction: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '16px',
      borderRadius: '12px',
      background: '#f8fafc',
      border: '1px solid #e2e8f0',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      textDecoration: 'none',
      color: 'inherit'
    },
    
    quickActionIcon: {
      width: '40px',
      height: '40px',
      borderRadius: '10px',
      background: 'linear-gradient(135deg, #34d399 0%, #10b981 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '18px',
      color: 'white'
    },
    
    quickActionContent: {
      flex: 1
    },
    
    quickActionTitle: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#1e293b',
      marginBottom: '2px'
    },
    
    quickActionDesc: {
      fontSize: '12px',
      color: '#64748b'
    },
    
    recentActivity: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px'
    },
    
    activityItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px',
      borderRadius: '10px',
      background: '#f8fafc'
    },
    
    activityIcon: {
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      background: '#34d399',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '14px',
      color: 'white'
    },
    
    activityContent: {
      flex: 1
    },
    
    activityText: {
      fontSize: '13px',
      color: '#1e293b',
      fontWeight: '500',
      marginBottom: '2px'
    },
    
    activityTime: {
      fontSize: '11px',
      color: '#64748b'
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
      marginBottom: '24px',
      lineHeight: '1.5'
    },
    
    btn: {
      padding: '16px 32px',
      borderRadius: '12px',
      fontSize: '16px',
      fontWeight: '600',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px'
    },
    
    btnPrimary: {
      background: 'linear-gradient(135deg, #34d399 0%, #10b981 100%)',
      color: 'white',
      boxShadow: '0 4px 12px rgba(52, 211, 153, 0.25)'
    },
    
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.6)',
      backdropFilter: 'blur(8px)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    },
    
    modal: {
      background: 'white',
      borderRadius: '24px',
      width: '100%',
      maxWidth: '600px',
      maxHeight: '90vh',
      overflow: 'auto',
      animation: 'slideUp 0.3s ease-out'
    },
    
    modalHeader: {
      padding: '32px 32px 0 32px'
    },
    
    modalTitle: {
      fontSize: '24px',
      fontWeight: '800',
      color: '#1e293b',
      marginBottom: '8px'
    },
    
    modalDesc: {
      color: '#64748b',
      marginBottom: '24px'
    },
    
    modalBody: {
      padding: '0 32px 32px 32px'
    },
    
    formGroup: {
      marginBottom: '24px'
    },
    
    formLabel: {
      display: 'block',
      fontSize: '14px',
      fontWeight: '600',
      color: '#374151',
      marginBottom: '8px'
    },
    
    formControl: {
      width: '100%',
      padding: '16px',
      borderRadius: '12px',
      border: '2px solid #e5e7eb',
      fontSize: '16px',
      transition: 'all 0.2s ease',
      fontFamily: 'inherit'
    },
    
    formControlFocus: {
      borderColor: '#34d399',
      boxShadow: '0 0 0 4px rgba(52, 211, 153, 0.1)'
    },
    
    modalActions: {
      display: 'flex',
      gap: '12px',
      justifyContent: 'flex-end',
      marginTop: '24px'
    },
    
    btnSecondary: {
      background: '#f8fafc',
      color: '#64748b',
      border: '1px solid #e2e8f0'
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
      borderTop: '4px solid #34d399',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      marginRight: '16px'
    }
  };

  const keyframes = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(40px);
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
          Loading your dashboard...
        </div>
      </>
    );
  }

  const StatCard = ({ icon, title, value, trend, color }) => (
    <div 
      style={styles.statCard}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.12)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.06)';
      }}
    >
      <div style={styles.statCardHeader}>
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
      <div style={styles.statValue}>{value}</div>
      <div style={styles.statLabel}>{title}</div>
    </div>
  );

  const SubmissionCard = ({ submission }) => (
    <div 
      style={styles.submissionCard}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = '#ecfdf5';
        e.currentTarget.style.borderColor = '#34d399';
        e.currentTarget.style.transform = 'translateX(4px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = '#f8fafc';
        e.currentTarget.style.borderColor = '#e2e8f0';
        e.currentTarget.style.transform = 'translateX(0)';
      }}
    >
      <div style={styles.submissionHeader}>
        <div>
          <h3 style={styles.submissionTitle}>{submission.title}</h3>
          <p style={styles.submissionDate}>
            Submitted {new Date(submission.submitted_at).toLocaleDateString()}
          </p>
        </div>
        <div style={{
          ...styles.submissionStatus,
          ...(submission.status === 'PENDING' ? styles.statusPending :
              submission.status === 'UNDER_REVIEW' ? styles.statusReviewing :
              styles.statusCompleted)
        }}>
          {submission.status.replace('_', ' ')}
        </div>
      </div>
      
      <p style={styles.submissionDescription}>{submission.description}</p>
      
      <div style={styles.submissionFooter}>
        {submission.average_score && (
          <div style={styles.submissionScore}>
            <span>⭐</span>
            <span>{submission.average_score}/100</span>
          </div>
        )}
        <div style={styles.submissionActions}>
          <button style={{...styles.actionBtn, ...styles.actionBtnPrimary}}>
            View Details
          </button>
          <button style={{...styles.actionBtn, ...styles.actionBtnSecondary}}>
            Edit
          </button>
        </div>
      </div>
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
            <div style={styles.welcomeText}>
              <h1 style={styles.welcomeTitle}>
                Welcome back, {user?.username}! 🎯
              </h1>
              <p style={styles.welcomeSubtitle}>
                Ready to showcase your next amazing project? You have {submissions.length} submissions in progress.
              </p>
            </div>
            <button 
              style={styles.welcomeAction}
              onClick={() => setShowModal(true)}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.3)';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              <span>➕</span>
              New Submission
            </button>
          </div>
        </div>

        {/* Stats Section */}
        <div style={styles.statsSection}>
          <StatCard
            icon="📄"
            title="Total Submissions"
            value={submissions.length}
            trend={12}
            color="linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)"
          />
          <StatCard
            icon="⭐"
            title="Average Score"
            value={submissions.length > 0 ? "85.2" : "--"}
            trend={8}
            color="linear-gradient(135deg, #34d399 0%, #10b981 100%)"
          />
          <StatCard
            icon="🏆"
            title="Completed"
            value={submissions.filter(s => s.status === 'COMPLETED').length}
            trend={-5}
            color="linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
          />
          <StatCard
            icon="📊"
            title="In Review"
            value={submissions.filter(s => s.status === 'UNDER_REVIEW').length}
            trend={25}
            color="linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)"
          />
        </div>

        {/* Main Content */}
        <div style={styles.mainContent}>
          {/* Submissions Section */}
          <div style={styles.submissionsSection}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>
                <span style={styles.sectionIcon}>📚</span>
                Your Submissions
              </h2>
              <button 
                style={{...styles.btn, ...styles.btnPrimary}}
                onClick={() => setShowModal(true)}
                onMouseEnter={(e) => {
                  e.target.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'linear-gradient(135deg, #34d399 0%, #10b981 100%)';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                <span>➕</span>
                New Project
              </button>
            </div>

            <div style={styles.submissionsList}>
              {submissions.length === 0 ? (
                <div style={styles.emptyState}>
                  <div style={styles.emptyIcon}>📄</div>
                  <h3 style={styles.emptyTitle}>No submissions yet</h3>
                  <p style={styles.emptyDesc}>
                    Ready to showcase your work? Create your first submission and start your journey!
                  </p>
                  <button 
                    style={{...styles.btn, ...styles.btnPrimary}}
                    onClick={() => setShowModal(true)}
                  >
                    <span>🚀</span>
                    Create First Submission
                  </button>
                </div>
              ) : (
                submissions.map(submission => (
                  <SubmissionCard key={submission.id} submission={submission} />
                ))
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div style={styles.sidebar}>
            {/* Quick Actions */}
            <div style={styles.sidebarCard}>
              <h3 style={styles.sectionTitle}>
                <span style={styles.sectionIcon}>⚡</span>
                Quick Actions
              </h3>
              <div style={styles.quickActions}>
                <div 
                  style={styles.quickAction}
                  onClick={() => setShowModal(true)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#ecfdf5';
                    e.currentTarget.style.borderColor = '#34d399';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#f8fafc';
                    e.currentTarget.style.borderColor = '#e2e8f0';
                  }}
                >
                  <div style={styles.quickActionIcon}>📝</div>
                  <div style={styles.quickActionContent}>
                    <div style={styles.quickActionTitle}>New Submission</div>
                    <div style={styles.quickActionDesc}>Submit your latest project</div>
                  </div>
                </div>
                
                <div style={styles.quickAction}>
                  <div style={styles.quickActionIcon}>📊</div>
                  <div style={styles.quickActionContent}>
                    <div style={styles.quickActionTitle}>View Analytics</div>
                    <div style={styles.quickActionDesc}>Track your performance</div>
                  </div>
                </div>
                
                <div style={styles.quickAction}>
                  <div style={styles.quickActionIcon}>💬</div>
                  <div style={styles.quickActionContent}>
                    <div style={styles.quickActionTitle}>Feedback</div>
                    <div style={styles.quickActionDesc}>Review judge comments</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div style={styles.sidebarCard}>
              <h3 style={styles.sectionTitle}>
                <span style={styles.sectionIcon}>🕐</span>
                Recent Activity
              </h3>
              <div style={styles.recentActivity}>
                <div style={styles.activityItem}>
                  <div style={styles.activityIcon}>📝</div>
                  <div style={styles.activityContent}>
                    <div style={styles.activityText}>Project submitted</div>
                    <div style={styles.activityTime}>2 hours ago</div>
                  </div>
                </div>
                
                <div style={styles.activityItem}>
                  <div style={styles.activityIcon}>⭐</div>
                  <div style={styles.activityContent}>
                    <div style={styles.activityText}>Score received</div>
                    <div style={styles.activityTime}>1 day ago</div>
                  </div>
                </div>
                
                <div style={styles.activityItem}>
                  <div style={styles.activityIcon}>💬</div>
                  <div style={styles.activityContent}>
                    <div style={styles.activityText}>New feedback</div>
                    <div style={styles.activityTime}>3 days ago</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div style={styles.modalOverlay} onClick={() => setShowModal(false)}>
            <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
              <div style={styles.modalHeader}>
                <h2 style={styles.modalTitle}>Submit New Project</h2>
                <p style={styles.modalDesc}>
                  Share your amazing work with the community and get valuable feedback from experts.
                </p>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div style={styles.modalBody}>
                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Competition</label>
                    <select
                      style={styles.formControl}
                      value={formState.competition_id}
                      onChange={(e) => setFormState({...formState, competition_id: e.target.value})}
                      required
                    >
                      <option value="">Select a competition</option>
                      {competitions.map(comp => (
                        <option key={comp.id} value={comp.id}>{comp.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Project Title</label>
                    <input
                      type="text"
                      style={styles.formControl}
                      value={formState.title}
                      onChange={(e) => setFormState({...formState, title: e.target.value})}
                      placeholder="Enter your project title"
                      required
                    />
                  </div>
                  
                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Project Link</label>
                    <input
                      type="url"
                      style={styles.formControl}
                      value={formState.link}
                      onChange={(e) => setFormState({...formState, link: e.target.value})}
                      placeholder="https://github.com/username/project"
                    />
                  </div>
                  
                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Description</label>
                    <textarea
                      style={{...styles.formControl, minHeight: '120px'}}
                      value={formState.description}
                      onChange={(e) => setFormState({...formState, description: e.target.value})}
                      placeholder="Describe your project, its goals, and key features..."
                      required
                    />
                  </div>
                  
                  <div style={styles.modalActions}>
                    <button 
                      type="button" 
                      style={{...styles.btn, ...styles.btnSecondary}}
                      onClick={() => setShowModal(false)}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      style={{...styles.btn, ...styles.btnPrimary}}
                      disabled={submitting}
                    >
                      {submitting ? 'Submitting...' : '🚀 Submit Project'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProfessionalParticipantDashboard;