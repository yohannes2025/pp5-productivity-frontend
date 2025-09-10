// src/components/Login.js
import React, { useState } from "react";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Alert,
  Card,
} from "react-bootstrap";
import styles from "../styles/Common.module.css";
import clsx from "clsx";

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Call your backend login endpoint
      const response = await api.post("/api/login/", {
        email,
        password,
      });

      // Destructure access and refresh tokens
      const { access, refresh } = response.data;

      // Store tokens in localStorage
      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);

      // Set default Authorization header for all future requests
      api.defaults.headers.common["Authorization"] = `Bearer ${access}`;

      // Notify App.js about login so it can fetch the user
      await onLogin(access);

      // Redirect to the main page after successful login
      navigate("/createtask");
    } catch (err) {
      console.error("Login error:", err.response || err);
      setError(
        err.response?.data?.message ||
          err.response?.data?.detail ||
          "Invalid email or password."
      );
    }
  };

  return (
    <Container
      className={clsx(
        styles.container,
        "d-flex",
        "flex-column",
        "justify-content-center",
        "align-items-center"
      )}
    >
      <Row className="w-100">
        <Col xs={12} sm={10} md={8} lg={5} className="mx-auto">
          <Card className="shadow">
            <Card.Body>
              <Card.Title className="text-center">Login</Card.Title>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formPassword" className="mt-2">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>
                <Button variant="primary" type="submit" className="w-100 mt-3">
                  Login
                </Button>
              </Form>
              <div className="text-center mt-3">
                Don't have an account? <Link to="/register">Register</Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
