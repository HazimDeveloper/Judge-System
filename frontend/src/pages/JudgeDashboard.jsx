import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import api from '../services/api';
import { Container, Card, Spinner, Alert, Row, Col, Button, Form, Dropdown, Accordion } from 'react-bootstrap';

const JudgeDashboard = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const [competitions, setCompetitions] = useState([]);
  const [selectedCompetition, setSelectedCompetition] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [rubrics, setRubrics] = useState([]);
  const [scores, setScores] = useState({});
  const [formState, setFormState] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState({});

  // Fetch competitions assigned to judge
  useEffect(() => {
    if (authLoading || !user) return;
    const fetchCompetitions = async () => {
      setLoading(true);
      setError('');
      try {
        // Try /api/competitions/ endpoint
        let comps = [];
        try {
          const res = await api.get('/api/competitions/');
          comps = res.data;
        } catch {
          // fallback: try /api/scoring/judges/ to get assigned competitions
          try {
            const res = await api.get('/api/scoring/judges/');
            const judge = res.data.find(j => j.user && j.user.username === user.username);
            comps = judge ? judge.competitions : [];
          } catch {
            setError('Could not load competitions.');
            setLoading(false);
            return;
          }
        }
        setCompetitions(comps);
        if (comps.length > 0) {
          setSelectedCompetition(comps[0]);
        }
      } catch {
        setError('Could not load competitions.');
      } finally {
        setLoading(false);
      }
    };
    fetchCompetitions();
  }, [authLoading, user]);

  // Fetch submissions, rubrics, and scores for selected competition
  useEffect(() => {
    if (!selectedCompetition) {
      setSubmissions([]);
      return;
    };
    setLoading(true);
    setError('');
    const fetchData = async () => {
      try {
        // Submissions
        let subs = [];
        try {
          const res = await api.get(`/api/submissions/?competition=${selectedCompetition.id || selectedCompetition}`);
          subs = res.data;
        } catch {
          setError('Could not load submissions.');
          setLoading(false);
          return;
        }
        setSubmissions(subs);
        // Rubrics
        let rubs = [];
        try {
          const res = await api.get(`/api/scoring/rubrics/?competition=${selectedCompetition.id || selectedCompetition}`);
          rubs = res.data;
        } catch {
          setError('Could not load rubrics.');
          setLoading(false);
          return;
        }
        setRubrics(rubs);
        // Scores
        let scoresArr = [];
        try {
          const res = await api.get('/api/scoring/scores/');
          scoresArr = res.data.filter(s => s.judge_name === user.username);
        } catch {
          // If scores endpoint fails, just show empty
          scoresArr = [];
        }
        const scoresMap = scoresArr.reduce((acc, score) => {
          const key = `${score.submission}_${score.rubric}`;
          acc[key] = score;
          return acc;
        }, {});
        setScores(scoresMap);
        // Prefill form state
        const newFormState = {};
        subs.forEach(sub => {
          rubs.forEach(rubric => {
            const key = `${sub.id}_${rubric.id}`;
            const existing = scoresMap[key];
            newFormState[key] = {
              score: existing ? existing.score : 1,
              comment: existing ? existing.comment : '',
            };
          });
        });
        setFormState(newFormState);
      } catch {
        setError('Could not load data for this competition.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedCompetition, user]);

  const handleChange = (subId, rubricId, field, value) => {
    const key = `${subId}_${rubricId}`;
    setFormState(prev => ({ ...prev, [key]: { ...prev[key], [field]: value } }));
  };

  const handleSubmission = async (subId) => {
    setSubmitting(prev => ({ ...prev, [subId]: true }));
    try {
      const rubricIds = rubrics.map(r => r.id);
      for (const rubricId of rubricIds) {
        const key = `${subId}_${rubricId}`;
        const state = formState[key];
        const existingScore = scores[key];
        const payload = {
          competition_id: selectedCompetition.id || selectedCompetition,
          submission: subId,
          rubric: rubricId,
          score: state.score,
          comment: state.comment,
        };
        if (existingScore) {
          await api.put(`/api/scoring/scores/${existingScore.id}/`, payload);
        } else {
          await api.post('/api/scoring/scores/', payload);
        }
      }
      // Refresh scores
      let scoresArr = [];
      try {
        const res = await api.get('/api/scoring/scores/');
        scoresArr = res.data.filter(s => s.judge_name === user.username);
      } catch {
        scoresArr = [];
      }
      const scoresMap = scoresArr.reduce((acc, score) => {
        const key = `${score.submission}_${score.rubric}`;
        acc[key] = score;
        return acc;
      }, {});
      setScores(scoresMap);
    } catch {
      alert('Failed to save evaluation.');
    }
    setSubmitting(prev => ({ ...prev, [subId]: false }));
  };

  if (authLoading) return <div className="text-center my-5"><Spinner animation="border" /></div>;
  if (!user) return <Alert variant="danger" className="mt-4">You are not logged in.</Alert>;

  return (
    <Container className="py-4">
      <h2 className="mb-4">Judge Scoring</h2>
      {competitions.length > 0 && (
        <Dropdown className="mb-4">
          <Dropdown.Toggle variant="primary" id="dropdown-basic">
            {selectedCompetition ? selectedCompetition.name || 'Select Competition' : 'Select a Competition'}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {competitions.map(c => (
              <Dropdown.Item key={c.id || c} onClick={() => setSelectedCompetition(c)}>
                {c.name || c}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      )}
      {loading && <div className="text-center my-5"><Spinner animation="border" /></div>}
      {error && <Alert variant="danger">{error}</Alert>}
      {selectedCompetition && !loading && !error && (
        <Accordion>
          {submissions.map(sub => (
            <Accordion.Item eventKey={String(sub.id)} key={sub.id}>
              <Accordion.Header>{sub.title}</Accordion.Header>
              <Accordion.Body>
                <Card>
                  <Card.Body>
                    <p>{sub.description}</p>
                    {sub.file && <a href={sub.file} target="_blank" rel="noopener noreferrer">Download File</a>}
                    {sub.link && <a href={sub.link} target="_blank" rel="noopener noreferrer" className="ms-2">View Link</a>}
                    <hr />
                    <Row>
                      {rubrics.map(rubric => {
                        const key = `${sub.id}_${rubric.id}`;
                        const state = formState[key] || { score: 1, comment: '' };
                        return (
                          <Col md={6} key={rubric.id} className="mb-3">
                            <h6>{rubric.name}</h6>
                            <Form>
                              <Form.Group>
                                <Form.Label>Score (1-5)</Form.Label>
                                <Form.Select value={state.score} onChange={e => handleChange(sub.id, rubric.id, 'score', Number(e.target.value))}>
                                  {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
                                </Form.Select>
                              </Form.Group>
                              <Form.Group>
                                <Form.Label>Comment</Form.Label>
                                <Form.Control as="textarea" rows={2} value={state.comment} onChange={e => handleChange(sub.id, rubric.id, 'comment', e.target.value)} />
                              </Form.Group>
                              <Button variant="outline-primary" size="sm" className="mt-2" disabled={submitting[key]} onClick={() => handleSubmission(sub.id)}>
                                {scores[key] ? 'Update' : 'Submit'}
                              </Button>
                            </Form>
                          </Col>
                        );
                      })}
                    </Row>
                    <hr />
                    <div className="d-flex justify-content-end">
                      <Button variant="primary" disabled={submitting[sub.id]} onClick={() => handleSubmission(sub.id)}>
                        {submitting[sub.id] ? 'Saving...' : 'Save Scores'}
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      )}
    </Container>
  );
};

export default JudgeDashboard;