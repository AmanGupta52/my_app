// src/components/Header.js
import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import LoginModal from "./LoginModal";
import Notifications from "./Notifications";
import { AuthContext } from "../context/AuthContext";

function Header() {
  const [showModal, setShowModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { user, logout } = useContext(AuthContext);
  return (
    <>
      {/* Topbar */}
      <div className="bg-dark text-white py-2 px-4 d-flex justify-content-between align-items-center" style={{ fontSize: "0.85rem" }}>
        <div>
          <i className="bi bi-envelope me-2"></i> amangupta032005@gmail.com
          <i className="bi bi-telephone ms-4 me-2"></i> +91 9022251303
        </div>
        <div>
          <i className="bi bi-facebook mx-1"></i>
          <i className="bi bi-instagram mx-1"></i>
          <i className="bi bi-linkedin mx-1"></i>
          <i className="bi bi-youtube mx-1"></i>
        </div>
      </div>

      {/* Navbar */}
      <nav className="navbar navbar-expand-lg shadow-sm px-4" style={{ backgroundColor: "#FBF9ED", fontSize: "1.2rem" }}>
        <Link className="navbar-brand fw-bold d-flex align-items-center gap-2" to="/">
          <img
            src="/nav.png"
            alt="Logo"
            style={{ width: "50px", height: "50px", objectFit: "contain" }}
          />
          <div>
            <div>Balanced Minds Consultancy</div>
            <small className="d-block" style={{ fontSize: "12px" }}>Empowering Minds</small>
          </div>
        </Link>

        <button className="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div id="navbarNav" className="collapse navbar-collapse">
          {/* Center Nav Links */}
          <ul className="navbar-nav mx-auto">
            <li className="nav-item">
              <Link to="/" className="nav-link">Home</Link>
            </li>
            <li className="nav-item">
              <Link to="/about" className="nav-link">About</Link>
            </li>

            {/* Services Dropdown */}
            <li className="nav-item dropdown">
              <Link
                to="/service"
                className="nav-link dropdown-toggle"
                role="button"
                data-bs-toggle="dropdown"
              >
                Services
              </Link>

              <ul className="dropdown-menu">
                <li><Link to="/motivation" className="dropdown-item">Motivational Talks</Link></li>
                <li><Link to="/counselling" className="dropdown-item">Counselling</Link></li>
                <li><Link to="/career" className="dropdown-item">Career Guidance</Link></li>
                <li><Link to="/life-coaching" className="dropdown-item">Life Coaching</Link></li>
                <li><Link to="/soft-skills" className="dropdown-item">Soft Skill Training</Link></li>
                <li><Link to="/image-consultant" className="dropdown-item">Image Consultant</Link></li>
                <li><Link to="/study-abroad" className="dropdown-item">Study Abroad</Link></li>
                <li><Link to="/graphologist" className="dropdown-item">Graphologist</Link></li>
                <li><Link to="/reiki" className="dropdown-item">Reiki Healing</Link></li>
              </ul>
            </li>

            <li className="nav-item">
              <Link to="/experts" className="nav-link">Experts</Link>
            </li>
            <li className="nav-item">
              <Link to="/contact" className="nav-link">Contact</Link>
            </li>
          </ul>

          {/* Right Side */}
          <div className="d-flex align-items-center">
            <Link to="/experts" className="btn btn-warning me-3">Book a Session</Link>

            {!user ? (
              <button className="btn btn-warning d-flex align-items-center gap-2" onClick={() => setShowModal(true)}>
                <i className="bi bi-person-circle"></i> Sign In
              </button>
            ) : (
              <div className="dropdown">
                <button className="btn btn-light dropdown-toggle d-flex align-items-center border rounded-pill px-3 py-1 shadow-sm"
                        type="button" data-bs-toggle="dropdown" aria-expanded="false"
                        style={{ backgroundColor: "#f8f9fa" }}>
                  <img src="/images/user-icon.png" alt="User Icon" width="32" height="32"
                       className="me-2 rounded-circle border border-2 border-warning"
                       style={{ boxShadow: "0 0 5px rgba(255, 193, 7, 0.5)" }} />
                  <span className="fw-semibold">{user.fullName || user.email}</span>
                </button>

                <ul className="dropdown-menu dropdown-menu-end mt-2 shadow-sm">
                  <li>
                    <span className="dropdown-item-text fw-bold">👋 Hi, <span className="text-primary">{user.fullName || user.email}</span></span>
                  </li>
                  <li><span className="dropdown-item-text text-muted small">{user.email}</span></li>
                  <li><hr className="dropdown-divider" /></li>

                  {user.role === "admin" && <li><Link to="/admin-dashboard" className="dropdown-item"><i className="bi bi-speedometer2 me-2"></i> Admin Dashboard</Link></li>}
                  {user.role === "moderator" && <li><Link to="/moderator-dashboard" className="dropdown-item"><i className="bi bi-shield-lock me-2"></i> Moderator Dashboard</Link></li>}
                  {user.role === "expert" && <li><Link to="/expert-dashboard" className="dropdown-item"><i className="bi bi-mortarboard me-2"></i> Expert Dashboard</Link></li>}
                  {user.role === "user" && <li><Link to="/profile" className="dropdown-item"><i className="bi bi-person me-2"></i> My Profile</Link></li>}

                  <li><hr className="dropdown-divider" /></li>
                  <li><button className="dropdown-item text-danger" onClick={logout}><i className="bi bi-box-arrow-right me-2"></i> Logout</button></li>
                </ul>
              </div>
            )}

            <button className="btn btn-light position-relative ms-3" onClick={() => setShowNotifications(true)}>
              <i className="bi bi-bell" style={{ fontSize: "1.2rem" }}></i>
            </button>
          </div>
        </div>
      </nav>

      {/* Login Modal */}
      {showModal && <LoginModal onClose={() => setShowModal(false)} />}

      {/* Notifications */}
      {showNotifications && <Notifications show={showNotifications} onClose={() => setShowNotifications(false)} />}
    </>
  );
}

export default Header;
