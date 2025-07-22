import React, { useEffect, useState } from 'react';
import api from '../services/api';

const ModernAdminSubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    setError('');
    try {
      const res = await api.get('/api/submissions/');
      setSubmissions(res.data);
    } catch (err) {
      setError('Could not load submissions. Please refresh the page.');
      setSubmissions([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredAndSortedSubmissions = React.useMemo(() => {
    let filtered = submissions.filter(submission => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        submission.title?.toLowerCase().includes(searchLower) ||
        submission.participant?.user?.toLowerCase().includes(searchLower) ||
        submission.description?.toLowerCase().includes(searchLower);
      
      if (filterBy === 'all') return matchesSearch;
      return matchesSearch && submission.status === filterBy;
    });

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return (a.title || '').localeCompare(b.title || '');
        case 'participant':
          return (a.participant?.user || '').localeCompare(b.participant?.user || '');
        case 'status':
          return (a.status || '').localeCompare(b.status || '');
        case 'oldest':
          return new Date(a.submitted_at || 0) - new Date(b.submitted_at || 0);
        default:
          return new Date(b.submitted_at || 0) - new Date(a.submitted_at || 0);
      }
    });
  }, [submissions, searchTerm, filterBy, sortBy]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return '#f59e0b';
      case 'UNDER_REVIEW':
        return '#06b6d4';
      case 'COMPLETED':
        return '#10b981';
      case 'REJECTED':
        return '#ef4444';
      default:
        return '#64748b';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PENDING':
        return '⏳';
      case 'UNDER_REVIEW':
        return '👀';
      case 'COMPLETED':
        return '✅';
      case 'REJECTED':
        return '❌';
      default:
        return '📄';
    }
  };

  const openDetailsModal = (submission) => {
    setSelectedSubmission(submission);
    setShowDetailsModal(true);
  };

  const styles = {
    dashboard: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
      padding: '40px'
    },
    
    welcomeSection: {
      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      borderRadius: '24px',
      padding: '40px',
      color: 'white',
      marginBottom: '40px',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 20px 40px rgba(16, 185, 129, 0.15)'
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
    
    statsSection: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '24px',
      marginBottom: '40px'
    },
    
    statCard: {
      background: 'white',
      borderRadius: '20px',
      padding: '24px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.06)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      textAlign: 'center'
    },
    
    statIcon: {
      fontSize: '32px',
      marginBottom: '12px',
      display: 'block'
    },
    
    statValue: {
      fontSize: '28px',
      fontWeight: '800',
      color: '#1e293b',
      marginBottom: '4px'
    },
    
    statLabel: {
      fontSize: '14px',
      color: '#64748b',
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    },
    
    controlsSection: {
      background: 'white',
      borderRadius: '20px',
      padding: '32px',
      marginBottom: '32px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.06)'
    },
    
    controlsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '20px',
      alignItems: 'end'
    },
    
    formGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    },
    
    formLabel: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#374151'
    },
    
    formControl: {
      padding: '12px 16px',
      borderRadius: '12px',
      border: '2px solid #e5e7eb',
      background: 'white',
      fontSize: '16px',
      transition: 'all 0.2s ease',
      fontFamily: 'inherit',
      outline: 'none'
    },
    
    submissionsSection: {
      background: 'white',
      borderRadius: '24px',
      padding: '32px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.06)'
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
    
    submissionsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
      gap: '24px'
    },
    
    submissionCard: {
      background: '#f8fafc',
      borderRadius: '16px',
      padding: '24px',
      border: '1px solid #e2e8f0',
      transition: 'all 0.3s ease',
      cursor: 'pointer'
    },
    
    submissionHeader: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      marginBottom: '16px'
    },
    
    submissionInfo: {
      flex: 1
    },
    
    submissionTitle: {
      fontSize: '18px',
      fontWeight: '700',
      color: '#1e293b',
      marginBottom: '4px'
    },
    
    submissionParticipant: {
      fontSize: '14px',
      color: '#64748b',
      marginBottom: '8px'
    },
    
    submissionDate: {
      fontSize: '12px',
      color: '#94a3b8',
      fontWeight: '500'
    },
    
    statusBadge: {
      padding: '6px 12px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      whiteSpace: 'nowrap'
    },
    
    submissionDescription: {
      color: '#64748b',
      lineHeight: '1.6',
      marginBottom: '16px',
      fontSize: '14px'
    },
    
    submissionFooter: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    
    submissionLinks: {
      display: 'flex',
      gap: '8px'
    },
    
    linkBtn: {
      padding: '6px 12px',
      borderRadius: '6px',
      fontSize: '12px',
      fontWeight: '500',
      textDecoration: 'none',
      border: '1px solid #e2e8f0',
      background: 'white',
      color: '#64748b',
      transition: 'all 0.2s ease'
    },
    
    viewBtn: {
      background: '#10b981',
      color: 'white',
      border: 'none',
      padding: '8px 16px',
      borderRadius: '8px',
      fontSize: '12px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease'
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
      maxWidth: '700px',
      maxHeight: '90vh',
      overflow: 'auto',
      animation: 'slideUp 0.3s ease-out'
    },
    
    modalHeader: {
      background: 'linear-gradient(135deg, #f8fafc 0%, #ecfdf5 100%)',
      padding: '32px',
      borderBottom: '1px solid #e2e8f0'
    },
    
    modalTitle: {
      fontSize: '24px',
      fontWeight: '800',
      color: '#1e293b',
      marginBottom: '8px'
    },
    
    modalSubtitle: {
      color: '#64748b',
      fontSize: '16px'
    },
    
    modalBody: {
      padding: '32px'
    },
    
    detailsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '20px',
      marginBottom: '24px'
    },
    
    detailItem: {
      background: '#f8fafc',
      borderRadius: '12px',
      padding: '16px',
      border: '1px solid #e2e8f0'
    },
    
    detailLabel: {
      fontSize: '12px',
      fontWeight: '600',
      color: '#64748b',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      marginBottom: '8px'
    },
    
    detailValue: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#1e293b'
    },
    
    modalFooter: {
      display: 'flex',
      gap: '12px',
      justifyContent: 'flex-end',
      padding: '24px 32px',
      borderTop: '1px solid #e2e8f0',
      background: '#f8fafc'
    },
    
    btn: {
      padding: '12px 24px',
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: '600',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    },
    
    btnSecondary: {
      background: '#f8fafc',
      color: '#64748b',
      border: '1px solid #e2e8f0'
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
      borderTop: '4px solid #10b981',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      marginRight: '16px'
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
          Loading submissions...
        </div>
      </>
    );
  }

  const StatCard = ({ icon, title, value, color = '#10b981' }) => (
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
      <div style={{...styles.statIcon, color}}>{icon}</div>
      <div style={styles.statValue}>{value}</div>
      <div style={styles.statLabel}>{title}</div>
    </div>
  );

  const SubmissionCard = ({ submission }) => (
    <div 
      style={styles.submissionCard}
      onClick={() => openDetailsModal(submission)}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = '#ecfdf5';
        e.currentTarget.style.borderColor = '#10b981';
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 12px 24px rgba(16, 185, 129, 0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = '#f8fafc';
        e.currentTarget.style.borderColor = '#e2e8f0';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div style={styles.submissionHeader}>
        <div style={styles.submissionInfo}>
          <h3 style={styles.submissionTitle}>{submission.title}</h3>
          <div style={styles.submissionParticipant}>
            👤 {submission.participant?.user || 'Unknown Participant'}
          </div>
          <div style={styles.submissionDate}>
            📅 Submitted {new Date(submission.submitted_at).toLocaleDateString()}
          </div>
        </div>
        <div style={{
          ...styles.statusBadge,
          background: getStatusColor(submission.status)
        }}>
          <span>{getStatusIcon(submission.status)}</span>
          <span>{submission.status.replace('_', ' ')}</span>
        </div>
      </div>

      <p style={styles.submissionDescription}>
        {submission.description?.length > 150 
          ? `${submission.description.substring(0, 150)}...`
          : submission.description
        }
      </p>

      <div style={styles.submissionFooter}>
        <div style={styles.submissionLinks}>
          {submission.file && (
            <a 
              href={submission.file} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{...styles.linkBtn, background: '#ef4444', color: 'white', border: 'none'}}
              onClick={(e) => e.stopPropagation()}
              onMouseEnter={(e) => {
                e.target.style.background = '#dc2626';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = '#ef4444';
              }}
            >
              📄 File
            </a>
          )}
          {submission.link && (
            <a 
              href={submission.link} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{...styles.linkBtn, background: '#06b6d4', color: 'white', border: 'none'}}
              onClick={(e) => e.stopPropagation()}
              onMouseEnter={(e) => {
                e.target.style.background = '#0891b2';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = '#06b6d4';
              }}
            >
              🔗 Link
            </a>
          )}
        </div>
        <button 
          style={styles.viewBtn}
          onClick={(e) => {
            e.stopPropagation();
            openDetailsModal(submission);
          }}
          onMouseEnter={(e) => {
            e.target.style.background = '#059669';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = '#10b981';
          }}
        >
          👁️ View Details
        </button>
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
            <h1 style={styles.welcomeTitle}>
              All Submissions 📄
            </h1>
            <p style={styles.welcomeSubtitle}>
              Monitor and manage all competition submissions with detailed analytics and comprehensive overview tools.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div style={styles.statsSection}>
          <StatCard
            icon="📄"
            title="Total Submissions"
            value={submissions.length}
            color="#10b981"
          />
          <StatCard
            icon="⏳"
            title="Pending"
            value={submissions.filter(s => s.status === 'PENDING').length}
            color="#f59e0b"
          />
          <StatCard
            icon="👀"
            title="Under Review"
            value={submissions.filter(s => s.status === 'UNDER_REVIEW').length}
            color="#06b6d4"
          />
          <StatCard
            icon="✅"
            title="Completed"
            value={submissions.filter(s => s.status === 'COMPLETED').length}
            color="#10b981"
          />
          <StatCard
            icon="👥"
            title="Participants"
            value={new Set(submissions.map(s => s.participant?.user)).size}
            color="#8b5cf6"
          />
        </div>

        {/* Controls Section */}
        <div style={styles.controlsSection}>
          <div style={styles.controlsGrid}>
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Search</label>
              <input
                type="text"
                style={styles.formControl}
                placeholder="Search titles, participants, descriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={(e) => {
                  e.target.style.borderColor = '#10b981';
                  e.target.style.boxShadow = '0 0 0 4px rgba(16, 185, 129, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Filter by Status</label>
              <select
                style={styles.formControl}
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                onFocus={(e) => {
                  e.target.style.borderColor = '#10b981';
                  e.target.style.boxShadow = '0 0 0 4px rgba(16, 185, 129, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <option value="all">All Statuses</option>
                <option value="PENDING">Pending</option>
                <option value="UNDER_REVIEW">Under Review</option>
                <option value="COMPLETED">Completed</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Sort by</label>
              <select
                style={styles.formControl}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                onFocus={(e) => {
                  e.target.style.borderColor = '#10b981';
                  e.target.style.boxShadow = '0 0 0 4px rgba(16, 185, 129, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="title">Title A-Z</option>
                <option value="participant">Participant A-Z</option>
                <option value="status">Status</option>
              </select>
            </div>
          </div>
        </div>

        {/* Submissions Section */}
        <div style={styles.submissionsSection}>
          <h2 style={styles.sectionTitle}>
            <span style={styles.sectionIcon}>📋</span>
            Submissions ({filteredAndSortedSubmissions.length})
          </h2>

          {error && (
            <div style={{...styles.alert, ...styles.alertDanger}}>
              <span>⚠️</span>
              {error}
            </div>
          )}

          {filteredAndSortedSubmissions.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>📄</div>
              <h3 style={styles.emptyTitle}>No submissions found</h3>
              <p style={styles.emptyDesc}>
                {searchTerm || filterBy !== 'all' 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Submissions will appear here once participants start submitting their work.'
                }
              </p>
            </div>
          ) : (
            <div style={styles.submissionsGrid}>
              {filteredAndSortedSubmissions.map(submission => (
                <SubmissionCard key={submission.id} submission={submission} />
              ))}
            </div>
          )}
        </div>

        {/* Details Modal */}
        {showDetailsModal && selectedSubmission && (
          <div style={styles.modalOverlay} onClick={() => setShowDetailsModal(false)}>
            <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
              <div style={styles.modalHeader}>
                <h2 style={styles.modalTitle}>{selectedSubmission.title}</h2>
                <p style={styles.modalSubtitle}>
                  Submission Details and Information
                </p>
              </div>
              
              <div style={styles.modalBody}>
                <div style={styles.detailsGrid}>
                  <div style={styles.detailItem}>
                    <div style={styles.detailLabel}>Participant</div>
                    <div style={styles.detailValue}>
                      {selectedSubmission.participant?.user || 'Unknown'}
                    </div>
                  </div>
                  
                  <div style={styles.detailItem}>
                    <div style={styles.detailLabel}>Status</div>
                    <div style={{
                      ...styles.detailValue,
                      color: getStatusColor(selectedSubmission.status)
                    }}>
                      {getStatusIcon(selectedSubmission.status)} {selectedSubmission.status.replace('_', ' ')}
                    </div>
                  </div>
                  
                  <div style={styles.detailItem}>
                    <div style={styles.detailLabel}>Submitted</div>
                    <div style={styles.detailValue}>
                      {new Date(selectedSubmission.submitted_at).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div style={styles.detailItem}>
                    <div style={styles.detailLabel}>ID</div>
                    <div style={styles.detailValue}>#{selectedSubmission.id}</div>
                  </div>
                </div>

                <div style={{marginBottom: '24px'}}>
                  <div style={styles.detailLabel}>Description</div>
                  <div style={{
                    background: '#f8fafc',
                    borderRadius: '12px',
                    padding: '16px',
                    border: '1px solid #e2e8f0',
                    marginTop: '8px',
                    lineHeight: '1.6',
                    color: '#374151'
                  }}>
                    {selectedSubmission.description || 'No description provided.'}
                  </div>
                </div>

                {(selectedSubmission.file || selectedSubmission.link) && (
                  <div>
                    <div style={styles.detailLabel}>Attachments</div>
                    <div style={{display: 'flex', gap: '12px', marginTop: '8px'}}>
                      {selectedSubmission.file && (
                        <a 
                          href={selectedSubmission.file} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          style={{
                            ...styles.linkBtn,
                            background: '#ef4444',
                            color: 'white',
                            border: 'none',
                            padding: '12px 20px'
                          }}
                        >
                          📄 Download File
                        </a>
                      )}
                      {selectedSubmission.link && (
                        <a 
                          href={selectedSubmission.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          style={{
                            ...styles.linkBtn,
                            background: '#06b6d4',
                            color: 'white',
                            border: 'none',
                            padding: '12px 20px'
                          }}
                        >
                          🔗 Open Link
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              <div style={styles.modalFooter}>
                <button 
                  style={{...styles.btn, ...styles.btnSecondary}}
                  onClick={() => setShowDetailsModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ModernAdminSubmissions;