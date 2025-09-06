// src/components/TaskList.js
import React, { useState, useEffect, useMemo } from "react";
import { Table, Container, Form } from "react-bootstrap";
import api from "../services/api";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [filterOptions, setFilterOptions] = useState({
    overdue: "",
    priority: "",
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

    if (filterOptions.overdue === "overdue") {
      result = result.filter((task) => task.is_overdue);
    }

    if (filterOptions.priority) {
      result = result.filter(
        (task) => task.priority === filterOptions.priority
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
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default TaskList;
