import React from 'react';
import './Experts.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import Header from './Header';



const expert = [
    {
   name: "Sachin Pawar",
   title: "Life Coach, Award Coach & Motivating Coach",
   availability: "Online",
   specialities: ["Anxiety", "Depression", "Stress", "CBT"],
   languages: ["English", "Hindi", "Marathi"],
   time: "Mon to Sat, 11:00 AM - 1:00 PM",
   img: "sachin.png",
   experience: "5+ years"
    },
    {
   name: "Krisshnaa Dama",
   title: "Counsellor/Psychologist",
   availability: "Online",
   specialities: ["Anxiety", "Depression", "Stress", "CBT"],
   languages: ["English", "Hindi", "Marathi"],
   time: "Mon to Sat, 11:00 AM - 1:00 PM",
   img: "Krisshnaa.png",
   experience: "5+ years"
    },
    {
    name: "Mansi Singare",
    title: "Clinical Psychologist",
    img: "Mansi.png",
    availability: "Online", // or "Offline"
    time: "Mon-Fri, 10am-4pm",
    specialities: ["Insomnia Therapy" ,"Mindfulness Therapy"],
    languages: ["English", "Hindi","Marathi"],
    experience: "5+ years"
    },

    {
      name: "Ganesh Mourya  ",
      title: "Clinical Psychologist",
      img: "Ganesh.png",
      availability: "Online", // or "Offline"
      time: "Sat & Sun, 11:00 am - 8:00pm",
      specialities: ["Queer counselling" ,"Mindfulness Therapy"],
      languages: ["English", "Hindi","Marathi"],
      experience: "5+ years"
    },
    {
      name: "Gatha Gokhale ",
      title: "Counsellor/ Psychologist",
      img: "Gatha.png",
      availability: "Online", // or "Offline"
      time: "Mon-sat, 11:00 am - 8:00 pm",
      specialities: ["Psychoeducation","Emotional Well-being"],
      languages: ["English", "Hindi","Marathi"],
      experience: "5+ years"
    },
    {
      name: "Disha Sharma ",
      title: "Counsellor/ Psychologist ",
      img: "Disha.png",
      availability: "Online", // or "Offline"
      time: "Mon-Fri, 10am-4pm",
      specialities: ["Stress reduction"," Humanistic Therapy"],
      languages: ["English", "Hindi","Marathi"],
      experience: "5+ years"
    },
    {
      name: "Rutuja Joshi ",
      title: "Clinical Psychologist",
      img: "Rutuja.png",
      availability: "Online", // or "Offline"
      time: "Mon-Sat, 11:00 am-8:00 pm",
      specialities: ["Life Transitions","Adolescent Counselling"],
      languages: ["English", "Hindi","Marathi"],
      experience: "5+ years"
    },
    {
      name: "Shambhavi Agrawal ",
      title: "Clinical Psychologist",
      img: "Shambhavi.png",
      availability: "Online", // or "Offline"
      time: "Mon-Fri, 10am-4pm",
      specialities: ["Narrative JournalingSomatic Awareness"],
      languages: ["English", "Hindi","Marathi"],
      experience: "5+ years"
    },
    

];

function ExpertCard({ expert }) {
    return (
      <div className="expert-card card shadow-sm m-3 p-3 rounded-4">
        <div className="d-flex">
          <img src={`/images/${expert.img}`} alt={expert.name} className="profile-img me-3" />
          <div>
            <h5 className="fw-bold">{expert.name}</h5>
            <p className="text-muted small mb-1">{expert.title}</p>
            <p className="fw-semibold mb-1">Sessions upto 60 mins</p>
  
            <div className="d-flex flex-wrap align-items-center mb-2">
              <span className="fw-semibold me-1">Expertise:</span>
              {expert.specialities.map((s, i) => (
                <span key={i} className="badge expertise-badge me-1 mb-1">{s}</span>
              ))}
              <span className="badge badge-more">More</span>
            </div>
  
            
            <p className="mb-2"><b>Speaks: </b>{Array.isArray(expert.languages) ? expert.languages.join(', ') : 'N/A'}</p>
          </div>
        </div>
  
        <div className="d-flex justify-content-between my-3">
          <div className={`mode-btn ${expert.availability === 'Online' ? 'active' : ''}`}>Online</div>
          <div className={`mode-btn ${expert.availability !== 'Online' ? 'active' : ''} inperson`}>In-person</div>
        </div>
  
        <div className="row text-start mb-3">
          <div className="col-6">
            <p className="fw-semibold mb-0">Available via:</p>
            <p className="small">Google Meet, Zoom Call</p>
          </div>
          <div className="col-6">
            <p className="fw-semibold mb-0">Available for consultation:</p>
            <p className="small text-danger">{expert.time}</p>
          </div>
        </div>
  
        <button className="btn book-btn w-100">Book</button>
      </div>
    );
  }
  
  

function Experts() {
  return (
    <>
      {/* Navbar */}
      <Header />
    <div className="experts-page px-4" style={{ backgroundColor: '#F8F2DB' }}>
      <section className="text-center py-5">
        <h2>FIND AN <span className="text-warning">LIFE COACH</span> WHO UNDERSTANDS YOUR NEEDS.</h2>
        <p>Find an expert who truly understands your unique needs and delivers personalized solutions to help you achieve your goals effectively.</p>
      </section>

      <section className="experts-list d-flex flex-wrap justify-content-center">
        {expert.map((expert, index) => <ExpertCard key={index} expert={expert} />)}
      </section>

      <section className="why-choose py-5 bg-light text-center">
        <h3 className="mb-4">WHY CHOOSE BELIEVE CONSULTANCY?</h3>
        <div className="d-flex flex-wrap justify-content-center">
          <div className="feature-box m-3 p-3 bg-white shadow-sm rounded">
            <h5>Experienced Psychologists</h5>
          </div>
          <div className="feature-box m-3 p-3 bg-white shadow-sm rounded">
            <h5>Safe, Confidential & Non-Judgmental Space</h5>
          </div>
          <div className="feature-box m-3 p-3 bg-white shadow-sm rounded">
            <h5>Experience a Personalized Approach</h5>
          </div>
          <div className="feature-box m-3 p-3 bg-white shadow-sm rounded">
            <h5>Holistic Mental Well-being</h5>
          </div>
        </div>
      </section>

      <section className="client-feedback py-5 text-center">
        <h3>OUR CLIENT FEEDBACK</h3>
        <div className="d-flex flex-wrap justify-content-center mt-4">
          <div className="feedback-box m-3 p-3 bg-white shadow-sm rounded">
            <strong>Sagun Naik</strong>
            <p className="text-muted small">2 months ago</p>
            <p><em>"Mind-Blowing Guidance"</em></p>
          </div>
          <div className="feedback-box m-3 p-3 bg-white shadow-sm rounded">
            <strong>Prachi Mohite</strong>
            <p className="text-muted small">1 month ago</p>
            <p><em>"Transformative Experience"</em></p>
          </div>
          <div className="feedback-box m-3 p-3 bg-white shadow-sm rounded">
            <strong>Aarav Mehta</strong>
            <p className="text-muted small">8 months ago</p>
            <p><em>"Exceptional Guidance"</em></p>
          </div>
        </div>
      </section>
    </div>

</>

);
}
    


 export default Experts;
