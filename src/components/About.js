import './About.css'; // custom styles here
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import Header from './Header';

function About() {
  return (
    <>
        
      {/* Navbar */}
      <Header />

    {/* bg image */}
    <div className="hero-section">
  <div>
    <h1>Welcome to Believe Consultancy</h1>
    <p>Your journey begins here.</p>
  </div>
</div>

<div className="container mt-5">
  <h2>About Us</h2>
  <p>Here is some scrollable content that will scroll over the image.</p>
  <p>Keep scrolling...</p>
  <p>More content...</p>
</div>
    </>

  );
}
    


 export default About;