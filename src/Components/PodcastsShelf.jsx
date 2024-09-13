import React from "react";
import pod1 from "/podcast1.png";
import pod2 from "/podcast2.png";
import pod3 from "/podcast3.png";
import pod4 from "/podcast4.png";
import pod5 from "/podcast5.png";
import shelf from "/woodenshelf.png";
import { useNavigate } from "react-router-dom";

const podcasts = [
  { title: "Daisy Jones & the Six" },
  { title: "Black Sheep" },
  { title: "The Sugar Palace" },
  { title: "The Secret" },
  { title: "Tomorrow and Tomorrow" },
];

const pods = [pod1, pod2, pod3, pod4, pod5];

const getRandomImage = () => {
  const randomIndex = Math.floor(Math.random() * pods.length);
  return pods[randomIndex];
};

function PodcastsShelf({
  setIsPodcastHovered,
  isBookHovered,
  isPodcastHovered,
}) {
  const navigate = useNavigate();

  return (
    <div
      className='podcast-container'
      onMouseEnter={() => {
        setIsPodcastHovered(true);
      }}
      onMouseLeave={() => {
        setIsPodcastHovered(false);
      }}
      style={{ opacity: isBookHovered ? 0.2 : 1 }}
    >
      {isPodcastHovered && (
        <button
          className='podcast-button'
          onClick={() => navigate("/podcasts")}
        >
          Listen
        </button>
      )}
      <div className='podcastshelf'>
        {podcasts.map((podcast, index) => (
          <div className='podcast' key={index}>
            <img
              src={getRandomImage()}
              alt={podcast.title}
              className='podcast-image'
            />
            <div className='podcast-title'>{podcast.title}</div>
          </div>
        ))}
      </div>
      <img src={shelf} alt='shelf' className='shelf-image' />
    </div>
  );
}

export default React.memo(PodcastsShelf);
