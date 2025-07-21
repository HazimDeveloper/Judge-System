import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Container, Table, Spinner, Alert, Card, Button, Form, Row, Col, Modal } from 'react-bootstrap';

const AdminCompetitions = () => {
  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', description: '', start_date: '', end_date: '' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [showRubricModal, setShowRubricModal] = useState(false);
  const [showJudgeModal, setShowJudgeModal] = useState(false);
  const [selectedCompetition, setSelectedCompetition] = useState(null);
  const [rubricForm, setRubricForm] = useState({ name: '', description: '', max_score: 100 });
  const [judges, setJudges] = useState([]);
  const [allJudges, setAllJudges] = useState([]);
  const [selectedJudges, setSelectedJudges] = useState([]);
  const [rubrics, setRubrics] = useState([]);
  const [judgeAssignSuccess, setJudgeAssignSuccess] = useState('');

  useEffect(() => {
    fetchCompetitions();
    fetchAllJudges();
  }, []);

  const fetchCompetitions = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/api/competitions/');
      setCompetitions(res.data);
    } catch (err) {
      setError('Could not load competitions. Please refresh the page.');
      setCompetitions([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllJudges = async () => {
    try {
      const res = await api.get('/api/scoring/judges/');
      setAllJudges(res.data);
    } catch {
      setAllJudges([]);
    }
  };

  const fetchRubrics = async (competitionId) => {
    try {
      const res = await api.get(`/scoring/rubrics/?competition_id=${competitionId}`);
      setRubrics(res.data);
    } catch {
      setRubrics([]);
    }
  };

  const fetchCompetitionJudges = async (competitionId) => {
    try {
      const res = await api.get('/api/scoring/judges/');
      const assigned = res.data.filter(j => j.competitions.some(c => c.id === competitionId));
      setJudges(assigned);
      setSelectedJudges(assigned.map(j => j.id));
    } catch {
      setJudges([]);
      setSelectedJudges([]);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');
    try {
      await api.post('/api/competitions/', form);
      setSuccess('Competition created!');
      setForm({ name: '', description: '', start_date: '', end_date: '' });
      fetchCompetitions();
    } catch (err) {
      setError('Could not create competition. Please check your input.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this competition?')) return;
    try {
      await api.delete(`/api/competitions/${id}/`);
      fetchCompetitions();
    } catch (err) {
      setError('Could not delete competition.');
    }
  };

  // Rubric Modal
  const openRubricModal = (competition) => {
    setSelectedCompetition(competition);
    setRubricForm({ name: '', description: '', max_score: 100 });
    fetchRubrics(competition.id);
    setShowRubricModal(true);
  };
  const handleRubricChange = (e) => {
    setRubricForm({ ...rubricForm, [e.target.name]: e.target.value });
  };
  const handleRubricSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/scoring/rubrics/', { ...rubricForm, competition_id: selectedCompetition.id });
      fetchRubrics(selectedCompetition.id);
      setRubricForm({ name: '', description: '', max_score: 100 });
    } catch {}
  };

  // Judge Modal
  const openJudgeModal = (competition) => {
    setSelectedCompetition(competition);
    fetchCompetitionJudges(competition.id);
    setShowJudgeModal(true);
  };
  const handleJudgeChange = (e) => {
    const value = Array.from(e.target.selectedOptions, option => parseInt(option.value));
    setSelectedJudges(value);
  };
  const handleJudgeSubmit = async (e) => {
    e.preventDefault();
    setJudgeAssignSuccess('');

    try {
      // Get the original list of judge IDs for THIS competition
      const originalJudgeIds = judges.map(j => j.id);
      
      // Judges to be newly assigned to this competition
      const judgesToAdd = selectedJudges.filter(id => !originalJudgeIds.includes(id));
      for (const judgeId of judgesToAdd) {
        const judge = allJudges.find(j => j.id === judgeId);
        if (judge) {
          const currentCompetitionIds = judge.competitions.map(c => c.id);
          const newCompetitionIds = [...currentCompetitionIds, selectedCompetition.id];
          await api.patch(`/api/scoring/judges/${judgeId}/`, { competitions_ids: newCompetitionIds });
        }
      }

      // Judges to be unassigned from this competition
      const judgesToRemove = originalJudgeIds.filter(id => !selectedJudges.includes(id));
      for (const judgeId of judgesToRemove) {
        const judge = allJudges.find(j => j.id === judgeId);
        if (judge) {
          const currentCompetitionIds = judge.competitions.map(c => c.id);
          const newCompetitionIds = currentCompetitionIds.filter(id => id !== selectedCompetition.id);
          await api.patch(`/api/scoring/judges/${judgeId}/`, { competitions_ids: newCompetitionIds });
        }
      }

      // After all updates, refetch the data to update the UI
      await fetchAllJudges(); // This will update `allJudges` with the latest assignments
      await fetchCompetitionJudges(selectedCompetition.id); // This will update the `judges` for the current modal

      setJudgeAssignSuccess('Judges assigned successfully!');
      setTimeout(() => setJudgeAssignSuccess(''), 2000);
    } catch (err) {
      console.error('Failed to assign judges:', err);
      setJudgeAssignSuccess('Failed to assign judges.');
      setTimeout(() => setJudgeAssignSuccess(''), 2000);
    }
  };

  return (
    <Container className="py-4">
      <Card className="shadow border-0 mx-auto" style={{ maxWidth: 900 }}>
        <Card.Body>
          <h3 className="mb-4 text-primary">Manage Competitions</h3>
          {error && <Alert variant="danger" className="mb-3">{error}</Alert>}
          {success && <Alert variant="success" className="mb-3">{success}</Alert>}
          <Form onSubmit={handleSubmit} className="mb-4">
            <Row className="g-2">
              <Col md={3}>
                <Form.Control
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Competition Name"
                  required
                />
              </Col>
              <Col md={3}>
                <Form.Control
                  type="date"
                  name="start_date"
                  value={form.start_date}
                  onChange={handleChange}
                  required
                />
              </Col>
              <Col md={3}>
                <Form.Control
                  type="date"
                  name="end_date"
                  value={form.end_date}
                  onChange={handleChange}
                  required
                />
              </Col>
              <Col md={3}>
                <Button type="submit" variant="primary" className="w-100" disabled={submitting}>
                  {submitting ? 'Creating...' : 'Add Competition'}
                </Button>
              </Col>
            </Row>
            <Form.Control
              as="textarea"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Description"
              className="mt-2"
              rows={2}
            />
          </Form>
          {loading ? (
            <div className="text-center my-5"><Spinner animation="border" /></div>
          ) : (
            <Table striped bordered hover responsive className="mb-0">
              <thead className="table-light">
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Rubrics</th>
                  <th>Judges</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {competitions.length === 0 ? (
                  <tr><td colSpan={7} className="text-center text-muted">No competitions found.</td></tr>
                ) : competitions.map(comp => (
                  <tr key={comp.id}>
                    <td>{comp.name}</td>
                    <td>{comp.description}</td>
                    <td>{comp.start_date}</td>
                    <td>{comp.end_date}</td>
                    <td>
                      <Button variant="info" size="sm" onClick={() => openRubricModal(comp)}>Manage Rubrics</Button>
                    </td>
                    <td>
                      <Button variant="secondary" size="sm" onClick={() => openJudgeModal(comp)}>Assign Judges</Button>
                    </td>
                    <td>
                      <Button variant="danger" size="sm" onClick={() => handleDelete(comp.id)}>Delete</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
      {/* Rubric Modal */}
      <Modal show={showRubricModal} onHide={() => setShowRubricModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Manage Rubrics</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleRubricSubmit} className="mb-3">
            <Form.Group className="mb-2">
              <Form.Label>Rubric Name</Form.Label>
              <Form.Control type="text" name="name" value={rubricForm.name} onChange={handleRubricChange} required />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" name="description" value={rubricForm.description} onChange={handleRubricChange} rows={2} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Max Score</Form.Label>
              <Form.Control type="number" name="max_score" value={rubricForm.max_score} onChange={handleRubricChange} min={1} max={100} required />
            </Form.Group>
            <Button type="submit" variant="primary">Add Rubric</Button>
          </Form>
          <h5>Existing Rubrics</h5>
          <ul>
            {rubrics.map(r => <li key={r.id}>{r.name} (Max: {r.max_score})</li>)}
          </ul>
        </Modal.Body>
      </Modal>
      {/* Judge Modal */}
      <Modal show={showJudgeModal} onHide={() => setShowJudgeModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Assign Judges</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {judgeAssignSuccess && <Alert variant="success">{judgeAssignSuccess}</Alert>}
          <Form onSubmit={handleJudgeSubmit}>
            <Form.Group>
              <Form.Label>Select Judges</Form.Label>
              <Form.Control as="select" multiple value={selectedJudges} onChange={handleJudgeChange}>
                {allJudges.map(j => (
                  <option key={j.id} value={j.id} disabled={judges.some(assigned => assigned.id === j.id)}>
                    {j.user?.first_name || ''} {j.user?.last_name || ''} {j.user?.username ? `(${j.user.username})` : ''}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Button type="submit" variant="primary" className="mt-2">Assign</Button>
          </Form>
          <h5 className="mt-3">Assigned Judges</h5>
          <ul>
            {judges.map(j => (
              <li key={j.id}>
                {j.user?.first_name || ''} {j.user?.last_name || ''} {j.user?.username ? `(${j.user.username})` : ''}
              </li>
            ))}
          </ul>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default AdminCompetitions; 