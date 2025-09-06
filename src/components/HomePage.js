// src/components/HomePage.js
import React from "react";
import { Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <Container>
      <h1>Welcome to Productivity App</h1>
      <p>Manage your tasks efficiently.</p>
      <Button as={Link} to="/login" variant="primary">
        Login
      </Button>
      <Button as={Link} to="/register" variant="secondary">
        Register
      </Button>
    </Container>
  );
};

export default HomePage;
