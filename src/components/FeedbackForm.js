import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
const API_BASE = process.env.REACT_APP_API_BASE;


export default function FeedbackForm({ onFeedbackAdded }) {
  const { user } = useContext(AuthContext);
  const [stars, setStars] = useState(5);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");


  const handleSubmit = async (e) => {
    e.preventDefault();
    const newFeedback = {
      fullName: user?.fullName || null,   // null → backend will replace with Anonymous
      email: user?.email || null,         // null → backend will replace with Not Provided
      stars,
      title,
      message,
    };

    try {
      const res = await fetch(`${API_BASE}/api/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newFeedback),
      });

      const data = await res.json();

      if (res.ok) {
        onFeedbackAdded(data);
        setStatus("Feedback submitted successfully ✅");
        setTitle("");
        setMessage("");
        setStars(5);
      } else {
        setStatus(data.error || "Something went wrong ❌");
      }
    } catch (err) {
      setStatus("Network error ❌");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card p-3 shadow-sm rounded-4">
      <h5 className="mb-3">Share your feedback</h5>

      <div className="mb-2">
        <label className="form-label">Rating</label>
        <select
          className="form-select"
          value={stars}
          onChange={(e) => setStars(Number(e.target.value))}
          required
        >
          {[5, 4, 3, 2, 1].map((n) => (
            <option key={n} value={n}>{n} Stars</option>
          ))}
        </select>
      </div>

      <div className="mb-2">
        <label className="form-label">Title</label>
        <input
          type="text"
          className="form-control"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="mb-2">
        <label className="form-label">Message</label>
        <textarea
          className="form-control"
          rows="3"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
      </div>

      <button className="btn btn-primary w-100">Submit Feedback</button>

      {status && <p className="mt-2 text-center small">{status}</p>}
    </form>
  );
}
