import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <nav className="navbar navbar-expand-lg shadow-sm px-4" style={{ backgroundColor: '#FBF9ED' }}>
        <Link className="navbar-brand fw-bold" to="/">
          BC
          <small className="d-block" style={{ fontSize: '12px' }}>Believe Consultancy</small>
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
        </div>
      </nav>
      );
}

export default Header;