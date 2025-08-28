import React, { useState, useEffect } from "react";
import FeedbackForm from "./FeedbackForm";

export default function FeedbackSection({ user }) {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/feedback")
      .then((res) => res.json())
      .then((data) => setFeedbacks(data))
      .catch((err) => console.error("Error fetching feedback:", err));
  }, []);

  const handleNewFeedback = (feedback) => {
    setFeedbacks((prev) => [feedback, ...prev]);
  };

  return (
    <section className="py-5 bg-light">
      <div className="container">
        <h2 className="fw-bold text-center">OUR CLIENT FEEDBACK</h2>
        <p className="text-muted text-center mb-4">
          Our clients share their experiences with our counseling & consulting.
        </p>

        <div className="row mb-4">
          <div className="col-md-6 mx-auto">
            <FeedbackForm onFeedbackAdded={handleNewFeedback} user={user} />
          </div>
        </div>

        <div className="row">
          {feedbacks.map((f, idx) => (
            <div key={idx} className="col-md-4 mb-3">
             <div className="card shadow-sm rounded-4 p-3 bg-white h-100">
  <div className="d-flex align-items-center mb-2">
    <div
      className="rounded-circle bg-primary text-white d-flex justify-content-center align-items-center me-2"
      style={{ width: 40, height: 40 }}
    >
      {f.fullName && f.fullName !== "Anonymous" ? f.fullName[0] : "A"}
    </div>
    <div>
      <strong>{f.fullName || "Anonymous"}</strong>
    </div>
  </div>

  <div className="mb-1">
    {"★".repeat(f.stars)}{"☆".repeat(5 - f.stars)}
  </div>
  <h6 className="fw-bold">{f.title}</h6>
  <p className="small">{f.message}</p>
</div>

            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
