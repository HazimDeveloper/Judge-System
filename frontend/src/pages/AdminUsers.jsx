import React, { useEffect, useState } from 'react';
import api from '../services/api';

const ModernAdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [userForm, setUserForm] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    role: 'PARTICIPANT'
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setError('');
    try {
      const res = await api.get('/api/users/');
      setUsers(res.data);
    } catch (err) {
      setError('Could not load users. Please refresh the page.');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');
    
    try {
      await api.post('/api/users/register/', {
        ...userForm,
        password: 'temppass123' // Default password for admin-created users
      });
      setSuccess('User created successfully!');
      setUserForm({
        username: '',
        email: '',
        first_name: '',
        last_name: '',
        role: 'PARTICIPANT'
      });
      setShowCreateModal(false);
      fetchUsers();
    } catch (err) {
      setError('Could not create user. Please check your input.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    try {
      await api.delete(`/api/users/${userId}/`);
      fetchUsers();
    } catch (err) {
      setError('Could not delete user.');
    }
  };

  const filteredAndSortedUsers = React.useMemo(() => {
    let filtered = users.filter(user => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        user.username?.toLowerCase().includes(searchLower) ||
        user.email?.toLowerCase().includes(searchLower) ||
        user.first_name?.toLowerCase().includes(searchLower) ||
        user.last_name?.toLowerCase().includes(searchLower);
      
      if (filterBy === 'all') return matchesSearch;
      return matchesSearch && user.role === filterBy;
    });

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'username':
          return (a.username || '').localeCompare(b.username || '');
        case 'email':
          return (a.email || '').localeCompare(b.email || '');
        case 'role':
          return (a.role || '').localeCompare(b.role || '');
        case 'oldest':
          return new Date(a.date_joined || 0) - new Date(b.date_joined || 0);
        default:
          return new Date(b.date_joined || 0) - new Date(a.date_joined || 0);
      }
    });
  }, [users, searchTerm, filterBy, sortBy]);

  const getRoleColor = (role) => {
    switch (role) {
      case 'ADMIN':
        return '#8b5cf6';
      case 'JUDGE':
        return '#10b981';
      case 'COMMITTEE':
        return '#f59e0b';
      case 'PARTICIPANT':
        return '#06b6d4';
      default:
        return '#64748b';
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'ADMIN':
        return '👑';
      case 'JUDGE':
        return '⚖️';
      case 'COMMITTEE':
        return '📋';
      case 'PARTICIPANT':
        return '🎯';
      default:
        return '👤';
    }
  };

  const openDetailsModal = (user) => {
    setSelectedUser(user);
    setShowDetailsModal(true);
  };

  const styles = {
    dashboard: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
      padding: '40px'
    },
    
    welcomeSection: {
      background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
      borderRadius: '24px',
      padding: '40px',
      color: 'white',
      marginBottom: '40px',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 20px 40px rgba(59, 130, 246, 0.15)'
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
    
    usersSection: {
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
    
    usersGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
      gap: '20px'
    },
    
    userCard: {
      background: '#f8fafc',
      borderRadius: '16px',
      padding: '24px',
      border: '1px solid #e2e8f0',
      transition: 'all 0.3s ease',
      cursor: 'pointer'
    },
    
    userHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      marginBottom: '16px'
    },
    
    userAvatar: {
      width: '48px',
      height: '48px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '20px',
      color: 'white',
      fontWeight: '700',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
    },
    
    userInfo: {
      flex: 1
    },
    
    userName: {
      fontSize: '18px',
      fontWeight: '700',
      color: '#1e293b',
      marginBottom: '4px'
    },
    
    userEmail: {
      fontSize: '14px',
      color: '#64748b',
      marginBottom: '8px'
    },
    
    roleBadge: {
      padding: '4px 8px',
      borderRadius: '12px',
      fontSize: '11px',
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      color: 'white',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px'
    },
    
    userDetails: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '12px',
      marginBottom: '16px'
    },
    
    detailItem: {
      background: 'white',
      borderRadius: '8px',
      padding: '12px',
      border: '1px solid #e2e8f0'
    },
    
    detailLabel: {
      fontSize: '10px',
      fontWeight: '600',
      color: '#64748b',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      marginBottom: '4px'
    },
    
    detailValue: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#1e293b'
    },
    
    userActions: {
      display: 'flex',
      gap: '8px'
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
    
    btnView: {
      background: '#3b82f6',
      color: 'white'
    },
    
    btnDanger: {
      background: '#ef4444',
      color: 'white'
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
    
    formRow: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '16px',
      marginBottom: '20px'
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
    
    btnPrimary: {
      background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
      color: 'white',
      boxShadow: '0 4px 12px rgba(59, 130, 246, 0.25)'
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
      borderTop: '4px solid #3b82f6',
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
    
    alertSuccess: {
      background: 'rgba(16, 185, 129, 0.1)',
      color: '#065f46',
      border: '1px solid rgba(16, 185, 129, 0.2)'
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
          Loading users...
        </div>
      </>
    );
  }

  const StatCard = ({ icon, title, value, color = '#3b82f6' }) => (
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

  const UserCard = ({ user }) => (
    <div 
      style={styles.userCard}
      onClick={() => openDetailsModal(user)}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = '#ecfdf5';
        e.currentTarget.style.borderColor = '#3b82f6';
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 12px 24px rgba(59, 130, 246, 0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = '#f8fafc';
        e.currentTarget.style.borderColor = '#e2e8f0';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div style={styles.userHeader}>
        <div style={{
          ...styles.userAvatar,
          background: getRoleColor(user.role)
        }}>
          {getRoleIcon(user.role)}
        </div>
        <div style={styles.userInfo}>
          <h3 style={styles.userName}>
            {user.first_name} {user.last_name} {!user.first_name && !user.last_name && user.username}
          </h3>
          <div style={styles.userEmail}>{user.email}</div>
          <div style={{
            ...styles.roleBadge,
            background: getRoleColor(user.role)
          }}>
            <span>{getRoleIcon(user.role)}</span>
            <span>{user.role}</span>
          </div>
        </div>
      </div>

      <div style={styles.userDetails}>
        <div style={styles.detailItem}>
          <div style={styles.detailLabel}>Username</div>
          <div style={styles.detailValue}>{user.username}</div>
        </div>
        <div style={styles.detailItem}>
          <div style={styles.detailLabel}>User ID</div>
          <div style={styles.detailValue}>#{user.id}</div>
        </div>
        <div style={styles.detailItem}>
          <div style={styles.detailLabel}>Joined</div>
          <div style={styles.detailValue}>
            {user.date_joined ? new Date(user.date_joined).toLocaleDateString() : 'Unknown'}
          </div>
        </div>
        <div style={styles.detailItem}>
          <div style={styles.detailLabel}>Status</div>
          <div style={styles.detailValue}>
            {user.is_active ? '🟢 Active' : '🔴 Inactive'}
          </div>
        </div>
      </div>

      <div style={styles.userActions}>
        <button 
          style={{...styles.actionBtn, ...styles.btnView}}
          onClick={(e) => {
            e.stopPropagation();
            openDetailsModal(user);
          }}
          onMouseEnter={(e) => {
            e.target.style.background = '#2563eb';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = '#3b82f6';
          }}
        >
          👁️ View Details
        </button>
        <button 
          style={{...styles.actionBtn, ...styles.btnDanger}}
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteUser(user.id);
          }}
          onMouseEnter={(e) => {
            e.target.style.background = '#dc2626';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = '#ef4444';
          }}
        >
          🗑️ Delete
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
            <div style={styles.welcomeText}>
              <h1 style={styles.welcomeTitle}>
                User Management 👥
              </h1>
              <p style={styles.welcomeSubtitle}>
                Manage platform users, roles, and permissions with comprehensive administrative tools and detailed analytics.
              </p>
            </div>
            <button 
              style={styles.welcomeAction}
              onClick={() => setShowCreateModal(true)}
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
              Create User
            </button>
          </div>
        </div>

        {/* Stats Section */}
        <div style={styles.statsSection}>
          <StatCard
            icon="👥"
            title="Total Users"
            value={users.length}
            color="#3b82f6"
          />
          <StatCard
            icon="👑"
            title="Admins"
            value={users.filter(u => u.role === 'ADMIN').length}
            color="#8b5cf6"
          />
          <StatCard
            icon="⚖️"
            title="Judges"
            value={users.filter(u => u.role === 'JUDGE').length}
            color="#10b981"
          />
          <StatCard
            icon="📋"
            title="Committee"
            value={users.filter(u => u.role === 'COMMITTEE').length}
            color="#f59e0b"
          />
          <StatCard
            icon="🎯"
            title="Participants"
            value={users.filter(u => u.role === 'PARTICIPANT').length}
            color="#06b6d4"
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
                placeholder="Search users by name, email, username..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={(e) => {
                  e.target.style.borderColor = '#3b82f6';
                  e.target.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Filter by Role</label>
              <select
                style={styles.formControl}
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                onFocus={(e) => {
                  e.target.style.borderColor = '#3b82f6';
                  e.target.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <option value="all">All Roles</option>
                <option value="ADMIN">Admin</option>
                <option value="JUDGE">Judge</option>
                <option value="COMMITTEE">Committee</option>
                <option value="PARTICIPANT">Participant</option>
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Sort by</label>
              <select
                style={styles.formControl}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                onFocus={(e) => {
                  e.target.style.borderColor = '#3b82f6';
                  e.target.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="username">Username A-Z</option>
                <option value="email">Email A-Z</option>
                <option value="role">Role</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Section */}
        <div style={styles.usersSection}>
          <h2 style={styles.sectionTitle}>
            <span style={styles.sectionIcon}>📋</span>
            All Users ({filteredAndSortedUsers.length})
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

          {filteredAndSortedUsers.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>👥</div>
              <h3 style={styles.emptyTitle}>No users found</h3>
              <p style={styles.emptyDesc}>
                {searchTerm || filterBy !== 'all' 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Users will appear here once they register on the platform.'
                }
              </p>
            </div>
          ) : (
            <div style={styles.usersGrid}>
              {filteredAndSortedUsers.map(user => (
                <UserCard key={user.id} user={user} />
              ))}
            </div>
          )}
        </div>

        {/* Details Modal */}
        {showDetailsModal && selectedUser && (
          <div style={styles.modalOverlay} onClick={() => setShowDetailsModal(false)}>
            <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
              <div style={styles.modalHeader}>
                <h2 style={styles.modalTitle}>User Details</h2>
                <p style={styles.modalSubtitle}>
                  Complete information for {selectedUser.username}
                </p>
              </div>
              
              <div style={styles.modalBody}>
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px'}}>
                  <div style={styles.detailItem}>
                    <div style={styles.detailLabel}>Full Name</div>
                    <div style={styles.detailValue}>
                      {selectedUser.first_name} {selectedUser.last_name} || 'Not provided'
                    </div>
                  </div>
                  
                  <div style={styles.detailItem}>
                    <div style={styles.detailLabel}>Username</div>
                    <div style={styles.detailValue}>{selectedUser.username}</div>
                  </div>
                  
                  <div style={styles.detailItem}>
                    <div style={styles.detailLabel}>Email</div>
                    <div style={styles.detailValue}>{selectedUser.email}</div>
                  </div>
                  
                  <div style={styles.detailItem}>
                    <div style={styles.detailLabel}>Role</div>
                    <div style={{
                      ...styles.detailValue,
                      color: getRoleColor(selectedUser.role)
                    }}>
                      {getRoleIcon(selectedUser.role)} {selectedUser.role}
                    </div>
                  </div>
                  
                  <div style={styles.detailItem}>
                    <div style={styles.detailLabel}>User ID</div>
                    <div style={styles.detailValue}>#{selectedUser.id}</div>
                  </div>
                  
                  <div style={styles.detailItem}>
                    <div style={styles.detailLabel}>Date Joined</div>
                    <div style={styles.detailValue}>
                      {selectedUser.date_joined 
                        ? new Date(selectedUser.date_joined).toLocaleDateString()
                        : 'Unknown'
                      }
                    </div>
                  </div>
                  
                  <div style={styles.detailItem}>
                    <div style={styles.detailLabel}>Last Login</div>
                    <div style={styles.detailValue}>
                      {selectedUser.last_login 
                        ? new Date(selectedUser.last_login).toLocaleDateString()
                        : 'Never'
                      }
                    </div>
                  </div>
                  
                  <div style={styles.detailItem}>
                    <div style={styles.detailLabel}>Status</div>
                    <div style={styles.detailValue}>
                      {selectedUser.is_active ? '🟢 Active' : '🔴 Inactive'}
                    </div>
                  </div>
                </div>
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

        {/* Create User Modal */}
        {showCreateModal && (
          <div style={styles.modalOverlay} onClick={() => setShowCreateModal(false)}>
            <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
              <div style={styles.modalHeader}>
                <h2 style={styles.modalTitle}>Create New User</h2>
                <p style={styles.modalSubtitle}>
                  Add a new user to the platform
                </p>
              </div>
              
              <form onSubmit={handleCreateUser}>
                <div style={styles.modalBody}>
                  <div style={styles.formRow}>
                    <div style={styles.formGroup}>
                      <label style={styles.formLabel}>First Name</label>
                      <input
                        type="text"
                        style={styles.formControl}
                        value={userForm.first_name}
                        onChange={(e) => setUserForm({...userForm, first_name: e.target.value})}
                        placeholder="Enter first name"
                        required
                      />
                    </div>
                    
                    <div style={styles.formGroup}>
                      <label style={styles.formLabel}>Last Name</label>
                      <input
                        type="text"
                        style={styles.formControl}
                        value={userForm.last_name}
                        onChange={(e) => setUserForm({...userForm, last_name: e.target.value})}
                        placeholder="Enter last name"
                        required
                      />
                    </div>
                  </div>

                  <div style={styles.formRow}>
                    <div style={styles.formGroup}>
                      <label style={styles.formLabel}>Username</label>
                      <input
                        type="text"
                        style={styles.formControl}
                        value={userForm.username}
                        onChange={(e) => setUserForm({...userForm, username: e.target.value})}
                        placeholder="Choose username"
                        required
                      />
                    </div>
                    
                    <div style={styles.formGroup}>
                      <label style={styles.formLabel}>Email</label>
                      <input
                        type="email"
                        style={styles.formControl}
                        value={userForm.email}
                        onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                        placeholder="Enter email address"
                        required
                      />
                    </div>
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Role</label>
                    <select
                      style={styles.formControl}
                      value={userForm.role}
                      onChange={(e) => setUserForm({...userForm, role: e.target.value})}
                      required
                    >
                      <option value="PARTICIPANT">Participant</option>
                      <option value="JUDGE">Judge</option>
                      <option value="COMMITTEE">Committee</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  </div>

                  <div style={{
                    background: '#eff6ff',
                    border: '1px solid #bfdbfe',
                    borderRadius: '12px',
                    padding: '16px',
                    marginTop: '20px'
                  }}>
                    <p style={{color: '#1d4ed8', fontSize: '14px', margin: 0}}>
                      ℹ️ The user will be created with a temporary password: <strong>temppass123</strong>
                      <br />Please inform them to change it after first login.
                    </p>
                  </div>
                </div>
                
                <div style={styles.modalFooter}>
                  <button 
                    type="button"
                    style={{...styles.btn, ...styles.btnSecondary}}
                    onClick={() => setShowCreateModal(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    style={{...styles.btn, ...styles.btnPrimary}}
                    disabled={submitting}
                    onMouseEnter={(e) => {
                      if (!submitting) {
                        e.target.style.background = 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)';
                        e.target.style.transform = 'translateY(-2px)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!submitting) {
                        e.target.style.background = 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)';
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
                        <span>👤</span>
                        Create User
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ModernAdminUsers;