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
        const res = await api.get('/api/scoring/scores/');
        setScores(res.data);
        setLoading(false);
      } catch (err) {
        setError('Could not load scores. Please refresh the page.');
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
                  <th>Participant</th>
                  <th>Judge</th>
                  <th>Rubric</th>
                  <th>Score</th>
                  <th>Comment</th>
                  <th>File/Link</th>
                </tr>
              </thead>
              <tbody>
                {scores.length === 0 ? (
                  <tr><td colSpan={6} className="text-center text-muted">No scores found.</td></tr>
                ) : scores.map(score => (
                  <tr key={score.id}>
                    <td>{score.participant_name}</td>
                    <td>{score.judge_name}</td>
                    <td>{score.rubric_name}</td>
                    <td>{score.score}</td>
                    <td>{score.comment}</td>
                    <td>
                      {score.evaluation_file && (
                        <a href={score.evaluation_file} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary me-2">PDF</a>
                      )}
                      {score.evaluation_link && (
                        <a href={score.evaluation_link} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-success">Link</a>
                      )}
                      {!(score.evaluation_file || score.evaluation_link) && <span className="text-muted">-</span>}
                    </td>
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