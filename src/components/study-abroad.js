import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Homepage.css';
import './Motivation.css';
import { Link, useLocation } from 'react-router-dom';
import Header from './Header';

function Study_abroad() {
  const location = useLocation();

  const servicesList = [
    { name: "Motivational Talks / Speaker's", path: "/motivation" },
    { name: "Counselling Services", path: "/counselling" },
    { name: "Career Guidance", path: "/career" },
    { name: "Life Coaching", path: "/life-coaching" },
    { name: "Soft Skill Training", path: "/soft-skills" },
    { name: "Image Consultant", path: "/image-consultant" },
    { name: "Study Abroad Consultant", path: "/study-abroad" },
    { name: "Graphologist", path: "/graphologist" },
    { name: "Reiki Healing", path: "/reiki" }
  ];

  return (
    <>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm px-4">
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

            <li
              className="nav-item dropdown"
              onMouseEnter={() => document.getElementById('servicesMenu').classList.add('show')}
              onMouseLeave={() => document.getElementById('servicesMenu').classList.remove('show')}
            >
             
              <Link
                to="/service"
                className="nav-link"
                onClick={(e) => {
                  // Ensure navigation works normally
                  e.stopPropagation();
                }}
              >
                Services <i className="bi bi-chevron-down ms-1"></i>
              </Link>
            
              <ul className="dropdown-menu" id="servicesMenu">
                {servicesList.map((service, index) => (
                  <li key={index}>
                    <Link to={service.path} className="dropdown-item">
                      {service.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>

            <li className="nav-item">
              <Link to="/experts" className="nav-link">Experts</Link>
            </li>
            <li className="nav-item">
              <Link to="/contact" className="nav-link">Contact</Link>
            </li>
          </ul>

          <Link to="/book" className="btn btn-warning ms-3">Book a Session</Link>
        </div>
      </nav>

      {/* Page Header */}
      <header className="text-center py-5 text-white" style={{ backgroundImage: 'url(/images/banner-bg.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <h1 className="fw-bold">MOTIVATIONAL TALKS / SPEAKER'S</h1>
      </header>

      {/* Page Content */}
      <div className="container my-5">
        <div className="row">
          <div className="col-md-8">
            <img src="/images/speaker.jpg" alt="Speaker" className="img-fluid rounded mb-4" />
            <h3 className="fw-bold mb-3">Motivational Talks / Speaker's</h3>
            <p>We believe that motivational talks hold the potential to transform lives, sparking inspiration and unlocking the strength within us to overcome challenges...</p>
            {/* truncated for brevity */}
          </div>

          <div className="col-md-4">
            <div className="p-3 mb-4 bg-light border rounded">
              <h5 className="fw-bold mb-3">Our Solutions</h5>
              <ul className="list-unstyled">
                {servicesList.map((service, index) => (
                  <li key={index}>
                    <Link
                      to={service.path}
                      className={`d-block px-3 py-2 mb-2 rounded text-decoration-none ${location.pathname === service.path ? 'bg-warning text-white fw-bold' : 'text-dark'}`}
                    >
                      {service.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-3 bg-light border rounded">
              <h5 className="fw-bold mb-3">Contact Form</h5>
              <form>
                <div className="mb-2">
                  <input type="text" className="form-control" placeholder="Name" />
                </div>
                <div className="mb-2">
                  <input type="email" className="form-control" placeholder="Email" />
                </div>
                <div className="mb-2">
                  <textarea className="form-control" rows="3" placeholder="Message"></textarea>
                </div>
                <button className="btn btn-warning w-100">SUBMIT</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Study_abroad;
