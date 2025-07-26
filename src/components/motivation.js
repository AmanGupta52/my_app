import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Service.css';
import './Motivation.css';
import { Link, useLocation } from 'react-router-dom';
import Header from './Header';

function Motivation() {
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
      MOTIVATIONAL TALKS / SPEAKER'S
    </h1>
  </div>
</header>

      {/* Page Content */}
      <div className="container my-5">
        <div className="row">
          <div className="col-md-8">
            <img src="/images/service2.png" alt="Speaker" className="img-fluid rounded mb-4" style={{minHeight: '40vh'}}/>
            <h3 className="fw-bold mb-3">Motivational Talks / Speaker's</h3>
            <p>We believe that motivational talks hold the potential to transform lives, sparking inspiration and unlocking the strength within us to overcome challenges. Whether delivered in intimate one-on-one sessions, dynamic group discussions, or electrifying crowd engagements, these talks can cater to diverse audiences, ensuring personalized impact and connection. Motivational talks serve as a beacon of hope, reminding us that obstacles are stepping stones, and with the right mindset, we can achieve greatness. Speakers share powerful stories and unique perspectives that encourage us to envision possibilities beyond our current circumstances, providing the push needed to reach our dreams.</p>
            <p>Listening to motivational speakers is not just about feeling inspired momentarily; it’s about gaining practical insights and tools to improve ourselves. They help us build confidence, develop resilience, and stay focused on our goals. A great speaker connects with the audience on a personal level, addressing fears, doubts, and insecurities, turning them into stepping stones for success. These talks can be transformative, showing us how to reframe setbacks and embrace growth opportunities.</p>
            <p>Investing time in motivational talks is like feeding the soul. The energy and wisdom they provide can be life-changing. Make it a habit to seek motivation regularly—it could be the spark you need to reach your full potential!</p>
            
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

export default Motivation;
