// src/components/admin/FeedbackTab.js
import React, { useEffect, useState, useContext, useMemo } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import "./AdminDashboard.css"; // ✅ reuse the same CSS for consistent style

const API_BASE = "http://localhost:5000/api/admin";

const emptyFeedback = {
  fullName: "",
  email: "",
  stars: 5,
  title: "",
  message: "",
};

const FeedbackTab = () => {
  const { token } = useContext(AuthContext);
  const authHeader = useMemo(
    () => ({ Authorization: `Bearer ${localStorage.getItem("token") || token}` }),
    [token]
  );

  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(false);

  const [newFeedback, setNewFeedback] = useState(null);
  const [editFeedback, setEditFeedback] = useState(null);

  useEffect(() => {
    fetchFeedbacks();
    // eslint-disable-next-line
  }, []);

  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/feedbacks`, { headers: authHeader });
      setFeedbacks(res.data || []);
    } catch (err) {
      console.error("Error fetching feedbacks:", err.response?.data || err.message);
      alert("Failed to fetch feedbacks");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this feedback?")) return;
    try {
      await axios.delete(`${API_BASE}/feedbacks/${id}`, { headers: authHeader });
      setFeedbacks((prev) => prev.filter((f) => f._id !== id));
    } catch (err) {
      console.error("Error deleting feedback:", err.response?.data || err.message);
      alert("Failed to delete feedback");
    }
  };

  const handleAdd = async () => {
    if (!newFeedback) return;
    try {
      const res = await axios.post(`${API_BASE}/feedbacks`, newFeedback, {
        headers: authHeader,
      });
      setFeedbacks([res.data, ...feedbacks]);
      setNewFeedback(null);
    } catch (err) {
      console.error("Error adding feedback:", err.response?.data || err.message);
      alert("Failed to add feedback");
    }
  };

  const handleUpdate = async () => {
    if (!editFeedback?._id) return;
    try {
      const res = await axios.put(`${API_BASE}/feedbacks/${editFeedback._id}`, editFeedback, {
        headers: authHeader,
      });
      setFeedbacks((prev) =>
        prev.map((f) => (f._id === res.data._id ? res.data : f))
      );
      setEditFeedback(null);
    } catch (err) {
      console.error("Error updating feedback:", err.response?.data || err.message);
      alert("Failed to update feedback");
    }
  };

  return (
    <div className="moderators-page container py-4">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h2 className="mb-0">Feedbacks</h2>
        <button
          className="btn btn-primary"
          onClick={() => setNewFeedback({ ...emptyFeedback })}
        >
          + Add Feedback
        </button>
      </div>

      {loading ? (
        <div className="text-muted">Loading feedbacks...</div>
      ) : feedbacks.length === 0 ? (
        <div className="empty-card card p-4 text-center text-muted">No feedback found.</div>
      ) : (
        <div className="card shadow-sm">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-dark">
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Stars</th>
                  <th>Title</th>
                  <th>Message</th>
                  <th style={{ width: 160 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {feedbacks.map((f) => (
                  <tr key={f._id}>
                    <td className="fw-semibold">{f.fullName || "Anonymous"}</td>
                    <td>{f.email || "-"}</td>
                    <td>{"⭐".repeat(f.stars)}</td>
                    <td>{f.title}</td>
                    <td className="truncate-cell" title={f.message}>
                      {f.message}
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-sm btn-warning"
                          onClick={() => setEditFeedback(f)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(f._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Feedback Form */}
      {newFeedback && (
        <div className="card mt-4 shadow-sm p-4">
          <h4 className="mb-3">Add Feedback</h4>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Full Name</label>
              <input
                className="form-control"
                value={newFeedback.fullName}
                onChange={(e) => setNewFeedback({ ...newFeedback, fullName: e.target.value })}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                value={newFeedback.email}
                onChange={(e) => setNewFeedback({ ...newFeedback, email: e.target.value })}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">Stars</label>
              <input
                type="number"
                min="1"
                max="5"
                className="form-control"
                value={newFeedback.stars}
                onChange={(e) => setNewFeedback({ ...newFeedback, stars: Number(e.target.value) })}
              />
            </div>
            <div className="col-md-9">
              <label className="form-label">Title</label>
              <input
                className="form-control"
                value={newFeedback.title}
                onChange={(e) => setNewFeedback({ ...newFeedback, title: e.target.value })}
              />
            </div>
            <div className="col-12">
              <label className="form-label">Message</label>
              <textarea
                rows="3"
                className="form-control"
                value={newFeedback.message}
                onChange={(e) => setNewFeedback({ ...newFeedback, message: e.target.value })}
              />
            </div>
          </div>
          <div className="d-flex gap-2 mt-4">
            <button className="btn btn-success" onClick={handleAdd}>
              Save
            </button>
            <button className="btn btn-secondary" onClick={() => setNewFeedback(null)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Edit Feedback Form */}
      {editFeedback && (
        <div className="card mt-4 shadow-sm p-4">
          <h4 className="mb-3">Edit Feedback</h4>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Full Name</label>
              <input
                className="form-control"
                value={editFeedback.fullName || ""}
                onChange={(e) => setEditFeedback({ ...editFeedback, fullName: e.target.value })}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                value={editFeedback.email || ""}
                onChange={(e) => setEditFeedback({ ...editFeedback, email: e.target.value })}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">Stars</label>
              <input
                type="number"
                min="1"
                max="5"
                className="form-control"
                value={editFeedback.stars || 5}
                onChange={(e) => setEditFeedback({ ...editFeedback, stars: Number(e.target.value) })}
              />
            </div>
            <div className="col-md-9">
              <label className="form-label">Title</label>
              <input
                className="form-control"
                value={editFeedback.title || ""}
                onChange={(e) => setEditFeedback({ ...editFeedback, title: e.target.value })}
              />
            </div>
            <div className="col-12">
              <label className="form-label">Message</label>
              <textarea
                rows="3"
                className="form-control"
                value={editFeedback.message || ""}
                onChange={(e) => setEditFeedback({ ...editFeedback, message: e.target.value })}
              />
            </div>
          </div>
          <div className="d-flex gap-2 mt-4">
            <button className="btn btn-success" onClick={handleUpdate}>
              Save
            </button>
            <button className="btn btn-secondary" onClick={() => setEditFeedback(null)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackTab;
