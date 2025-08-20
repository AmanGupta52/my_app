import React, { useState } from 'react';  
import { Link } from 'react-router-dom';
import LoginModal from './LoginModal';


function Header() {
 const [showModal, setShowModal] = useState(false);
 const [user, setUser] = useState(null); // null = not logged in

  const handleLogin = (userData) => {
  console.log('Logged in user:', userData);
  setUser(userData);
};

  const handleLogout = () => {
  setUser(null); // or however you're managing the logged-in user
};

  return (
    <>
    {/* Topbar */}
      <div className="bg-dark text-white py-2 px-4 d-flex justify-content-between align-items-center small">
        <div>
          <i className="bi bi-envelope me-2"></i>amangupta032005@gmail.com
          <i className="bi bi-telephone ms-4 me-2"></i> +91 9022251303
        </div>
        <div>
          <i className="bi bi-facebook mx-1"></i>
          <i className="bi bi-instagram mx-1"></i>
          <i className="bi bi-linkedin mx-1"></i>
          <i className="bi bi-youtube mx-1"></i>
        </div>
      </div>

    <nav className="navbar navbar-expand-lg shadow-sm px-4" style={{ backgroundColor: '#FBF9ED' }}>
        <Link className="navbar-brand fw-bold d-flex align-items-center gap-2" to="./Homepage">
    <img
      src="/nav.png" 
      alt="Logo"
      style={{ width: '50px', height: '50px', objectFit: 'contain' }}
    />
    <div>
      <div>Believe Consultancy</div>
      <small className="d-block" style={{ fontSize: '12px' }}>Empowering Minds</small>
    </div>
  </Link>
    
        <button className="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
    
        <div id="navbarNav" className="collapse navbar-collapse">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link to="/" className="nav-link">Home</Link>
            </li>
    
            <li className="nav-item">
              <Link to="/about" className="nav-link">About</Link>
            </li>
    
            {/* Dropdown on hover and click */}
            <li
      className="nav-item dropdown"
      onMouseEnter={() => document.getElementById('servicesMenu').classList.add('show')}
      onMouseLeave={() => document.getElementById('servicesMenu').classList.remove('show')}
    >
        <Link
          to="/Service"
          className="nav-link dropdown-toggle"
    
          onClick={(e) => {
            e.stopPropagation(); 
          }}
        >
          Services <i className="bi ms-1"></i>
        </Link>
    
        <ul className="dropdown-menu" id="servicesMenu">
          <li><Link to="/motivation" className="dropdown-item">Motivational Talks</Link></li>
          <li><Link to="/counselling" className="dropdown-item">Counselling</Link></li>
          <li><Link to="/career" className="dropdown-item">Career Guidance</Link></li>
          <li><Link to="/life-coaching" className="dropdown-item">Life Coaching</Link></li>
          <li><Link to="/soft-skills" className="dropdown-item">Soft Skill Training</Link></li>
          <li><Link to="/image-consultant" className="dropdown-item">Image Consultant</Link></li>
          <li><Link to="/study-abroad" className="dropdown-item">Study Abroad Consultant</Link></li>
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
    
          <Link to="/Experts" className="btn btn-warning ms-3">Book a Session</Link>

            {/* login saction */}
          <div className="d-flex align-items-center">
  {!user ? (
    <button
      className="btn btn-warning ms-3 d-flex align-items-center gap-2"
      onClick={() => setShowModal(true)}
    >
      <i className="bi bi-person-circle"></i> Sign In
    </button>
  ) : (
    <div className="dropdown ms-3">
      <button
        className="btn btn-light dropdown-toggle d-flex align-items-center border rounded-pill px-3 py-1 shadow-sm"
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
        style={{ backgroundColor: '#f8f9fa' }}
      >
        <img
          src="/images/user-icon.png"
          alt="User Icon"
          width="32"
          height="32"
          className="me-2 rounded-circle border border-2 border-warning"
          style={{ boxShadow: '0 0 5px rgba(255, 193, 7, 0.5)' }}
        />
        <span className="fw-semibold">{user.name}</span>
      </button>
      <ul className="dropdown-menu dropdown-menu-end mt-2 shadow-sm">
        <li>
          <span className="dropdown-item-text fw-bold">
            👋 Hi, <span className="text-primary">{user.name}</span>
          </span>
        </li>
        <li>
          <span className="dropdown-item-text text-muted small">
            {user.email}
          </span>
        </li>
        <li><hr className="dropdown-divider" /></li>
        <li>
          <button className="dropdown-item text-danger" onClick={handleLogout}>
            <i className="bi bi-box-arrow-right me-2"></i> Logout
          </button>
        </li>
      </ul>
    </div>
  )}
</div>

        </div>
      </nav>

      {showModal && <LoginModal onClose={() => setShowModal(false)} onLogin={handleLogin} />}
      </>
    );
}

export default Header;