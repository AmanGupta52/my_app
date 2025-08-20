import './About.css'; // custom styles here
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import Header from './Header';

function About() {
  return (
        <>
      {/* Navbar */}
      <Header />

    <div className="about-page bg-light text-dark">

      {/* Section 1: Banner */}
      <section className="text-center text-white py-5" style={{ backgroundImage: 'url(/images/service1.png)', backgroundSize: 'cover', backgroundPosition: 'center',backgroundAttachment: 'fixed',minHeight: '20vh',display: 'flex',alignItems: 'center',justifyContent: 'center', }}>
        <h1 className="display-4 fw-bold">ABOUT</h1>
      </section>

      {/* Section 2: Intro */}
      <section className="text-center py-4">
        <h5 className="text-uppercase">High Quality <span className="text-warning">Honest Approach</span></h5>
        <p className="lead">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vel nisi nec sapien tempor aliquam.</p>
      </section>

      {/* Section 3: About Us */}
      <section className="container py-5">
        <div className="row align-items-center">
          <div className="col-md-6">
            <img src="/images/about-img.jpg" alt="About" className="img-fluid rounded" />
          </div>
          <div className="col-md-6">
            <h3>About Us</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris interdum est et metus fermentum convallis.</p>
            <button className="btn btn-warning mt-3">Learn More</button>
          </div>
        </div>
      </section>

      {/* Section 4: Vision and Mission */}
      <section className="bg-light py-5 text-center">
        <div className="container">
          <h4 className="mb-3">Our Vision & Mission</h4>
          <p className="mb-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. Curabitur tempor ante nec diam hendrerit, non efficitur felis tincidunt.</p>
        </div>
      </section>

      {/* Section 5: Why We Are Best */}
      <section className="container py-5">
        <div className="text-center mb-4">
          <h3>We Are Always Best</h3>
          <p className="text-muted">Why you should choose us</p>
        </div>
        <div className="row text-start">
          <div className="col-md-6">
            <ul className="list-group list-group-flush">
              <li className="list-group-item">✔ Trusted by professionals</li>
              <li className="list-group-item">✔ Expert Counselors</li>
              <li className="list-group-item">✔ Custom Plans</li>
              <li className="list-group-item">✔ Affordable Pricing</li>
            </ul>
          </div>
          <div className="col-md-6">
            <img src="/images/team.jpg" alt="Our Team" className="img-fluid rounded" />
          </div>
        </div>
      </section>

      {/* Section 6: Team / Services / Popular Lists */}
      <section className="bg-white py-5">
        <div className="container text-center">
          <h3 className="mb-4">Meet Our Team</h3>
          {/* Repeatable columns with card lists */}
          <div className="row">
            {[...Array(4)].map((_, i) => (
              <div className="col-md-3 mb-4" key={i}>
                <div className="card h-100 shadow-sm">
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

      {/* Section 7: Footer */}
      <footer className="bg-dark text-light py-4">
        <div className="container">
          <div className="row">
            <div className="col-md-4 mb-3">
              <h6>About</h6>
              <p className="small">Brief company intro and values...</p>
            </div>
            <div className="col-md-4 mb-3">
              <h6>Quick Links</h6>
              <ul className="list-unstyled small">
                <li>Home</li>
                <li>About</li>
                <li>Services</li>
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