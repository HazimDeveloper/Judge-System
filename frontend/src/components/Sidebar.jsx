import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const sidebarLinks = {
  ADMIN: [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/admin/users', label: 'Users', icon: '👥' },
    { path: '/admin/submissions', label: 'Submissions', icon: '📄' },
    { path: '/admin/scoring', label: 'Scoring', icon: '⭐' },
    { path: '/admin/competitions', label: 'Competitions', icon: '🏆' }
  ],
  JUDGE: [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' }
  ],
  COMMITTEE: [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' }
  ],
  PARTICIPANT: [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' }
  ]
};

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  if (!user) return null;
  const links = sidebarLinks[user.role] || [];

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="sidebar-icon">🏆</span>
        <span className="sidebar-text">JudgeFlow</span>
      </div>
      <nav className="sidebar-nav">
        {links.map(link => (
          <Link
            key={link.path}
            to={link.path}
            className={`sidebar-link${location.pathname === link.path ? ' active' : ''}`}
          >
            <span className="sidebar-link-icon">{link.icon}</span>
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <span className="sidebar-user-avatar">{user.role === 'ADMIN' ? '👑' : user.role === 'JUDGE' ? '⚖️' : user.role === 'COMMITTEE' ? '📋' : '🎯'}</span>
          <div className="sidebar-user-details">
            <span className="sidebar-username">{user.username}</span>
            <span className="sidebar-userrole">{user.role}</span>
          </div>
        </div>
        <button className="sidebar-logout" onClick={logout} title="Logout">
          <span>🚪</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar; 