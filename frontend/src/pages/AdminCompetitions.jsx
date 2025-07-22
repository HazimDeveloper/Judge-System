import React, { useEffect, useState } from 'react';
import api from '../services/api';

const ModernAdminCompetitions = () => {
  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', description: '', start_date: '', end_date: '' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [showRubricModal, setShowRubricModal] = useState(false);
  const [showJudgeModal, setShowJudgeModal] = useState(false);
  const [selectedCompetition, setSelectedCompetition] = useState(null);
  const [rubricForm, setRubricForm] = useState({ name: '', description: '', max_score: 100 });
  const [judges, setJudges] = useState([]);
  const [allJudges, setAllJudges] = useState([]);
  const [selectedJudges, setSelectedJudges] = useState([]);
  const [rubrics, setRubrics] = useState([]);
  const [judgeAssignSuccess, setJudgeAssignSuccess] = useState('');

  useEffect(() => {
    fetchCompetitions();
    fetchAllJudges();
  }, []);

  const fetchCompetitions = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/api/competitions/');
      setCompetitions(res.data);
    } catch (err) {
      setError('Could not load competitions. Please refresh the page.');
      setCompetitions([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllJudges = async () => {
    try {
      const res = await api.get('/api/scoring/judges/');
      setAllJudges(res.data);
    } catch {
      setAllJudges([]);
    }
  };

  const fetchRubrics = async (competitionId) => {
    try {
      const res = await api.get(`/scoring/rubrics/?competition_id=${competitionId}`);
      setRubrics(res.data);
    } catch {
      setRubrics([]);
    }
  };

  const fetchCompetitionJudges = async (competitionId) => {
    try {
      const res = await api.get('/api/scoring/judges/');
      const assigned = res.data.filter(j => j.competitions.some(c => c.id === competitionId));
      setJudges(assigned);
      setSelectedJudges(assigned.map(j => j.id));
    } catch {
      setJudges([]);
      setSelectedJudges([]);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');
    try {
      await api.post('/api/competitions/', form);
      setSuccess('Competition created successfully!');
      setForm({ name: '', description: '', start_date: '', end_date: '' });
      fetchCompetitions();
    } catch (err) {
      setError('Could not create competition. Please check your input.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this competition?')) return;
    try {
      await api.delete(`/api/competitions/${id}/`);
      fetchCompetitions();
    } catch (err) {
      setError('Could not delete competition.');
    }
  };

  const openRubricModal = (competition) => {
    setSelectedCompetition(competition);
    setRubricForm({ name: '', description: '', max_score: 100 });
    fetchRubrics(competition.id);
    setShowRubricModal(true);
  };

  const handleRubricChange = (e) => {
    setRubricForm({ ...rubricForm, [e.target.name]: e.target.value });
  };

  const handleRubricSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/scoring/rubrics/', { ...rubricForm, competition_id: selectedCompetition.id });
      fetchRubrics(selectedCompetition.id);
      setRubricForm({ name: '', description: '', max_score: 100 });
    } catch {}
  };

  const openJudgeModal = (competition) => {
    setSelectedCompetition(competition);
    fetchCompetitionJudges(competition.id);
    setShowJudgeModal(true);
  };

  const handleJudgeChange = (judgeId) => {
    setSelectedJudges(prev => 
      prev.includes(judgeId) 
        ? prev.filter(id => id !== judgeId)
        : [...prev, judgeId]
    );
  };

  const handleJudgeSubmit = async (e) => {
    e.preventDefault();
    setJudgeAssignSuccess('');

    try {
      const originalJudgeIds = judges.map(j => j.id);
      
      const judgesToAdd = selectedJudges.filter(id => !originalJudgeIds.includes(id));
      for (const judgeId of judgesToAdd) {
        const judge = allJudges.find(j => j.id === judgeId);
        if (judge) {
          const currentCompetitionIds = judge.competitions.map(c => c.id);
          const newCompetitionIds = [...currentCompetitionIds, selectedCompetition.id];
          await api.patch(`/api/scoring/judges/${judgeId}/`, { competitions_ids: newCompetitionIds });
        }
      }

      const judgesToRemove = originalJudgeIds.filter(id => !selectedJudges.includes(id));
      for (const judgeId of judgesToRemove) {
        const judge = allJudges.find(j => j.id === judgeId);
        if (judge) {
          const currentCompetitionIds = judge.competitions.map(c => c.id);
          const newCompetitionIds = currentCompetitionIds.filter(id => id !== selectedCompetition.id);
          await api.patch(`/api/scoring/judges/${judgeId}/`, { competitions_ids: newCompetitionIds });
        }
      }

      await fetchAllJudges();
      await fetchCompetitionJudges(selectedCompetition.id);

      setJudgeAssignSuccess('Judges assigned successfully!');
      setTimeout(() => setJudgeAssignSuccess(''), 2000);
    } catch (err) {
      console.error('Failed to assign judges:', err);
      setJudgeAssignSuccess('Failed to assign judges.');
      setTimeout(() => setJudgeAssignSuccess(''), 2000);
    }
  };

  const styles = {
    dashboard: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
      padding: '40px'
    },
    
    welcomeSection: {
      background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      borderRadius: '24px',
      padding: '40px',
      color: 'white',
      marginBottom: '40px',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 20px 40px rgba(245, 158, 11, 0.15)'
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
    
    formSection: {
      background: 'white',
      borderRadius: '24px',
      padding: '32px',
      marginBottom: '32px',
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
    
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    },
    
    formRow: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '16px'
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
    
    textarea: {
      minHeight: '100px',
      resize: 'vertical'
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
      justifyContent: 'center',
      gap: '8px'
    },
    
    btnPrimary: {
      background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      color: 'white',
      boxShadow: '0 4px 12px rgba(245, 158, 11, 0.25)'
    },
    
    btnSecondary: {
      background: '#f8fafc',
      color: '#64748b',
      border: '1px solid #e2e8f0'
    },
    
    btnDanger: {
      background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      color: 'white',
      boxShadow: '0 4px 12px rgba(239, 68, 68, 0.25)'
    },
    
    btnSuccess: {
      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      color: 'white',
      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)'
    },
    
    btnInfo: {
      background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
      color: 'white',
      boxShadow: '0 4px 12px rgba(6, 182, 212, 0.25)'
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
    
    alertSuccess: {
      background: 'rgba(16, 185, 129, 0.1)',
      color: '#065f46',
      border: '1px solid rgba(16, 185, 129, 0.2)'
    },
    
    alertDanger: {
      background: 'rgba(239, 68, 68, 0.1)',
      color: '#dc2626',
      border: '1px solid rgba(239, 68, 68, 0.2)'
    },
    
    competitionsSection: {
      background: 'white',
      borderRadius: '24px',
      padding: '32px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.06)'
    },
    
    competitionGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
      gap: '24px'
    },
    
    competitionCard: {
      background: '#f8fafc',
      borderRadius: '16px',
      padding: '24px',
      border: '1px solid #e2e8f0',
      transition: 'all 0.3s ease'
    },
    
    competitionHeader: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      marginBottom: '16px'
    },
    
    competitionTitle: {
      fontSize: '20px',
      fontWeight: '700',
      color: '#1e293b',
      marginBottom: '4px'
    },
    
    competitionDates: {
      fontSize: '14px',
      color: '#64748b',
      marginBottom: '12px'
    },
    
    competitionDescription: {
      color: '#64748b',
      lineHeight: '1.6',
      marginBottom: '20px'
    },
    
    competitionActions: {
      display: 'flex',
      gap: '8px',
      flexWrap: 'wrap'
    },
    
    actionBtn: {
      padding: '8px 16px',
      fontSize: '12px',
      fontWeight: '500',
      borderRadius: '8px',
      border: 'none',
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
      maxWidth: '600px',
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
    
    modalFooter: {
      display: 'flex',
      gap: '12px',
      justifyContent: 'flex-end',
      padding: '24px 32px',
      borderTop: '1px solid #e2e8f0',
      background: '#f8fafc'
    },
    
    judgeList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      maxHeight: '300px',
      overflowY: 'auto'
    },
    
    judgeItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px 16px',
      background: '#f8fafc',
      borderRadius: '12px',
      border: '1px solid #e2e8f0',
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    },
    
    judgeCheckbox: {
      width: '18px',
      height: '18px',
      borderRadius: '4px',
      border: '2px solid #e5e7eb',
      cursor: 'pointer'
    },
    
    judgeInfo: {
      flex: 1
    },
    
    judgeName: {
      fontWeight: '600',
      color: '#1e293b',
      fontSize: '14px'
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
      borderTop: '4px solid #f59e0b',
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
          Loading competitions...
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
              Manage Competitions 🏆
            </h1>
            <p style={styles.welcomeSubtitle}>
              Create, manage, and oversee competitions with advanced tools for rubrics, judge assignments, and comprehensive analytics.
            </p>
          </div>
        </div>

        {/* Form Section */}
        <div style={styles.formSection}>
          <h2 style={styles.sectionTitle}>
            <span style={styles.sectionIcon}>➕</span>
            Create New Competition
          </h2>
          
          {error && (
            <div style={{...styles.alert, ...styles.alertDanger}}>
              <span>⚠️</span>
              {error}
            </div>
          )}
          
          {success && (
            <div style={{...styles.alert, ...styles.alertSuccess}}>
              <span>✅</span>
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Competition Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  style={styles.formControl}
                  placeholder="Enter competition name"
                  required
                  onFocus={(e) => {
                    e.target.style.borderColor = '#f59e0b';
                    e.target.style.boxShadow = '0 0 0 4px rgba(245, 158, 11, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Start Date</label>
                <input
                  type="date"
                  name="start_date"
                  value={form.start_date}
                  onChange={handleChange}
                  style={styles.formControl}
                  required
                  onFocus={(e) => {
                    e.target.style.borderColor = '#f59e0b';
                    e.target.style.boxShadow = '0 0 0 4px rgba(245, 158, 11, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>End Date</label>
                <input
                  type="date"
                  name="end_date"
                  value={form.end_date}
                  onChange={handleChange}
                  style={styles.formControl}
                  required
                  onFocus={(e) => {
                    e.target.style.borderColor = '#f59e0b';
                    e.target.style.boxShadow = '0 0 0 4px rgba(245, 158, 11, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                style={{...styles.formControl, ...styles.textarea}}
                placeholder="Describe the competition objectives and requirements..."
                required
                onFocus={(e) => {
                  e.target.style.borderColor = '#f59e0b';
                  e.target.style.boxShadow = '0 0 0 4px rgba(245, 158, 11, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            <button 
              type="submit" 
              style={styles.btnPrimary}
              disabled={submitting}
              onMouseEnter={(e) => {
                if (!submitting) {
                  e.target.style.background = 'linear-gradient(135deg, #d97706 0%, #b45309 100%)';
                  e.target.style.transform = 'translateY(-2px)';
                }
              }}
              onMouseLeave={(e) => {
                if (!submitting) {
                  e.target.style.background = 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
                  e.target.style.transform = 'translateY(0)';
                }
              }}
            >
              {submitting ? (
                <>
                  <div style={styles.spinner}></div>
                  Creating...
                </>
              ) : (
                <>
                  <span>🚀</span>
                  Create Competition
                </>
              )}
            </button>
          </form>
        </div>

        {/* Competitions Section */}
        <div style={styles.competitionsSection}>
          <h2 style={styles.sectionTitle}>
            <span style={styles.sectionIcon}>📋</span>
            Existing Competitions
          </h2>

          {competitions.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>🏆</div>
              <h3 style={styles.emptyTitle}>No competitions yet</h3>
              <p style={styles.emptyDesc}>
                Create your first competition to get started with the platform.
              </p>
            </div>
          ) : (
            <div style={styles.competitionGrid}>
              {competitions.map(comp => (
                <div 
                  key={comp.id}
                  style={styles.competitionCard}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#ecfdf5';
                    e.currentTarget.style.borderColor = '#f59e0b';
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 12px 24px rgba(245, 158, 11, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#f8fafc';
                    e.currentTarget.style.borderColor = '#e2e8f0';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={styles.competitionHeader}>
                    <div>
                      <h3 style={styles.competitionTitle}>{comp.name}</h3>
                      <div style={styles.competitionDates}>
                        📅 {comp.start_date} to {comp.end_date}
                      </div>
                    </div>
                  </div>
                  
                  <p style={styles.competitionDescription}>{comp.description}</p>
                  
                  <div style={styles.competitionActions}>
                    <button 
                      style={{...styles.actionBtn, ...styles.btnInfo}}
                      onClick={() => openRubricModal(comp)}
                      onMouseEnter={(e) => {
                        e.target.style.background = 'linear-gradient(135deg, #0891b2 0%, #0e7490 100%)';
                        e.target.style.transform = 'translateY(-1px)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)';
                        e.target.style.transform = 'translateY(0)';
                      }}
                    >
                      📋 Rubrics
                    </button>
                    <button 
                      style={{...styles.actionBtn, ...styles.btnSecondary}}
                      onClick={() => openJudgeModal(comp)}
                      onMouseEnter={(e) => {
                        e.target.style.background = '#e2e8f0';
                        e.target.style.transform = 'translateY(-1px)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = '#f8fafc';
                        e.target.style.transform = 'translateY(0)';
                      }}
                    >
                      👨‍⚖️ Judges
                    </button>
                    <button 
                      style={{...styles.actionBtn, ...styles.btnDanger}}
                      onClick={() => handleDelete(comp.id)}
                      onMouseEnter={(e) => {
                        e.target.style.background = 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)';
                        e.target.style.transform = 'translateY(-1px)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
                        e.target.style.transform = 'translateY(0)';
                      }}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Rubric Modal */}
        {showRubricModal && (
          <div style={styles.modalOverlay} onClick={() => setShowRubricModal(false)}>
            <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
              <div style={styles.modalHeader}>
                <h2 style={styles.modalTitle}>Manage Rubrics</h2>
                <p style={styles.modalSubtitle}>
                  Create scoring criteria for {selectedCompetition?.name}
                </p>
              </div>
              
              <div style={styles.modalBody}>
                <form onSubmit={handleRubricSubmit} style={styles.form}>
                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Rubric Name</label>
                    <input 
                      type="text" 
                      name="name" 
                      value={rubricForm.name} 
                      onChange={handleRubricChange} 
                      style={styles.formControl}
                      required 
                    />
                  </div>
                  
                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Description</label>
                    <textarea 
                      name="description" 
                      value={rubricForm.description} 
                      onChange={handleRubricChange} 
                      style={{...styles.formControl, ...styles.textarea}}
                    />
                  </div>
                  
                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Max Score</label>
                    <input 
                      type="number" 
                      name="max_score" 
                      value={rubricForm.max_score} 
                      onChange={handleRubricChange} 
                      style={styles.formControl}
                      min={1} 
                      max={100} 
                      required 
                    />
                  </div>
                  
                  <button type="submit" style={styles.btnPrimary}>
                    <span>➕</span>
                    Add Rubric
                  </button>
                </form>
                
                <div style={{marginTop: '32px'}}>
                  <h4 style={{marginBottom: '16px', color: '#1e293b', fontWeight: '600'}}>Existing Rubrics</h4>
                  {rubrics.length === 0 ? (
                    <p style={{color: '#64748b', fontStyle: 'italic'}}>No rubrics created yet.</p>
                  ) : (
                    <ul style={{margin: 0, padding: 0, listStyle: 'none'}}>
                      {rubrics.map(r => (
                        <li key={r.id} style={{
                          padding: '12px 16px',
                          background: '#f8fafc',
                          borderRadius: '8px',
                          marginBottom: '8px',
                          border: '1px solid #e2e8f0'
                        }}>
                          <strong>{r.name}</strong> (Max: {r.max_score})
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
              
              <div style={styles.modalFooter}>
                <button 
                  style={styles.btnSecondary}
                  onClick={() => setShowRubricModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Judge Modal */}
        {showJudgeModal && (
          <div style={styles.modalOverlay} onClick={() => setShowJudgeModal(false)}>
            <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
              <div style={styles.modalHeader}>
                <h2 style={styles.modalTitle}>Assign Judges</h2>
                <p style={styles.modalSubtitle}>
                  Select judges for {selectedCompetition?.name}
                </p>
              </div>
              
              <div style={styles.modalBody}>
                {judgeAssignSuccess && (
                  <div style={{...styles.alert, ...styles.alertSuccess}}>
                    <span>✅</span>
                    {judgeAssignSuccess}
                  </div>
                )}
                
                <form onSubmit={handleJudgeSubmit}>
                  <div style={styles.judgeList}>
                    {allJudges.map(judge => (
                      <div 
                        key={judge.id}
                        style={{
                          ...styles.judgeItem,
                          ...(selectedJudges.includes(judge.id) ? {
                            background: 'rgba(245, 158, 11, 0.1)',
                            borderColor: '#f59e0b'
                          } : {})
                        }}
                        onClick={() => handleJudgeChange(judge.id)}
                      >
                        <div style={{
                          ...styles.judgeCheckbox,
                          ...(selectedJudges.includes(judge.id) ? {
                            background: '#f59e0b',
                            borderColor: '#f59e0b'
                          } : {})
                        }}>
                          {selectedJudges.includes(judge.id) && (
                            <span style={{color: 'white', fontSize: '12px'}}>✓</span>
                          )}
                        </div>
                        <div style={styles.judgeInfo}>
                          <div style={styles.judgeName}>
                            {judge.user?.first_name || ''} {judge.user?.last_name || ''} 
                            {judge.user?.username ? ` (${judge.user.username})` : ''}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div style={styles.modalFooter}>
                    <button 
                      type="button"
                      style={styles.btnSecondary}
                      onClick={() => setShowJudgeModal(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit" style={styles.btnPrimary}>
                      <span>👨‍⚖️</span>
                      Assign Judges
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ModernAdminCompetitions;