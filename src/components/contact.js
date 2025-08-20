import React from 'react';
import './Contact.css'; // Add extra styles if needed
import 'bootstrap/dist/css/bootstrap.min.css';
import MapComponent from './MapComponent';
import { Link } from 'react-router-dom';
import Header from './Header';

function Contact() {
  return (
    <>
      {/* Navbar */}
      <Header />

      {/* Page Background Wrapper */}
      <div style={{ backgroundColor: '#F8F2DB', minHeight: '100vh', paddingBottom: '50px' }}>
        {/* Map Section */}
        <div className="container pt-4">
          <h2 className="text-center fw-bold mb-3">📍 Our Location</h2>
          <MapComponent />
        </div>

        {/* Contact Info */}
        <div className="container text-center mt-5 mb-4">
          <h2 className="fw-bold display-6">📞 Contact Now</h2>
          <p className="text-muted lead">
            Get in touch with us for quick assistance and personalized support. We're here to help!
          </p>
          <div className="bg-light p-3 rounded shadow-sm d-inline-block">
            <p className="mb-0">
              <strong>Office Address:</strong><br />
              Tirupati Bldg No. 60, Ground Floor – 2680 Gandhi Nagar,<br />
              Behind Hotel Sai Prasad, Bandra East, Mumbai – 400051, Maharashtra, India.
            </p>
          </div>
        </div>

        {/* Contact Form Section */}
        <div className="container bg-white rounded-4 shadow-lg p-4 mt-4">
          <div className="row g-4 align-items-center">
            <div className="col-md-5 text-center">
              <img
                src="/images/contact-img.jpg"
                alt="Contact"
                className="img-fluid rounded-3 shadow-sm"
                style={{ maxHeight: '350px' }}
              />
            </div>

            <div className="col-md-7">
              <h4 className="mb-4 fw-semibold text-warning">Send Us a Message</h4>
              <form>
                <div className="row mb-3">
                  <div className="col-md-6 mb-3 mb-md-0">
                    <input type="text" className="form-control form-control-lg" placeholder="Your Name *" required />
                  </div>
                  <div className="col-md-6">
                    <input type="tel" className="form-control form-control-lg" placeholder="Phone Number *" required />
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-6 mb-3 mb-md-0">
                    <input type="email" className="form-control form-control-lg" placeholder="Email Address *" required />
                  </div>
                  <div className="col-md-6">
                    <select className="form-select form-select-lg" required>
                      <option value="">Select a Service *</option>
                      <option>Motivational Talk</option>
                      <option>Counselling</option>
                      <option>Career Guidance</option>
                      <option>Reiki Healing</option>
                    </select>
                  </div>
                </div>

                <div className="mb-3">
                  <textarea
                    className="form-control form-control-lg"
                    rows="4"
                    placeholder="Write your message here..."
                  ></textarea>
                </div>

                <div className="text-end">
                  <button type="submit" className="btn btn-warning px-4 py-2 fw-semibold shadow-sm">
                    <i className="bi bi-send-fill me-2"></i>Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Contact;
