// src/components/EditTask.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Container, Card, Form, Button, Alert, Spinner } from "react-bootstrap";
import styles from "../styles/Common.module.css";
import clsx from "clsx";
import api from "../services/api";
import { format } from "date-fns";
import { toast } from "react-toastify";

const EditTask = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState(new Date());
  const [priority, setPriority] = useState("low");

  // Define the category choices
  const CATEGORY_CHOICES = [
    "development",
    "design",
    "testing",
    "documentation",
    "other",
  ];
  const [category, setCategory] = useState(CATEGORY_CHOICES[0]);

  const [status, setStatus] = useState("pending");
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [files, setFiles] = useState([]);
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchTaskAndUsers = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const [taskRes, usersRes] = await Promise.all([
          api.get(`/api/tasks/${id}/`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          api.get(`/api/users/`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        const task = taskRes.data;
        setTitle(task.title);
        setDescription(task.description);
        setDueDate(task.due_date ? new Date(task.due_date) : new Date());
        setPriority(task.priority);
        // Set the category from the fetched task data
        setCategory(task.category || CATEGORY_CHOICES[0]); // Use fetched category or default
        setStatus(task.status);
        setAssignedUsers(task.assigned_users.map((u) => String(u)));
        setUsers(usersRes.data);
      } catch (error) {
        // console.error("Error fetching task or users:", error);
        setErrorMessage("Failed to load task or users.");
      } finally {
        setLoading(false);
      }
    };

    fetchTaskAndUsers();
  }, [id]);

  const handleAssignedUserChange = (e) => {
    const selected = Array.from(e.target.selectedOptions).map(
      (opt) => opt.value
    );
    setAssignedUsers(selected);
  };

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);

    if (dueDate instanceof Date && !isNaN(dueDate)) {
      formData.append("due_date", format(dueDate, "yyyy-MM-dd"));
    } else {
      // console.warn("Invalid due date, not appending to form data.");
    }

    formData.append("priority", priority);
    formData.append("category", category);
    formData.append("status", status);

    assignedUsers.forEach((userId) => {
      formData.append("assigned_users", Number(userId));
    });

    files.forEach((file) => formData.append("upload_files", file));

    try {
      const token = localStorage.getItem("access_token");

      await api.put(`/api/tasks/${id}/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      // setSuccessMessage("Task updated successfully!");
      toast.success("Task updated successfully!");
      navigate("/tasklist", {
        state: { message: "Edit successful", type: "success" },
      });
    } catch (error) {
      // console.error("Error updating task:", error);
      if (error.response && error.response.data) {
        // console.error("Backend validation errors:", error.response.data);
        // setErrorMessage(
        //   "Failed to update the task. Please check the console for details."
        // );
        toast.error(
          "Failed to update the task. Please check the console for details."
        );
      } else {
        setErrorMessage(
          "Failed to update the task. An unexpected error occurred."
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/tasklist", {
      state: { message: "Edit cancelled", type: "info" },
    });
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
        <p>Loading task...</p>
      </Container>
    );
  }

  return (
    <Container
      className={clsx(
        styles.container,
        "d-flex",
        "flex-column",
        "justify-content-center",
        "align-items-center",
        "mt-5"
      )}
    >
      <Card className="p-4 shadow" style={{ width: "100%", maxWidth: "600px" }}>
        <h3 className="text-center mb-4">Edit Task</h3>

        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label htmlFor="title">Task Title</Form.Label>
            <Form.Control
              type="text"
              id="title"
              name="title"
              placeholder="Task Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Label htmlFor="description">Task Description</Form.Label>
            <Form.Control
              as="textarea"
              id="description"
              name="description"
              placeholder="Task Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              required
            />
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Label htmlFor="dueDate">Due Date</Form.Label>
            <DatePicker
              id="dueDate"
              name="dueDate"
              selected={dueDate}
              onChange={(date) => setDueDate(date)}
              className="form-control"
              required
              dateFormat="yyyy-MM-dd" // Specify date format
            />
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Label htmlFor="priority">Priority</Form.Label>
            <Form.Select
              id="priority"
              name="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Label htmlFor="category">Category</Form.Label>
            <Form.Select
              id="category"
              name="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {/* Map over the CATEGORY_CHOICES to create options */}
              {CATEGORY_CHOICES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}{" "}
                  {/* Capitalize for display */}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Label htmlFor="status">Status</Form.Label>
            <Form.Select
              id="status"
              name="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Label htmlFor="assignedUsers">Assigned Users</Form.Label>
            <Form.Select
              multiple
              id="assignedUsers"
              name="assigned_users"
              value={assignedUsers}
              onChange={handleAssignedUserChange}
            >
              {users.map((user) => (
                <option key={user.id} value={String(user.id)}>
                  {user.name || user.username}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Label>Upload Files</Form.Label>
            <Form.Control type="file" multiple onChange={handleFileChange} />
          </Form.Group>

          <div className="d-flex justify-content-between mt-4">
            <Button variant="primary" type="submit" disabled={submitting}>
              {submitting ? "Saving..." : "Edit Task"}
            </Button>
            <Button
              variant="outline-secondary"
              type="button"
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </div>
        </Form>
      </Card>
    </Container>
  );
};

export default EditTask;
