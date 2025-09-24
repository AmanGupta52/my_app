import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Homepage.css';
import './Motivation.css';
import { Link, useLocation } from 'react-router-dom';
import Header from './Header';

function Graphologist() {
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
     Graphologist
    </h1>
  </div>
</header>

      {/* Page Content */}
      <div className="container my-5">
        <div className="row">
          <div className="col-md-8">
            <img src="/images/service8.png" alt="Speaker" className="img-fluid rounded mb-4" />
            <h3 className="fw-bold mb-3">Graphologist</h3>
            <p>Graphology is the study of handwriting, particularly as it relates to psychological interpretations and personality characteristics. A <b>graphologist</b> examines the physical features of handwriting, such as slant, size, and pressure, to infer the writer's psychological state at the time of writing and their personality traits. This field assumes that handwriting is an unconscious manifestation of the self, providing insights into behavior, mental states, and even professional suitability.</p>
            <p>The work of a<b> graphologist </b>is often applied in various contexts, including personal development, clinical psychology, and corporate hiring processes. By analyzing how individuals form letters and words, graphologists can provide assessments that suggest certain psychological tendencies. These analyses can help in counseling sessions, team-building activities, and identifying leadership qualities in potential employees, making graphology a valuable tool in human resource practices.</p>
            <p>Despite its applications, graphology is a subject of debate among psychologists. Critics argue that handwriting analysis lacks empirical support and standardization, which leads to questions about its reliability and validity. However, enthusiasts and professional<b> graphologists</b> advocate for its use as a supplementary tool alongside other psychological assessments, claiming that it provides unique insights that might not be apparent through other methods. The field continues to evolve, with ongoing research aimed at enhancing its scientific basis and practical applications.</p>



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

export default Graphologist;
