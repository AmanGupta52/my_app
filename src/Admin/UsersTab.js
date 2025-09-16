import React, { useEffect, useState, useContext, useMemo } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import "./AdminDashboard.css"; // custom styles
import { toast } from "react-toastify";

const API_BASE = "http://localhost:5000/api/admin";

const emptyUser = {
  fullName: "",
  age: "",
  email: "",
  password: "",
  role: "user",
};

const UsersTab = () => {
  const { token } = useContext(AuthContext);

  // always include token from localStorage or context
  const authHeader = useMemo(
    () => ({
      Authorization: `Bearer ${localStorage.getItem("token") || token}`,
    }),
    [token]
  );

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // form states
  const [newUser, setNewUser] = useState(null);
  const [editUser, setEditUser] = useState(null);

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line
  }, []);

  // Fetch users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/users`, { headers: authHeader });
      setUsers(res.data.users || []);
    } catch (err) {
      console.error("Error fetching users:", err.response?.data || err.message);
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  // Add user
  const handleAdd = async () => {
    if (!newUser) return;
    try {
      await axios.post(`${API_BASE}/users`, newUser, { headers: authHeader });
      toast.success("User added successfully");
      setNewUser(null);
      fetchUsers();
    } catch (err) {
      console.error("Error adding user:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Failed to add user");
    }
  };

  // Update user
  const handleUpdate = async () => {
    if (!editUser?._id) return;
    try {
      await axios.put(`${API_BASE}/users/${editUser._id}`, editUser, {
        headers: authHeader,
      });
      toast.success("User updated successfully");
      setEditUser(null);
      fetchUsers();
    } catch (err) {
      console.error("Error updating user:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Failed to update user");
    }
  };

  // Delete user
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`${API_BASE}/users/${id}`, { headers: authHeader });
      setUsers((prev) => prev.filter((u) => u._id !== id));
      toast.success("User deleted");
    } catch (err) {
      console.error("Error deleting user:", err.response?.data || err.message);
      toast.error("Failed to delete user");
    }
  };

  return (
    <div className="users-page container py-4">
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h2 className="mb-0">Users</h2>
        <button
          className="btn btn-primary"
          onClick={() => setNewUser({ ...emptyUser })}
        >
          + Add User
        </button>
      </div>

      {/* Users Table */}
      {loading ? (
        <div className="text-muted">Loading users...</div>
      ) : users.length === 0 ? (
        <div className="empty-card card p-4 text-center text-muted">
          No users found.
        </div>
      ) : (
        <div className="card shadow-sm">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-dark">
                <tr>
                  <th>Name</th>
                  <th>Age</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th style={{ width: 160 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td className="fw-semibold">{user.fullName}</td>
                    <td>{user.age || "-"}</td>
                    <td>{user.email}</td>
                    <td>
                      <span
                        className={`badge bg-${
                          user.role === "admin"
                            ? "danger"
                            : user.role === "moderator"
                            ? "warning text-dark"
                            : user.role === "expert"
                            ? "info"
                            : "secondary"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-sm btn-warning"
                          onClick={() => setEditUser({ ...user })}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(user._id)}
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

      {/* Add Form */}
      {newUser && (
        <div className="card mt-4 shadow-sm p-4">
          <h4 className="mb-3">Add User</h4>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Full Name</label>
              <input
                className="form-control"
                value={newUser.fullName}
                onChange={(e) =>
                  setNewUser({ ...newUser, fullName: e.target.value })
                }
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Age</label>
              <input
                type="number"
                className="form-control"
                value={newUser.age}
                onChange={(e) =>
                  setNewUser({ ...newUser, age: e.target.value })
                }
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                value={newUser.email}
                onChange={(e) =>
                  setNewUser({ ...newUser, email: e.target.value })
                }
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                value={newUser.password}
                onChange={(e) =>
                  setNewUser({ ...newUser, password: e.target.value })
                }
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Role</label>
              <select
                className="form-select"
                value={newUser.role}
                onChange={(e) =>
                  setNewUser({ ...newUser, role: e.target.value })
                }
              >
                <option value="user">User</option>
                <option value="moderator">Moderator</option>
                <option value="expert">Expert</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          <div className="d-flex gap-2 mt-4">
            <button className="btn btn-success" onClick={handleAdd}>
              Save
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setNewUser(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Edit Form */}
      {editUser && (
        <div className="card mt-4 shadow-sm p-4">
          <h4 className="mb-3">Edit User</h4>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Full Name</label>
              <input
                className="form-control"
                value={editUser.fullName}
                onChange={(e) =>
                  setEditUser({ ...editUser, fullName: e.target.value })
                }
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Age</label>
              <input
                type="number"
                className="form-control"
                value={editUser.age}
                onChange={(e) =>
                  setEditUser({ ...editUser, age: e.target.value })
                }
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                value={editUser.email}
                onChange={(e) =>
                  setEditUser({ ...editUser, email: e.target.value })
                }
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Role</label>
              <select
                className="form-select"
                value={editUser.role}
                onChange={(e) =>
                  setEditUser({ ...editUser, role: e.target.value })
                }
              >
                <option value="user">User</option>
                <option value="moderator">Moderator</option>
                <option value="expert">Expert</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          <div className="d-flex gap-2 mt-4">
            <button className="btn btn-success" onClick={handleUpdate}>
              Save
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setEditUser(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersTab;
