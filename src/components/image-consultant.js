import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Homepage.css';
import './Motivation.css';
import { Link, useLocation } from 'react-router-dom';
import Header from './Header';

function Image_consultant() {
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
     Image Consultant
    </h1>
  </div>
</header>

      {/* Page Content */}
      <div className="container my-5">
        <div className="row">
          <div className="col-md-8">
            <img src="/images/service6.png" alt="Speaker" className="img-fluid rounded mb-4" />
            <h3 className="fw-bold mb-3">Image Consultant</h3>
            <p><b>Image consultants</b> are professionals who specialize in enhancing an individual's personal or professional image. They assess a client's current style, personal branding, and communication skills, then provide tailored advice on wardrobe, grooming, body language, and etiquette. By doing this, image consultants help individuals build a strong personal identity that aligns with their goals, whether it's climbing the career ladder, boosting social presence, or simply improving self-confidence. They work with a diverse clientele, including executives, celebrities, politicians, and anyone looking to make a significant impression in their personal or professional life.</p>
            <p><b>The role of an image consultant </b>extends beyond superficial aesthetics to encompass a holistic approach to personal development. They utilize tools like color analysis to determine which shades complement a client's natural palette, and wardrobe evaluation to ensure attire meets the desired image and lifestyle needs. Training in communication skills, including public speaking and interpersonal interactions, is also often provided, enabling clients to present themselves authentically and effectively in any setting. As a result, clients not only look better but also feel more confident and prepared for various social and professional engagements.</p>
            <p><b>With the rise of digital media</b>, image consultants have become even more essential. They now also advise on digital presence, including social media profiles and online interactions. An optimized digital image can enhance one's visibility and influence in the digital world, opening up new opportunities for career advancement and personal growth. Image consultants stay abreast of current trends and technologies to offer clients cutting-edge advice that keeps them ahead in a rapidly evolving digital landscape. This makes their services invaluable for anyone looking to maintain relevance and competitiveness in both virtual and physical arenas.</p>
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

export default Image_consultant;
