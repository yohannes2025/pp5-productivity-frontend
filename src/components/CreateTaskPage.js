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

  // This function handles the actual API submission from CreateTask
  const handleCreateTask = async (formData) => {
    setErrorMessage("");
    setLoading(true);

    try {
      // Note: formData is a FormData instance including files
      const token = localStorage.getItem("access_token");

      const response = await api.post("/api/tasks/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      // Navigate to the task list or detail page after success
      toast.success("Task created successfully!");
      navigate("/tasklist");

      return response.data;
    } catch (error) {
      // Provide error details for CreateTask component to display
      if (error.response && error.response.data) {
        const detail =
          error.response.data.detail || JSON.stringify(error.response.data);
        setErrorMessage(detail);
        throw new Error(detail);
      } else {
        //setErrorMessage(error.message || "Failed to create task.");
        toast.error(error.message || "Failed to create task.");
        throw error;
      }
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
          onCancel={() => navigate("/tasks")}
        />
      )}
    </Container>
  );
};

export default CreateTaskPage;
