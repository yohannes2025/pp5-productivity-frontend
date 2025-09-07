// src/components/NavBar.js
import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link } from "react-router-dom";

const NavBar = ({ isLoggedIn, onLogout, user }) => {
  return (
    <Navbar expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">
          Productivity App
        </Navbar.Brand>{" "}
        {/* Corrected closing tag */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {isLoggedIn && user && (
              <Nav.Link>Welcome, {user.username}</Nav.Link>
            )}
            {isLoggedIn ? (
              <>
                <Nav.Link as={Link} to="/tasklist">
                  Task List
                </Nav.Link>
                <Nav.Link as={Link} to="/createtask">
                  Create Task
                </Nav.Link>
                <Nav.Link onClick={onLogout}>Logout</Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/register">
                  Register
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
