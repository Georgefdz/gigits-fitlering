import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home.jsx";
import Books from "./Books.jsx";
import Podcasts from "./Podcasts.jsx";
import Mobile from "./Mobile.jsx";
import "./App.css";
import PodcastsMobile from "./PodcastsMobile.jsx";

const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/books' element={<Books />} />
          <Route path='/podcasts' element={<Podcasts />} />
          <Route path='/mobile' element={<Mobile />} />
          <Route path='/podcastsmobile' element={<PodcastsMobile />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
