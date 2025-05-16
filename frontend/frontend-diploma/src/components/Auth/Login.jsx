import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const { data } = await axiosInstance.post('http://localhost:8000'+'/api/token/', formData);
    localStorage.setItem('access_token', data.access);
    localStorage.setItem('refresh_token', data.refresh);

    window.dispatchEvent(new Event('storage'));

    navigate('/admin-dashboard');
  } catch (err) {
    setError('Invalid username or password');
  }
};

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
     <Container fluid className="login-container">
      <Row className="justify-content-center align-items-center min-vh-100">
        <Col md={6} lg={4}>
          <div className="login-card p-4 shadow">
            <h2 className="text-center mb-4">Welcome Back</h2>
            <Form onSubmit={handleSubmit}>
              {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}

              <Form.Group className="mb-3" controlId="formUsername">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter username"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-4" controlId="formPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  required
                />
              </Form.Group>

              <div className="d-grid">
                <Button variant="primary" type="submit" size="lg">
                  Sign In
                </Button>
              </div>

              <div className="text-center mt-3">
                <a href="/forgot-password" className="text-muted">Forgot password?</a>
              </div>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
