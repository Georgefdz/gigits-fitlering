import React, { useState } from "react";
import pod1 from "/podcast1.png";
import pod2 from "/podcast2.png";
import pod3 from "/podcast3.png";
import pod4 from "/podcast4.png";
import pod5 from "/podcast5.png";
import Modal from "./Modal.jsx";

const pods = [pod1, pod2, pod3, pod4, pod5];

const getRandomImage = () => {
  const randomIndex = Math.floor(Math.random() * pods.length);
  return pods[randomIndex];
};

function IndividualPodcastShelf({ podcasts }) {
  const [selectedPodcast, setSelectedPodcast] = useState(null);

  const handlePodcastClick = (podcast) => {
    const spotifyUrl = convertToEmbedUrl(podcast.spotifyUrl);
    setSelectedPodcast({ ...podcast, spotifyUrl }); // Set the selected podcast when a podcast is clicked
  };

  const closeModal = () => {
    setSelectedPodcast(null); // Reset the selected podcast to close the modal
  };

  const convertToEmbedUrl = (url) => {
    if (!url) {
      console.log("No URL provided");
      return ""; // Handle undefined or invalid URLs
    }

    const episodeId = url.match(/episode\/([a-zA-Z0-9]+)/)?.[1]; // Extract the episode ID
    console.log("Extracted Spotify Episode ID:", episodeId);
    const embedUrl = episodeId
      ? `https://open.spotify.com/embed/episode/${episodeId}?utm_source=generator`
      : "";
    console.log("Final Embed URL:", embedUrl);
    return embedUrl;
  };

  return (
    <>
      <div className='podcast-container'>
        <div className='podcastshelf2'>
          {podcasts.map((podcast, index) => (
            <div className='podcast2' key={index}>
              <img
                src={getRandomImage()}
                alt={podcast.title}
                className='podcast-image'
                onClick={() => handlePodcastClick(podcast)}
              />
              <div className='podcast-title2'>{podcast.title}</div>
            </div>
          ))}
        </div>
      </div>
      {selectedPodcast && (
        <Modal
          description={selectedPodcast.description}
          spotifyUrl={selectedPodcast.spotifyUrl}
          closeModal={closeModal}
        />
      )}
    </>
  );
}

export default IndividualPodcastShelf;
