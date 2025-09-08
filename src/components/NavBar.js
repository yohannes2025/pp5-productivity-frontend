// src/components/NavBar.js

import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Navbar, Container, Nav } from "react-bootstrap";
import styles from "../styles/NavBar.module.css";
import "bootstrap/dist/css/bootstrap.min.css";

function NavBar({ isLoggedIn, onLogout, user }) {
  const [expanded, setExpanded] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setExpanded(false);
  }, [location.pathname]);

  const handleNavClick = () => {
    setExpanded(false);
  };

  const loggedInLinks = (
    <>
      <NavLink
        to="/createtask"
        className={`${styles.NavLink} fw-bold`}
        onClick={handleNavClick}
      >
        <i className="fa-solid fa-square-plus"></i> Create Task
      </NavLink>
      <NavLink
        to="/tasklist"
        className={`${styles.NavLink} fw-bold`}
        onClick={handleNavClick}
      >
        <i className="fa-solid fa-list-check"></i> Task List
      </NavLink>
      <Nav.Link onClick={onLogout} className={`${styles.NavLink} fw-bold`}>
        <i className="fa-solid fa-sign-out-alt"></i> Logout
      </Nav.Link>
    </>
  );

  return (
    <>
      <div>
        <Navbar
          expand="md"
          fixed="top"
          expanded={expanded}
          onToggle={setExpanded}
          className={styles.NavBar}
        >
          <Container>
            <Navbar.Brand className="me-auto">
              <img src="/logo192.png" alt="logo" height="45" className="me-2" />
              <span className="fw-bold">Productivity</span>
            </Navbar.Brand>

            <Navbar.Toggle aria-controls="navbarScroll" />
            <Navbar.Collapse id="navbarScroll">
              <Nav className="ms-auto my-2 my-lg-0" navbarScroll>
                {/* Corrected logic */}
                {isLoggedIn && user ? (
                  <NavLink
                    to="/"
                    className={`${styles.NavLink} fw-bold`}
                    onClick={handleNavClick}
                  >
                    <i className="fa-solid fa-house"></i> Welcome,{" "}
                    {user.username}
                  </NavLink>
                ) : (
                  <NavLink
                    to="/"
                    className={`${styles.NavLink} fw-bold`}
                    onClick={handleNavClick}
                  >
                    <i className="fa-solid fa-house"></i> Home Page
                  </NavLink>
                )}
                {isLoggedIn && loggedInLinks}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </div>
    </>
  );
}

export default NavBar;
