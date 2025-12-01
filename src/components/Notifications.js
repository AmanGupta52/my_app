// src/component/Notifications.js
import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const API_BASE = process.env.REACT_APP_API_BASE;

function Notifications({ show, onClose }) {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alertBookingId, setAlertBookingId] = useState(null); // highlight meeting

  // Fetch Notifications
  useEffect(() => {
    if (!user || !show) return;

    fetch(`${API_BASE}/api/bookings/user/${user.email}`)
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


  // ============================
  // 🔥 AUTO CHECK MEETING TIME
  // ============================
  useEffect(() => {
    if (!notifications.length) return;

    const timer = setInterval(() => {
      const now = new Date();

      notifications.forEach((booking) => {
        if (!booking.date || !booking.timingFrom) return;

        // Example: "10:30 AM"
        const meetingDate = new Date(booking.date);
        const [timeStr, period] = booking.timingFrom.split(" ");
        let [hours, minutes] = timeStr.split(":");

        hours = parseInt(hours);
        minutes = parseInt(minutes);

        if (period === "PM" && hours !== 12) hours += 12;
        if (period === "AM" && hours === 12) hours = 0;

        meetingDate.setHours(hours);
        meetingDate.setMinutes(minutes);
        meetingDate.setSeconds(0);

        // difference in minutes
        const diff = (meetingDate - now) / 1000 / 60;

        // 🔔 If meeting starts within next 1 minute
        if (diff >= 0 && diff <= 1) {
          if (alertBookingId !== booking._id) {
            setAlertBookingId(booking._id);

            // POPUP ALERT
            alert(`⏰ Your meeting with ${booking.expertName} is starting now!`);

            // You can also auto-open meeting link:
            // if (booking.meetingLink) window.open(booking.meetingLink, "_blank");
          }
        }
      });
    }, 30000); // check every 30 sec

    return () => clearInterval(timer);
  }, [notifications, alertBookingId]);




  // UI Rendering
  if (!show) return null;
  if (!user) return null;

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
      style={{ background: "rgba(0,0,0,0.5)", zIndex: 1050 }}
    >
      <div
        className="bg-white rounded shadow p-4"
        style={{ width: "500px", maxHeight: "80vh", overflowY: "auto" }}
      >
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
            <div
              key={booking._id}
              className="card mb-3 p-3 shadow-sm"
              style={{
                border:
                  booking._id === alertBookingId
                    ? "2px solid red"
                    : "1px solid #ddd",
                animation:
                  booking._id === alertBookingId
                    ? "blink 1s infinite"
                    : "none",
              }}
            >
              <h6>📅 Booking with {booking.expertName}</h6>
              <p>Status: <strong>{booking.status}</strong></p>
              <p>Time: {booking.timingFrom} – {booking.timingTo}</p>
              <p>Date: {new Date(booking.date).toDateString()}</p>

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

      {/* 🔥 CSS Animation */}
      <style>
        {`
        @keyframes blink {
          0% { background-color: #fff; }
          50% { background-color: #ffe5e5; }
          100% { background-color: #fff; }
        }
        `}
      </style>
    </div>
  );
}

export default Notifications;
