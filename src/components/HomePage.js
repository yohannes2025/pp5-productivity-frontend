// HomePage.js
import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import styles from "../styles/Common.module.css";
import clsx from "clsx";

const HomePage = () => {
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
      <Row className="justify-content-center mb-5">
        <Col md={10} lg={8}>
          <h1 className="display-4 fw-bold text-primary styles.responsiveTitle">
            Stay Productive, Stay Ahead
          </h1>
          <p className="lead mt-3 fs-4 styles.responsiveSubtitle">
            Organize your life and collaborate better with our calendar-driven
            productivity app. Plan your tasks, track habits, and achieve more
            together.
          </p>
          <div className="d-flex justify-content-center gap-3 mt-3">
            <Link to="/register">
              <Button variant="outline-primary" size="lg">
                Get Started
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline-success" size="lg">
                Login
              </Button>
            </Link>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default HomePage;
