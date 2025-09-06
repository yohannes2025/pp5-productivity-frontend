// src/components/TaskList.js
import React, { useState, useEffect, useMemo } from "react";
import { Table, Container, Form } from "react-bootstrap";
import api from "../services/api";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [filterOptions, setFilterOptions] = useState({
    status: "",
    priority: "",
    category: "",
  });

  // Fetch tasks on component mount
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await api.get("/api/tasks/");
        setTasks(response.data);
      } catch (error) {
        console.error("Failed to load tasks.");
      }
    };
    fetchTasks();
  }, []);

  // Fetch users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("/api/users/");
        setUsers(response.data);
      } catch (error) {
        console.error("Failed to load users.");
      }
    };
    fetchUsers();
  }, []);

  // Helper function to get username by ID
  const getUserName = (id) =>
    users.find((user) => user.id === id)?.username || "Unknown";

  // Handle filter change for overdue
  const handleOverdueFilterChange = (e) => {
    setFilterOptions({ ...filterOptions, overdue: e.target.value });
  };

  // Handle filter change for priority
  const handlePriorityFilterChange = (e) => {
    setFilterOptions({ ...filterOptions, priority: e.target.value });
  };

  // Memoized filtered tasks
  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    if (filterOptions.status) {
      result = result.filter((task) => task.status === filterOptions.status);
    }

    if (filterOptions.priority) {
      result = result.filter(
        (task) => task.priority === filterOptions.priority
      );
    }

    if (filterOptions.category) {
      result = result.filter(
        (task) => task.category === filterOptions.category
      );
    }

    return result;
  }, [tasks, filterOptions]);

  return (
    <Container>
      {/* Overdue filter dropdown */}
      <Form.Select
        onChange={handleOverdueFilterChange}
        value={filterOptions.overdue}
        style={{ marginBottom: "1rem", width: "200px", marginRight: "1rem" }}
      >
        <option value="">All</option>
        <option value="overdue">Overdue</option>
      </Form.Select>

      <Form.Group controlId="statusFilter">
        <Form.Label>Filter by Status</Form.Label>
        <Form.Select
          value={filterOptions.status}
          onChange={(e) =>
            setFilterOptions({ ...filterOptions, status: e.target.value })
          }
        >
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </Form.Select>
      </Form.Group>

      {/* Priority filter dropdown */}
      <Form.Group
        controlId="priorityFilter"
        style={{ display: "inline-block", marginBottom: "1rem" }}
      >
        <Form.Label>Filter by Priority</Form.Label>
        <Form.Select
          value={filterOptions.priority}
          onChange={handlePriorityFilterChange}
        >
          <option value="">All</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </Form.Select>
      </Form.Group>

      {/* Category filter dropdown */}
      <Form.Group controlId="categoryFilter">
        <Form.Label>Filter by Category</Form.Label>
        <Form.Select
          value={filterOptions.category}
          onChange={(e) =>
            setFilterOptions({ ...filterOptions, category: e.target.value })
          }
        >
          <option value="">All</option>
          <option value="development">Development</option>
          <option value="design">Design</option>
          <option value="testing">Testing</option>
          <option value="documentation">Documentation</option>
          <option value="other">Other</option>
        </Form.Select>
      </Form.Group>

      {/* Tasks Table */}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Title</th>
            <th>Due Date</th>
            <th>Priority</th>
            <th>Category</th>
            <th>Status</th>
            <th>Assigned Users</th>
            <th>Priority</th>
            <th>Category</th>
          </tr>
        </thead>
        <tbody>
          {filteredTasks.map((task) => (
            <tr key={task.id}>
              {/* Style title based on overdue status */}
              <td style={{ color: task.is_overdue ? "red" : "black" }}>
                {task.title}
              </td>
              <td>{task.due_date}</td>
              <td>{task.priority}</td>
              <td>{task.category}</td>
              <td>{task.status}</td>
              <td>
                {task.assigned_users.map((id) => getUserName(id)).join(", ")}
              </td>
              <td>{task.priority}</td>
              <td>{task.category}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default TaskList;
