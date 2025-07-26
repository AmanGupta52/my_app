import React from 'react'; // custom styles here
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './Header';
import ClientFeedback from './ClientFeedback';


function Service() {
     const services = [
    "Motivational Talks",
    "Counselling",
    "Career Guidance",
    "Study Abroad",
    "Graphologist",
    "Life Coaching",
    "Soft Skill Training",
    "Image Consultant",
    "Reiki Healing"
  ];

  const feedbacks = [
    { name: "Prachi Mohite", time: "1 month ago", quote: "Mind-Blowing Guidance" },
    { name: "Aarav Mehta", time: "8 months ago", quote: "Transformative Experience" },
    { name: "Pooja Sharma", time: "5 months ago", quote: "Exceptional Guidance" }
  ];
  return (
     <>
    <div style={{ backgroundColor: '#F8F2DB' }}>
      {/* Topbar */}
      <div className="bg-dark text-white py-2 px-4 d-flex justify-content-between align-items-center small">
        <div>
          <i className="bi bi-envelope me-2"></i> believeconsultancy79@gmail.com
          <i className="bi bi-telephone ms-4 me-2"></i> +91 88501 65438
        </div>
        <div>
          <i className="bi bi-facebook mx-1"></i>
          <i className="bi bi-instagram mx-1"></i>
          <i className="bi bi-linkedin mx-1"></i>
          <i className="bi bi-youtube mx-1"></i>
        </div>
      </div>

        {/* Navbar */}
     <Header />
</div>
 <div className="services-page">
      {/* Header */}
      <header className="text-center py-5 bg-light">
        <h1 className="fw-bold">SERVICES</h1>
      </header>

      {/* Our Services */}
      <section className="text-center py-5 bg-white">
        <h2 className="fw-bold mb-3">OUR SERVICES</h2>
        <p className="text-muted">Our services drive growth with expert solutions and personalized support.</p>

        <div className="container mt-4">
          <div className="row">
            {services.map((title, i) => (
              <div className="col-md-4 col-sm-6 mb-4" key={i}>
                <div className="card h-100 shadow-sm p-3">
                  <h5 className="fw-bold">{title}</h5>
                  <a href="#" className="text-warning fw-semibold">READ MORE &gt;</a>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4">Reach for us at: <a href="mailto:believeconsultancy798@gmail.com">believeconsultancy798@gmail.com</a></p>
        </div>
      </section>

      {/* Banner */}
      <section className="text-center py-5 text-white" style={{ backgroundColor: '#222' }}>
        <div className="container">
          <h2 className="fw-bold">We provide expert services and guidance for personal, professional, and emotional growth.</h2>
          <a href="#" className="btn btn-warning mt-3">CONNECT NOW</a>
        </div>
      </section>

      {/* Feedback */}
      <ClientFeedback />

      {/* Consultation Form */}
      <section className="py-5 bg-light text-center">
        <h2 className="fw-bold">BOOK YOUR CONSULTATION NOW</h2>
        <p>Get the right advice to solve problems and achieve your goals effectively.</p>

        <div className="container mt-4 d-flex flex-wrap justify-content-center align-items-center">
          <img
            src="/images/contact-img.jpg"
            alt="Contact"
            className="img-fluid rounded shadow img-fluid me-4"
            style={{ maxWidth: '400px' }}
          />

          <form className="bg-white p-4 shadow-sm rounded" style={{ maxWidth: '500px', width: '100%' }}>
            <div className="row mb-3">
              <div className="col">
                <input type="text" className="form-control" placeholder="Name *" required />
              </div>
              <div className="col">
                <input type="tel" className="form-control" placeholder="Phone *" required />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col">
                <input type="email" className="form-control" placeholder="Email *" required />
              </div>
              <div className="col">
                <select className="form-select">
                  <option>Select a service</option>
                  {services.map((s, i) => <option key={i}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="mb-3">
              <textarea className="form-control" rows="3" placeholder="Message"></textarea>
            </div>
            <button type="submit" className="btn btn-warning w-100">SUBMIT</button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white py-4">
        <div className="container d-flex flex-wrap justify-content-between">
          <div>
            <h5>ABOUT OUR CONSULTING</h5>
            <p style={{ maxWidth: '300px' }}>Believe Consultancy helps individuals and businesses achieve their full potential through expert guidance, motivational talks, and tailored solutions.</p>
          </div>
          <div>
            <h5>SERVICES WE OFFER</h5>
            <ul className="list-unstyled">
              {services.map((service, i) => <li key={i}>{service}</li>)}
            </ul>
          </div>
          <div>
            <h5>FOLLOW US ON</h5>
            <div className="d-flex gap-2">
              <i className="bi bi-facebook"></i>
              <i className="bi bi-instagram"></i>
              <i className="bi bi-linkedin"></i>
              <i className="bi bi-youtube"></i>
            </div>
          </div>
        </div>
        <div className="text-center mt-3 small">
          © Copyright 2025 Believe Consultancy. All Rights Reserved. | <a href="#">Need a Website?</a>
        </div>
      </footer>
    </div>
</> 


    
);
}
   
 export default Service;
