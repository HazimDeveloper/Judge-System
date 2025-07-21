import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import { Container, Navbar, Nav } from 'react-bootstrap';
import AdminDashboard from './pages/AdminDashboard';
import RequireRole from './components/RequireRole';
import AdminUsers from './pages/AdminUsers';
import AdminSubmissions from './pages/AdminSubmissions';
import AdminScoring from './pages/AdminScoring';
import { useContext } from 'react';
import { AuthContext } from './contexts/AuthContext';
import JudgeDashboard from './pages/JudgeDashboard';
import JudgeScores from './pages/JudgeScores';
import CommitteeDashboard from './pages/CommitteeDashboard';
import ParticipantDashboard from './pages/ParticipantDashboard';
import Home from './pages/Home';

const Dashboard = () => (
  <Container className="mt-5">
    <h1>Dashboard</h1>
    <p>Welcome to the Judging Review System!</p>
  </Container>
);

function App() {
  const { user, logout } = useContext(AuthContext);
  return (
    <Router>
      <Navbar bg="primary" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="/">Judging System</Navbar.Brand>
          <Nav className="me-auto">
            {user && user.role === 'ADMIN' && (
              <>
                <Nav.Link href="/dashboard">Dashboard</Nav.Link>
                <Nav.Link href="/admin/users">Users</Nav.Link>
                <Nav.Link href="/admin/submissions">Submissions</Nav.Link>
                <Nav.Link href="/admin/scoring">Scoring</Nav.Link>
              </>
            )}
            {user && user.role === 'JUDGE' && (
              <>
                <Nav.Link href="/dashboard">Dashboard</Nav.Link>
                <Nav.Link href="/judge/scores">My Scores</Nav.Link>
              </>
            )}
            {user && user.role === 'COMMITTEE' && (
              <Nav.Link href="/dashboard">Dashboard</Nav.Link>
            )}
            {user && user.role === 'PARTICIPANT' && (
              <Nav.Link href="/dashboard">Dashboard</Nav.Link>
            )}
            {!user && <Nav.Link href="/login">Login</Nav.Link>}
            {!user && <Nav.Link href="/register">Register</Nav.Link>}
          </Nav>
          {user && (
            <Nav>
              <Navbar.Text className="me-2">Signed in as: <b>{user.username}</b> ({user.role})</Navbar.Text>
              <Nav.Link onClick={logout}>Logout</Nav.Link>
            </Nav>
          )}
        </Container>
      </Navbar>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={
          user && user.role === 'ADMIN' ? <RequireRole role="ADMIN"><AdminDashboard /></RequireRole> :
          user && user.role === 'JUDGE' ? <RequireRole role="JUDGE"><JudgeDashboard /></RequireRole> :
          user && user.role === 'COMMITTEE' ? <RequireRole role="COMMITTEE"><CommitteeDashboard /></RequireRole> :
          user && user.role === 'PARTICIPANT' ? <RequireRole role="PARTICIPANT"><ParticipantDashboard /></RequireRole> :
          <Navigate to="/login" />
        } />
        <Route path="/" element={<Home />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
