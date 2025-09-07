// src/components/CreateTask.js
import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Table,
  Spinner,
  Alert,
  Modal,
} from "react-bootstrap";
import DatePicker from "react-datepicker";
import api from "../services/api";
import { toast } from "react-toastify";
import "react-datepicker/dist/react-datepicker.css";
import { Container, Card, Form, Button, Alert, Spinner } from "react-bootstrap";

const CreateTask = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState(new Date());
  const [priority, setPriority] = useState("medium");
  const [category, setCategory] = useState("development");
  const [status, setStatus] = useState("pending");
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("/api/users/");
        setUsers(response.data);
      } catch (error) {
        toast.error("Failed to load users.");
      }
    };
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        title,
        description,
        due_date: dueDate.toISOString().split("T")[0],
        priority: priority,
        category: category,
        status: status,
        assigned_users: assignedUsers,
      };
      await api.post("/api/tasks/", data);
      toast.success("Task created successfully!");
    } catch (error) {
      toast.error("Failed to create task.");
    }
  };

  const handleAssignedChange = (e) => {
    const selected = Array.from(e.target.options)
      .filter((option) => option.selected)
      .map((option) => parseInt(option.value));
    setAssignedUsers(selected);
  };

  return (
    <Container>
      <Card>
        <Card.Body>
          <Card.Title>Create Task</Card.Title>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="dueDate">
              <Form.Label>Due Date</Form.Label>
              <DatePicker
                selected={dueDate}
                onChange={(date) => setDueDate(date)}
                minDate={new Date()}
              />
            </Form.Group>
            <Form.Group controlId="priority">
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
            <Form.Group controlId="category">
              <Form.Label>Category</Form.Label>
              <Form.Select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="development">Development</option>
                <option value="design">Design</option>
                <option value="testing">Testing</option>
                <option value="documentation">Documentation</option>
                <option value="other">Other</option>
              </Form.Select>
            </Form.Group>
            <Form.Group controlId="status">
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </Form.Select>
            </Form.Group>
            <Form.Group controlId="assignedUsers">
              <Form.Label>Assigned Users</Form.Label>
              <Form.Select multiple onChange={handleAssignedChange}>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.username}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Button variant="primary" type="submit">
              Create Task
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CreateTask;
