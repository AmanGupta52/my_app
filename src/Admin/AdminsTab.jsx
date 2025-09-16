import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import "./Admintab.css";

const API_URL = "http://localhost:5000/api/admin";

// Modal component using Portal
const Modal = ({ children, onClose }) => {
  return ReactDOM.createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    document.body
  );
};

const AdminsTab = () => {
  const [admins, setAdmins] = useState([]);
  const [newAdmin, setNewAdmin] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [editAdmin, setEditAdmin] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [otpStep, setOtpStep] = useState(false); // 🔑 stage control
  const [otp, setOtp] = useState("");
  const [createdAdminId, setCreatedAdminId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch all admins
  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setAdmins(res.data.admins || res.data || []);
    } catch (err) {
      console.error("Error fetching admins:", err);
    } finally {
      setLoading(false);
    }
  };

  // Step 1: Add admin (pending until OTP)
  const handleAdd = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(API_URL, newAdmin, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      setCreatedAdminId(res.data.admin?._id || null);
      setOtpStep(true); // switch to OTP input
      alert("✅ Admin created. OTP sent to other admins.");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to add admin");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp) return;
    setLoading(true);
    try {
      await axios.post(
        `${API_URL}/verify-otp`,
        { adminId: createdAdminId, otp },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      setShowForm(false);
      setOtpStep(false);
      setOtp("");
      setCreatedAdminId(null);
      setNewAdmin({ fullName: "", email: "", password: "" });
      fetchAdmins();

      alert("✅ OTP verified! New admin is now active.");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  // Delete admin
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    setLoading(true);
    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setAdmins(admins.filter((a) => a._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete admin");
    } finally {
      setLoading(false);
    }
  };

  // Update admin
  const handleUpdate = async () => {
    if (!editAdmin?.fullName || !editAdmin?.email) return;
    setLoading(true);
    try {
      await axios.put(`${API_URL}/${editAdmin._id}`, editAdmin, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setEditAdmin(null);
      fetchAdmins();
    } catch (err) {
      console.error(err);
      alert("Failed to update admin");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-tab">
      <h2 className="title">👑 Admin Management</h2>

      <button className="btn primary-btn" onClick={() => setShowForm(true)}>
        ➕ Add Admin
      </button>

      {/* Loading Overlay */}
      {loading && (
        <div className="loading-overlay">
          <div className="loading-text">Loading...</div>
        </div>
      )}

      {/* Add Admin + OTP in the same modal */}
      {showForm && (
        <Modal
          onClose={() => {
            setShowForm(false);
            setOtpStep(false);
            setNewAdmin({ fullName: "", email: "", password: "" });
            setOtp("");
          }}
        >
          {!otpStep ? (
            <>
              <h3>Add New Admin</h3>
              <form onSubmit={handleAdd}>
  <input
    type="text"
    placeholder="Full Name"
    value={newAdmin.fullName}
    onChange={(e) =>
      setNewAdmin({ ...newAdmin, fullName: e.target.value })
    }
    required
  />
  <input
    type="email"
    placeholder="Email"
    value={newAdmin.email}
    onChange={(e) =>
      setNewAdmin({ ...newAdmin, email: e.target.value })
    }
    required
  />
  <input
    type="password"
    placeholder="Password"
    value={newAdmin.password}
    onChange={(e) =>
      setNewAdmin({ ...newAdmin, password: e.target.value })
    }
    required
  />


  <div className="form-actions">
    <button type="submit" className="btn save-btn">
      ✅ Add Admin
    </button>
    <button
      type="button"
      className="btn cancel-btn"
      onClick={() => setShowForm(false)}
    >
      ❌ Cancel
    </button>
  </div>
</form>

            </>
          ) : (
            <>
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
                  <button type="submit" className="btn save-btn">
                    ✅ Verify
                  </button>
                  <button
                    type="button"
                    className="btn cancel-btn"
                    onClick={() => setShowForm(false)}
                  >
                    ❌ Cancel
                  </button>
                </div>
              </form>
            </>
          )}
        </Modal>
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
              <td colSpan="3" className="empty">
                No admins found.
              </td>
            </tr>
          ) : (
            admins.map((admin) =>
              editAdmin?._id === admin._id ? (
                <tr key={admin._id}>
                  <td>
                    <input
                      value={editAdmin.fullName}
                      onChange={(e) =>
                        setEditAdmin({ ...editAdmin, fullName: e.target.value })
                      }
                    />
                  </td>
                  <td>
                    <input
                      value={editAdmin.email}
                      onChange={(e) =>
                        setEditAdmin({ ...editAdmin, email: e.target.value })
                      }
                    />
                  </td>
                  <td>
                    <button className="btn save-btn" onClick={handleUpdate}>
                      💾 Save
                    </button>
                    <button
                      className="btn cancel-btn"
                      onClick={() => setEditAdmin(null)}
                    >
                      ❌ Cancel
                    </button>
                  </td>
                </tr>
              ) : (
                <tr key={admin._id}>
                  <td>{admin.fullName}</td>
                  <td>{admin.email}</td>
                  <td>
                    <button
                      className="btn edit-btn"
                      onClick={() => setEditAdmin(admin)}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      className="btn delete-btn"
                      onClick={() => handleDelete(admin._id)}
                    >
                      🗑️ Delete
                    </button>
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
