import React, { useState, useEffect } from "react";
import { useWindowSize } from "@uidotdev/usehooks";

import Header from "./Components/Header";
import "./App.css";
import BookShelf from "./Components/BookShelf";
import PodcastsShelf from "./Components/PodcastsShelf";

function Home() {
  const [isPodcastHovered, setIsPodcastHovered] = useState(false);
  const [isBookHovered, setIsBookHovered] = useState(false);

  const { width } = useWindowSize();

  useEffect(() => {
    console.log(" Podcast Hovered", isPodcastHovered);
  }, [isPodcastHovered]);

  useEffect(() => {
    console.log(" Book Hovered", isBookHovered);
  }, [isBookHovered]);

  return (
    <>
      <Header />
      <div className='body-container'>
        <h1>Feeling inspired to learn?</h1>
        <h3>Let us suggest something tailored to your preferences:</h3>
        <div className='grid-divider'>
          {width < 768 ? (
            <>
              <PodcastsShelf
                setIsPodcastHovered={setIsPodcastHovered}
                isBookHovered={isBookHovered}
                isPodcastHovered={isPodcastHovered}
              />

              <BookShelf
                setIsBookHovered={setIsBookHovered}
                isPodcastHovered={isPodcastHovered}
                isBookHovered={isBookHovered}
              />
            </>
          ) : (
            // Render multiple shelves if window width is 768px or more
            <>
              <PodcastsShelf
                setIsPodcastHovered={setIsPodcastHovered}
                isBookHovered={isBookHovered}
                isPodcastHovered={isPodcastHovered}
              />
              <BookShelf
                setIsBookHovered={setIsBookHovered}
                isPodcastHovered={isPodcastHovered}
                isBookHovered={isBookHovered}
              />
              <PodcastsShelf
                setIsPodcastHovered={setIsPodcastHovered}
                isBookHovered={isBookHovered}
                isPodcastHovered={isPodcastHovered}
              />
              <BookShelf
                setIsBookHovered={setIsBookHovered}
                isPodcastHovered={isPodcastHovered}
                isBookHovered={isBookHovered}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default Home;
