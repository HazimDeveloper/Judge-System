import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../services/auth';
import { Container, Form, Button, Alert, Card } from 'react-bootstrap';

const Register = () => {
  const [form, setForm] = useState({ username: '', email: '', password: '', first_name: '', last_name: '', role: 'PARTICIPANT' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await register(form);
      setSuccess('Registration successful! You can now log in.');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError('Registration failed. Please check your details.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #e0e7ff 0%, #f8fafc 100%)', display: 'flex', alignItems: 'center' }}>
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <Card className="shadow-lg border-0 p-2" style={{ width: '100%', maxWidth: 440 }}>
          <Card.Body>
            <h2 className="mb-4 text-center text-primary">Register</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="username">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  required
                  size="lg"
                  autoFocus
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  size="lg"
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="first_name">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  name="first_name"
                  value={form.first_name}
                  onChange={handleChange}
                  size="lg"
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="last_name">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  name="last_name"
                  value={form.last_name}
                  onChange={handleChange}
                  size="lg"
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  size="lg"
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="role">
                <Form.Label>Role</Form.Label>
                <Form.Select name="role" value={form.role} onChange={handleChange} required size="lg">
                  <option value="PARTICIPANT">Participant</option>
                  <option value="JUDGE">Judge</option>
                  <option value="COMMITTEE">Committee</option>
                  <option value="ADMIN">Admin</option>
                </Form.Select>
              </Form.Group>
              <Button variant="primary" type="submit" className="w-100" size="lg">
                Register
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default Register; 