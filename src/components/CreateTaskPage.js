// src/components/CreateTaskPage.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CreateTask from "../components/CreateTask";
import api from "../services/api";
import { Container, Alert, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";

const CreateTaskPage = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Function to refresh access token
  const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem("refresh_token");
    if (!refreshToken) return null;

    try {
      const response = await api.post("/api/token/refresh/", {
        refresh: refreshToken,
      });
      const newAccess = response.data.access;
      localStorage.setItem("access_token", newAccess);
      return newAccess;
    } catch (err) {
      console.error("Refresh token failed:", err);
      return null;
    }
  };

  // Handles task creation
  const handleCreateTask = async (formData) => {
    setErrorMessage("");
    setLoading(true);

    try {
      let token = localStorage.getItem("access_token");
      if (!token) throw new Error("User not authenticated");

      // Attempt API request
      try {
        const response = await api.post("/api/tasks/", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });

        toast.success("Task created successfully!");
        navigate("/tasklist");
        return response.data;
      } catch (err) {
        // If 401, try refreshing token
        if (err.response && err.response.status === 401) {
          const newToken = await refreshAccessToken();
          if (!newToken) {
            toast.error("Session expired. Please login again.");
            navigate("/login");
            throw new Error("Authentication required");
          }

          const retryResponse = await api.post("/api/tasks/", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${newToken}`,
            },
          });

          toast.success("Task created successfully!");
          navigate("/tasklist");
          return retryResponse.data;
        } else {
          throw err;
        }
      }
    } catch (error) {
      if (error.response && error.response.data) {
        const detail =
          error.response.data.detail || JSON.stringify(error.response.data);
        setErrorMessage(detail);
        toast.error(detail);
      } else {
        const msg = error.message || "Failed to create task.";
        setErrorMessage(msg);
        toast.error(msg);
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5">
      {errorMessage && (
        <Alert variant="danger" className="mb-3">
          {errorMessage}
        </Alert>
      )}

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
          <p>Creating task...</p>
        </div>
      ) : (
        <CreateTask
          onSubmit={handleCreateTask}
          onCancel={() => navigate("/tasklist")}
        />
      )}
    </Container>
  );
};

export default CreateTaskPage;
