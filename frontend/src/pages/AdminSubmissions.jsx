import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Container, Table, Spinner, Alert, Card } from 'react-bootstrap';

const AdminSubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setError('');
    const fetchSubmissions = async () => {
      try {
        const res = await api.get('/submissions/submissions/');
        setSubmissions(res.data);
      } catch (err) {
        setError('Failed to load submissions.');
        setSubmissions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSubmissions();
  }, []);

  return (
    <Container className="py-4">
      <Card className="shadow border-0 mx-auto" style={{ maxWidth: 1100 }}>
        <Card.Body>
          <h3 className="mb-4 text-success">All Submissions</h3>
          {error && <Alert variant="danger" className="mb-3">{error}</Alert>}
          {loading ? (
            <div className="text-center my-5"><Spinner animation="border" /></div>
          ) : (
            <Table striped bordered hover responsive className="mb-0">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Participant</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Submitted At</th>
                </tr>
              </thead>
              <tbody>
                {submissions.length === 0 ? (
                  <tr><td colSpan={6} className="text-center text-muted">No submissions found.</td></tr>
                ) : submissions.map(sub => (
                  <tr key={sub.id}>
                    <td>{sub.id}</td>
                    <td>{sub.participant?.user}</td>
                    <td>{sub.title}</td>
                    <td>{sub.description}</td>
                    <td>{sub.status}</td>
                    <td>{new Date(sub.submitted_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AdminSubmissions; 