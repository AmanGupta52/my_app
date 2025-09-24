import './About.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './Header';

function About() {
  return (
    <>
      {/* Navbar */}
      <Header />

      <div className="about-page bg-light text-dark">

        {/* Banner Section */}
        <section className="banner-section text-center text-white d-flex align-items-center justify-content-center" style={{ backgroundImage: 'url(/images/service1.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed', minHeight: '25vh' }}>
          <h1 className="display-4 fw-bold">ABOUT</h1>
        </section>

        {/* Intro Section */}
        <section className="text-center py-5">
          <h5 className="text-uppercase">High Quality <span className="text-warning">Honest Approach</span></h5>
          <p className="lead mx-auto" style={{ maxWidth: '700px' }}>Balanced Minds Consultancy offers professional mental health and wellness services designed to help you lead a more balanced, healthier life. We are dedicated to providing customized care tailored to your needs.</p>
        </section>

        {/* About Us Section */}
        <section className="container py-5 fade-in-section">
          <div className="row align-items-center">
            <div className="col-md-6">
              <img src="/images/about-img.jpg" alt="About" className="img-fluid rounded shadow" />
            </div>
            <div className="col-md-6">
              <h3>About Us</h3>
              <p>We are a team of experienced counselors, therapists, and mental health professionals committed to guiding you through emotional, behavioral, and psychological challenges.</p>
              <button className="btn btn-warning mt-3">Learn More</button>
            </div>
          </div>
        </section>

        {/* Vision & Mission Section */}
        <section className="bg-light py-5 text-center fade-in-section">
          <div className="container">
            <h4 className="mb-3">Our Vision & Mission</h4>
            <p className="mb-0">Our vision is to empower individuals and families to achieve mental clarity, emotional resilience, and a balanced life. We aim to provide accessible, ethical, and evidence-based therapy for everyone.</p>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="container py-5 fade-in-section">
          <div className="text-center mb-4">
            <h3>Why Choose Us</h3>
            <p className="text-muted">Our commitment and expertise make us the best choice</p>
          </div>
          <div className="row text-start">
            <div className="col-md-6">
              <ul className="list-group list-group-flush">
                <li className="list-group-item">✔ Trusted by professionals</li>
                <li className="list-group-item">✔ Expert Counselors</li>
                <li className="list-group-item">✔ Custom Plans for each client</li>
                <li className="list-group-item">✔ Affordable Pricing</li>
                <li className="list-group-item">✔ Confidential & Safe Environment</li>
              </ul>
            </div>
            <div className="col-md-6">
              <img src="/images/team.jpg" alt="Our Team" className="img-fluid rounded shadow" />
            </div>
          </div>
        </section>

        {/* Team / Services Section */}
        <section className="bg-white py-5 fade-in-section">
          <div className="container text-center">
            <h3 className="mb-4">Meet Our Team</h3>
            <div className="row">
              {[...Array(4)].map((_, i) => (
                <div className="col-md-3 mb-4" key={i}>
                  <div className="card h-100 shadow-sm hover-effect">
                    <div className="card-body">
                      <h6 className="card-title">Popular Services</h6>
                      <ul className="list-unstyled small">
                        <li>✔ Counseling</li>
                        <li>✔ Career Advice</li>
                        <li>✔ Life Coaching</li>
                        <li>✔ Motivational Talks</li>
                        <li>✔ Graphology</li>
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer Section */}
        <footer className="bg-dark text-light py-4 fade-in-section">
          <div className="container">
            <div className="row">
              <div className="col-md-4 mb-3">
                <h6>About</h6>
                <p className="small">Balanced Minds Consultancy is committed to providing professional mental health services for all.</p>
              </div>
              <div className="col-md-4 mb-3">
                <h6>Quick Links</h6>
                <ul className="list-unstyled small">
                  <li>Home</li>
                  <li>About</li>
                  <li>Services</li>
                  <li>Contact</li>
                </ul>
              </div>
              <div className="col-md-4 mb-3">
                <h6>Follow Us</h6>
                <div>
                  <i className="bi bi-facebook me-2"></i>
                  <i className="bi bi-instagram me-2"></i>
                  <i className="bi bi-linkedin"></i>
                </div>
              </div>
            </div>
          </div>
        </footer>

      </div>
    </>
  );
}

export default About;