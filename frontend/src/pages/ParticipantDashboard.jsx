import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Container, Table, Button, Spinner, Alert, Card, Form, Modal } from 'react-bootstrap';

const ParticipantDashboard = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', description: '' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const res = await api.get('/submissions/submissions/');
      setSubmissions(res.data);
    } catch (err) {
      setError('Failed to load submissions.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccess('');
    setError('');
    try {
      await api.post('/submissions/submissions/', form);
      setSuccess('Submission successful!');
      setShowModal(false);
      setForm({ title: '', description: '' });
      fetchSubmissions();
    } catch (err) {
      setError('Failed to submit.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center mt-5"><Spinner animation="border" /></div>;
  if (error) return <Alert variant="danger" className="mt-4">{error}</Alert>;

  return (
    <Container className="py-4">
      <Card className="shadow border-0 mx-auto" style={{ maxWidth: 1100 }}>
        <Card.Body>
          <h2 className="fw-bold mb-4 text-center text-primary">Participant Dashboard</h2>
          <Button className="mb-3" onClick={() => setShowModal(true)} size="lg">Submit New Project</Button>
          <Table striped bordered hover responsive className="mb-0">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Description</th>
                <th>Status</th>
                <th>Submitted At</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map(sub => (
                <tr key={sub.id}>
                  <td>{sub.id}</td>
                  <td>{sub.title}</td>
                  <td>{sub.description}</td>
                  <td>{sub.status}</td>
                  <td>{new Date(sub.submitted_at).toLocaleString()}</td>
                  <td>{sub.scores && sub.scores.length > 0 ? (
                    <>
                      Avg: {(
                        sub.scores.reduce((acc, s) => acc + s.score, 0) / sub.scores.length
                      ).toFixed(2)}
                    </>
                  ) : 'Pending'}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Submit New Project</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control type="text" name="title" value={form.title} onChange={handleChange} required size="lg" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" name="description" value={form.description} onChange={handleChange} required size="lg" />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)} size="lg">
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={submitting} size="lg">
              {submitting ? 'Submitting...' : 'Submit'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
      {success && <Alert variant="success" className="mt-3">{success}</Alert>}
    </Container>
  );
};

export default ParticipantDashboard; 