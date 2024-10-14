import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Mobile from "./Mobile.jsx";
import "./App.css";
import PodcastsMobile from "./PodcastsMobile.jsx";
import BooksMobile from "./BooksMobile.jsx";

const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<Mobile />} />
          <Route path='/podcastsmobile' element={<PodcastsMobile />} />
          <Route path='/booksmobile' element={<BooksMobile />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
