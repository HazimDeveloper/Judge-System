import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Container, Table, Spinner, Alert, Card } from 'react-bootstrap';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setError('');
    const fetchUsers = async () => {
      try {
        const res = await api.get('/api/users/');
        setUsers(res.data);
      } catch (err) {
        setError('Could not load users. Please refresh the page.');
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <Container className="py-4">
      <Card className="shadow border-0 mx-auto" style={{ maxWidth: 900 }}>
        <Card.Body>
          <h3 className="mb-4 text-primary">Manage Users</h3>
          {error && <Alert variant="danger" className="mb-3">{error}</Alert>}
          {loading ? (
            <div className="text-center my-5"><Spinner animation="border" /></div>
          ) : (
            <Table striped bordered hover responsive className="mb-0">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr><td colSpan={6} className="text-center text-muted">No users found.</td></tr>
                ) : users.map(user => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>{user.first_name}</td>
                    <td>{user.last_name}</td>
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

export default AdminUsers; 