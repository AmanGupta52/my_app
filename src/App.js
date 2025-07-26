import './App.css';
import Homepage from './components/Homepage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import About from './components/About';
import Expert from './components/Experts';
import Contact from './components/contact';
import Service from './components/Service';
import 'leaflet/dist/leaflet.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Motivation from './components/motivation';
import Counselling from './components/Counselling';
import Career from './components/Career';
import Life_coaching from './components/life-coaching';
import Soft_skills from './components/soft-skills';
import Image_consultant from './components/image-consultant';
import Graphologist from './components/graphologist';
import Reiki from './components/reiki';
import Study_abroad from './components/study-abroad';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/about" element={<About />} />
        <Route path="/experts" element={<Expert />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/Service" element={<Service />} />
        <Route path="/Counselling" element={<Counselling />}/>
        <Route path="/Career" element={<Career />}/>
        <Route path="/life-coaching" element={<Life_coaching />}/>
        <Route path="/soft-skills" element={<Soft_skills />}/>
        <Route path="/image-consultant" element={<Image_consultant />}/>
        <Route path="/study-abroad" element={<Study_abroad />}/>
        <Route path="/graphologist" element={<Graphologist />}/>
        <Route path="/reiki" element={<Reiki />}/>
        <Route path="/motivation" element={<Motivation />}/>
        {/* add other routes here */}
      </Routes>
    </Router>
  );
}



export default App;
