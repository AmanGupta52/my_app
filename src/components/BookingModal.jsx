// src/components/BookingModal.jsx
import React, { useContext, useState, useEffect } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import { QRCodeSVG } from "qrcode.react";

const UPI_ID = "amangupta032005@okaxis"; // Replace with your UPI ID

const BookingModal = ({ show, handleClose, expert }) => {
  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    contact: "",
    age: "",
    issue: "",
    timingFrom: "",
    timingTo: "",
    amount: expert?.price || 1000,
    coupon: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState("booking"); // booking → payment
  const [discountApplied, setDiscountApplied] = useState(false);

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  // Prefill user info
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: user.fullName || prev.fullName,
        email: user.email || prev.email,
        contact: user.contact || user.phone || prev.contact,
        age: user.age || prev.age,
      }));
    }
  }, [user]);

  // Reset price when expert changes
  useEffect(() => {
    if (expert) {
      setFormData((prev) => ({
        ...prev,
        amount: expert.price || 1000,
      }));
    }
  }, [expert]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const applyCoupon = () => {
    if (!formData.coupon) return alert("Enter a coupon code!");
    if (formData.coupon.toUpperCase() === "AMAN") {
      setFormData((prev) => ({ ...prev, amount: 0 }));
      setDiscountApplied(true);
      alert("✅ Coupon applied: Free slot!");
    } else {
      alert("❌ Invalid coupon");
    }
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.issue) {
      return alert("Please fill all required fields.");
    }

    setSubmitting(true);
    setTimeout(() => {
      setStep("payment");
      setSubmitting(false);

      // Mobile UPI auto-launch if amount > 0
      if (isMobile && formData.amount > 0 && expert) {
        window.location.href = `upi://pay?pa=${UPI_ID}&pn=BelieveConsultancy&tn=Consultation with ${expert.fullName}&am=${formData.amount}&cu=INR`;
      }
    }, 500);
  };

  const confirmBooking = async () => {
    if (!expert) return alert("Expert not available.");

    setSubmitting(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE}/api/bookings/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            expertId: expert._id,
            verified: formData.amount === 0, // auto-verify free slots
            timingFrom: formData.timingFrom || "Not Specified",
            timingTo: formData.timingTo || "Not Specified",
          }),
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Booking failed");

      alert(
        formData.amount === 0
          ? "✅ Free slot booked!"
          : "✅ Booking recorded. Admin will verify payment."
      );
      handleClose();
      setStep("booking");
      setFormData((prev) => ({ ...prev, coupon: "" }));
      setDiscountApplied(false);
    } catch (err) {
      console.error("❌ Booking error:", err);
      alert(`❌ Error: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (!expert) return null;

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton className="bg-warning text-dark">
        <Modal.Title>
          Book Session with <strong>{expert.fullName || "Expert"}</strong>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Step 1: Booking Form */}
        {step === "booking" && (
          <Form onSubmit={handleBookingSubmit} className="p-2">
            <Form.Group className="mb-3">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Contact Number</Form.Label>
              <Form.Control
                type="text"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                placeholder="Optional"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Age</Form.Label>
              <Form.Control
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder="Your age"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Preferred Timing</Form.Label>
              <div className="d-flex gap-2">
                <Form.Control
                  type="time"
                  name="timingFrom"
                  value={formData.timingFrom}
                  onChange={handleChange}
                />
                <Form.Control
                  type="time"
                  name="timingTo"
                  value={formData.timingTo}
                  onChange={handleChange}
                />
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Describe your issue</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="issue"
                value={formData.issue}
                onChange={handleChange}
                required
                placeholder="Explain briefly about your issue"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Coupon Code</Form.Label>
              <Form.Control
                name="coupon"
                value={formData.coupon}
                onChange={handleChange}
                placeholder="Enter coupon (if any)"
                disabled={discountApplied}
              />
              <Button
                variant="outline-secondary"
                size="sm"
                className="mt-2"
                onClick={applyCoupon}
                disabled={discountApplied}
              >
                Apply
              </Button>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Amount to Pay (INR)</Form.Label>
              <Form.Control
                type="number"
                value={formData.amount}
                disabled
                className="fw-bold text-success"
              />
            </Form.Group>

            <Button
              type="submit"
              className="w-100 btn-warning fw-bold"
              disabled={submitting}
            >
              {submitting ? (
                <Spinner animation="border" size="sm" />
              ) : (
                "Proceed to Payment"
              )}
            </Button>
          </Form>
        )}

        {/* Step 2: Payment Section (Desktop only) */}
        {step === "payment" && formData.amount > 0 && !isMobile && (
          <div className="text-center mt-3">
            <h5>Scan to Pay via UPI</h5>
            <p className="fw-bold text-success">Amount: ₹{formData.amount}</p>
            <QRCodeSVG
              value={`upi://pay?pa=${UPI_ID}&pn=BelieveConsultancy&tn=Consultation with ${expert.fullName}&am=${formData.amount}&cu=INR`}
              size={200}
            />
            <p className="mt-2 small text-muted">Use any UPI app to complete payment</p>
          </div>
        )}

        {/* Confirm Button */}
        {(step === "payment" || formData.amount === 0) && (
          <Button
            className="w-100 btn-success fw-bold mt-3"
            onClick={confirmBooking}
            disabled={submitting}
          >
            {submitting
              ? "Submitting..."
              : formData.amount === 0
              ? "Book Free Slot"
              : "I've Paid / Confirm Booking"}
          </Button>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default BookingModal;
