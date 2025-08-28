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
import Lifecoaching from './components/life-coaching';
import Softskills from './components/soft-skills';
import Imageconsultant from './components/image-consultant';
import Graphologist from './components/graphologist';
import Reiki from './components/reiki';
import Studyabroad from './components/study-abroad';

import { AuthProvider } from './context/AuthContext';  // ✅ import

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/about" element={<About />} />
          <Route path="/experts" element={<Expert />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/Service" element={<Service />} />
          <Route path="/Counselling" element={<Counselling />}/>
          <Route path="/Career" element={<Career />}/>
          <Route path="/life_coaching" element={<Lifecoaching />}/>
          <Route path="/soft-skills" element={<Softskills />}/>
          <Route path="/image-consultant" element={<Imageconsultant />}/>
          <Route path="/study-abroad" element={<Studyabroad />}/>
          <Route path="/graphologist" element={<Graphologist />}/>
          <Route path="/reiki" element={<Reiki />}/>
          <Route path="/motivation" element={<Motivation />}/>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
