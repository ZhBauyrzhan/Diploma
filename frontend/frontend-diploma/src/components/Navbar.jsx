import { Navbar, Nav, Container, Dropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { CiLogin } from "react-icons/ci";
import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { CgProfile } from "react-icons/cg";
import { CiLogout } from "react-icons/ci";
import { FaCloudUploadAlt } from "react-icons/fa";


const CustomNavbar = () => {
  const [username, setUsername] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  const checkAuthStatus = () => {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUsername(decoded.username);
        setIsAuthenticated(true);
      } catch (error) {
        console.log(error);
        handleLogout();
      }
    } else {
      setUsername('');
      setIsAuthenticated(false);
    }
  };
  useEffect(() => {
    checkAuthStatus();
    window.addEventListener('storage', checkAuthStatus);
    return () => {
      window.removeEventListener('storage', checkAuthStatus);
    };
  }, []);
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');

    window.dispatchEvent(new Event('storage'));

    navigate('/login');
  };
  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">Car Insurance Project</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/">Prediction</Nav.Link>
            <Nav.Link as={Link} to="/about">About</Nav.Link>
            <Nav >
              {isAuthenticated && <Nav.Link as={Link} to="/data-upload"><FaCloudUploadAlt /> Upload Data</Nav.Link>}
            </Nav>
          </Nav>
          <Nav className="me-auto">
            {isAuthenticated && <Nav.Link as={Link} to="/admin-dashboard">Dashboard</Nav.Link>}
          </Nav>

          <Nav>
            {isAuthenticated ? (
              <Dropdown align="end">
                <Dropdown.Toggle variant="light" id="dropdown-basic">
                  <i className="bi bi-person-circle me-2"></i>
                  {username}
                  <CgProfile />

                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item as={Link} to="/profile"> <CgProfile /> Profile</Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={handleLogout}><CiLogout />Logout</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <Nav.Link as={Link} to="/login">   <CiLogin className="me-1" /> Login  </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;
