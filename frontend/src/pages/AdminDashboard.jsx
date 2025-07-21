import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';
import api from '../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/dashboard/stats/');
        setStats(res.data);
      } catch (err) {
        setError('Failed to load dashboard stats.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const handleExport = async () => {
    try {
      const res = await api.get('/dashboard/export-scores/', { responseType: 'blob' });
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

  if (loading) return <div className="text-center mt-5"><Spinner animation="border" /></div>;
  if (error) return <Alert variant="danger" className="mt-4">{error}</Alert>;

  return (
    <div style={{ background: 'linear-gradient(135deg, #f1f5f9 0%, #e0e7ff 100%)', minHeight: '100vh' }}>
      <Container className="py-4">
        <h2 className="fw-bold mb-4 text-center" style={{ color: '#1e293b' }}>Admin Dashboard</h2>
        <Row className="g-4 mb-4" xs={1} sm={2} md={2} lg={4}>
          <Col>
            <Card className="h-100 shadow-sm border-0 text-center">
              <Card.Body>
                <Card.Title className="mb-2">Total Participants</Card.Title>
                <Card.Text className="display-6 fw-semibold" style={{ color: '#2563eb' }}>{stats?.total_participants ?? '--'}</Card.Text>
                <Button variant="outline-primary" className="w-100 mt-2" size="lg">Manage Users</Button>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card className="h-100 shadow-sm border-0 text-center">
              <Card.Body>
                <Card.Title className="mb-2">Total Submissions</Card.Title>
                <Card.Text className="display-6 fw-semibold" style={{ color: '#16a34a' }}>{stats?.total_submissions ?? '--'}</Card.Text>
                <Button variant="outline-success" className="w-100 mt-2" size="lg">View Submissions</Button>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card className="h-100 shadow-sm border-0 text-center">
              <Card.Body>
                <Card.Title className="mb-2">Average Score</Card.Title>
                <Card.Text className="display-6 fw-semibold" style={{ color: '#f59e42' }}>{stats?.average_score ? stats.average_score.toFixed(2) : '--'}</Card.Text>
                <Button variant="outline-warning" className="w-100 mt-2" size="lg">View Scoring</Button>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card className="h-100 shadow-sm border-0 text-center">
              <Card.Body>
                <Card.Title className="mb-2">Reports</Card.Title>
                <Card.Text className="mb-2">Export & Print</Card.Text>
                <Button variant="primary" className="w-100" size="lg" onClick={handleExport}>Export Report</Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row className="g-4">
          <Col xs={12} md={8} className="mx-auto">
            <Card className="shadow border-0">
              <Card.Body>
                <Card.Title className="mb-3">Judge Activity</Card.Title>
                <ul className="mb-0" style={{ color: '#475569', fontSize: '1.1rem' }}>
                  {stats?.judge_activity?.length ? stats.judge_activity.map((j, i) => (
                    <li key={i}>{j['judge__user__username']}: {j.count} scores</li>
                  )) : <li>No judge activity yet.</li>}
                </ul>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdminDashboard; 