// src/components/NotFound.js
import React from "react";
import noResults from "../assets/images/no-results.png";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import styles from "../styles/Common.module.css";

const NotFound = () => {
  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center vh-100"
    >
      <Row className="text-center">
        <Col>
          <Image
            src={noResults}
            alt="Illustration of no search results or missing page"
            className={styles.customImage || "img-fluid"}
            fluid
          />
          <h2 className="mt-3">
            Sorry, the page you're looking for doesn't exist.
          </h2>
        </Col>
      </Row>
    </Container>
  );
};

export default NotFound;
