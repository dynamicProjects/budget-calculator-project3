import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import expenseLogo from '../assets/images/expense-manager.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/login.scss';

const Login = ({ handleLogin }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const baseURL = process.env.NODE_ENV === "development"
            ? "http://localhost:8080"
            : "https://budget-calculator-project3.onrender.com";

        try {
            const response = await axios.post(
                `${baseURL}/api/users/login`,
                {
                    username,
                    password,
                },
                { withCredentials: true }
            );

            console.log(response.data);
            handleLogin();
        } catch (err) {
            setError(err.response.data.message);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
    
        try {
          
            navigate("/register");
          
        } catch (err) {
          setError(err.response.data.message);
        }
      };

    return (
        <Container className="d-flex justify-content-center align-items-center min-vh-100">
            <Row>
                <Col>
                    <Card className="login-card">
                        <Card.Body>
                            <div className="text-center mb-4">
                                <img src={expenseLogo} alt="Logo" className="mb-3 imgSize" />
                                <h2>Sign In</h2>
                            </div>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group controlId="formUsername">
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group controlId="formPassword">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Enter password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <Button variant="primary" type="submit" className="w-25 m-3">
                                        Login
                                    </Button>
                                    <Button variant="secondary" type='button' onClick={handleRegister} className="w-25 m-3">
                                        Register
                                    </Button>
                                </Form.Group>
                                {error && <p className="error">{error}</p>}
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Login;
