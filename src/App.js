// src/App.js
import React, { useState, useEffect } from "react";
import NavBar from "./components/NavBar";
import styles from "./App.module.css";
import Container from "react-bootstrap/Container";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import EditTask from "./components/EditTask";
import TaskList from "./components/TaskList";
import HomePage from "./components/HomePage";
import CreateTaskPage from "./components/CreateTaskPage";
import NotFound from "./components/NotFound";
import ProtectedRoute from "./ProtectedRoute";
import api from "./services/api";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // Fetch user from backend
  const fetchUser = async (token) => {
    try {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const res = await api.get("/api/users/me/");
      setUser(res.data);
      setIsLoggedIn(true);
      return res.data;
    } catch (err) {
      console.warn("Access token may be expired, trying refresh...", err);

      // Try to refresh token
      const refreshToken = localStorage.getItem("refresh_token");
      if (refreshToken) {
        try {
          const refreshRes = await api.post("/api/token/refresh/", {
            refresh: refreshToken,
          });
          const newAccess = refreshRes.data.access;
          localStorage.setItem("access_token", newAccess);
          api.defaults.headers.common["Authorization"] = `Bearer ${newAccess}`;
          const userRes = await api.get("/api/users/me/");
          setUser(userRes.data);
          setIsLoggedIn(true);
          return userRes.data;
        } catch (refreshErr) {
          console.error("Refresh token failed:", refreshErr);
          handleLogout();
          throw refreshErr;
        }
      } else {
        handleLogout();
        throw err;
      }
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      fetchUser(token).finally(() => setLoadingUser(false));
    } else {
      setIsLoggedIn(false);
      setUser(null);
      setLoadingUser(false);
    }
  }, []);

  const handleLogin = async (token) => {
    await fetchUser(token);
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    delete api.defaults.headers.common["Authorization"];
    setIsLoggedIn(false);
    setUser(null);
  };

  if (loadingUser) {
    return (
      <div className="text-center mt-5">
        <p>Loading user data...</p>
      </div>
    );
  }

  return (
    <div className="App">
      <ToastContainer position="top-right" autoClose={3000} />
      <NavBar isLoggedIn={isLoggedIn} onLogout={handleLogout} user={user} />
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
                <CreateTaskPage onSubmit={() => {}} onCancel={() => {}} />
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
