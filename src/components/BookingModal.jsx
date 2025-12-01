// src/components/BookingModal.jsx
import React, { useContext, useState, useEffect } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import { QRCodeSVG } from "qrcode.react";

const UPI_ID = "amangupta032005@okaxis";

const BookingModal = ({ show, handleClose, expert }) => {
  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    contact: "",
    age: "",
    issue: "",
    date: "",
    timingFrom: "",
    timingTo: "",
    amount: expert?.price || 1000,
    coupon: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState("booking");
  const [discountApplied, setDiscountApplied] = useState(false);

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

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

  useEffect(() => {
    if (expert) {
      setFormData((prev) => ({
        ...prev,
        amount: expert.price || 1000,
      }));
    }
  }, [expert]);

  const handleChange = (e) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const applyCoupon = () => {
    if (!formData.coupon) return alert("Enter coupon!");
    if (formData.coupon.toUpperCase() === "AMAN") {
      setFormData((p) => ({ ...p, amount: 0 }));
      setDiscountApplied(true);
    } else {
      alert("Invalid coupon");
    }
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();

    if (!formData.fullName || !formData.email || !formData.issue || !formData.date) {
      return alert("Fill required fields");
    }

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setStep("payment");

      if (isMobile && formData.amount > 0 && expert) {
        window.location.href = `upi://pay?pa=${UPI_ID}&pn=BelieveConsultancy&tn=Session with ${expert.fullName}&am=${formData.amount}&cu=INR`;
      }
    }, 600);
  };

  const confirmBooking = async () => {
    if (!expert) return alert("Expert not found");

    setSubmitting(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE}/api/bookings/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            meetingDate: formData.date,
            expertId: expert._id,
            verified: formData.amount === 0,
          }),
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Booking failed");

      alert(
        formData.amount === 0
          ? "Free slot booked!"
          : "Booking recorded. Admin will confirm after payment."
      );

      handleClose();
      setStep("booking");
      setFormData({
        fullName: "",
        email: "",
        contact: "",
        age: "",
        issue: "",
        date: "",
        timingFrom: "",
        timingTo: "",
        amount: expert.price,
        coupon: "",
      });
      setDiscountApplied(false);
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!expert) return null;

  return (
    <Modal show={show} onHide={handleClose} centered size="lg" className="booking-modal">
      <Modal.Header closeButton className="bg-dark text-light py-3">
        <Modal.Title className="fw-bold fs-4">
          Book Session – <span className="text-warning">{expert.fullName}</span>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-4" style={{ background: "#f8f9fa" }}>
        {/* BOOKING FORM STEP */}
        {step === "booking" && (
          <Form onSubmit={handleBookingSubmit}>
            <div className="card shadow-sm p-4 mb-4">
              <h5 className="fw-bold mb-3 text-secondary">Your Details</h5>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <Form.Label>Full Name *</Form.Label>
                  <Form.Control name="fullName" value={formData.fullName} onChange={handleChange} />
                </div>
                <div className="col-md-6 mb-3">
                  <Form.Label>Email *</Form.Label>
                  <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <Form.Label>Contact</Form.Label>
                  <Form.Control name="contact" value={formData.contact} onChange={handleChange} />
                </div>

                <div className="col-md-6 mb-3">
                  <Form.Label>Age</Form.Label>
                  <Form.Control type="number" name="age" value={formData.age} onChange={handleChange} />
                </div>
              </div>
            </div>

            {/* DATE & TIME CARD */}
            <div className="card shadow-sm p-4 mb-4">
              <h5 className="fw-bold mb-3 text-secondary">Session Time</h5>

              <Form.Group className="mb-3">
                <Form.Label>Date *</Form.Label>
                <Form.Control
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  min={new Date().toISOString().split("T")[0]}
                />
              </Form.Group>

              <div className="row">
                <div className="col-md-6">
                  <Form.Label>From</Form.Label>
                  <Form.Control type="time" name="timingFrom" value={formData.timingFrom} onChange={handleChange} />
                </div>
                <div className="col-md-6">
                  <Form.Label>To</Form.Label>
                  <Form.Control type="time" name="timingTo" value={formData.timingTo} onChange={handleChange} />
                </div>
              </div>
            </div>

            {/* ISSUE CARD */}
            <div className="card shadow-sm p-4 mb-4">
              <h5 className="fw-bold mb-3 text-secondary">Describe Your Issue *</h5>
              <Form.Control as="textarea" rows={4} name="issue" value={formData.issue} onChange={handleChange} />
            </div>

            {/* COUPON + AMOUNT */}
            <div className="card shadow-sm p-4 mb-4">
              <h5 className="fw-bold mb-3 text-secondary">Payment Details</h5>

              <div className="d-flex gap-2 mb-3">
                <Form.Control
                  name="coupon"
                  value={formData.coupon}
                  onChange={handleChange}
                  placeholder="Enter coupon"
                  disabled={discountApplied}
                />
                <Button variant="success" onClick={applyCoupon} disabled={discountApplied}>
                  Apply
                </Button>
              </div>

              <div className="p-3 rounded border bg-white text-center">
                <h5 className="fw-bold mb-0">
                  Amount:{" "}
                  <span className={formData.amount === 0 ? "text-success" : "text-danger"}>
                    ₹{formData.amount}
                  </span>
                </h5>
              </div>
            </div>

            <Button type="submit" className="btn-warning w-100 py-3 fw-bold shadow-sm" disabled={submitting}>
              {submitting ? <Spinner size="sm" /> : "Proceed to Payment →"}
            </Button>
          </Form>
        )}

        {/* PAYMENT STEP */}
        {step === "payment" && formData.amount > 0 && !isMobile && (
          <div className="text-center">
            <h4 className="fw-bold text-success mb-3">Scan & Pay ₹{formData.amount}</h4>

            <div className="bg-white p-4 rounded shadow-sm d-inline-block">
              <QRCodeSVG
                size={220}
                value={`upi://pay?pa=${UPI_ID}&pn=BelieveConsultancy&am=${formData.amount}&cu=INR`}
              />
            </div>

            <p className="text-muted mt-3">Use any UPI app to complete payment.</p>
          </div>
        )}

        {/* CONFIRM BUTTON */}
        {(step === "payment" || formData.amount === 0) && (
          <Button className="btn-success w-100 py-3 fw-bold mt-3" onClick={confirmBooking} disabled={submitting}>
            {submitting ? "Processing..." : formData.amount === 0 ? "Confirm Free Booking" : "I've Paid – Confirm Booking"}
          </Button>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default BookingModal;
