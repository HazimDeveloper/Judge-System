import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import api from '../services/api';

const ProfessionalJudgeDashboard = () => {
  const { user } = useContext(AuthContext);
  const [competitions, setCompetitions] = useState([]);
  const [selectedCompetition, setSelectedCompetition] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [rubrics, setRubrics] = useState([]);
  const [scores, setScores] = useState({});
  const [formState, setFormState] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState({});
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [showScoringModal, setShowScoringModal] = useState(false);

  useEffect(() => {
    fetchCompetitions();
  }, []);

  useEffect(() => {
    if (selectedCompetition) {
      fetchSubmissions();
    }
  }, [selectedCompetition]);

  const fetchCompetitions = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/competitions/');
      setCompetitions(res.data);
      if (res.data.length > 0) {
        setSelectedCompetition(res.data[0]);
      }
    } catch (err) {
      setError('Failed to load competitions.');
    } finally {
      setLoading(false);
    }
  };

  const fetchSubmissions = async () => {
    try {
      const [subRes, rubRes, scoreRes] = await Promise.all([
        api.get(`/api/submissions/?competition=${selectedCompetition.id}`),
        api.get(`/api/scoring/rubrics/?competition=${selectedCompetition.id}`),
        api.get('/api/scoring/scores/')
      ]);
      
      setSubmissions(subRes.data);
      setRubrics(rubRes.data);
      
      const scoresMap = scoreRes.data
        .filter(s => s.judge_name === user.username)
        .reduce((acc, score) => {
          const key = `${score.submission}_${score.rubric}`;
          acc[key] = score;
          return acc;
        }, {});
      setScores(scoresMap);
    } catch (err) {
      setError('Failed to load submissions.');
    }
  };

  const handleScoreSubmission = (submission) => {
    setSelectedSubmission(submission);
    setShowScoringModal(true);
    
    // Initialize form state for this submission
    const newFormState = {};
    rubrics.forEach(rubric => {
      const key = `${submission.id}_${rubric.id}`;
      const existing = scores[key];
      newFormState[key] = {
        score: existing ? existing.score : 50,
        comment: existing ? existing.comment : '',
      };
    });
    setFormState(newFormState);
  };

  const handleScoreChange = (subId, rubricId, field, value) => {
    const key = `${subId}_${rubricId}`;
    setFormState(prev => ({
      ...prev,
      [key]: { ...prev[key], [field]: value }
    }));
  };

  const submitScores = async () => {
    if (!selectedSubmission) return;
    
    setSubmitting(prev => ({ ...prev, [selectedSubmission.id]: true }));
    try {
      for (const rubric of rubrics) {
        const key = `${selectedSubmission.id}_${rubric.id}`;
        const state = formState[key];
        const existingScore = scores[key];
        
        const payload = {
          competition_id: selectedCompetition.id,
          submission: selectedSubmission.id,
          rubric: rubric.id,
          score: state.score,
          comment: state.comment,
        };
        
        if (existingScore) {
          await api.put(`/api/scoring/scores/${existingScore.id}/`, payload);
        } else {
          await api.post('/api/scoring/scores/', payload);
        }
      }
      
      setShowScoringModal(false);
      fetchSubmissions(); // Refresh data
    } catch (err) {
      setError('Failed to save scores.');
    } finally {
      setSubmitting(prev => ({ ...prev, [selectedSubmission.id]: false }));
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
      zIndex: 2
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
      gap: '16px',
      marginBottom: '24px'
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
      minWidth: '250px'
    },
    
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '20px'
    },
    
    statCard: {
      background: '#f8fafc',
      borderRadius: '16px',
      padding: '24px',
      border: '1px solid #e2e8f0',
      textAlign: 'center'
    },
    
    statIcon: {
      fontSize: '32px',
      marginBottom: '12px',
      display: 'block'
    },
    
    statValue: {
      fontSize: '24px',
      fontWeight: '800',
      color: '#1e293b',
      marginBottom: '4px'
    },
    
    statLabel: {
      fontSize: '14px',
      color: '#64748b',
      fontWeight: '500'
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
      marginBottom: '32px',
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
      gap: '24px'
    },
    
    submissionCard: {
      background: '#f8fafc',
      borderRadius: '20px',
      padding: '32px',
      border: '1px solid #e2e8f0',
      transition: 'all 0.3s ease',
      position: 'relative',
      overflow: 'hidden'
    },
    
    submissionHeader: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      marginBottom: '20px'
    },
    
    submissionInfo: {
      flex: 1
    },
    
    submissionTitle: {
      fontSize: '20px',
      fontWeight: '700',
      color: '#1e293b',
      marginBottom: '8px'
    },
    
    submissionMeta: {
      display: 'flex',
      alignItems: 'center',
      gap: '20px',
      fontSize: '14px',
      color: '#64748b'
    },
    
    metaItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px'
    },
    
    scoreButton: {
      background: 'linear-gradient(135deg, #34d399 0%, #10b981 100%)',
      color: 'white',
      border: 'none',
      padding: '12px 24px',
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    
    submissionDescription: {
      color: '#64748b',
      lineHeight: '1.6',
      marginBottom: '20px'
    },
    
    submissionLinks: {
      display: 'flex',
      gap: '12px',
      marginBottom: '20px'
    },
    
    linkBtn: {
      padding: '8px 16px',
      borderRadius: '8px',
      border: '1px solid #e2e8f0',
      background: 'white',
      color: '#64748b',
      textDecoration: 'none',
      fontSize: '14px',
      fontWeight: '500',
      transition: 'all 0.2s ease'
    },
    
    scoreStatus: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '8px 16px',
      borderRadius: '20px',
      background: 'rgba(52, 211, 153, 0.1)',
      color: '#059669',
      fontSize: '14px',
      fontWeight: '600'
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
      maxWidth: '800px',
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
    
    submissionPreview: {
      background: '#f8fafc',
      borderRadius: '16px',
      padding: '24px',
      marginBottom: '32px',
      border: '1px solid #e2e8f0'
    },
    
    previewTitle: {
      fontSize: '18px',
      fontWeight: '700',
      color: '#1e293b',
      marginBottom: '16px'
    },
    
    previewGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '16px',
      marginBottom: '16px'
    },
    
    previewItem: {
      display: 'flex',
      flexDirection: 'column',
      gap: '4px'
    },
    
    previewLabel: {
      fontSize: '12px',
      fontWeight: '600',
      color: '#64748b',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    },
    
    previewValue: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#1e293b'
    },
    
    previewDescription: {
      color: '#64748b',
      lineHeight: '1.6',
      fontSize: '14px'
    },
    
    scoringSection: {
      background: 'white',
      borderRadius: '16px',
      padding: '24px',
      border: '1px solid #e2e8f0'
    },
    
    scoringTitle: {
      fontSize: '18px',
      fontWeight: '700',
      color: '#1e293b',
      marginBottom: '24px'
    },
    
    rubricCard: {
      background: '#f8fafc',
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '20px',
      border: '1px solid #e2e8f0'
    },
    
    rubricName: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#1e293b',
      marginBottom: '12px'
    },
    
    scoreInputGroup: {
      marginBottom: '16px'
    },
    
    scoreLabel: {
      display: 'block',
      fontSize: '14px',
      fontWeight: '600',
      color: '#374151',
      marginBottom: '8px'
    },
    
    scoreInputContainer: {
      position: 'relative'
    },
    
    scoreInput: {
      width: '100%',
      padding: '12px 80px 12px 16px',
      borderRadius: '8px',
      border: '2px solid #e5e7eb',
      fontSize: '16px',
      transition: 'all 0.2s ease'
    },
    
    scoreIndicator: {
      position: 'absolute',
      right: '12px',
      top: '50%',
      transform: 'translateY(-50%)',
      padding: '4px 8px',
      borderRadius: '6px',
      fontSize: '12px',
      fontWeight: '600'
    },
    
    commentTextarea: {
      width: '100%',
      padding: '12px 16px',
      borderRadius: '8px',
      border: '2px solid #e5e7eb',
      fontSize: '14px',
      minHeight: '80px',
      resize: 'vertical',
      fontFamily: 'inherit',
      transition: 'all 0.2s ease'
    },
    
    modalActions: {
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
      fontSize: '16px',
      fontWeight: '600',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    
    btnPrimary: {
      background: 'linear-gradient(135deg, #34d399 0%, #10b981 100%)',
      color: 'white',
      boxShadow: '0 4px 12px rgba(52, 211, 153, 0.25)'
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

  const getScoreIndicator = (score) => {
    if (score >= 80) return { text: 'Excellent', color: '#059669', bg: 'rgba(16, 185, 129, 0.1)' };
    if (score >= 60) return { text: 'Good', color: '#0369a1', bg: 'rgba(59, 130, 246, 0.1)' };
    if (score >= 40) return { text: 'Fair', color: '#d97706', bg: 'rgba(245, 158, 11, 0.1)' };
    return { text: 'Needs Work', color: '#dc2626', bg: 'rgba(239, 68, 68, 0.1)' };
  };

  const getSubmissionStatus = (submission) => {
    const submissionScores = rubrics.map(rubric => {
      const key = `${submission.id}_${rubric.id}`;
      return scores[key];
    }).filter(Boolean);
    
    if (submissionScores.length === 0) return 'Not Scored';
    if (submissionScores.length < rubrics.length) return 'Partially Scored';
    return 'Completed';
  };

  if (loading) {
    return (
      <>
        <style>{keyframes}</style>
        <div style={styles.loadingSpinner}>
          <div style={styles.spinner}></div>
          Loading judge dashboard...
        </div>
      </>
    );
  }

  return (
    <>
      <style>{keyframes}</style>
      
      <div style={styles.dashboard}>
        {/* Welcome Section */}
        <div style={styles.welcomeSection}>
          <div style={styles.welcomePattern}></div>
          <div style={styles.welcomeContent}>
            <h1 style={styles.welcomeTitle}>
              Welcome, Judge {user?.username}! ⚖️
            </h1>
            <p style={styles.welcomeSubtitle}>
              Review submissions with fairness and expertise. Your evaluations help shape the future of innovation.
            </p>
          </div>
        </div>

        {/* Controls Section */}
        <div style={styles.controlsSection}>
          <div style={styles.competitionSelector}>
            <label style={styles.selectorLabel}>Competition:</label>
            <select 
              style={styles.select}
              value={selectedCompetition?.id || ''}
              onChange={(e) => {
                const comp = competitions.find(c => c.id === parseInt(e.target.value));
                setSelectedCompetition(comp);
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#34d399';
                e.target.style.boxShadow = '0 0 0 4px rgba(52, 211, 153, 0.1)';
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

          {selectedCompetition && (
            <div style={styles.statsGrid}>
              <div style={styles.statCard}>
                <span style={styles.statIcon}>📄</span>
                <div style={styles.statValue}>{submissions.length}</div>
                <div style={styles.statLabel}>Total Submissions</div>
              </div>
              <div style={styles.statCard}>
                <span style={styles.statIcon}>✅</span>
                <div style={styles.statValue}>
                  {submissions.filter(s => getSubmissionStatus(s) === 'Completed').length}
                </div>
                <div style={styles.statLabel}>Completed Reviews</div>
              </div>
              <div style={styles.statCard}>
                <span style={styles.statIcon}>⏳</span>
                <div style={styles.statValue}>
                  {submissions.filter(s => getSubmissionStatus(s) === 'Not Scored').length}
                </div>
                <div style={styles.statLabel}>Pending Reviews</div>
              </div>
              <div style={styles.statCard}>
                <span style={styles.statIcon}>📊</span>
                <div style={styles.statValue}>{rubrics.length}</div>
                <div style={styles.statLabel}>Scoring Criteria</div>
              </div>
            </div>
          )}
        </div>

        {/* Submissions Section */}
        {selectedCompetition && (
          <div style={styles.submissionsSection}>
            <h2 style={styles.sectionTitle}>
              <span style={styles.sectionIcon}>📝</span>
              Submissions to Review
            </h2>

            <div style={styles.submissionsList}>
              {submissions.length === 0 ? (
                <div style={styles.emptyState}>
                  <div style={styles.emptyIcon}>📝</div>
                  <h3 style={styles.emptyTitle}>No submissions available</h3>
                  <p style={styles.emptyDesc}>
                    There are no submissions to review for this competition yet.
                  </p>
                </div>
              ) : (
                submissions.map(submission => {
                  const status = getSubmissionStatus(submission);
                  return (
                    <div 
                      key={submission.id}
                      style={styles.submissionCard}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#ecfdf5';
                        e.currentTarget.style.borderColor = '#34d399';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 12px 32px rgba(52, 211, 153, 0.15)';
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
                          <div style={styles.submissionMeta}>
                            <div style={styles.metaItem}>
                              <span>👤</span>
                              <span>Participant: {submission.participant?.user || 'Unknown'}</span>
                            </div>
                            <div style={styles.metaItem}>
                              <span>📅</span>
                              <span>Submitted: {new Date(submission.submitted_at).toLocaleDateString()}</span>
                            </div>
                            <div style={styles.metaItem}>
                              <span>📊</span>
                              <span>Status: {status}</span>
                            </div>
                          </div>
                        </div>
                        
                        {status === 'Completed' ? (
                          <div style={styles.scoreStatus}>
                            <span>✅</span>
                            <span>Scored</span>
                          </div>
                        ) : (
                          <button 
                            style={styles.scoreButton}
                            onClick={() => handleScoreSubmission(submission)}
                            onMouseEnter={(e) => {
                              e.target.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
                              e.target.style.transform = 'translateY(-2px)';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.background = 'linear-gradient(135deg, #34d399 0%, #10b981 100%)';
                              e.target.style.transform = 'translateY(0)';
                            }}
                          >
                            <span>⚖️</span>
                            <span>{status === 'Partially Scored' ? 'Complete Review' : 'Start Review'}</span>
                          </button>
                        )}
                      </div>

                      <p style={styles.submissionDescription}>{submission.description}</p>

                      {(submission.file || submission.link) && (
                        <div style={styles.submissionLinks}>
                          {submission.file && (
                            <a 
                              href={submission.file} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              style={styles.linkBtn}
                              onMouseEnter={(e) => {
                                e.target.style.background = '#34d399';
                                e.target.style.color = 'white';
                                e.target.style.borderColor = '#34d399';
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.background = 'white';
                                e.target.style.color = '#64748b';
                                e.target.style.borderColor = '#e2e8f0';
                              }}
                            >
                              📎 Download File
                            </a>
                          )}
                          {submission.link && (
                            <a 
                              href={submission.link} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              style={styles.linkBtn}
                              onMouseEnter={(e) => {
                                e.target.style.background = '#34d399';
                                e.target.style.color = 'white';
                                e.target.style.borderColor = '#34d399';
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.background = 'white';
                                e.target.style.color = '#64748b';
                                e.target.style.borderColor = '#e2e8f0';
                              }}
                            >
                              🔗 View Project
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* Scoring Modal */}
        {showScoringModal && selectedSubmission && (
          <div style={styles.modalOverlay} onClick={() => setShowScoringModal(false)}>
            <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
              <div style={styles.modalHeader}>
                <h2 style={styles.modalTitle}>Score Submission</h2>
                <p style={styles.modalSubtitle}>
                  Evaluate "{selectedSubmission.title}" using the provided rubrics
                </p>
              </div>

              <div style={styles.modalBody}>
                {/* Submission Preview */}
                <div style={styles.submissionPreview}>
                  <h3 style={styles.previewTitle}>Submission Details</h3>
                  <div style={styles.previewGrid}>
                    <div style={styles.previewItem}>
                      <span style={styles.previewLabel}>Title</span>
                      <span style={styles.previewValue}>{selectedSubmission.title}</span>
                    </div>
                    <div style={styles.previewItem}>
                      <span style={styles.previewLabel}>Participant</span>
                      <span style={styles.previewValue}>{selectedSubmission.participant?.user || 'Unknown'}</span>
                    </div>
                    <div style={styles.previewItem}>
                      <span style={styles.previewLabel}>Submitted</span>
                      <span style={styles.previewValue}>
                        {new Date(selectedSubmission.submitted_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <p style={styles.previewDescription}>{selectedSubmission.description}</p>
                </div>

                {/* Scoring Section */}
                <div style={styles.scoringSection}>
                  <h3 style={styles.scoringTitle}>Evaluation Criteria</h3>
                  
                  {rubrics.map(rubric => {
                    const key = `${selectedSubmission.id}_${rubric.id}`;
                    const currentScore = formState[key]?.score || 50;
                    const indicator = getScoreIndicator(currentScore);
                    
                    return (
                      <div key={rubric.id} style={styles.rubricCard}>
                        <h4 style={styles.rubricName}>{rubric.name}</h4>
                        
                        <div style={styles.scoreInputGroup}>
                          <label style={styles.scoreLabel}>
                            Score (0-100): {currentScore}
                          </label>
                          <div style={styles.scoreInputContainer}>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              style={styles.scoreInput}
                              value={currentScore}
                              onChange={(e) => handleScoreChange(
                                selectedSubmission.id, 
                                rubric.id, 
                                'score', 
                                parseInt(e.target.value)
                              )}
                            />
                            <div style={{
                              ...styles.scoreIndicator,
                              color: indicator.color,
                              background: indicator.bg
                            }}>
                              {indicator.text}
                            </div>
                          </div>
                        </div>
                        
                        <div style={styles.scoreInputGroup}>
                          <label style={styles.scoreLabel}>Comments</label>
                          <textarea
                            style={styles.commentTextarea}
                            value={formState[key]?.comment || ''}
                            onChange={(e) => handleScoreChange(
                              selectedSubmission.id, 
                              rubric.id, 
                              'comment', 
                              e.target.value
                            )}
                            placeholder="Provide detailed feedback for this criterion..."
                            onFocus={(e) => {
                              e.target.style.borderColor = '#34d399';
                              e.target.style.boxShadow = '0 0 0 4px rgba(52, 211, 153, 0.1)';
                            }}
                            onBlur={(e) => {
                              e.target.style.borderColor = '#e5e7eb';
                              e.target.style.boxShadow = 'none';
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div style={styles.modalActions}>
                <button 
                  style={{...styles.btn, ...styles.btnSecondary}}
                  onClick={() => setShowScoringModal(false)}
                >
                  Cancel
                </button>
                <button 
                  style={{...styles.btn, ...styles.btnPrimary}}
                  onClick={submitScores}
                  disabled={submitting[selectedSubmission.id]}
                  onMouseEnter={(e) => {
                    if (!submitting[selectedSubmission.id]) {
                      e.target.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
                      e.target.style.transform = 'translateY(-2px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!submitting[selectedSubmission.id]) {
                      e.target.style.background = 'linear-gradient(135deg, #34d399 0%, #10b981 100%)';
                      e.target.style.transform = 'translateY(0)';
                    }
                  }}
                >
                  {submitting[selectedSubmission.id] ? (
                    <>
                      <div style={styles.spinner}></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <span>💾</span>
                      Save Scores
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProfessionalJudgeDashboard;