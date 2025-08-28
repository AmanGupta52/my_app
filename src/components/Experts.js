import React, { useEffect, useState } from 'react';
import './Experts.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import Header from './Header';
import ClientFeedback from './ClientFeedback';
import BookingModal from './BookingModal'; // 👈 import modal

function Experts() {
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);

  // state for booking modal
  const [selectedExpert, setSelectedExpert] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Fetch experts
  useEffect(() => { 
    fetch('http://localhost:5000/api/experts')
      .then((res) => res.json())
      .then((data) => {
        setExperts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching experts:', err);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <Header />
      <div className="experts-page px-4" style={{ backgroundColor: '#F8F2DB' }}>
        <section className="text-center py-5">
          <h2>
            FIND AN <span className="text-warning">LIFE COACH</span> WHO
            UNDERSTANDS YOUR NEEDS.
          </h2>
          <p>
            Find an expert who truly understands your unique needs and
            delivers personalized solutions to help you achieve your goals
            effectively.
          </p>
        </section>

        <section className="experts-list d-flex flex-wrap justify-content-center">
          {loading ? (
            <p>Loading experts...</p>
          ) : experts.length > 0 ? (
            experts.map((expert, index) => (
              <div key={index} className="expert-card card shadow-sm m-3 p-3 rounded-4">
                <div className="d-flex">
                  <img
                    src={`/images/${expert.img}`}
                    alt={expert.name}
                    className="profile-img me-3"
                  />
                  <div>
                    <h5 className="fw-bold">{expert.name}</h5>
                    <p className="text-muted small mb-1">{expert.title}</p>
                    <p className="fw-semibold mb-1">Sessions upto 60 mins</p>

                    <div className="d-flex flex-wrap align-items-center mb-2">
                      <span className="fw-semibold me-1">Expertise:</span>
                      {expert.specialities &&
                        expert.specialities.map((s, i) => (
                          <span key={i} className="badge expertise-badge me-1 mb-1">
                            {s}
                          </span>
                        ))}
                      <span className="badge badge-more">More</span>
                    </div>

                    <p className="mb-2">
                      <b>Speaks: </b>
                      {Array.isArray(expert.languages)
                        ? expert.languages.join(', ')
                        : 'N/A'}
                    </p>
                  </div>
                </div>

                <div className="d-flex justify-content-between my-3">
                  <div className={`mode-btn ${expert.availability === 'Online' ? 'active' : ''}`}>
                    Online
                  </div>
                  <div className={`mode-btn ${expert.availability !== 'Online' ? 'active' : ''} inperson`}>
                    In-person
                  </div>
                </div>

                <div className="row text-start mb-3">
                  <div className="col-6">
                    <p className="fw-semibold mb-0">Available via:</p>
                    <p className="small">Google Meet, Zoom Call</p>
                  </div>
                  <div className="col-6">
                    <p className="fw-semibold mb-0">Available for consultation:</p>
                    <p className="small text-danger">{expert.time}</p>
                  </div>
                </div>

                <button
                  className="btn book-btn w-100"
                  onClick={() => {
                    setSelectedExpert(expert);
                    setShowModal(true);
                  }}
                >
                  Book
                </button>
              </div>
            ))
          ) : (
            <p>No experts found.</p>
          )}
        </section>

        <section className="why-choose py-5 bg-light text-center">
          <h3 className="mb-4">WHY CHOOSE BELIEVE CONSULTANCY?</h3>
          <div className="d-flex flex-wrap justify-content-center">
            <div className="feature-box m-3 p-3 bg-white shadow-sm rounded">
              <h5>Experienced Psychologists</h5>
            </div>
            <div className="feature-box m-3 p-3 bg-white shadow-sm rounded">
              <h5>Safe, Confidential & Non-Judgmental Space</h5>
            </div>
            <div className="feature-box m-3 p-3 bg-white shadow-sm rounded">
              <h5>Experience a Personalized Approach</h5>
            </div>
            <div className="feature-box m-3 p-3 bg-white shadow-sm rounded">
              <h5>Holistic Mental Well-being</h5>
            </div>
          </div>
        </section>

        <ClientFeedback />
      </div>

      {/* Booking modal */}
      {showModal && (
        <BookingModal
          show={showModal}
          handleClose={() => setShowModal(false)}
          expert={selectedExpert}
        />
      )}
    </>
  );
}

export default Experts;
