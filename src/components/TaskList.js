// src / components / TaskList.js;
import React, { useState, useEffect } from "react";
import { Table, Container } from "react-bootstrap";
import api from "../services/api";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);

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

  return (
    <Container>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Title</th>
            <th>Due Date</th>
            <th>Priority</th>
            <th>Category</th>
            <th>Status</th>
            <th>Assigned Users</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id}>
              <td>{task.title}</td>
              <td>{task.due_date}</td>
              <td>{task.priority}</td>
              <td>{task.category}</td>
              <td>{task.status}</td>
              <td>{task.assigned_users.join(", ")}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default TaskList;
