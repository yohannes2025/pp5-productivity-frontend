//src / App.js(updated);
import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";
import api from "./services/api"; // to be added later

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

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<div>Home</div>} /> // Placeholder
      </Routes>
    </div>
  );
}

export default App;
