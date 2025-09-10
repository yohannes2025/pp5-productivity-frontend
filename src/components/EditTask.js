// export default EditTask;

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
  const [priority, setPriority] = useState("medium");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("pending");
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [files, setFiles] = useState([]);
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("access_token");

        const [taskRes, usersRes, catsRes] = await Promise.all([
          api.get(`/api/tasks/${id}/`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          api.get("/api/users/", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          api.get("/api/categories/", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const task = taskRes.data;
        setTitle(task.title);
        setDescription(task.description);
        setDueDate(task.due_date ? new Date(task.due_date) : new Date());
        setPriority(task.priority || "medium");
        setStatus(task.status || "pending");
        setAssignedUsers(task.assigned_users.map((u) => String(u)));
        setUsers(usersRes.data);
        setCategories(catsRes.data);

        // Set task category or default first category
        setCategory(
          task.category || (catsRes.data[0] ? String(catsRes.data[0].id) : "")
        );
      } catch (error) {
        setErrorMessage("Failed to load task, users, or categories.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);

      if (dueDate instanceof Date && !isNaN(dueDate)) {
        formData.append("due_date", format(dueDate, "yyyy-MM-dd"));
      }

      formData.append("priority", priority);
      formData.append("category", category);
      formData.append("status", status);

      assignedUsers.forEach((userId) =>
        formData.append("assigned_users", Number(userId))
      );
      files.forEach((file) => formData.append("files", file));

      const token = localStorage.getItem("access_token");
      await api.put(`/api/tasks/${id}/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Task updated successfully!");
      navigate("/tasklist", {
        state: { message: "Edit successful", type: "success" },
      });
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.detail ||
          "Failed to update the task. Please try again."
      );
      toast.error("Failed to update the task.");
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
        <p>Loading task, users, and categories...</p>
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
          {/* Title */}
          <Form.Group controlId="taskTitle">
            <Form.Control
              type="text"
              placeholder="Task Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </Form.Group>

          {/* Description */}
          <Form.Group controlId="taskDescription" className="mt-3">
            <Form.Control
              as="textarea"
              placeholder="Task Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              required
            />
          </Form.Group>

          {/* Due Date */}
          <Form.Group controlId="dueDate" className="mt-3">
            <Form.Label>Due Date</Form.Label>
            <DatePicker
              selected={dueDate}
              onChange={(date) => setDueDate(date)}
              className="form-control"
              required
              minDate={new Date()}
            />
          </Form.Group>

          {/* Priority */}
          <Form.Group controlId="taskPriority" className="mt-3">
            <Form.Label>Priority</Form.Label>
            <Form.Select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </Form.Select>
          </Form.Group>

          {/* Category */}
          <Form.Group controlId="taskCategory" className="mt-3">
            <Form.Label>Category</Form.Label>
            <Form.Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={String(cat.id)}>
                  {cat.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          {/* Status */}
          <Form.Group controlId="taskStatus" className="mt-3">
            <Form.Label>Status</Form.Label>
            <Form.Select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="pending">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
            </Form.Select>
          </Form.Group>

          {/* Assigned Users */}
          <Form.Group controlId="assignedUsers" className="mt-3">
            <Form.Label>Assigned Users</Form.Label>
            <Form.Select
              multiple
              value={assignedUsers}
              onChange={handleAssignedUserChange}
            >
              {users.map((user) => (
                <option key={user.id} value={String(user.id)}>
                  {user.username || user.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          {/* Files */}
          <Form.Group controlId="taskFiles" className="mt-3">
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
