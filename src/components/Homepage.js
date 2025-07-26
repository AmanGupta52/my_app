import './Homepage.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect } from 'react';
import Header from './Header';
import ClientFeedback from "./ClientFeedback";






function Homepage() {
  useEffect(() => {
    const fadeEls = document.querySelectorAll('.fade-in');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, { threshold: 0.2 });

    fadeEls.forEach(el => observer.observe(el));
  }, []);
  return (
    <>
    <div>
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


      {/* Hero Section */}
  <div
  className="hero d-flex flex-column flex-md-row align-items-center p-5"
  style={{
    backgroundImage: "url('/images/hero_1.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    color: "#000",
    position: "relative",
    minHeight: "100vh"
  }}
>
  <div className="text-section flex-grow-1 text-center text-md-start mb-4 mb-md-0">
    <p className="small slide-in text-white">
      The best way to get your life back on track and achieve success.
    </p>

    <h1 className="fw-bold display-5">
      Empower Your Future<br />With Expert Guidance
    </h1>

    <a href="/contact" className="btn btn-warning mt-3 px-4">Connect With Us</a>
  </div>

  <div className="score-box bg-white p-4 rounded shadow text-center ms-md-5 fade-in">
    <h5 className="fw-bold">Find your Mental Health Score</h5>
    <img
      src="/images/home2.png"
      alt="Mental Score"
      width="200"
      height="200"
      className="my-3 img-fluid"
      style={{ maxHeight: '150px', objectFit: 'contain' }}
    />
    <a href="/assessment" className="btn btn-warning w-100">Start Your Assessment</a>
  </div>
</div>



      {/* WhatsApp & Call Floating Buttons */}
      <a href="https://wa.me/918850165438" className="whatsapp-float" target="_blank" rel="noreferrer">
        <i className="bi bi-whatsapp"></i>
      </a>
      <a href="tel:+918850165438" className="call-float" target="_blank" rel="noreferrer">
        <i className="bi bi-telephone-fill"></i>
      </a>
    </div>

    
    {/* Therapy & Psychological Solutions */}
    <section
  className="p-4 text-center bg-light fade-in-section"
  style={{
    fontFamily: 'Arial, sans-serif',
    lineHeight: '1.6',
  }}
>
  <h5
    className="fw-bold mb-2"
    style={{
      fontSize: '1.1rem',
      textTransform: 'uppercase',
      animationDelay: '0.1s',
    }}
  >
    WE CAN HELP WITH THE FOLLOWING THROUGH OUR
  </h5>

  <p
    className="mb-2"
    style={{
      fontSize: '0.85rem',
      color: '#6c757d',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      fontWeight: '600',
      animationDelay: '0.2s',
    }}
  >
    WELLNESS & THERAPY SOLUTIONS
  </p>

  <div
    className="mb-2"
    style={{
      fontSize: '0.85rem',
      lineHeight: '1.8',
      animationDelay: '0.3s',
    }}
  >
    Fears & Phobias | Anger Management | Stress Management | Child Care | Dream Analysis |<br />
    Sleep | Relationship Counselling | Trauma Management | Depression | Anxiety Management |<br />
    Migraines | Aches & Pains | Eating Disorders | Body Dysmorphia | Panic Disorder
  </div>

  <p
    className="mt-3 mb-1"
    style={{
      fontSize: '0.85rem',
      color: '#6c757d',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      fontWeight: '600',
      animationDelay: '0.4s',
    }}
  >
    AND THROUGH OUR
  </p>

  <p
    className="mb-2"
    style={{
      fontSize: '0.85rem',
      color: '#6c757d',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      fontWeight: '600',
      animationDelay: '0.5s',
    }}
  >
    PSYCHOLOGICAL HEALTH SOLUTIONS
  </p>

  <div
    style={{
      fontSize: '0.85rem',
      lineHeight: '1.8',
      animationDelay: '0.6s',
    }}
  >
    Bipolar Disorder | Schizophrenia | Personality Disorders | Paranoia | Dissociative Disorders |<br />
    Post Traumatic Stress Disorders | Obsessive Compulsive Disorders
  </div>
</section>

{/* About Us */}
<section className="container py-5 fade-in">
  <div className="row align-items-center g-4">
    {/* Image Column */}
    <div className="col-md-5 text-center">
      <img 
        src="/images/home3.png" 
        className="img-fluid rounded shadow-sm" 
        alt="Believe Consultancy" 
        style={{ maxWidth: '450px' }} 
      />
    </div>

    {/* Text Column */}
    <div className="col-md-7">
      <h3 className="fw-bold mb-3">About Us</h3>
      <div className="section-divider"></div>
      <p className="text-muted" style={{ fontSize: '0.95rem', lineHeight: '1.7' }}>
        Believe Consultancy began with a simple mission — to create a space where every voice is heard,
        every struggle is acknowledged, and every person feels supported. What started as a small step
        to bridge the gap between mental health and real-life challenges has grown into a sanctuary of
        healing and growth.
      </p>
      <p className="text-muted" style={{ fontSize: '0.95rem', lineHeight: '1.7' }}>
        We believe that healing begins with trust. That’s why we prioritize open dialogue, compassionate
        care, and breaking the stigma surrounding mental wellness. Our name reflects our mission:
        to help individuals believe in themselves, in recovery, and in brighter days — one step at a time.
      </p>
      <a href="/about" className="btn btn-outline-warning mt-3">Learn More</a>
    </div>
  </div>
</section>



{/* Mid-banner CTA */}
<section
  className="text-white text-center"
  style={{
    backgroundImage: "url('/images/image.png')",
    backgroundSize: "cover",
    backgroundAttachment: "fixed", // key part for scroll-over effect
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    minHeight: "50vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: "4rem 1rem"
  }}
>
  <div
    style={{
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      padding: "2rem",
      borderRadius: "10px",
      maxWidth: "700px",
      margin: "0 auto"
    }}
  >
    <h5 className="fw-bold mb-3" style={{ fontSize: '1.1rem' }}>
      We provide expert services and guidance for personal, professional and emotional growth.
    </h5>
    <a href="/contact" className="btn btn-warning mt-2">
      Connect With Us
    </a>
  </div>
</section>



{/* Services */}
<section className="container py-5 text-center">
  <h4 className="fw-bold text-uppercase">Our Services</h4>
  <div className="section-divider mb-3"></div>
  <p className="text-muted">We offer personalized support in many mental wellness areas...</p>

  <div className="row mt-4">
    {[
      { title: 'Motivational Talks', path: '/motivation' },
      { title: 'Counselling', path: '/counselling' },
      { title: 'Career Guidance', path: '/career' },
      { title: 'Study Abroad', path: '/study-abroad' },
      { title: 'Group Workshops', path: '/workshops' },
      { title: 'Life Coaching', path: '/life-coaching' }
    ].map((service, i) => (
      <div key={i} className="col-md-4 mb-4 fade-in">
        <div className="card h-100 shadow-sm">
          <div className="card-body">
            <h6 className="fw-bold">{service.title}</h6>
            <p className="small text-muted">Brief description of the {service.title} service...</p>
            <a href={service.path} className="btn btn-outline-warning btn-sm">Read More</a>
          </div>
        </div>
      </div>
    ))}
  </div>
  <div className="mt-4">
    <a href="/service" className="btn btn-warning px-4">View More</a>
  </div>
</section>



{/* Why Choose */}
<section
      style={{
        backgroundImage: "url('/images/home4.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        color: "#fff",
        padding: "60px 0"
      }}
    >
      <div className="container text-center">
        <h2 className="fw-bold">WHY CHOOSE BELIEVE CONSULTANCY?</h2>
        <div className="section-divider mb-3"></div>
        <div className="row mt-4">
          {[
            { icon: "bi-person-lines-fill", title: "Experienced Psychologists", desc: "Professional support for diverse concerns." },
            { icon: "bi-shield-lock", title: "Confidential Space", desc: "Your story is safe with us." },
            { icon: "bi-person-heart", title: "Personalized Care", desc: "Tailored sessions just for you." },
            { icon: "bi-flower2", title: "Holistic Well-Being", desc: "Support for mind, body & soul." },
          ].map((item, i) => (
            <div className="col-md-6 col-lg-3 mb-4" key={i}>
              <div className="card h-100 shadow-sm text-dark" style={{ backgroundColor: "rgba(255,255,255,0.95)", borderRadius: "12px" }}>
                <div className="card-body">
                  <i className={`bi ${item.icon} display-6 text-warning mb-3`}></i>
                  <h6 className="fw-bold">{item.title}</h6>
                  <p className="small">{item.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>


{/* Team */}
<section className="container py-5 text-center">
  <h2 className="fw-bold mb-2">MEET OUR TEAM</h2>
  <div className="section-divider mx-auto mb-3"></div>
  <p className="text-muted mb-5">
    Meet Our Team of Passionate Professionals Dedicated to Delivering Innovative Solutions
    and Exceptional Service to Meet Your Needs.
  </p>

  <div className="row g-4">
    <div className="col-md-6 col-lg-3">
      <div className="card shadow-sm h-100">
        <div className="card-body text-start">
          <h6 className="fw-bold">Sachin Pawar</h6>
          <p className="fst-italic small text-muted">Designation & Expertise:</p>
          <ul className="small ps-3 mb-0">
            <li>Consultant, Speaker & Coach</li>
            <li>Consultant for Any kind of Difficulties and Challenges in Life</li>
            <li>Handles Stress, Anxiety and Depression through Buddhist Teachings and Science</li>
            <li>Relationship Counseling Also</li>
          </ul>
        </div>
      </div>
    </div>

    <div className="col-md-6 col-lg-3">
      <div className="card shadow-sm h-100">
        <div className="card-body text-start">
          <h6 className="fw-bold">Snehal Jadhav</h6>
          <p className="fst-italic small text-muted">Designation & Expertise:</p>
          <ul className="small ps-3 mb-0">
            <li>Master in Counselling Psychology</li>
            <li>Advance Diploma in Counselling Psychology</li>
            <li>Asst Professor Psychology</li>
            <li>Dept SNDT Women’s College, Churchgate Mumbai</li>
          </ul>
        </div>
      </div>
    </div>

    <div className="col-md-6 col-lg-3">
      <div className="card shadow-sm h-100">
        <div className="card-body text-start">
          <h6 className="fw-bold">Janvi Thakkar</h6>
          <p className="fst-italic small text-muted">Designation & Expertise:</p>
          <ul className="small ps-3 mb-0">
            <li>B.A. and M.A. in Clinical Psychology</li>
            <li>Art Based Therapy</li>
            <li>Play Therapy</li>
            <li>Bach Flower Therapy</li>
            <li>Animal Assisted Therapy</li>
            <li>Grapho Therapy</li>
          </ul>
        </div>
      </div>
    </div>

    <div className="col-md-6 col-lg-3">
      <div className="card shadow-sm h-100">
        <div className="card-body text-start">
          <h6 className="fw-bold">Naresh Pawar</h6>
          <p className="fst-italic small text-muted">Designation & Expertise:</p>
          <ul className="small ps-3 mb-0">
            <li>Clinical Psychologist & Psychotherapist</li>
            <li>Anxiety and Depression</li>
            <li>Stress and Emotional Management</li>
            <li>Child – Adult Career Counselling</li>
            <li>Relaxation Techniques</li>
            <li>Family Counselling</li>
          </ul>
        </div>
      </div>
    </div>
  </div>

  <a href="/experts" className="btn btn-warning mt-5 px-4">
    View More
  </a>
</section>
{/* */}

{/* FAQs */}
<section
  className="text-white"
  style={{
    backgroundImage: "url('/images/home4.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundAttachment: "fixed",
    minHeight: "60vh",
    display: "flex",
    alignItems: "center",
    backgroundColor: "rgba(212, 174, 78, 0.86)", // light white overlay
      zIndex: 1,
  }}
>

  <div className="container py-5">
    <h2 className="text-center fw-bold">FAQ’S</h2>
    <div className="section-divider mx-auto mb-3"></div>
    <p className="text-center text-white-100 text-dar mb-5 ">
      Frequently Asked Questions (FAQs) provide clear, concise answers to common queries about our services.
    </p>

    <div className="row bg-white text-dark rounded shadow overflow-hidden">
      <div className="col-md-6">
        <img
          src="/images/home5.png"
          alt="FAQ"
          width= "40"
          className="img-fluid w-100 h-100 object-fit-cover"
          style={{ maxWidth: '450px' }} 
        />
      </div>

      <div className="col-md-6 p-4">
        <div className="accordion" id="faqAccordion">
          {[
            {
              q: "1. How can motivational talks help me?",
              a: "They inspire, boost confidence, and provide strategies to overcome challenges, achieve goals, and unlock your full potential in life and work.",
            },
            {
              q: "2. What issues can counselling address?",
              a: "Counselling helps with anxiety, stress, relationship issues, emotional distress, self-confidence, and more.",
            },
            {
              q: "3. Why is career guidance important?",
              a: "It helps align your passion, skills, and opportunities to make informed academic and professional decisions.",
            },
            {
              q: "4. What can a life coach do?",
              a: "A life coach helps clarify goals, builds action plans, improves productivity, and strengthens motivation for personal growth.",
            },
          ].map((item, index) => (
            <div className="accordion-item border-0" key={index}>
              <h2 className="accordion-header" id={`q${index + 1}`}>
                <button
                  className={`accordion-button ${index !== 0 ? "collapsed" : ""}`}
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target={`#a${index + 1}`}
                  aria-expanded={index === 0}
                  aria-controls={`a${index + 1}`}
                >
                  {item.q}
                </button>
              </h2>
              <div
                id={`a${index + 1}`}
                className={`accordion-collapse collapse ${index === 0 ? "show" : ""}`}
                data-bs-parent="#faqAccordion"
              >
                <div className="accordion-body">{item.a}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
</section>



{/* Feedback */}
<ClientFeedback />


{/* Consultation Form */}
<section className="bg-light py-5 text-center">
  <h4 className="fw-bold mb-4">Book Your Consultation Now</h4>
  <div className="container d-flex flex-column flex-md-row align-items-center justify-content-center gap-5">
    <img src="/images/contact-img.jpg" alt="Consult" className="rounded shadow img-fluid rounded" style={{ maxWidth: '400px' }}/>
    <form className="w-100" style={{ maxWidth: '400px' }}>
      <input type="text" placeholder="Name" className="form-control mb-3" required />
      <input type="email" placeholder="Email" className="form-control mb-3" required />
      <input type="text" placeholder="Phone" className="form-control mb-3" required />
      <textarea placeholder="Message" rows="3" className="form-control mb-3"></textarea>
      <button type="submit" className="btn btn-warning w-100">Submit</button>
    </form>
  </div>
</section>


<section className="p-5 text-center bg-light">
  <h5 className="fw-bold mb-2">We Can Help With the Following Through Our</h5>
  <p className="text-uppercase small text-secondary mb-3">Wellness & Therapy Solutions</p>
  <div className="small mb-4">
    <span className="badge bg-warning text-dark m-1">Stress & Phobia</span>
    <span className="badge bg-warning text-dark m-1">Anger Management</span>
    <span className="badge bg-warning text-dark m-1">Sleep Issues</span>
    <span className="badge bg-warning text-dark m-1">Depression</span>
    <span className="badge bg-warning text-dark m-1">OCD</span>
  </div>
  <p className="text-uppercase small text-secondary mb-2">Psychological Health Solutions</p>
  <div className="small">
    <span className="badge bg-secondary text-white m-1">Bipolar Disorder</span>
    <span className="badge bg-secondary text-white m-1">PTSD</span>
    <span className="badge bg-secondary text-white m-1">Schizophrenia</span>
    <span className="badge bg-secondary text-white m-1">Addiction</span>
  </div>
</section>


{/* Footer */}
<footer className="bg-dark text-light py-4 text-center small border-top border-warning">
  <div>© 2025 Believe Consultancy. All rights reserved.</div>
  <div className="mt-2">
    <a href="/privacy" className="text-warning me-3">Privacy Policy</a>
    <a href="/terms" className="text-warning">Terms of Use</a>
  </div>
</footer>


    
 </> );
}

export default Homepage;
