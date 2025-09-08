import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminsTab.css";

const API_URL = "http://localhost:5000/api/admin";

const AdminsTab = () => {
  const [admins, setAdmins] = useState([]);
  const [newAdmin, setNewAdmin] = useState({ fullName: "", email: "", password: "" });
  const [editAdmin, setEditAdmin] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [createdAdminId, setCreatedAdminId] = useState(null);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setAdmins(res.data.admins || []);
    } catch (err) {
      console.error("Error fetching admins:", err);
    }
  };

  // Add admin
  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(API_URL, newAdmin, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      alert(res.data.message || "✅ Admin added successfully. OTP sent!");
      setCreatedAdminId(res.data.admin._id); // save ID for OTP verification
      setShowForm(false);
      setShowOtpModal(true);
      setNewAdmin({ fullName: "", email: "", password: "" });
    } catch (err) {
      console.error("Error adding admin:", err);
      alert(err.response?.data?.message || "❌ Failed to add admin");
    }
  };

  // Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${API_URL}/verify-otp`,
        { adminId: createdAdminId, otp },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      alert(res.data.message || "✅ OTP verified successfully");
      setShowOtpModal(false);
      setOtp("");
      setCreatedAdminId(null);
      fetchAdmins();
    } catch (err) {
      console.error("Error verifying OTP:", err);
      alert(err.response?.data?.message || "❌ OTP verification failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this admin?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setAdmins(admins.filter((a) => a._id !== id));
    } catch (err) {
      console.error("Error deleting admin:", err);
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`${API_URL}/${editAdmin._id}`, editAdmin, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      alert("✅ Admin updated successfully");
      setEditAdmin(null);
      fetchAdmins();
    } catch (err) {
      console.error("Error updating admin:", err);
      alert("❌ Failed to update admin");
    }
  };

  return (
    <div className="admin-tab">
      <h2 className="title">👑 Admin Management</h2>

      <button className="btn primary-btn" onClick={() => setShowForm(true)}>
        ➕ Add Admin
      </button>

      {/* Add Admin Modal */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Add New Admin</h3>
            <form onSubmit={handleAdd}>
              <input
                type="text"
                placeholder="Full Name"
                value={newAdmin.fullName}
                onChange={(e) => setNewAdmin({ ...newAdmin, fullName: e.target.value })}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={newAdmin.email}
                onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={newAdmin.password}
                onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                required
              />
              <div className="form-actions">
                <button type="submit" className="btn save-btn">✅ Save</button>
                <button type="button" className="btn cancel-btn" onClick={() => setShowForm(false)}>❌ Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* OTP Modal */}
      {showOtpModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>🔐 Enter OTP</h3>
            <form onSubmit={handleVerifyOtp}>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
              <div className="form-actions">
                <button type="submit" className="btn save-btn">✅ Verify</button>
                <button type="button" className="btn cancel-btn" onClick={() => setShowOtpModal(false)}>❌ Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admins Table */}
      <table className="data-table">
        <thead>
          <tr>
            <th>Full Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {admins.length === 0 ? (
            <tr>
              <td colSpan="3" className="empty">No admins found.</td>
            </tr>
          ) : (
            admins.map((admin) =>
              editAdmin?._id === admin._id ? (
                <tr key={admin._id}>
                  <td>
                    <input
                      type="text"
                      value={editAdmin.fullName}
                      onChange={(e) => setEditAdmin({ ...editAdmin, fullName: e.target.value })}
                    />
                  </td>
                  <td>
                    <input
                      type="email"
                      value={editAdmin.email}
                      onChange={(e) => setEditAdmin({ ...editAdmin, email: e.target.value })}
                    />
                  </td>
                  <td>
                    <button className="btn save-btn" onClick={handleUpdate}>💾 Save</button>
                    <button className="btn cancel-btn" onClick={() => setEditAdmin(null)}>❌ Cancel</button>
                  </td>
                </tr>
              ) : (
                <tr key={admin._id}>
                  <td>{admin.fullName}</td>
                  <td>{admin.email}</td>
                  <td>
                    <button className="btn edit-btn" onClick={() => setEditAdmin(admin)}>✏️ Edit</button>
                    <button className="btn delete-btn" onClick={() => handleDelete(admin._id)}>🗑️ Delete</button>
                  </td>
                </tr>
              )
            )
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminsTab;
