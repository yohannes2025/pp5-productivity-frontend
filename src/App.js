//src / App.js(updated);
import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";
import api from "./services/api";
import Login from "./components/Login";
import Register from "./components/Register";
import NavBar from "./components/NavBar";
import CreateTask from "./components/CreateTask";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

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

  // Fetch user info when logged in
  useEffect(() => {
    if (isLoggedIn) {
      const fetchUser = async () => {
        try {
          const res = await api.get("/api/users/me/");
          setUser(res.data);
        } catch (err) {
          console.error("Failed to fetch user");
        }
      };
      fetchUser();
    }
  }, [isLoggedIn]);

  // Handle login
  const handleLogin = (userData, tokens) => {
    localStorage.setItem("access_token", tokens.access);
    localStorage.setItem("refresh_token", tokens.refresh);
    api.defaults.headers.common["Authorization"] = `Bearer ${tokens.access}`;
    setIsLoggedIn(true);
    setUser(userData);
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setIsLoggedIn(false);
    setUser(null);
    api.defaults.headers.common["Authorization"] = null;
  };

  return (
    <div className="App">
      <NavBar isLoggedIn={isLoggedIn} onLogout={handleLogout} user={user} />
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route
          path="/createtask"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <CreateTask />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
