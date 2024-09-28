import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home.jsx";
import Books from "./Books.jsx";
import Podcasts from "./Podcasts.jsx";
import Mobile from "./Mobile.jsx";
import "./App.css";
import PodcastsMobile from "./PodcastsMobile.jsx";
import BooksMobile from "./BooksMobile.jsx";

const App = () => {
  return (
    <>
      <Router>
        <Routes>
          {/* <Route path='/' element={<Home />} /> */}
          <Route path='/books' element={<Books />} />
          <Route path='/podcasts' element={<Podcasts />} />
          {/* <Route path='/mobile' element={<Mobile />} /> */}
          <Route path='/' element={<Mobile />} />
          <Route path='/podcastsmobile' element={<PodcastsMobile />} />
          <Route path='/booksmobile' element={<BooksMobile />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
