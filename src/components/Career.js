import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Homepage.css';
import './Motivation.css';
import { Link, useLocation } from 'react-router-dom';
import Header from './Header';

function Career() {
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
Career Guidance    </h1>
  </div>
</header>

      {/* Page Content */}
      <div className="container my-5">
        <div className="row">
          <div className="col-md-8">
            <img src="/images/service10.png" alt="Speaker" className="img-fluid rounded mb-4" />
            <h3 className="fw-bold mb-3">Career Guidance</h3>
            <p><b>Career guidance </b>plays a pivotal role in helping individuals align their educational and professional paths with their personal interests and capabilities. Effective career counseling assists people in discovering their strengths and passions, enabling them to make informed decisions about their future. It is crucial for students and professionals at every stage, from choosing an initial career path to navigating mid-career changes. The guidance provided by career counselors is based on thorough assessments of aptitudes, interests, and market trends, ensuring individuals choose careers that offer both personal satisfaction and professional growth.</p>
            <p><b>Today's dynamic job market </b>demands that individuals not only choose careers wisely but also stay adaptable to ongoing changes in their fields. Career guidance helps in planning not just the first job but a sustainable and flexible career trajectory. Counselors emphasize the importance of continuous learning and skill development, which are essential in keeping pace with technological advancements and economic shifts. By encouraging an understanding of lifelong learning, career guidance ensures individuals remain competitive and relevant in their chosen fields, regardless of evolving industry demands.</p>
            <p><b>Moreover, career guidance </b>extends beyond mere job selection; it encompasses personal development and strategic planning. It provides support through resume building, interview preparation, and networking strategies, all tailored to individual career goals. Counselors also offer support during job transitions, helping mitigate the stress associated with change and ensuring a smoother adjustment to new roles. By addressing both personal and professional aspects, career guidance fosters overall confidence and aids in building a fulfilling career that resonates with one's life goals and values.</p>
            
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

export default Career;
