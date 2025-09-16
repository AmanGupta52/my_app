// src/components/AdminDashboard/StatsTab.js
import React, { useState, useContext } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  FaUsers,
  FaUserShield,
  FaChalkboardTeacher,
  FaComments,
  FaBookOpen,
  FaBell,
  FaUserCog,
  FaEye,
  FaServer,
  FaDatabase,
  FaTools,
  FaChartLine,
} from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";
import "./AdminDashboard.css"; // ✅ centralized styles

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#845EC2"];

const StatsTab = ({ stats }) => {
  const [date, setDate] = useState(new Date());
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const { user } = useContext(AuthContext);

  if (!stats || Object.keys(stats).length === 0) {
    return <p>Loading stats...</p>;
  }

  const data = [
    { name: "Users", value: stats.usersCount || 0, icon: <FaUsers />, color: "primary" },
    { name: "Admins", value: stats.adminsCount || 0, icon: <FaUserShield />, color: "danger" },
    { name: "Experts", value: stats.expertsCount || 0, icon: <FaChalkboardTeacher />, color: "success" },
    { name: "Feedbacks", value: stats.feedbackCount || 0, icon: <FaComments />, color: "info" },
    { name: "Bookings", value: stats.bookingsCount || 0, icon: <FaBookOpen />, color: "warning" },
  ];

  return (
    <div className="container-fluid p-3 rounded">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>📊 Dashboard Overview</h2>
      </div>

      {/* Stats Cards */}
      <div className="row">
        {data.map((item, index) => (
          <div className="col-md-2 mb-3" key={index}>
            <div className={`card shadow-lg border-0 text-center bg-${item.color} bg-gradient text-white`}>
              <div className="card-body">
                <div className="fs-3 mb-2">{item.icon}</div>
                <h6 className="card-title">{item.name}</h6>
                <p className="fs-4 fw-bold">{item.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="row mt-4">
        <div className="col-md-6 mb-4">
          <div className="card shadow-lg border-0">
            <div className="card-body">
              <h5 className="card-title">📈 Activity Overview</h5>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#0088FE" barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-4">
          <div className="card shadow-lg border-0">
            <div className="card-body">
              <h5 className="card-title">📊 Distribution</h5>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {data.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar + Notifications */}
      <div className="row mt-4">
        <div className="col-md-6 mb-4">
          <div className="card shadow-lg border-0">
            <div className="card-body">
              <h5 className="card-title">📅 Calendar</h5>
              <Calendar value={date} onChange={setDate} />
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-4">
          <div className="card shadow-lg border-0">
            <div className="card-body">
              <h5 className="card-title">🔔 Notifications</h5>
              <ul className="list-group list-group-flush">
                <li className="list-group-item"><FaBell className="me-2 text-primary" /> New user registered</li>
                <li className="list-group-item"><FaBell className="me-2 text-success" /> Expert approved</li>
                <li className="list-group-item"><FaBell className="me-2 text-danger" /> Booking cancelled</li>
                <li className="list-group-item"><FaBell className="me-2 text-warning" /> New feedback received</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* System Health + Quick Actions */}
      <div className="row mt-4">
        {/* System Health */}
        <div className="col-md-6 mb-4">
          <div className="card shadow-lg border-0">
            <div className="card-body">
              <h5 className="card-title">🖥 System Health</h5>
              <ul className="list-group list-group-flush">
                <li className="list-group-item"><FaServer className="me-2 text-success" /> Server Uptime: 99.9%</li>
                <li className="list-group-item"><FaTools className="me-2 text-primary" /> API Status: Running</li>
                <li className="list-group-item"><FaDatabase className="me-2 text-info" /> Database: Connected</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="col-md-6 mb-4">
          <div className="card shadow-lg border-0 text-center">
            <div className="card-body">
              <h5 className="card-title">⚡ Quick Actions</h5>
              <div className="d-flex flex-wrap justify-content-center gap-2 mt-3">
                <button className="btn btn-outline-primary btn-sm"><FaUserShield className="me-1" /> Add Admin</button>
                <button className="btn btn-outline-success btn-sm"><FaChartLine className="me-1" /> View Reports</button>
                <button className="btn btn-outline-danger btn-sm"><FaTools className="me-1" /> Clear Cache</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity + Profile */}
      <div className="row mt-4">
        <div className="col-md-8 mb-4">
          <div className="card shadow-lg border-0">
            <div className="card-body">
              <h5 className="card-title">📝 Recent Activity</h5>
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Details</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>User</td>
                    <td>New registration</td>
                    <td>2025-09-03</td>
                  </tr>
                  <tr>
                    <td>Booking</td>
                    <td>Consultation booked</td>
                    <td>2025-09-02</td>
                  </tr>
                  <tr>
                    <td>Feedback</td>
                    <td>Positive review received</td>
                    <td>2025-09-01</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Admin Profile */}
        <div className="col-md-4 mb-4">
          <div className="card shadow-lg border-0 text-center p-3">
            <img
              src="https://via.placeholder.com/100"
              alt="Admin"
              className="rounded-circle mb-3"
            />
            <h5 className="card-title">{user?.fullName || "Admin Panel"}</h5>
            <p className="text-muted">{user?.email || "System Administrator"}</p>

            <div className="d-flex justify-content-center gap-2 mt-2">
              <button
                className="btn btn-outline-primary btn-sm"
                onClick={() => setShowProfile(true)}
              >
                <FaEye className="me-1" /> View Profile
              </button>
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={() => setShowSettings(true)}
              >
                <FaUserCog className="me-1" /> Settings
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* View Profile Modal */}
      {showProfile && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h4>👤 Profile Details</h4>
            <p><strong>Name:</strong> {user?.fullName}</p>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Role:</strong> {user?.role}</p>
            <p><strong>Age:</strong> {user?.age || "N/A"}</p>
            <button className="btn btn-danger mt-2" onClick={() => setShowProfile(false)}>Close</button>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h4>⚙ Settings</h4>
            <p>Update your preferences here.</p>
            <button className="btn btn-secondary mt-2" onClick={() => setShowSettings(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatsTab;
