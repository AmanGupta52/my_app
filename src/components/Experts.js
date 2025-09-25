// src/pages/Experts.js
import React, { useEffect, useState } from "react";
import "./Experts.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./Header";
import ClientFeedback from "./ClientFeedback";
import BookingModal from "./BookingModal";
const API_BASE = process.env.REACT_APP_API_BASE;

function Experts() {
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Booking modal state
  const [selectedExpert, setSelectedExpert] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Search + filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLang, setFilterLang] = useState("");
  const [filterSpeciality, setFilterSpeciality] = useState("");

  // Fetch experts
  useEffect(() => {
    fetch(`${API_BASE}/api/experts`)
      .then((res) => res.json())
      .then((data) => {
        setExperts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching experts:", err);
        setLoading(false);
      });
  }, []);

  // Filter experts safely
  const filteredExperts = experts.filter((expert) => {
    const fullName = expert.fullName || "";
    const title = expert.title || "";

    const matchesSearch =
      fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      title.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesLang =
      !filterLang ||
      (Array.isArray(expert.languages) && expert.languages.includes(filterLang));

    const matchesSpeciality =
      !filterSpeciality ||
      (Array.isArray(expert.specialities) &&
        expert.specialities.includes(filterSpeciality));

    return matchesSearch && matchesLang && matchesSpeciality;
  });

  return (
    <>
      <Header />
      <div className="experts-page px-4" style={{ backgroundColor: "#F8F2DB" }}>
        {/* Intro */}
        <section className="text-center py-5">
          <h2>
            FIND AN <span className="text-warning">LIFE COACH</span> WHO
            UNDERSTANDS YOUR NEEDS.
          </h2>
          <p>
            Find an expert who truly understands your unique needs and delivers
            personalized solutions to help you achieve your goals effectively.
          </p>
        </section>

        {/* Search + Filters */}
        <section className="filter-section text-center mb-4">
          <input
            type="text"
            placeholder="Search experts..."
            className="form-control mb-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="d-flex flex-wrap justify-content-center gap-2">
            <select
              className="form-select w-auto"
              value={filterLang}
              onChange={(e) => setFilterLang(e.target.value)}
            >
              <option value="">Filter by Language</option>
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
              <option value="Spanish">Spanish</option>
            </select>
            <select
              className="form-select w-auto"
              value={filterSpeciality}
              onChange={(e) => setFilterSpeciality(e.target.value)}
            >
              <option value="">Filter by Speciality</option>
              <option value="Career">Career</option>
              <option value="Relationship">Relationship</option>
              <option value="Mental Health">Mental Health</option>
              <option value="Confidence">Confidence</option>
            </select>
            <button
              className="btn btn-outline-secondary"
              onClick={() => {
                setSearchTerm("");
                setFilterLang("");
                setFilterSpeciality("");
              }}
            >
              Reset
            </button>
          </div>
        </section>

        {/* Experts List */}
        <section className="experts-list d-flex flex-wrap justify-content-center">
          {loading ? (
            <p>Loading experts...</p>
          ) : filteredExperts.length > 0 ? (
            filteredExperts.map((expert) => (
              <div
                key={expert._id}
                className="expert-card card shadow-sm m-3 p-3 rounded-4"
              >
                <div className="d-flex">
                  <img
                    src={expert.img || "/images/default.png"}
                    alt={expert.fullName}
                    className="profile-img me-3"
                  />
                  <div>
                    <h5 className="fw-bold">{expert.fullName}</h5>
                    <p className="text-muted small mb-1">
                      {expert.title || "Expert"}
                    </p>
                    <p className="fw-semibold mb-1">Sessions up to 60 mins</p>

                    <div className="d-flex flex-wrap align-items-center mb-2">
                      <span className="fw-semibold me-1">Expertise:</span>
                      {Array.isArray(expert.specialities) &&
                        expert.specialities.map((s, i) => (
                          <span
                            key={i}
                            className="badge expertise-badge me-1 mb-1"
                          >
                            {s}
                          </span>
                        ))}
                    </div>

                    <p className="mb-2">
                      <b>Speaks: </b>
                      {Array.isArray(expert.languages)
                        ? expert.languages.join(", ")
                        : "N/A"}
                    </p>
                  </div>
                </div>

                {/* Availability */}
                <div className="d-flex justify-content-between my-3">
                  <div
                    className={`mode-btn ${
                      expert.availability === "Online" ? "active" : ""
                    }`}
                  >
                    Online
                  </div>
                  <div
                    className={`mode-btn ${
                      expert.availability === "In-person" ? "active" : ""
                    } inperson`}
                  >
                    In-person
                  </div>
                </div>

                {/* Consultation info */}
                <div className="row text-start mb-3">
                  <div className="col-6">
                    <p className="fw-semibold mb-0">Available via:</p>
                    <p className="small">Google Meet, Zoom Call</p>
                  </div>
                  <div className="col-6">
                    <p className="fw-semibold mb-0">
                      Available for consultation:
                    </p>
                    <p className="small text-danger">
                      {expert.time || "Flexible"}
                    </p>
                  </div>
                </div>

                {/* Book button */}
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

        {/* Why choose section */}
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

        {/* Feedback section */}
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
