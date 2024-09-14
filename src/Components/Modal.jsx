import React from "react";
import SpotifyPlayer from "./SpotifyPlayer.jsx";

function Modal({
  title,
  author,
  topPicks,
  oneLiner,
  description,
  spotifyUrl,
  onClose,
}) {
  const handleBackgroundClick = () => {
    if (onClose) {
      onClose();
    }
  };

  const handleModalClick = (e) => {
    e.stopPropagation(); // Prevents the click from propagating to the background
  };

  return (
    <div className='modal-container' onClick={handleBackgroundClick}>
      <div className='modal' onClick={handleModalClick}>
        {description && (
          <>
            <SpotifyPlayer url={spotifyUrl} />
            <h3>{description}</h3>
          </>
        )}
        {author && <h2>Author: {author}</h2>}
        {oneLiner && <h2>{oneLiner}</h2>}
        {topPicks && (
          <>
            <h2>Top Picks: </h2>
            {topPicks()}
          </>
        )}
      </div>
    </div>
  );
}

export default Modal;
