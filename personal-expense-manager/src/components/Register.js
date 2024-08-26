import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import expenseLogo from '../assets/images/expense-manager.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/login.scss';

const Register = ({ handleLogin }) => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                "https://budget-calculator-project3.onrender.com/api/users/register",
                {
                    username,
                    email,
                    password,
                },
                { withCredentials: true }
            );

            console.log(response.data);
            // Redirect to the dashboard after successful signup
            navigate("/");
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
                                <h2>Register</h2>
                            </div>
                            <Form onSubmit={handleRegister}>
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
                                <Form.Group controlId="formEmail">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="Enter email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
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
                                <Button variant="primary" type='submit' className="w-100 m-3">
                                    Sign Up
                                </Button>
                                {error && <p className="error">{error}</p>}
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Register;
