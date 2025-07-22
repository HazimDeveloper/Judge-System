import React, { useEffect, useState } from 'react';
import api from '../services/api';

const ModernAdminScoring = () => {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    fetchScores();
  }, []);

  const fetchScores = async () => {
    setError('');
    try {
      const res = await api.get('/api/scoring/scores/');
      setScores(res.data);
    } catch (err) {
      setError('Could not load scores. Please refresh the page.');
      setScores([]);
    } finally {
      setLoading(false);
    }
  };

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

  const filteredAndSortedScores = React.useMemo(() => {
    let filtered = scores.filter(score => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        score.participant_name?.toLowerCase().includes(searchLower) ||
        score.judge_name?.toLowerCase().includes(searchLower) ||
        score.rubric_name?.toLowerCase().includes(searchLower);
      
      if (filterBy === 'all') return matchesSearch;
      if (filterBy === 'high') return matchesSearch && score.score >= 80;
      if (filterBy === 'medium') return matchesSearch && score.score >= 60 && score.score < 80;
      if (filterBy === 'low') return matchesSearch && score.score < 60;
      
      return matchesSearch;
    });

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'score-high':
          return b.score - a.score;
        case 'score-low':
          return a.score - b.score;
        case 'participant':
          return (a.participant_name || '').localeCompare(b.participant_name || '');
        case 'judge':
          return (a.judge_name || '').localeCompare(b.judge_name || '');
        default:
          return new Date(b.created_at || 0) - new Date(a.created_at || 0);
      }
    });
  }, [scores, searchTerm, filterBy, sortBy]);

  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    return 'Needs Improvement';
  };

  const averageScore = scores.length > 0 
    ? (scores.reduce((sum, score) => sum + score.score, 0) / scores.length).toFixed(1)
    : 0;

  const styles = {
    dashboard: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
      padding: '40px'
    },
    
    welcomeSection: {
      background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
      borderRadius: '24px',
      padding: '40px',
      color: 'white',
      marginBottom: '40px',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 20px 40px rgba(6, 182, 212, 0.15)'
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
    
    scoresSection: {
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
    
    scoresGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
      gap: '20px'
    },
    
    scoreCard: {
      background: '#f8fafc',
      borderRadius: '16px',
      padding: '24px',
      border: '1px solid #e2e8f0',
      transition: 'all 0.3s ease'
    },
    
    scoreHeader: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      marginBottom: '16px'
    },
    
    scoreInfo: {
      flex: 1
    },
    
    participantName: {
      fontSize: '18px',
      fontWeight: '700',
      color: '#1e293b',
      marginBottom: '4px'
    },
    
    judgeInfo: {
      fontSize: '14px',
      color: '#64748b',
      marginBottom: '8px'
    },
    
    rubricName: {
      fontSize: '14px',
      color: '#06b6d4',
      fontWeight: '600'
    },
    
    scoreBadge: {
      padding: '8px 16px',
      borderRadius: '20px',
      fontSize: '14px',
      fontWeight: '700',
      color: 'white',
      textAlign: 'center',
      minWidth: '80px'
    },
    
    scoreComment: {
      background: 'white',
      borderRadius: '12px',
      padding: '16px',
      border: '1px solid #e2e8f0',
      marginBottom: '16px'
    },
    
    commentLabel: {
      fontSize: '12px',
      fontWeight: '600',
      color: '#64748b',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      marginBottom: '8px'
    },
    
    commentText: {
      color: '#374151',
      lineHeight: '1.6',
      fontSize: '14px',
      fontStyle: 'italic'
    },
    
    scoreLinks: {
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
      borderTop: '4px solid #06b6d4',
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
  `;

  if (loading) {
    return (
      <>
        <style>{keyframes}</style>
        <div style={styles.loadingSpinner}>
          <div style={styles.spinner}></div>
          Loading scoring data...
        </div>
      </>
    );
  }

  const StatCard = ({ icon, title, value, color = '#06b6d4' }) => (
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

  const ScoreCard = ({ score }) => (
    <div 
      style={styles.scoreCard}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = '#ecfdf5';
        e.currentTarget.style.borderColor = '#06b6d4';
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 12px 24px rgba(6, 182, 212, 0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = '#f8fafc';
        e.currentTarget.style.borderColor = '#e2e8f0';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div style={styles.scoreHeader}>
        <div style={styles.scoreInfo}>
          <h3 style={styles.participantName}>{score.participant_name}</h3>
          <div style={styles.judgeInfo}>👨‍⚖️ Judged by {score.judge_name}</div>
          <div style={styles.rubricName}>📋 {score.rubric_name}</div>
        </div>
        <div style={{
          ...styles.scoreBadge,
          background: getScoreColor(score.score)
        }}>
          {score.score}/100
        </div>
      </div>

      {score.comment && (
        <div style={styles.scoreComment}>
          <div style={styles.commentLabel}>Judge's Comments</div>
          <div style={styles.commentText}>{score.comment}</div>
        </div>
      )}

      {(score.evaluation_file || score.evaluation_link) && (
        <div style={styles.scoreLinks}>
          {score.evaluation_file && (
            <a 
              href={score.evaluation_file} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{...styles.linkBtn, background: '#ef4444', color: 'white', border: 'none'}}
              onMouseEnter={(e) => {
                e.target.style.background = '#dc2626';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = '#ef4444';
              }}
            >
              📄 PDF
            </a>
          )}
          {score.evaluation_link && (
            <a 
              href={score.evaluation_link} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{...styles.linkBtn, background: '#10b981', color: 'white', border: 'none'}}
              onMouseEnter={(e) => {
                e.target.style.background = '#059669';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = '#10b981';
              }}
            >
              🔗 Link
            </a>
          )}
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
            <div style={styles.welcomeText}>
              <h1 style={styles.welcomeTitle}>
                Scoring Analytics ⭐
              </h1>
              <p style={styles.welcomeSubtitle}>
                Comprehensive view of all scores, feedback, and evaluation metrics across competitions.
              </p>
            </div>
            <button 
              style={styles.welcomeAction}
              onClick={handleExport}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.3)';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              <span>📊</span>
              Export Report
            </button>
          </div>
        </div>

        {/* Stats Section */}
        <div style={styles.statsSection}>
          <StatCard
            icon="📄"
            title="Total Scores"
            value={scores.length}
            color="#06b6d4"
          />
          <StatCard
            icon="⭐"
            title="Average Score"
            value={averageScore}
            color="#f59e0b"
          />
          <StatCard
            icon="🏆"
            title="High Scores (80+)"
            value={scores.filter(s => s.score >= 80).length}
            color="#10b981"
          />
          <StatCard
            icon="📊"
            title="Unique Judges"
            value={new Set(scores.map(s => s.judge_name)).size}
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
                placeholder="Search participants, judges, or rubrics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={(e) => {
                  e.target.style.borderColor = '#06b6d4';
                  e.target.style.boxShadow = '0 0 0 4px rgba(6, 182, 212, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Filter by Score</label>
              <select
                style={styles.formControl}
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                onFocus={(e) => {
                  e.target.style.borderColor = '#06b6d4';
                  e.target.style.boxShadow = '0 0 0 4px rgba(6, 182, 212, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <option value="all">All Scores</option>
                <option value="high">High (80+)</option>
                <option value="medium">Medium (60-79)</option>
                <option value="low">Low (&lt;60)</option>
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Sort by</label>
              <select
                style={styles.formControl}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                onFocus={(e) => {
                  e.target.style.borderColor = '#06b6d4';
                  e.target.style.boxShadow = '0 0 0 4px rgba(6, 182, 212, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <option value="newest">Newest First</option>
                <option value="score-high">Highest Score</option>
                <option value="score-low">Lowest Score</option>
                <option value="participant">Participant A-Z</option>
                <option value="judge">Judge A-Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Scores Section */}
        <div style={styles.scoresSection}>
          <h2 style={styles.sectionTitle}>
            <span style={styles.sectionIcon}>📋</span>
            Score Details ({filteredAndSortedScores.length})
          </h2>

          {error && (
            <div style={{...styles.alert, ...styles.alertDanger}}>
              <span>⚠️</span>
              {error}
            </div>
          )}

          {filteredAndSortedScores.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>⭐</div>
              <h3 style={styles.emptyTitle}>No scores found</h3>
              <p style={styles.emptyDesc}>
                {searchTerm || filterBy !== 'all' 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Scores will appear here once judges begin evaluating submissions.'
                }
              </p>
            </div>
          ) : (
            <div style={styles.scoresGrid}>
              {filteredAndSortedScores.map(score => (
                <ScoreCard key={score.id} score={score} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ModernAdminScoring;