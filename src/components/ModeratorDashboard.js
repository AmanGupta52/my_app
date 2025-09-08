// src/pages/Moderator.js 
import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "./Moderator.css"; // custom styles

function Moderator() {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [meetingLinks, setMeetingLinks] = useState({});
  const [notes, setNotes] = useState({});
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("pending");
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    rejected: 0
  });

  // ✅ Fetch bookings and filter by moderator name
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:5000/api/bookings");
        const data = await res.json();

        // Filter by moderator's full name
        const moderatorBookings = data.filter(
          booking => booking.expertName === user.fullName
        );

        setBookings(moderatorBookings);
        setFilteredBookings(moderatorBookings);
        
        // Calculate stats
        const pendingCount = moderatorBookings.filter(b => b.status === "Pending").length;
        const confirmedCount = moderatorBookings.filter(b => b.status === "Confirmed").length;
        const rejectedCount = moderatorBookings.filter(b => b.status === "Rejected").length;
        
        setStats({
          total: moderatorBookings.length,
          pending: pendingCount,
          confirmed: confirmedCount,
          rejected: rejectedCount
        });
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setLoading(false);
      }
    };

    if (user?.fullName) {
      fetchBookings();
    }
  }, [user]);

  // ✅ Filter bookings based on status and search term
  useEffect(() => {
    let result = bookings;
    
    // Filter by active tab
    if (activeTab !== "all") {
      result = result.filter(booking => {
        if (activeTab === "pending") return booking.status === "Pending";
        if (activeTab === "confirmed") return booking.status === "Confirmed";
        if (activeTab === "rejected") return booking.status === "Rejected";
        return true;
      });
    }
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(booking => 
        booking.fullName.toLowerCase().includes(term) || 
        booking.email.toLowerCase().includes(term) ||
        booking.timingFrom.toLowerCase().includes(term)
      );
    }
    
    setFilteredBookings(result);
  }, [bookings, activeTab, searchTerm]);

  // ✅ Update booking status
  const handleUpdate = async (id, status) => {
    try {
      const res = await fetch(`http://localhost:5000/api/bookings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          meetingLink: meetingLinks[id] || "",
          notes: notes[id] || "",
        }),
      });
      const data = await res.json();
      
      // Update local state
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? data.booking : b))
      );
      
      // Show success notification
      showNotification(`Booking ${status.toLowerCase()} successfully!`, "success");
    } catch (err) {
      console.error("Update error:", err);
      showNotification("Error updating booking. Please try again.", "error");
    }
  };

  // ✅ Copy meeting link to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showNotification("Meeting link copied to clipboard!", "success");
  };

  // ✅ Show notification
  const showNotification = (message, type) => {
    // Create notification element
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.innerHTML = `
      <span>${message}</span>
      <button onclick="this.parentElement.remove()">&times;</button>
    `;
    
    // Add to notification container
    const container = document.getElementById("notification-container");
    if (!container) {
      const newContainer = document.createElement("div");
      newContainer.id = "notification-container";
      document.body.appendChild(newContainer);
      newContainer.appendChild(notification);
    } else {
      container.appendChild(notification);
    }
    
    // Auto remove after 3 seconds
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 3000);
  };

  // ✅ Format date for display
  const formatDate = (dateString) => {
    const options = { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (!user || user.role !== "moderator")
    return (
      <div className="access-denied">
        <div className="lock-icon">🔒</div>
        <h2>Access Denied</h2>
        <p>This page is for moderators only.</p>
      </div>
    );

  if (loading)
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading your bookings...</p>
      </div>
    );

  return (
    <div className="moderator-dashboard">
      {/* Header Section */}
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Moderator Dashboard</h1>
          <p>Manage your expert sessions and meetings</p>
        </div>
        <div className="user-info">
          <div className="avatar">
            {user.fullName.charAt(0).toUpperCase()}
          </div>
          <div className="user-details">
            <span className="user-name">{user.fullName}</span>
            <span className="user-role">Moderator</span>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="stats-container">
        <div className="stat-card total">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <h3>{stats.total}</h3>
            <p>Total Bookings</p>
          </div>
        </div>
        <div className="stat-card pending">
          <div className="stat-icon">⏳</div>
          <div className="stat-info">
            <h3>{stats.pending}</h3>
            <p>Pending</p>
          </div>
        </div>
        <div className="stat-card confirmed">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <h3>{stats.confirmed}</h3>
            <p>Confirmed</p>
          </div>
        </div>
        <div className="stat-card rejected">
          <div className="stat-icon">❌</div>
          <div className="stat-info">
            <h3>{stats.rejected}</h3>
            <p>Rejected</p>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="controls-section">
        <div className="tabs">
          <button 
            className={activeTab === "all" ? "active" : ""} 
            onClick={() => setActiveTab("all")}
          >
            All ({stats.total})
          </button>
          <button 
            className={activeTab === "pending" ? "active" : ""} 
            onClick={() => setActiveTab("pending")}
          >
            Pending ({stats.pending})
          </button>
          <button 
            className={activeTab === "confirmed" ? "active" : ""} 
            onClick={() => setActiveTab("confirmed")}
          >
            Confirmed ({stats.confirmed})
          </button>
          <button 
            className={activeTab === "rejected" ? "active" : ""} 
            onClick={() => setActiveTab("rejected")}
          >
            Rejected ({stats.rejected})
          </button>
        </div>
        
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by name, email, or date..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="search-icon">🔍</span>
        </div>
      </div>

      {/* Bookings List */}
      <div className="bookings-container">
        {filteredBookings.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📅</div>
            <h3>No bookings found</h3>
            <p>There are no bookings matching your criteria</p>
          </div>
        ) : (
          <div className="bookings-grid">
            {filteredBookings.map((booking) => {
              const isConfirmed = booking.status === "Confirmed";
              const isRejected = booking.status === "Rejected";
              const isPending = booking.status === "Pending";

              return (
                <div key={booking._id} className="booking-card">
                  <div className="card-header">
                    <div className="client-info">
                      <div className="client-avatar">
                        {booking.fullName.charAt(0).toUpperCase()}
                      </div>
                      <div className="client-details">
                        <h4>{booking.fullName}</h4>
                        <p>{booking.email}</p>
                      </div>
                    </div>
                    <span className={`status-badge ${booking.status.toLowerCase()}`}>
                      {booking.status}
                    </span>
                  </div>

                  <div className="card-content">
                    <div className="booking-detail">
                      <span className="detail-label">Expert:</span>
                      <span className="detail-value">{booking.expertName}</span>
                    </div>
                    <div className="booking-detail">
                      <span className="detail-label">Scheduled Time:</span>
                      <span className="detail-value">
                        {formatDate(booking.timingFrom)} - {booking.timingTo}
                      </span>
                    </div>
                    
                    {/* Meeting Link */}
                    <div className="input-group">
                      <label>Meeting Link</label>
                      <div className="input-with-action">
                        <input
                          type="text"
                          placeholder="Paste meeting link here"
                          value={meetingLinks[booking._id] || ""}
                          onChange={(e) =>
                            setMeetingLinks({
                              ...meetingLinks,
                              [booking._id]: e.target.value,
                            })
                          }
                          disabled={isConfirmed || isRejected}
                        />
                        {meetingLinks[booking._id] && (
                          <button 
                            className="icon-button copy-btn"
                            onClick={() => copyToClipboard(meetingLinks[booking._id])}
                            title="Copy to clipboard"
                          >
                            📋
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Notes */}
                    <div className="input-group">
                      <label>Notes</label>
                      <textarea
                        placeholder="Add private notes about this session..."
                        rows={3}
                        value={notes[booking._id] || ""}
                        onChange={(e) =>
                          setNotes({ ...notes, [booking._id]: e.target.value })
                        }
                        disabled={isConfirmed || isRejected}
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="card-actions">
                    {isPending ? (
                      <>
                        <button
                          className="btn confirm-btn"
                          onClick={() => handleUpdate(booking._id, "Confirmed")}
                        >
                          <span className="btn-icon">✅</span>
                          Confirm Booking
                        </button>
                        <button
                          className="btn reject-btn"
                          onClick={() => handleUpdate(booking._id, "Rejected")}
                        >
                          <span className="btn-icon">❌</span>
                          Reject Booking
                        </button>
                      </>
                    ) : (
                      <div className={`status-message ${isConfirmed ? "confirmed" : "rejected"}`}>
                        <span className="message-icon">
                          {isConfirmed ? "✅" : "❌"}
                        </span>
                        <p>
                          {isConfirmed 
                            ? "Booking confirmed and notification sent to client" 
                            : "Booking rejected and notification sent to client"
                          }
                        </p>
                        <span className="action-date">
                          Updated on {new Date().toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Moderator;