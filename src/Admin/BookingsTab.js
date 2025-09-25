// src/components/admin/BookingsTab.js
import React, { useEffect, useState, useContext, useMemo } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
const API_BASE1 = process.env.REACT_APP_API_BASE;

const API_BASE = `${API_BASE1}/api/admin`;

const BookingsTab = () => {
  const { token } = useContext(AuthContext);

  // always include token from localStorage or context
  const authHeader = useMemo(
    () => ({
      Authorization: `Bearer ${localStorage.getItem("token") || token}`,
    }),
    [token]
  );

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchBookings();
    // eslint-disable-next-line
  }, [statusFilter]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/bookings`, { headers: authHeader });

      let data = res.data || [];
      if (statusFilter !== "all") {
        data = data.filter((b) => b.status === statusFilter);
      }

      setBookings(data);
    } catch (err) {
      console.error("Error fetching bookings:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Failed to fetch bookings");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this booking?")) return;
    try {
      await axios.delete(`${API_BASE}/bookings/${id}`, { headers: authHeader });
      setBookings((prev) => prev.filter((b) => b._id !== id));
      toast.success("Booking deleted successfully");
    } catch (err) {
      console.error("Error deleting booking:", err.response?.data || err.message);
      toast.error("Failed to delete booking");
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "pending":
        return { color: "orange", fontWeight: "bold" };
      case "accepted":
        return { color: "green", fontWeight: "bold" };
      case "rejected":
        return { color: "red", fontWeight: "bold" };
      case "completed":
        return { color: "blue", fontWeight: "bold" };
      default:
        return {};
    }
  };

  return (
    <div className="container py-4">
      <h2>📅 All Bookings (Admin)</h2>

      {/* Status Filter */}
      <div className="mb-3">
        <label>Status Filter: </label>
        <select
          className="form-select d-inline-block w-auto ms-2"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {loading ? (
        <div className="text-muted">Loading bookings...</div>
      ) : bookings.length === 0 ? (
        <div className="card p-4 text-center text-muted">No bookings found.</div>
      ) : (
        <div className="card shadow-sm">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-dark">
                <tr>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Issue</th>
                  <th>Expert</th>
                  <th>Timing</th>
                  <th>Status</th>
                  <th>Meeting Link</th>
                  <th>Notes</th>
                  <th>Created At</th>
                  <th>Updated At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b._id}>
                    <td>{b.fullName}</td>
                    <td>{b.email}</td>
                    <td>{b.issue}</td>
                    <td>{b.expertId?.fullName || b.expertName || "Unknown"}</td>
                    <td>
                      {b.timingFrom} - {b.timingTo}
                    </td>
                    <td style={getStatusStyle(b.status)}>{b.status}</td>
                    <td>
                      {b.meetingLink ? (
                        <a href={b.meetingLink} target="_blank" rel="noreferrer">
                          Join
                        </a>
                      ) : (
                        "Not set"
                      )}
                    </td>
                    <td>{b.notes || "—"}</td>
                    <td>{new Date(b.createdAt).toLocaleString()}</td>
                    <td>{new Date(b.updatedAt).toLocaleString()}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(b._id)}
                        >
                          🗑️ Delete
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
    </div>
  );
};

export default BookingsTab;
