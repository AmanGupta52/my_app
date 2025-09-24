import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Homepage.css';
import './Motivation.css';
import { Link, useLocation } from 'react-router-dom';
import Header from './Header';

function Soft_skills() {
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
     Soft Skill Training
    </h1>
  </div>
</header>

      {/* Page Content */}
      <div className="container my-5">
        <div className="row">
          <div className="col-md-8">
            <img src="/images/service5.png" alt="Speaker" className="img-fluid rounded mb-4" />
            <h3 className="fw-bold mb-3">Soft Skill Training</h3>
            <p><b>Soft Skill Training </b>plays a crucial role in today’s dynamic workplace. Unlike hard skills, which are about a person's skill set and ability to perform a certain type of task or activity, soft skills are interpersonal and broadly applicable across job titles and industries. They include traits like effective communication, teamwork, adaptability, and problem-solving. These skills enhance an individual’s interactions, job performance, and career prospects. Investing in soft skill development can significantly impact workplace efficiency and harmony, making it an essential component of professional growth.</p>
            <p><b>Effective communication</b> is a cornerstone of soft skill training, focusing on how well individuals express themselves, listen, and process information. Training in this area helps employees articulate their thoughts clearly and enhances their ability to understand others. Such skills are vital in managing relationships, resolving conflicts, and in negotiations. They lead to better teamwork and collaboration, and they are indispensable in customer service, leadership, and roles that depend on interpersonal influence. Communication skills extend beyond mere words to include non-verbal cues and digital correspondence, which are equally significant.</p>
            <p><b>Adaptability and problem-solving</b> are other critical areas covered under soft skill training. In the fast-paced modern work environment, the ability to adapt to changes and overcome challenges efficiently can set a professional apart. Training programs designed to enhance these skills teach individuals to handle unexpected situations with grace and to come up with strategic solutions under pressure. Cultivating such skills not only boosts an employee's value in the company but also equips them with the resilience to face personal and professional adversities, fostering a robust and adaptable workforce.</p>
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

export default Soft_skills;
