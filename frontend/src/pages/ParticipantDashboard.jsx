import React, { useEffect, useState } from 'react';
import api from '../services/api';

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
  
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #e2e8f0',
    borderTop: '4px solid #3b82f6',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '2rem auto'
  },
  
  participantStats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
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
    textAlign: 'center',
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
  
  statContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem'
  },
  
  statValue: {
    fontSize: '2.5rem',
    fontWeight: 800,
    color: '#2563eb',
    lineHeight: 1
  },
  
  statLabel: {
    color: '#475569',
    fontWeight: 600,
    fontSize: '0.875rem',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  
  submissionsSection: {
    marginBottom: '3rem'
  },
  
  sectionTitle: {
    fontSize: '1.75rem',
    fontWeight: 700,
    color: '#1e293b',
    marginBottom: '2rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem'
  },
  
  sectionTitleBefore: {
    width: '4px',
    height: '2rem',
    background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
    borderRadius: '0.125rem'
  },
  
  submissionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '2rem'
  },
  
  submissionCard: {
    background: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(20px)',
    borderRadius: '1.5rem',
    border: '1px solid #e2e8f0',
    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    transition: 'all 0.25s ease-out',
    overflow: 'hidden'
  },
  
  submissionHeader: {
    background: 'linear-gradient(135deg, #f8fafc, #eff6ff)',
    padding: '1.5rem',
    borderBottom: '1px solid #e2e8f0',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: '1rem'
  },
  
  submissionTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    flex: 1
  },
  
  submissionIcon: {
    fontSize: '1.5rem'
  },
  
  submissionTitleText: {
    fontSize: '1.25rem',
    fontWeight: 700,
    color: '#1e293b',
    margin: 0,
    lineHeight: 1.3
  },
  
  submissionStatus: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 0.75rem',
    borderRadius: '0.75rem',
    fontSize: '0.75rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    whiteSpace: 'nowrap'
  },
  
  statusWarning: {
    background: 'rgba(245, 158, 11, 0.1)',
    color: '#92400e',
    border: '1px solid rgba(245, 158, 11, 0.3)'
  },
  
  statusInfo: {
    background: 'rgba(6, 182, 212, 0.1)',
    color: '#0c4a6e',
    border: '1px solid rgba(6, 182, 212, 0.3)'
  },
  
  statusPrimary: {
    background: 'rgba(59, 130, 246, 0.1)',
    color: '#1e40af',
    border: '1px solid rgba(59, 130, 246, 0.3)'
  },
  
  statusSuccess: {
    background: 'rgba(16, 185, 129, 0.1)',
    color: '#065f46',
    border: '1px solid rgba(16, 185, 129, 0.3)'
  },
  
  statusDanger: {
    background: 'rgba(239, 68, 68, 0.1)',
    color: '#991b1b',
    border: '1px solid rgba(239, 68, 68, 0.3)'
  },
  
  statusIcon: {
    fontSize: '1rem'
  },
  
  submissionContent: {
    padding: '1.5rem'
  },
  
  submissionDescription: {
    color: '#475569',
    lineHeight: 1.6,
    marginBottom: '1.5rem',
    fontSize: '0.95rem'
  },
  
  submissionMeta: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    marginBottom: '1.5rem'
  },
  
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.875rem'
  },
  
  metaIcon: {
    fontSize: '1rem',
    color: '#3b82f6'
  },
  
  metaLabel: {
    color: '#475569',
    fontWeight: 500
  },
  
  metaValue: {
    color: '#1e293b',
    fontWeight: 600
  },
  
  metaValueScore: {
    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontWeight: 700
  },
  
  scoresSection: {
    background: '#f8fafc',
    borderRadius: '0.75rem',
    padding: '1.25rem',
    border: '1px solid #e2e8f0'
  },
  
  scoresTitle: {
    fontSize: '1rem',
    fontWeight: 600,
    color: '#1e293b',
    marginBottom: '1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  
  scoresList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  
  scoreItem: {
    background: 'rgba(255, 255, 255, 0.7)',
    borderRadius: '0.75rem',
    padding: '1rem',
    border: '1px solid #e2e8f0'
  },
  
  scoreHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '0.5rem'
  },
  
  judgeName: {
    fontWeight: 600,
    color: '#334155',
    fontSize: '0.875rem'
  },
  
  scoreValue: {
    background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
    color: 'white',
    padding: '0.25rem 0.75rem',
    borderRadius: '0.5rem',
    fontSize: '0.75rem',
    fontWeight: 700
  },
  
  scoreComment: {
    color: '#475569',
    fontSize: '0.875rem',
    lineHeight: 1.5,
    fontStyle: 'italic',
    margin: 0
  },
  
  emptyState: {
    textAlign: 'center',
    padding: '4rem 2rem',
    background: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(20px)',
    borderRadius: '1.5rem',
    border: '1px solid #e2e8f0',
    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)'
  },
  
  emptyIcon: {
    fontSize: '5rem',
    marginBottom: '1.5rem',
    opacity: 0.6
  },
  
  emptyTitle: {
    fontSize: '1.75rem',
    fontWeight: 700,
    color: '#1e293b',
    marginBottom: '1rem'
  },
  
  emptyMessage: {
    fontSize: '1.125rem',
    color: '#475569',
    marginBottom: '2rem',
    maxWidth: '400px',
    marginLeft: 'auto',
    marginRight: 'auto',
    lineHeight: 1.6
  },
  
  // Modal Styles
  modalBackdrop: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(0, 0, 0, 0.6)',
    backdropFilter: 'blur(8px)',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1.5rem',
    animation: 'fadeIn 0.3s ease-out'
  },
  
  modalContent: {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    borderRadius: '1.5rem',
    boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    border: '1px solid #e2e8f0',
    width: '100%',
    maxWidth: '600px',
    maxHeight: '90vh',
    overflowY: 'auto',
    animation: 'slideUp 0.3s ease-out'
  },
  
  modalHeader: {
    padding: '1.5rem',
    borderBottom: '1px solid #e2e8f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: 'linear-gradient(135deg, #f8fafc, #eff6ff)'
  },
  
  modalTitle: {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: '#1e293b',
    margin: 0
  },
  
  modalClose: {
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    color: '#64748b',
    cursor: 'pointer',
    padding: '0.5rem',
    borderRadius: '0.5rem',
    transition: 'all 0.15s ease-out'
  },
  
  modalBody: {
    padding: '1.5rem'
  },
  
  formGroup: {
    marginBottom: '1.5rem'
  },
  
  formLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '0.75rem',
    fontWeight: 600,
    color: '#334155',
    fontSize: '0.875rem'
  },
  
  labelIcon: {
    fontSize: '1rem'
  },
  
  formControl: {
    width: '100%',
    padding: '1rem',
    border: '2px solid #cbd5e1',
    borderRadius: '0.75rem',
    background: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(10px)',
    fontSize: '1rem',
    transition: 'all 0.15s ease-out',
    fontFamily: 'inherit'
  },
  
  submissionTips: {
    background: '#eff6ff',
    border: '1px solid #bfdbfe',
    borderRadius: '0.75rem',
    padding: '1.25rem',
    marginTop: '1.5rem'
  },
  
  tipsTitle: {
    fontSize: '1rem',
    fontWeight: 600,
    color: '#1d4ed8',
    marginBottom: '0.75rem'
  },
  
  tipsList: {
    margin: 0,
    paddingLeft: '1.25rem',
    color: '#1d4ed8'
  },
  
  tipsListItem: {
    marginBottom: '0.5rem',
    fontSize: '0.875rem',
    lineHeight: 1.5
  },
  
  modalFooter: {
    padding: '1.5rem',
    borderTop: '1px solid #e2e8f0',
    display: 'flex',
    gap: '0.75rem',
    justifyContent: 'flex-end',
    background: '#f8fafc'
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
  
  btnLg: {
    padding: '1rem 2rem',
    fontSize: '1rem'
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
  
  alertSuccess: {
    background: 'rgba(16, 185, 129, 0.1)',
    color: '#065f46',
    border: '1px solid rgba(16, 185, 129, 0.3)'
  },
  
  alertDanger: {
    background: 'rgba(239, 68, 68, 0.1)',
    color: '#991b1b',
    border: '1px solid rgba(239, 68, 68, 0.3)'
  },
  
  spinnerSm: {
    width: '16px',
    height: '16px',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    borderTop: '2px solid white',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginRight: '0.5rem'
  }
};

// CSS keyframes and additional styles
const cssStyles = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .stat-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
  }
  
  .submission-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
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
  
  .modal-close:hover {
    background: #e2e8f0;
    color: #334155;
  }
  
  .form-control:focus {
    outline: none;
    border-color: #3b82f6;
    background: rgba(255, 255, 255, 0.95);
    box-shadow: 0 0 0 4px #dbeafe;
  }
  
  @media (max-width: 1024px) {
    .submissions-grid {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }
    
    .participant-stats {
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    }
  }
  
  @media (max-width: 768px) {
    .dashboard-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 1.5rem;
    }
    
    .header-actions {
      width: 100%;
    }
    
    .header-actions .btn {
      width: 100%;
    }
    
    .submission-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 1rem;
    }
    
    .submission-title {
      width: 100%;
    }
    
    .submission-status {
      align-self: flex-start;
    }
    
    .participant-stats {
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
    }
    
    .modal-content {
      margin: 1rem;
      max-width: calc(100% - 2rem);
    }
    
    .modal-header, .modal-body, .modal-footer {
      padding: 1.25rem;
    }
    
    .modal-footer {
      flex-direction: column;
    }
    
    .modal-footer .btn {
      width: 100%;
    }
  }
  
  @media (max-width: 480px) {
    .participant-stats {
      grid-template-columns: 1fr;
    }
    
    .submission-card {
      margin: 0 calc(-1 * 1rem);
      border-radius: 1rem;
    }
    
    .submission-header, .submission-content {
      padding: 1rem;
    }
    
    .scores-section {
      padding: 1rem;
    }
    
    .score-item {
      padding: 0.75rem;
    }
    
    .empty-state {
      padding: 3rem 1.5rem;
      margin: 0 calc(-1 * 1rem);
    }
    
    .modal-content {
      border-radius: 1rem;
    }
  }
