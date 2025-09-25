// src/components/AdminDashboard.js
import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";   // ✅ Import navigate
import "bootstrap/dist/css/bootstrap.min.css";
import "./AdminDashboard.css";
const API_BASE = process.env.REACT_APP_API_BASE;
import { AuthContext } from "../context/AuthContext";  
import StatsTab from "./StatsTab";
import UsersTab from "./UsersTab";
import AdminsTab from "./AdminsTab";
import ModeratorsTab from "./ModeratorsTab";
import FeedbackTab from "./FeedbackTab";
import BookingsTab from "./BookingsTab";

const AdminDashboard = () => {
  const { user, logout } = useContext(AuthContext); 
  const token = localStorage.getItem("token");
  const navigate = useNavigate();  // ✅ Initialize navigate

  const [stats, setStats] = useState({});
  const [activeTab, setActiveTab] = useState("stats");
  const [darkMode, setDarkMode] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    if (!token) return;
    fetch(`${API_BASE}/api/admin/stats`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : Promise.reject("Unauthorized")))
      .then((data) => setStats(data))
      .catch((err) => console.error("Error fetching stats:", err));
  }, [token]);

  // ✅ Get first letter of admin name
  const getInitial = (name) => (name ? name.charAt(0).toUpperCase() : "A");

  // ✅ Logout + redirect to homepage
  const handleLogout = () => {
    logout();
    navigate("/");  // Redirect after logout
  };

  return (
     <div className={`admin-dashboard ${darkMode ? "dark-mode" : ""}`}>
    <div className={`dashboard-container ${darkMode ? "dark-mode" : ""}`}>
      {/* Header */}
      <header className="dashboard-header d-flex justify-content-between align-items-center mb-4">
        <h1 className="dashboard-title">Admin Dashboard</h1>

        <div className="d-flex align-items-center gap-3">
          {/* Mode Switch */}
          <div className="form-check form-switch mode-toggle">
            <input
              className="form-check-input"
              type="checkbox"
              id="modeSwitch"
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
            />
            <label className="form-check-label" htmlFor="modeSwitch">
              {darkMode ? "Dark" : "Light"}
            </label>
          </div>

          {/* Profile Dropdown */}
          <div className="dropdown">
            <button
              className="btn btn-profile dropdown-toggle d-flex align-items-center"
              type="button"
              id="profileMenu"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {/* Circle with initial */}
              <div className="profile-initial">
                {getInitial(user?.fullName || "Admin")}
              </div>
              <span className="ms-2">{user?.fullName || "Admin"}</span>
            </button>
            <ul
              className="dropdown-menu dropdown-menu-end"
              aria-labelledby="profileMenu"
            >
              <li>
                <button
                  className="dropdown-item"
                  onClick={() => setShowProfile(true)}
                >
                  View Profile
                </button>
              </li>
              <li>
                <button
                  className="dropdown-item"
                  onClick={() => setShowSettings(true)}
                >
                  Settings
                </button>
              </li>
              <li>
                <a className="dropdown-item" href="/">
                  Go to Homepage
                </a>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>
              <li>
                <button
                  className="dropdown-item text-danger"
                  onClick={handleLogout}   // ✅ use custom logout
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <ul className="nav nav-tabs mb-4">
        {["stats", "users", "admins", "moderators", "feedback", "bookings"].map(
          (tab) => (
            <li className="nav-item" key={tab}>
              <button
                className={`nav-link ${activeTab === tab ? "active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            </li>
          )
        )}
      </ul>

      {/* Tab content */}
      <div className="tab-card">
        {activeTab === "stats" && <StatsTab stats={stats} />}
        {activeTab === "users" && <UsersTab token={token} />}
        {activeTab === "admins" && <AdminsTab token={token} />}
        {activeTab === "moderators" && <ModeratorsTab token={token} />}
        {activeTab === "feedback" && <FeedbackTab token={token} />}
        {activeTab === "bookings" && <BookingsTab token={token} />}
      </div>

      {/* View Profile Modal */}
      {showProfile && (
        <div className="custom-modal">
          <div className="custom-modal-content">
            <h3>Profile</h3>
            <p><strong>Name:</strong> {user?.fullName}</p>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Age:</strong> {user?.age || "N/A"}</p>
            <p><strong>Role:</strong> {user?.role}</p>
            <button
              className="btn btn-secondary mt-3"
              onClick={() => setShowProfile(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="custom-modal">
          <div className="custom-modal-content">
            <h3>Settings</h3>
            <p>Here you can add settings options later (e.g., change password, theme, etc.).</p>
            <button
              className="btn btn-secondary mt-3"
              onClick={() => setShowSettings(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default AdminDashboard;
