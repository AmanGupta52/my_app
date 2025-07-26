import React from 'react';
import './Contact.css'; // reuse your styles or create Contact.css
import 'bootstrap/dist/css/bootstrap.min.css';
import MapComponent from './MapComponent';
import { Link } from 'react-router-dom';
import Header from './Header';


function Contact() {
  return (
    <>
         {/* Navbar */}
        <Header />

      {/* Contact Page Content */}
      <div className="container mt-4">
        <h2 className="text-center mb-3">Our Location</h2>
        <MapComponent />
      </div>

      {/* Contact Form Section */}
      <div className="container text-center mt-5 mb-4">
        <h2 className="fw-bold">CONTACT NOW</h2>
        <p className="text-muted">Get in touch with us now for quick assistance and personalized support. We're here to help!</p>
        <p><strong>Office Address:</strong> Tirupati Bldg No. 60, Ground Floor – 2680 Gandhi Nagar,<br />
        Behind Hotel Sai Prasad Bandra East, Mumbai – 400051, Maharashtra, India.</p>
      </div>

      <div className="container d-md-flex justify-content-center shadow rounded p-4 mb-5 bg-white">
        <div className="me-md-4 mb-3 mb-md-0">
         <img src='/images/contact-img.jpg' alt="Contact" className="img-fluid rounded" style={{ maxWidth: '400px' }} />
        </div>

        <form className="flex-grow-1">
          <div className="row mb-3">
            <div className="col-md-6">
              <input type="text" className="form-control" placeholder="Name *" required />
            </div>
            <div className="col-md-6">
              <input type="tel" className="form-control" placeholder="Phone *" required />
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-6">
              <input type="email" className="form-control" placeholder="Email *" required />
            </div>
            <div className="col-md-6">
              <select className="form-select" required>
                <option>Service you’re looking for?</option>
                <option>Motivational Talk</option>
                <option>Counselling</option>
                <option>Career Guidance</option>
              </select>
            </div>
          </div>
          <div className="mb-3">
            <textarea className="form-control" rows="4" placeholder="Message"></textarea>
          </div>
          <button type="submit" className="btn btn-warning px-4">SUBMIT</button>
        </form>
      </div>
    </>
  );
}

export default Contact;