`;

const SubmissionCard = ({ submission }) => {
  const getStatusColor = (status) => {
    const colors = {
      'PENDING': 'statusWarning',
      'SUBMITTED': 'statusInfo',
      'UNDER_REVIEW': 'statusPrimary',
      'COMPLETED': 'statusSuccess',
      'REJECTED': 'statusDanger'
    };
    return colors[status] || 'statusWarning';
  };

  const getStatusIcon = (status) => {
    const icons = {
      'PENDING': '⏳',
      'SUBMITTED': '📤',
      'UNDER_REVIEW': '👀',
      'COMPLETED': '✅',
      'REJECTED': '❌'
    };
    return icons[status] || '📄';
  };

  const calculateAverageScore = (scores) => {
    if (!scores || scores.length === 0) return null;
    const total = scores.reduce((acc, score) => acc + score.score, 0);
    return (total / scores.length).toFixed(2);
  };

  const avgScore = calculateAverageScore(submission.scores);

  return (
    <div style={styles.submissionCard} className="submission-card">
      <div style={styles.submissionHeader}>
        <div style={styles.submissionTitle}>
          <span style={styles.submissionIcon}>📄</span>
          <h3 style={styles.submissionTitleText}>{submission.title}</h3>
        </div>
        <div style={{...styles.submissionStatus, ...styles[getStatusColor(submission.status)]}}>
          <span style={styles.statusIcon}>{getStatusIcon(submission.status)}</span>
          <span>{submission.status.replace('_', ' ')}</span>
        </div>
      </div>
      
      <div style={styles.submissionContent}>
        <p style={styles.submissionDescription}>{submission.description}</p>
        
        <div style={styles.submissionMeta}>
          <div style={styles.metaItem}>
            <span style={styles.metaIcon}>📅</span>
            <span style={styles.metaLabel}>Submitted:</span>
            <span style={styles.metaValue}>{new Date(submission.submitted_at).toLocaleDateString()}</span>
          </div>
          
          {avgScore && (
            <div style={styles.metaItem}>
              <span style={styles.metaIcon}>⭐</span>
              <span style={styles.metaLabel}>Average Score:</span>
              <span style={{...styles.metaValue, ...styles.metaValueScore}}>{avgScore}/100</span>
            </div>
          )}
        </div>

        {submission.scores && submission.scores.length > 0 && (
          <div style={styles.scoresSection}>
            <h4 style={styles.scoresTitle}>
              💬 Judge Feedback
            </h4>
            <div style={styles.scoresList}>
              {submission.scores.map((score, index) => (
                <div key={index} style={styles.scoreItem}>
                  <div style={styles.scoreHeader}>
                    <span style={styles.judgeName}>Judge {index + 1}</span>
                    <span style={styles.scoreValue}>{score.score}/100</span>
                  </div>
                  {score.comment && (
                    <p style={styles.scoreComment}>{score.comment}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const NewSubmissionModal = ({ isOpen, onClose, onSubmit, loading, formState, setFormState }) => {
  const [competitions, setCompetitions] = useState([]);
  const [compLoading, setCompLoading] = useState(true);
  useEffect(() => {
    const fetchCompetitions = async () => {
      setCompLoading(true);
      try {
        const res = await api.get('/api/submissions/competitions/');
        setCompetitions(res.data);
      } catch {
        setCompetitions([]);
      } finally {
        setCompLoading(false);
      }
    };
    fetchCompetitions();
  }, []);
  const handleChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formState);
  };
  if (!isOpen) return null;
  return (
    <div style={styles.modalBackdrop} onClick={onClose}>
      <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}>Submit New Project</h2>
          <button style={styles.modalClose} className="modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div style={styles.modalBody}>
            <div style={styles.formGroup}>
              <label htmlFor="competition_id" style={styles.formLabel}>
                <span style={styles.labelIcon}>🏆</span>
                Competition
              </label>
              <select
                id="competition_id"
                name="competition_id"
                style={styles.formControl}
                value={formState.competition_id}
                onChange={handleChange}
                required
                disabled={compLoading}
              >
                <option value="">Select a competition</option>
                {competitions.map((comp) => (
                  <option key={comp.id} value={comp.id}>{comp.name}</option>
                ))}
              </select>
            </div>
            <div style={styles.formGroup}>
              <label htmlFor="title" style={styles.formLabel}>
                <span style={styles.labelIcon}>🏷️</span>
                Project Title
              </label>
              <input
                id="title"
                type="text"
                name="title"
                style={styles.formControl}
                value={formState.title}
                onChange={handleChange}
                required
                placeholder="Enter your project title"
              />
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="link" style={styles.formLabel}>
                <span style={styles.labelIcon}>🔗</span>
                Project Link
              </label>
              <input
                id="link"
                type="url"
                name="link"
                style={styles.formControl}
                value={formState.link}
                onChange={handleChange}
                placeholder="e.g., https://github.com/user/repo"
              />
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="description" style={styles.formLabel}>
                <span style={styles.labelIcon}>📝</span>
                Project Description
              </label>
              <textarea
                id="description"
                name="description"
                style={styles.formControl}
                value={formState.description}
                onChange={handleChange}
                required
                rows={6}
                placeholder="Describe your project, its goals, methodology, and key features..."
              />
            </div>

            <div style={styles.submissionTips}>
              <h4 style={styles.tipsTitle}>💡 Tips for a Great Submission</h4>
              <ul style={styles.tipsList}>
                <li style={styles.tipsListItem}>Clearly explain your project's purpose and innovation</li>
                <li style={styles.tipsListItem}>Highlight the problem you're solving</li>
                <li style={styles.tipsListItem}>Describe your methodology and approach</li>
                <li style={styles.tipsListItem}>Include any unique features or benefits</li>
              </ul>
            </div>
          </div>

          <div style={styles.modalFooter}>
            <button type="button" style={{...styles.btn, ...styles.btnSecondary}} className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" style={{...styles.btn, ...styles.btnPrimary}} className="btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <div style={styles.spinnerSm}></div>
                  Submitting...
                </>
              ) : (
                <>
                  <span>🚀</span>
                  Submit Project
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ParticipantDashboard = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [formState, setFormState] = useState({ title: '', description: '', competition_id: '', link: '' });

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/submissions/');
      setSubmissions(res.data);
    } catch (err) {
      setError('Could not load your submissions. Please refresh the page.');
      setSubmissions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccess('');
    setError('');
    
    try {
      const formData = new FormData();
      formData.append('title', formState.title);
      formData.append('description', formState.description);
      formData.append('competition_id', formState.competition_id);
      formData.append('link', formState.link);
      
      await api.post('/api/submissions/', formData);
      setShowModal(false);
      fetchSubmissions(); // Refresh list
    } catch (err) {
      setError('Could not submit your project. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <>
        <style>{cssStyles}</style>
        <div style={styles.dashboardLoading}>
          <div style={styles.spinner}></div>
          <p>Loading your submissions...</p>
        </div>
      </>
    );
  }

  const colorStyles = {
    primary: { background: 'linear-gradient(90deg, #3b82f6, #2563eb)' },
    success: { background: 'linear-gradient(90deg, #10b981, #059669)' },
    warning: { background: 'linear-gradient(90deg, #f59e0b, #d97706)' },
    info: { background: 'linear-gradient(90deg, #06b6d4, #0891b2)' }
  };

  return (
    <>
      <style>{cssStyles}</style>
      
      <div style={styles.dashboard}>
        <div style={styles.container}>
          <div style={styles.dashboardHeader}>
            <div style={styles.headerContent}>
              <h1 style={styles.dashboardTitle}>
                <span style={styles.titleIcon}>🎯</span>
                My Dashboard
              </h1>
              <p style={styles.dashboardSubtitle}>
                Track your project submissions and view feedback from judges.
              </p>
            </div>
            <div style={styles.headerActions}>
              <button 
                style={{...styles.btn, ...styles.btnPrimary, ...styles.btnLg}}
                className="btn-primary"
                onClick={() => setShowModal(true)}
              >
                <span>➕</span>
                New Submission
              </button>
            </div>
          </div>

          {success && (
            <div style={{...styles.alert, ...styles.alertSuccess}}>
              <span style={styles.alertIcon}>✅</span>
              {success}
            </div>
          )}

          {error && (
            <div style={{...styles.alert, ...styles.alertDanger}}>
              <span style={styles.alertIcon}>⚠️</span>
              {error}
            </div>
          )}

          <div style={styles.participantStats}>
            <div style={styles.statCard} className="stat-card">
              <div style={{...styles.statCardBefore, ...colorStyles.primary}}></div>
              <div style={styles.statContent}>
                <div style={styles.statValue}>{submissions.length}</div>
                <div style={styles.statLabel}>Total Submissions</div>
              </div>
            </div>
            
            <div style={styles.statCard} className="stat-card">
              <div style={{...styles.statCardBefore, ...colorStyles.success}}></div>
              <div style={styles.statContent}>
                <div style={styles.statValue}>
                  {submissions.filter(s => s.status === 'COMPLETED').length}
                </div>
                <div style={styles.statLabel}>Completed Reviews</div>
              </div>
            </div>
            
            <div style={styles.statCard} className="stat-card">
              <div style={{...styles.statCardBefore, ...colorStyles.warning}}></div>
              <div style={styles.statContent}>
                <div style={styles.statValue}>
                  {submissions.filter(s => s.scores && s.scores.length > 0).length}
                </div>
                <div style={styles.statLabel}>With Feedback</div>
              </div>
            </div>
            
            <div style={styles.statCard} className="stat-card">
              <div style={{...styles.statCardBefore, ...colorStyles.info}}></div>
              <div style={styles.statContent}>
                <div style={styles.statValue}>
                  {(() => {
                    const scoredSubmissions = submissions.filter(s => s.scores && s.scores.length > 0);
                    if (scoredSubmissions.length === 0) return '--';
                    const totalScore = scoredSubmissions.reduce((acc, s) => {
                      const avgScore = s.scores.reduce((sum, score) => sum + score.score, 0) / s.scores.length;
                      return acc + avgScore;
                    }, 0);
                    return (totalScore / scoredSubmissions.length).toFixed(1);
                  })()}
                </div>
                <div style={styles.statLabel}>Average Score</div>
              </div>
            </div>
          </div>

          <div style={styles.submissionsSection}>
            <h2 style={styles.sectionTitle}>
              <div style={styles.sectionTitleBefore}></div>
              Your Submissions
            </h2>
            
            {submissions.length === 0 ? (
              <div style={styles.emptyState}>
                <div style={styles.emptyIcon}>📄</div>
                <h3 style={styles.emptyTitle}>No Submissions Yet</h3>
                <p style={styles.emptyMessage}>Ready to showcase your work? Submit your first project to get started!</p>
                <button 
                  style={{...styles.btn, ...styles.btnPrimary}}
                  className="btn-primary"
                  onClick={() => setShowModal(true)}
                >
                  <span>🚀</span>
                  Submit Your First Project
                </button>
              </div>
            ) : (
              <div style={styles.submissionsGrid}>
                {submissions.map(submission => (
                  <SubmissionCard key={submission.id} submission={submission} />
                ))}
              </div>
            )}
          </div>

          <NewSubmissionModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            onSubmit={handleSubmit}
            loading={submitting}
            formState={formState}
            setFormState={setFormState}
          />
        </div>
      </div>
    </>
  );
};

export default ParticipantDashboard;