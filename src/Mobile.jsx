import Header from "./Components/Header";
import { useState, useEffect, useRef } from "react";
import styles from "./mobile.module.css";
import library from "/library.png";
import studio from "/studio.png";
import { Link } from "react-router-dom";

function Mobile() {
  const [libraryHovered, setLibraryHovered] = useState(false);
  const [studioHovered, setStudioHovered] = useState(false);

  const modalLibraryRef = useRef(null);
  const modalStudioRef = useRef(null);

  const active = libraryHovered
    ? `${styles.imgContainer} ${styles.applyOpacity}`
    : styles.imgContainer;

  const what = studioHovered
    ? `${styles.imgContainer} ${styles.applyOpacity}`
    : styles.imgContainer;

  useEffect(() => {
    const handleClickOutsideLibrary = (event) => {
      if (
        modalLibraryRef.current &&
        !modalLibraryRef.current.contains(event.target)
      ) {
        closeLibraryModal();
      }
    };

    document.addEventListener("mousedown", handleClickOutsideLibrary);
    document.addEventListener("touchstart", handleClickOutsideLibrary);

    return () => {
      document.removeEventListener("mousedown", handleClickOutsideLibrary);
      document.addEventListener("touchstart", handleClickOutsideLibrary);
    };
  }, [libraryHovered]);

  useEffect(() => {
    const handleClickOutsideStudio = (event) => {
      if (
        modalStudioRef.current &&
        !modalStudioRef.current.contains(event.target)
      ) {
        closeStudioModal();
      }
    };

    document.addEventListener("mousedown", handleClickOutsideStudio);
    document.addEventListener("touchstart", handleClickOutsideStudio);

    return () => {
      document.removeEventListener("mousedown", handleClickOutsideStudio);
      document.addEventListener("touchstart", handleClickOutsideStudio);
    };
  }, [studioHovered]);

  const closeLibraryModal = () => {
    setLibraryHovered(false);
  };

  const openLibraryModal = () => {
    setLibraryHovered(true);
  };

  const openStudioModal = () => {
    setStudioHovered(true);
  };

  const closeStudioModal = () => {
    setStudioHovered(false);
  };

  return (
    <>
      <Header />
      <div className={styles.container}>
        <h2 className={styles.mainText}>Feeling inspired to learn?</h2>
        <div
          className={what}
          onClick={() => openLibraryModal()}
          ref={modalLibraryRef}
        >
          <img src={library} alt='' />
          {libraryHovered && (
            <Link to='/books'>
              <button>Book</button>
            </Link>
          )}
        </div>
        <div
          className={active}
          onClick={() => openStudioModal()}
          ref={modalStudioRef}
        >
          <img src={studio} alt='' />
          {studioHovered && (
            <Link to='/podcastsmobile'>
              <button>Podcast</button>
            </Link>
          )}
        </div>
        <h2 className={styles.secondText}>
          Let us suggest a <span>book or podcast</span> tailored to your
          preferences
        </h2>
      </div>
    </>
  );
}

export default Mobile;
