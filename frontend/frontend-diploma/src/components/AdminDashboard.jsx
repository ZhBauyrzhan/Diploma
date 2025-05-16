import React, { useState, useEffect } from 'react';
import {
    Container,
    Row,
    Col,
    Card,
    Form,
    Button,
    Alert,
    Table,
    Spinner,
    Badge
} from 'react-bootstrap';
import axiosInstance from '../api';
import { jwtDecode } from 'jwt-decode';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        position: '',
        username: '',
        email: '',
        password: '',
        is_superuser: false,
        is_staff: true,
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const token = localStorage.getItem('access_token');
    const decodedToken = jwtDecode(token);
    const isAdmin = decodedToken.is_superuser === true;
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await axiosInstance.get('/api/user/');
                setUsers(response.data);
                setError('');
            } catch (err) {
                setError('Failed to fetch users');
            } finally {
                setLoading(false);
            }
        };
        if (isAdmin) {
            fetchData();
        }
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get('/api/user/');
            setUsers(response.data);
            setError('');
        } catch (err) {
            setError('Failed to fetch users: ' + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            console.log(formData);
            await axiosInstance.post('/api/user/', formData);
            setSuccess('User created successfully');
            setError('');
            setFormData({
                name: '',
                surname: '',
                position: '',
                username: '',
                email: '',
                password: '',
                is_superuser: false,
                is_staff: true,
            });
            await fetchUsers();
        } catch (err) {
            setError(err.response?.data?.message || 'User creation failed');
            setSuccess('');
        } finally {
            setLoading(false);
        }
    };
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };


    if (!isAdmin) {
        return (
            <Container className="mt-5 text-center">
                <Alert variant="danger" className="shadow">
                    <h2>403 - Access Denied</h2>
                    <p>Administrator privileges required</p>
                </Alert>
            </Container>
        );
    }

    return (
        <Container fluid className="admin-dashboard py-4">
            <Row className="justify-content-center">
                <Col xl={10} lg={12}>
                    <Card className="shadow-sm">
                        <Card.Header className="bg-primary text-white">
                            <h3 className="mb-0">User Management Dashboard</h3>
                        </Card.Header>

                        <Card.Body>
                            <Card className="mb-4 border-primary">
                                <Card.Body>
                                    <h5 className="text-primary mb-4">Create New User</h5>

                                    {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
                                    {success && <Alert variant="success" dismissible onClose={() => setSuccess('')}>{success}</Alert>}

                                    <Form onSubmit={handleSubmit}>
                                        <Row className="g-3">
                                            <Col md={6} lg={4}>
                                                <Form.Group controlId="formName">
                                                    <Form.Label>First Name</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="name"
                                                        value={formData.name}
                                                        onChange={handleChange}
                                                        required
                                                        placeholder="Bauyrzhan"
                                                    />
                                                </Form.Group>
                                            </Col>

                                            <Col md={6} lg={4}>
                                                <Form.Group controlId="formSurname">
                                                    <Form.Label>Last Name</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="surname"
                                                        value={formData.surname}
                                                        onChange={handleChange}
                                                        required
                                                        placeholder="Zhonkebayev"
                                                    />
                                                </Form.Group>
                                            </Col>

                                            <Col md={6} lg={4}>
                                                <Form.Group controlId="formPosition">
                                                    <Form.Label>Position</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="position"
                                                        value={formData.position}
                                                        onChange={handleChange}
                                                        required
                                                        placeholder="Software Engineer"
                                                    />
                                                </Form.Group>
                                            </Col>

                                            <Col md={6} lg={4}>
                                                <Form.Group controlId="formUsername">
                                                    <Form.Label>Username</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="username"
                                                        value={formData.username}
                                                        onChange={handleChange}
                                                        required
                                                        placeholder="zhnb123"
                                                    />
                                                </Form.Group>
                                            </Col>

                                            <Col md={6} lg={4}>
                                                <Form.Group controlId="formEmail">
                                                    <Form.Label>Email</Form.Label>
                                                    <Form.Control
                                                        type="email"
                                                        name="email"
                                                        value={formData.email}
                                                        onChange={handleChange}
                                                        required
                                                        placeholder="example@gmail.com"
                                                    />
                                                </Form.Group>
                                            </Col>

                                            <Col md={6} lg={4}>
                                                <Form.Group controlId="formPassword">
                                                    <Form.Label>Password</Form.Label>
                                                    <Form.Control
                                                        type="password"
                                                        name="password"
                                                        value={formData.password}
                                                        onChange={handleChange}
                                                        required
                                                        placeholder="••••••••"
                                                    />
                                                </Form.Group>
                                            </Col>

                                            <Col md={6} lg={4}>
                                                <Form.Group controlId="formIsSuperuser">
                                                    <Form.Check
                                                        type="checkbox"
                                                        name="is_superuser"
                                                        label="Administrator"
                                                        checked={formData.is_superuser}
                                                        onChange={handleChange}
                                                    />
                                                </Form.Group>
                                            </Col>


                                            <Col xs={12} className="mt-3">
                                                <Button
                                                    variant="primary"
                                                    type="submit"
                                                    disabled={loading}
                                                >
                                                    {loading ? (
                                                        <>
                                                            <Spinner
                                                                as="span"
                                                                animation="border"
                                                                size="sm"
                                                                role="status"
                                                                aria-hidden="true"
                                                            />
                                                            <span className="ms-2">Creating User...</span>
                                                        </>
                                                    ) : (
                                                        'Create User'
                                                    )}
                                                </Button>
                                            </Col>
                                        </Row>
                                    </Form>
                                </Card.Body>
                            </Card>

                            {
                                loading ? (
                                    <Spinner animation="border" />
                                ) : (
                                    <Card className="border-primary">
                                        <Card.Body>
                                            <div className="d-flex justify-content-between align-items-center mb-4">
                                                <h5 className="text-primary m-0">Registered Users</h5>
                                                <Button
                                                    variant="outline-primary"
                                                    onClick={fetchUsers}
                                                    disabled={loading}
                                                >
                                                    Refresh List
                                                </Button>
                                            </div>

                                            {loading ? (
                                                <div className="text-center py-4">
                                                    <Spinner animation="border" variant="primary" />
                                                </div>
                                            ) : error ? (
                                                <Alert variant="danger">{error}</Alert>
                                            ) : (
                                                <div className="table-responsive">
                                                    <Table striped hover className="mb-0">
                                                        <thead className="bg-light">
                                                            <tr>
                                                                <th>Name</th>
                                                                <th>Position</th>
                                                                <th>Username</th>
                                                                <th>Email</th>
                                                                <th>Role</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {users.map(user => (
                                                                <tr key={user.id}>
                                                                    <td>{user.name} {user.surname}</td>
                                                                    <td>{user.position}</td>
                                                                    <td>{user.username}</td>
                                                                    <td>{user.email}</td>
                                                                    <td>
                                                                        <Badge
                                                                            pill
                                                                            bg={user.is_superuser === true ? 'primary' : 'secondary'}
                                                                        >

                                                                            {user.is_superuser === true ? "Admin" : "Regular User"}
                                                                        </Badge>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </Table>
                                                </div>
                                            )}
                                        </Card.Body>
                                    </Card>
                                )
                            }
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default AdminDashboard;
