import React, { useContext, useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";

function BookingModal({ show, handleClose, expert }) {
  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    age: "",
    issue: "",
    timingFrom: "",
    timingTo: "",
  });

  // ✅ update when user is loaded/changes
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: user.fullName || "",
        email: user.email || "",
        age: user.age || "",
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          expertId: expert._id,
          expertName: expert.name,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert(`✅ Successfully booked slot with ${expert.name}`);
        handleClose();
      } else {
        alert(data.message || "Booking failed");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Book Session with {expert?.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-2">
            <Form.Label>Full Name</Form.Label>
            <Form.Control
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Age</Form.Label>
            <Form.Control
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Describe Your Issue</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="issue"
              value={formData.issue}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-2 d-flex">
            <div className="me-2">
              <Form.Label>Preferred From</Form.Label>
              <Form.Control
                type="time"
                name="timingFrom"
                value={formData.timingFrom}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Form.Label>Preferred To</Form.Label>
              <Form.Control
                type="time"
                name="timingTo"
                value={formData.timingTo}
                onChange={handleChange}
                required
              />
            </div>
          </Form.Group>
          <Button type="submit" className="w-100 mt-2 btn-warning">
            Submit Booking
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default BookingModal;
