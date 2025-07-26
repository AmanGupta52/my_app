import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Homepage.css';
import './Motivation.css';
import { Link, useLocation } from 'react-router-dom';
import Header from './Header';

function Counselling() {
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
      Counselling Services
    </h1>
  </div>
</header>

      {/* Page Content */}
      <div className="container my-5">
        <div className="row">
          <div className="col-md-8">
            <img src="/images/service3.png" alt="Speaker" className="img-fluid rounded mb-4" style={{minHeight: '40vh'}}/>
            <h3 className="fw-bold mb-3">Counselling Services</h3>
            <p>Counseling services offer a supportive environment where individuals can discuss their problems and feelings confidentially. Whether it's stress, anxiety, relationship issues, or personal growth, speaking to a professional counselor can make a significant difference. These services are available both online and offline, ensuring accessibility to everyone, regardless of location. Each session typically lasts between 45 to 60 minutes, providing enough time to delve into core issues and explore effective solutions.</p>
            <p>The importance of counseling cannot be overstated. It helps people manage and overcome emotional, mental, and lifestyle challenges. By speaking openly with a counselor, individuals can gain new perspectives on their problems and learn strategies to handle them better. This process is crucial for mental health and well-being, allowing people to lead happier, more fulfilling lives. Whether choosing online or offline sessions, the benefits of investing in professional counseling are profound and lasting.</p>
            <p>Moreover, counseling services are designed to suit various needs and preferences. Online counseling offers flexibility and convenience, ideal for those with busy schedules or limited access to local services. Offline counseling, on the other hand, provides a personal touch, which can be more comforting for some individuals. Regardless of the mode, professional counselors are equipped to provide guidance and support, ensuring that every session is beneficial. These services are a valuable investment in personal development and mental health.</p>
            
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

export default Counselling;
