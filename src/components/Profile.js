// src / components / Profile.js;
import React, { useState, useEffect } from "react";
import { Form, Button, Container, Alert, Card } from "react-bootstrap";
import api from "../services/api";
import { toast } from "react-toastify";

const Profile = () => {
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/api/profiles/me/");
        setName(response.data.name);
      } catch (error) {
        toast.error("Failed to load profile.");
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    if (avatar) formData.append("avatar", avatar);

    try {
      await api.patch("/api/profiles/me/", formData);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile.");
      setErrorMessage(error.message || "An error occurred.");
    }
  };

  return (
    <Container>
      <Card>
        <Card.Body>
          <Card.Title>Profile</Card.Title>
          {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="avatar">
              <Form.Label>Avatar</Form.Label>
              <Form.Control
                type="file"
                onChange={(e) => setAvatar(e.target.files[0])}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Update Profile
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Profile;
