import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import SpotifyPlayer from "./SpotifyPlayer.jsx";
import PlusCircle from "./PlusCircle.jsx";
import styles from "./modal.module.css";

function Modal({
  title,
  author,
  topPicks,
  oneLiner,
  description,
  spotifyUrl,
  cover,
  link,
  onClose,
}) {
  console.log("Modal spotifyUrl:", spotifyUrl);
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
    <div className={styles.modalContainer}>
      {description && (
        <div className={styles.modal} ref={modalRef} onClick={handleModalClick}>
          <SpotifyPlayer url={spotifyUrl} />
          <h3>{description}</h3>
          <div className={styles.bottomSpan}>
            <PlusCircle width='25' height='25' />
            <p>gigit</p> <span>your learning time</span>
          </div>
          {topPicks && (
            <>
              <h2>Top Picks: </h2>
              {topPicks()}
            </>
          )}
        </div>
      )}
      {author && (
        <div
          className={styles.modalBook}
          ref={modalRef}
          onClick={handleModalClick}
        >
          <div className={styles.leftSide}>
            <div className={styles.imageContainer}>
              <img src={cover} alt='' />
            </div>
          </div>
          <div className={styles.rightSide}>
            <a href={link} target='_blank' rel='noopener noreferrer'>
              <button>Find book</button>
            </a>
            <h2>Author: {author}</h2>
            <h3>{oneLiner}</h3>
          </div>
          <div className={styles.bottomSpan}>
            <PlusCircle width='25' height='25' />
            <p>gigit</p> <span>your learning time</span>
          </div>
        </div>
      )}
      {topPicks && (
        <>
          <div
            className={styles.modal}
            ref={modalRef}
            onClick={handleModalClick}
          >
            <h2>Top Picks: </h2>
            {topPicks()}
          </div>
        </>
      )}
    </div>,
    document.body // This renders the modal outside of the current DOM hierarchy
  );
}

export default Modal;
