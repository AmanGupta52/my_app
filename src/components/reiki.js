import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Homepage.css';
import './Motivation.css';
import { Link, useLocation } from 'react-router-dom';
import Header from './Header';

function Reiki() {
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
      <Header />

      {/* Page Header */}
     <header
  className="position-relative text-white text-center"
  style={{
    backgroundImage: 'url(/images/service1.png)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
    minHeight: '20vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }}
>
  {/* 🔶 Overlay */}
  <div
    className="position-absolute top-0 start-0 w-100 h-100"
    style={{
      backgroundColor: 'rgba(240, 150, 65, 0.5)', // 🔶 orange-tinted overlay
      zIndex: 1,
    }}
  ></div>

  {/* 🔤 Content */}
  <div className="position-relative z-2">
    <h1 className="fw-bold bg-opacity-50 px-4 py-2 rounded">
     Reiki Healing
    </h1>
  </div>
</header>

      {/* Page Content */}
      <div className="container my-5">
        <div className="row">
          <div className="col-md-8">
            <img src="/images/service9.png" alt="Speaker" className="img-fluid rounded mb-4" />
            <h3 className="fw-bold mb-3">Reiki Healing</h3>
            <p><b>Reiki </b>is a holistic healing practice that originated in Japan in the early 20th century, developed by Mikao Usui. This form of healing is based on the principle that the therapist can channel energy into the patient by means of touch, to activate the natural healing processes of the patient's body and restore physical and emotional well-being. It is a gentle yet powerful practice that is often used to reduce stress, promote relaxation, and support the healing of various conditions without any side effects.</p>
            <p><b>The practice of Reiki</b> involves the placement of the healer's hands on or just above the body in various positions. Each position is held for a few minutes, during which time the practitioner believes that the energy is being transferred to the body, addressing physical, emotional, mental, and spiritual imbalances. This technique is said to work on different levels of the body, enhancing and accelerating the body's own healing ability. People often report a deep sense of tranquility, mental clarity, and emotional release during and after receiving Reiki treatments.</p>
            <p><b>Reiki is versatile</b> and non-invasive, making it suitable for many people, including those in delicate health conditions. It is often integrated into other therapeutic techniques and is a beneficial adjunct to conventional therapies, helping to alleviate pain and improve recovery time. Reiki has grown in popularity across the globe, with many hospitals and medical practitioners including it as part of their complementary therapy programs to help patients manage chronic illnesses and the stress of recovery.</p>


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

export default Reiki;
