// src/components/AdminDashboard/StatsTab.js
import React, { useState } from "react";
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
} from "react-icons/fa";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#845EC2"];

const StatsTab = ({ stats }) => {
  const [date, setDate] = useState(new Date());
  const [darkMode, setDarkMode] = useState(false);

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
    <div className={`container-fluid ${darkMode ? "bg-dark text-light" : ""} p-3 rounded`}>
      {/* Header with Theme Toggle */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>📊 Dashboard Overview</h2>
        <button
          className="btn btn-sm btn-outline-secondary"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>

      {/* Top stats cards */}
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

      {/* Charts and Calendar */}
      <div className="row mt-4">
        {/* Bar Chart */}
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

        {/* Pie Chart */}
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

        {/* Notifications */}
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

      {/* Recent Activity + Admin Profile */}
      <div className="row mt-4">
        {/* Recent Activity */}
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
          <div className="card shadow-lg border-0 text-center">
            <div className="card-body">
              <img
                src="https://via.placeholder.com/100"
                alt="Admin"
                className="rounded-circle mb-3"
              />
              <h5 className="card-title">Admin Panel</h5>
              <p className="text-muted">System Administrator</p>
              <button className="btn btn-outline-primary btn-sm">Edit Profile</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsTab;
