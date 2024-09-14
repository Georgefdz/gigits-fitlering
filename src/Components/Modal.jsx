import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";
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
  const modalRef = useRef(null);

  // Hook to handle clicks/touches outside the modal
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        if (onClose) {
          onClose(); // Close the modal if clicked outside
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [onClose]);

  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  return ReactDOM.createPortal(
    <div className='modal-container'>
      <div className='modal' ref={modalRef} onClick={handleModalClick}>
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
    </div>,
    document.body // This renders the modal outside of the current DOM hierarchy
  );
}

export default Modal;
