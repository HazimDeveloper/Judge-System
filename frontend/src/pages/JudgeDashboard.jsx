import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Container, Table, Button, Spinner, Alert, Modal, Form, Card } from 'react-bootstrap';

const JudgeDashboard = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [score, setScore] = useState('');
  const [comment, setComment] = useState('');
  const [rubrics, setRubrics] = useState([]);
  const [selectedRubric, setSelectedRubric] = useState('');
  const [scoring, setScoring] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    setError('');
    const fetchData = async () => {
      try {
        const [subsRes, rubricsRes] = await Promise.all([
          api.get('/submissions/submissions/'),
          api.get('/scoring/rubrics/'),
        ]);
        setSubmissions(subsRes.data);
        setRubrics(rubricsRes.data);
      } catch (err) {
        setError('Failed to load data.');
        setSubmissions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleScore = (submission) => {
    setSelectedSubmission(submission);
    setShowModal(true);
    setScore('');
    setComment('');
    setSelectedRubric(rubrics[0]?.id || '');
    setSuccess('');
    setError('');
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setError('');
    setSuccess('');
  };

  const handleSubmitScore = async (e) => {
    e.preventDefault();
    setScoring(true);
    setSuccess('');
    setError('');
    try {
      await api.post('/scoring/scores/', {
        submission: selectedSubmission.id,
        rubric: selectedRubric,
        score: score,
        comment: comment,
      });
      setSuccess('Score submitted!');
      setShowModal(false);
    } catch (err) {
      setError('Failed to submit score.');
    } finally {
      setScoring(false);
    }
  };

  return (
    <Container className="py-4">
      <Card className="shadow border-0 mx-auto" style={{ maxWidth: 1100 }}>
        <Card.Body>
          <h2 className="fw-bold mb-4 text-center text-primary">Judge Dashboard</h2>
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
                  <th>Action</th>
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
                    <td>
                      <Button variant="success" size="lg" className="w-100" onClick={() => handleScore(sub)}>
                        Score
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Score Submission</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmitScore}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Rubric</Form.Label>
              <Form.Select value={selectedRubric} onChange={e => setSelectedRubric(e.target.value)} required size="lg">
                {rubrics.map(rubric => (
                  <option key={rubric.id} value={rubric.id}>{rubric.name}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Score</Form.Label>
              <Form.Control type="number" min="0" max="100" value={score} onChange={e => setScore(e.target.value)} required size="lg" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Comment</Form.Label>
              <Form.Control as="textarea" rows={3} value={comment} onChange={e => setComment(e.target.value)} size="lg" />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal} size="lg">
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={scoring} size="lg">
              {scoring ? 'Submitting...' : 'Submit Score'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
      {success && <Alert variant="success" className="mt-3">{success}</Alert>}
    </Container>
  );
};

export default JudgeDashboard; 