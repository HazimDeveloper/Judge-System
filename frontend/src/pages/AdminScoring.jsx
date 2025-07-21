import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Container, Table, Spinner, Alert, Card } from 'react-bootstrap';

const AdminScoring = () => {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setError('');
    const fetchScores = async () => {
      try {
        const res = await api.get('/scoring/scores/');
        setScores(res.data);
      } catch (err) {
        setError('Failed to load scores.');
        setScores([]);
      } finally {
        setLoading(false);
      }
    };
    fetchScores();
  }, []);

  return (
    <Container className="py-4">
      <Card className="shadow border-0 mx-auto" style={{ maxWidth: 1100 }}>
        <Card.Body>
          <h3 className="mb-4 text-warning">All Scores</h3>
          {error && <Alert variant="danger" className="mb-3">{error}</Alert>}
          {loading ? (
            <div className="text-center my-5"><Spinner animation="border" /></div>
          ) : (
            <Table striped bordered hover responsive className="mb-0">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Submission</th>
                  <th>Judge</th>
                  <th>Rubric</th>
                  <th>Score</th>
                  <th>Comment</th>
                  <th>Scored At</th>
                </tr>
              </thead>
              <tbody>
                {scores.length === 0 ? (
                  <tr><td colSpan={7} className="text-center text-muted">No scores found.</td></tr>
                ) : scores.map(score => (
                  <tr key={score.id}>
                    <td>{score.id}</td>
                    <td>{score.submission}</td>
                    <td>{score.judge}</td>
                    <td>{score.rubric}</td>
                    <td>{score.score}</td>
                    <td>{score.comment}</td>
                    <td>{new Date(score.scored_at).toLocaleString()}</td>
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

export default AdminScoring; 