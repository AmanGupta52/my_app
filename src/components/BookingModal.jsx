// src/components/BookingModal.jsx
import React, { useContext, useState, useEffect } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
const API_BASE = process.env.REACT_APP_API_BASE;
/**
 * BookingModal
 * - First shows a booking form (prefilled from user if available)
 * - On submit, creates a Razorpay order via backend and opens checkout
 * - On successful payment, sends payment data + booking data to backend for verification and booking creation
 *
 * Backend endpoints expected:
 *  - POST /api/payment/order    -> body: { amount }    -> returns order object ({ id, amount, currency, ... })
 *  - POST /api/payment/verify   -> body: { paymentResponse, booking } -> verifies signature, creates booking and returns { success: true }
 *
 * Notes:
 *  - Set your Razorpay Key ID in .env as REACT_APP_RAZORPAY_KEY_ID
 *  - This component injects its own small CSS to keep everything in one file. Remove or move to a CSS file if you prefer.
 */

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
    amount: "", // optional override, otherwise will use expert.price
  });

  const [submitting, setSubmitting] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  // prefill from user
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: user.fullName || prev.fullName,
        email: user.email || prev.email,
        contact: user.contact || prev.contact || user.phone || "",
        age: user.age || prev.age,
      }));
    }
  }, [user]);

  // inject compact CSS (so you get 'proper css' without creating new file)
  useEffect(() => {
    const styleId = "booking-modal-inline-styles";
    if (document.getElementById(styleId)) return;
    const css = `
      /* BookingModal custom styles */
      .booking-modal .modal-content { border-radius: 12px; overflow: hidden; }
      .booking-modal-header { background: linear-gradient(90deg,#fff9ef,#fff); border-bottom: 1px solid #eee; }
      .booking-modal .modal-title { font-weight: 700; color: #333; }
      .booking-form .form-label { font-weight: 600; font-size: 0.92rem; }
      .booking-form .form-control { border-radius: 8px; padding: 10px 12px; }
      .booking-form .form-control:focus { box-shadow: none; border-color: #f6a623; }
      .booking-form .btn-submit { border-radius: 8px; font-weight: 700; }
      .booking-note { font-size: 0.9rem; color: #666; }
      @media (max-width: 480px) {
        .booking-modal .modal-dialog { margin: 12px; }
      }
    `;
    const style = document.createElement("style");
    style.id = styleId;
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);
  }, []);

  // loads Razorpay checkout script once
  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // called when the booking form is submitted -> create order & open checkout
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!expert) {
      alert("Please select an expert before booking.");
      return;
    }

    // basic validation
    if (!formData.fullName || !formData.email || !formData.issue) {
      alert("Please fill required fields.");
      return;
    }

    setSubmitting(true);

    try {
      // amount (in rupees). prefer form override -> expert.price -> fallback 1000
      const amountINR = Number(formData.amount || expert.price || expert.fee || 1000);
      if (isNaN(amountINR) || amountINR <= 0) {
        alert("Invalid amount configured for this session.");
        setSubmitting(false);
        return;
      }

      // 1) create order on backend (best practice)
      const orderResp = await fetch(`${API_BASE}api/payment/order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: amountINR }),
      });

      if (!orderResp.ok) {
        const text = await orderResp.text();
        console.error("Order creation failed:", text);
        alert("Could not create payment order. Try again later.");
        setSubmitting(false);
        return;
      }

      const order = await orderResp.json();
      // order.amount is typically in paise (as created by Razorpay). If your backend returns rupees, convert.

      // prepare booking payload to send to backend after payment verification
      const bookingPayload = {
        fullName: formData.fullName,
        email: formData.email,
        contact: formData.contact,
        age: formData.age,
        issue: formData.issue,
        timingFrom: formData.timingFrom,
        timingTo: formData.timingTo,
        expertId: expert._id || expert.id,
        expertName: expert.fullName || expert.name,
        amount: order.amount || amountINR * 100, // paise
      };

      // 2) load Razorpay script then open checkout
      const ok = await loadRazorpayScript();
      if (!ok) {
        alert("Unable to load payment SDK. Check your connection.");
        setSubmitting(false);
        return;
      }

      setCheckoutLoading(true);

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID || "YOUR_RAZORPAY_KEY_ID",
        amount: bookingPayload.amount, // in paise
        currency: order.currency || "INR",
        name: "Believe Consultancy",
        description: `Consultation with ${bookingPayload.expertName}`,
        image: "/images/logo.png",
        order_id: order.id,
        handler: async function (paymentResponse) {
          // successful payment -> verify on backend and create booking
          try {
            const verifyResp = await fetch(`${API_BASE}/api/payment/verify`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ paymentResponse, booking: bookingPayload }),
            });

            const verifyData = await verifyResp.json();
            if (verifyResp.ok && verifyData.success) {
              alert("✅ Payment successful and booking confirmed.");
              handleClose();
            } else {
              console.error("Verification failed:", verifyData);
              alert("Payment succeeded but verification failed. Please contact support.");
            }
          } catch (err) {
            console.error("Verify error:", err);
            alert("Payment succeeded but there was an error verifying the payment.");
          } finally {
            setCheckoutLoading(false);
            setSubmitting(false);
          }
        },
        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: formData.contact,
        },
        notes: {
          expertId: bookingPayload.expertId,
          issue: bookingPayload.issue,
        },
        theme: {
          color: "#F6A623",
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", function (resp) {
        console.error("payment.failed:", resp);
        alert("Payment failed: " + (resp.error?.description || resp.error?.reason || "Unknown error"));
        setCheckoutLoading(false);
        setSubmitting(false);
      });

      rzp.open();
    } catch (err) {
      console.error(err);
      alert("Something went wrong during booking. Try again.");
      setSubmitting(false);
      setCheckoutLoading(false);
    }
  };

  if (!expert) return null;

  return (
    <Modal show={show} onHide={handleClose} centered className="booking-modal">
      <Modal.Header closeButton className="booking-modal-header">
        <Modal.Title>Book Session with {expert.fullName || expert.name}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form onSubmit={handleSubmit} className="booking-form">
          <Form.Group className="mb-3" controlId="fullName">
            <Form.Label>Full Name</Form.Label>
            <Form.Control
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="contact">
            <Form.Label>Contact Number</Form.Label>
            <Form.Control
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              placeholder="Optional but helpful"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="age">
            <Form.Label>Age</Form.Label>
            <Form.Control
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="issue">
            <Form.Label>Describe your issue (short)</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="issue"
              value={formData.issue}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <div className="d-flex gap-2 mb-3">
            <Form.Group className="flex-fill" controlId="timingFrom">
              <Form.Label>Preferred From</Form.Label>
              <Form.Control
                type="time"
                name="timingFrom"
                value={formData.timingFrom}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="flex-fill" controlId="timingTo">
              <Form.Label>Preferred To</Form.Label>
              <Form.Control
                type="time"
                name="timingTo"
                value={formData.timingTo}
                onChange={handleChange}
              />
            </Form.Group>
          </div>

          <Form.Group className="mb-3" controlId="amount">
            <Form.Label>Session Price (INR)</Form.Label>
            <Form.Control
              type="number"
              name="amount"
              value={formData.amount || expert.price || expert.fee || 1000}
              onChange={handleChange}
              placeholder={`Default: ${expert.price || expert.fee || 1000}`}
              required
            />
            <div className="booking-note mt-1">
              The amount will be processed via secure Razorpay checkout.
            </div>
          </Form.Group>

          <Button
            type="submit"
            className="w-100 btn-submit btn-warning"
            disabled={submitting || checkoutLoading}
          >
            {(submitting || checkoutLoading) && (
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
                className="me-2"
              />
            )}
            {checkoutLoading ? "Opening payment..." : submitting ? "Processing..." : "Proceed to Payment"}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default BookingModal;
