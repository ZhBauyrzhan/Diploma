import React, { useState, useEffect } from 'react';
import {
    Container,
    Row,
    Col,
    Card,
    Form,
    Button,
    Alert,
    Spinner,
    Image
} from 'react-bootstrap';
import axiosInstance from '../api';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const ProfilePage = () => {
    const [userData, setUserData] = useState({
        name: '',
        surname: '',
        email: '',
        position: '',
        username: ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('access_token');
                if (!token) {
                    navigate('/login');
                    return;
                }
                const decoded = jwtDecode(token);
                const response = await axiosInstance.get(`/api/user/${decoded.user_id}/`);

                setUserData(response.data);
            } catch (err) {
                setError('Failed to load profile data');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const response = await axiosInstance.put(`/api/user/${userData.id}/`, userData);
            setUserData(response.data);
            setIsEditing(false);
            setSuccess('Profile updated successfully');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Update failed');
        } finally {
            setLoading(false);
        }
    };
    return (
        <Container className="py-5">
            <Card className="shadow-sm">
                <Card.Body>
                    <div className="text-center mb-4">
                        <h2 className="mt-3">{`${userData.name} ${userData.surname}`}</h2>
                        <p className="text-muted">{userData.position}</p>
                    </div>

                    {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
                    {success && <Alert variant="success" dismissible onClose={() => setSuccess('')}>{success}</Alert>}

                    <Row>
                        <Col md={12}>
                            <Card className="mb-4">
                                <Card.Header className="bg-primary text-white">
                                    <h5>Personal Information</h5>
                                </Card.Header>
                                <Card.Body>
                                    <Form onSubmit={handleProfileSubmit}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>First Name</Form.Label>
                                            <Form.Control
                                                name="name"
                                                value={userData.name}
                                                disabled={!isEditing}
                                            />
                                        </Form.Group>

                                        <Form.Group className="mb-3">
                                            <Form.Label>Last Name</Form.Label>
                                            <Form.Control
                                                name="surname"
                                                value={userData.surname}
                                                disabled={!isEditing}
                                            />
                                        </Form.Group>

                                        <Form.Group className="mb-3">
                                            <Form.Label>Position</Form.Label>
                                            <Form.Control
                                                name="position"
                                                value={userData.position}
                                                disabled={!isEditing}
                                            />
                                        </Form.Group>

                                        <Form.Group className="mb-3">
                                            <Form.Label>Username</Form.Label>
                                            <Form.Control
                                                name="username"
                                                value={userData.username}
                                                disabled
                                            />
                                        </Form.Group>

                                        <Form.Group className="mb-3">
                                            <Form.Label>Email</Form.Label>
                                            <Form.Control
                                                type="email"
                                                name="email"
                                                value={userData.email}
                                                disabled={!isEditing}
                                            />
                                        </Form.Group>
                                    </Form>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Card.Body>
            </Card >
        </Container >
    );
};

ProfilePage.propTypes = {
    user: PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
        surname: PropTypes.string,
        email: PropTypes.string,
        position: PropTypes.string,
        username: PropTypes.string,
        avatar: PropTypes.string
    })
};

export default ProfilePage;
