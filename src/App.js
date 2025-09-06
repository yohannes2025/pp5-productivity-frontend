//src / App.js(updated);
import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import api from "./services/api";
import Login from "./components/Login";
import Register from "./components/Register";
import NavBar from "./components/NavBar";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  // Verify token on app load
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

  return (
    <div className="App">
      <NavBar isLoggedIn={isLoggedIn} onLogout={handleLogout} user={user} />
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
      </Routes>
    </div>
  );
}

export default App;
