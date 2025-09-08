// src/component/Notifications.js
import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Notifications({ show, onClose }) {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !show) return;

    fetch(`http://localhost:5000/api/bookings/user/${user.email}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch bookings");
        return res.json();
      })
      .then((data) => {
        setNotifications(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setLoading(false);
      });
  }, [user, show]);

  if (!show) return null; // hide when not open
  if (!user) return null;

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
      style={{ background: "rgba(0,0,0,0.5)", zIndex: 1050 }}
    >
      <div className="bg-white rounded shadow p-4" style={{ width: "500px", maxHeight: "80vh", overflowY: "auto" }}>
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="m-0">🔔 Notifications</h4>
          <button className="btn btn-sm btn-outline-secondary" onClick={onClose}>
            ✖
          </button>
        </div>

        {/* Body */}
        {loading ? (
          <p className="text-center">Loading notifications...</p>
        ) : notifications.length === 0 ? (
          <p className="text-center">No notifications yet.</p>
        ) : (
          notifications.map((booking) => (
            <div key={booking._id} className="card mb-3 p-3 shadow-sm">
              <h6>📅 Booking with {booking.expertName}</h6>
              <p>Status: <strong>{booking.status}</strong></p>
              <p>Timing: {booking.timingFrom} – {booking.timingTo}</p>
              <p>Date: {new Date(booking.createdAt).toLocaleString()}</p>
              {booking.meetingLink ? (
                <a
                  href={booking.meetingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-sm btn-primary"
                >
                  Join Meeting
                </a>
              ) : (
                <span className="text-muted">Waiting for meeting link...</span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Notifications;
