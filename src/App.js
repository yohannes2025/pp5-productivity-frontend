// src/App.js
import React, { useState, useEffect } from "react";
import NavBar from "./components/NavBar";
import styles from "./App.module.css";
import Container from "react-bootstrap/Container";
import "bootstrap/dist/css/bootstrap.min.css";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import EditTask from "./components/EditTask";
import TaskList from "./components/TaskList";
import HomePage from "./components/HomePage";
import "react-datepicker/dist/react-datepicker.css";
import CreateTaskPage from "./components/CreateTaskPage";
import NotFound from "./components/NotFound";
import ProtectedRoute from "./ProtectedRoute";
import api from "./services/api";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setIsLoggedIn(false);
        return;
      }

      try {
        await api.post("/api/token/verify/", { token });
        setIsLoggedIn(true);
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      } catch (err) {
        console.error("Invalid token, logging out");
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        setIsLoggedIn(false);
      }
    };

    verifyToken();
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    delete api.defaults.headers.common["Authorization"];
    setIsLoggedIn(false);
  };

  return (
    <div className="App">
      <NavBar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      <Container className={styles.container}>
        <Routes>
          <Route
            path="/"
            element={isLoggedIn ? <Navigate to="/createtask" /> : <HomePage />}
          />
          <Route
            path="/login"
            element={
              isLoggedIn ? (
                <Navigate to="/createtask" />
              ) : (
                <Login onLogin={handleLogin} />
              )
            }
          />
          <Route path="/register" element={<Register />} />
          <Route
            path="/createtask"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <CreateTaskPage
                  users={[]}
                  onSubmit={() => {}}
                  onCancel={() => {}}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edittask/:id"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <EditTask />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tasklist"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <TaskList />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Container>
    </div>
  );
}

export default App;
