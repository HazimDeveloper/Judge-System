import React, { useContext, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import RequireRole from './components/RequireRole';
import AdminUsers from './pages/AdminUsers';
import AdminSubmissions from './pages/AdminSubmissions';
import AdminScoring from './pages/AdminScoring';
import { AuthContext } from './contexts/AuthContext';
import JudgeDashboard from './pages/JudgeDashboard';
import CommitteeDashboard from './pages/CommitteeDashboard';
import ParticipantDashboard from './pages/ParticipantDashboard';
import Home from './pages/Home';
import './App.css';
import AdminCompetitions from './pages/AdminCompetitions';
import Sidebar from './components/Sidebar';

const ModernNavbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const getRoleIcon = (role) => {
    const icons = {
      ADMIN: '👑',
      JUDGE: '⚖️', 
      COMMITTEE: '📋',
      PARTICIPANT: '🎯'
    };
    return icons[role] || '👤';
  };

  const navLinks = {
    ADMIN: [
      { path: '/dashboard', label: 'Dashboard', icon: '📊' },
      { path: '/admin/users', label: 'Users', icon: '👥' },
      { path: '/admin/submissions', label: 'Submissions', icon: '📄' },
      { path: '/admin/scoring', label: 'Scoring', icon: '⭐' },
      { path: '/admin/competitions', label: 'Competitions', icon: '🏆' }
    ],
    JUDGE: [
      { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    ],
    COMMITTEE: [
      { path: '/dashboard', label: 'Dashboard', icon: '📊' }
    ],
    PARTICIPANT: [
      { path: '/dashboard', label: 'Dashboard', icon: '📊' }
    ]
  };

  return (
    <nav className="modern-navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <div className="brand-icon">🏆</div>
          <span className="brand-text">JudgeFlow</span>
        </Link>

        <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          {user && navLinks[user.role]?.map((link) => (
            <Link 
              key={link.path}
              to={link.path} 
              className="navbar-link"
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="link-icon">{link.icon}</span>
              {link.label}
            </Link>
          ))}
          
          {!user && (
            <>
              <Link to="/login" className="navbar-link">Login</Link>
              <Link to="/register" className="navbar-link">Register</Link>
            </>
          )}
        </div>

        {user && (
          <div className="navbar-user">
            <div className="user-info">
              <div className="user-avatar">
                {getRoleIcon(user.role)}
              </div>
              <div className="user-details">
                <span className="username">{user.username}</span>
                <span className="user-role">{user.role}</span>
              </div>
            </div>
            <button className="logout-btn" onClick={logout}>
              <span>🚪</span>
            </button>
          </div>
        )}

        <button 
          className="mobile-menu-btn"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
};

function App() {
  const { user } = useContext(AuthContext);
  const isDashboard =
    user && (
      window.location.pathname === '/dashboard' ||
      window.location.pathname.startsWith('/admin/') ||
      window.location.pathname.startsWith('/judge/')
    );

  return (
    <Router>
      <div className="app">
        {/* Only show ModernNavbar on non-dashboard pages */}
        {!isDashboard && <ModernNavbar />}
        {/* Dashboard layout: sidebar + main content */}
        {isDashboard ? (
          <div className="dashboard-layout">
            <Sidebar />
            <main className="main-content dashboard-main-content">
              <Routes>
                <Route path="/dashboard" element={
                  user && user.role === 'ADMIN' ? <RequireRole role="ADMIN"><AdminDashboard /></RequireRole> :
                  user && user.role === 'JUDGE' ? <RequireRole role="JUDGE"><JudgeDashboard /></RequireRole> :
                  user && user.role === 'COMMITTEE' ? <RequireRole role="COMMITTEE"><CommitteeDashboard /></RequireRole> :
                  user && user.role === 'PARTICIPANT' ? <RequireRole role="PARTICIPANT"><ParticipantDashboard /></RequireRole> :
                  <Navigate to="/login" />
                } />
                <Route path="/admin/users" element={<RequireRole role="ADMIN"><AdminUsers /></RequireRole>} />
                <Route path="/admin/submissions" element={<RequireRole role="ADMIN"><AdminSubmissions /></RequireRole>} />
                <Route path="/admin/scoring" element={<RequireRole role="ADMIN"><AdminScoring /></RequireRole>} />
                <Route path="/admin/competitions" element={<RequireRole role="ADMIN"><AdminCompetitions /></RequireRole>} />
              </Routes>
            </main>
          </div>
        ) : (
          <main className="main-content">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<Home />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        )}
      </div>
    </Router>
  );
}

export default App;