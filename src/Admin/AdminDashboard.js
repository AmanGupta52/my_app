import React, { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import './AdminDashboard.css';

import StatsTab from "./StatsTab";
import UsersTab from "./UsersTab";
import AdminsTab from "./AdminsTab";
import ModeratorsTab from "./ModeratorsTab";
import FeedbackTab from "./FeedbackTab";
import BookingsTab from "./BookingsTab";

const AdminDashboard = () => {
  const token = localStorage.getItem("token");

  const [stats, setStats] = useState({});
  const [activeTab, setActiveTab] = useState("stats");

  useEffect(() => {
    if (!token) return;
    fetch("http://localhost:5000/api/admin/stats", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.ok ? res.json() : Promise.reject("Unauthorized"))
      .then(data => setStats(data))
      .catch(err => console.error("Error fetching stats:", err));
  }, [token]);

  return (
    <div className="container-fluid py-4">
      <h1 className="mb-4">Admin Dashboard</h1>

      {/* Tabs */}
      <ul className="nav nav-tabs mb-4">
        {["stats", "users", "admins", "moderators", "feedback", "bookings"].map(tab => (
          <li className="nav-item" key={tab}>
            <button
              className={`nav-link ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          </li>
        ))}
      </ul>

      {/* Tab content */}
      {activeTab === "stats" && <StatsTab stats={stats} />}
      {activeTab === "users" && <UsersTab token={token} />}
      {activeTab === "admins" && <AdminsTab token={token} />}
      {activeTab === "moderators" && <ModeratorsTab token={token} />}
      {activeTab === "feedback" && <FeedbackTab token={token} />}
      {activeTab === "bookings" && <BookingsTab token={token} />}
    </div>
  );
};

export default AdminDashboard;
