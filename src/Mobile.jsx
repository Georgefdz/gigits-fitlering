import Header from "./Components/Header";
import React from "react";
import styles from "./mobile.module.css";
import library from "/library.png";
import studio from "/studio.png";

function Mobile() {
  const [libraryHovered, setLibraryHovered] = React.useState(false);
  const [studioHovered, setStudioHovered] = React.useState(false);

  const active = libraryHovered
    ? `${styles.imgContainer} ${styles.applyOpacity}`
    : styles.imgContainer;

  const what = studioHovered
    ? `${styles.imgContainer} ${styles.applyOpacity}`
    : styles.imgContainer;

  return (
    <>
      <Header />
      <div className={styles.container}>
        <h2 className={styles.mainText}>Feeling inspired to learn?</h2>
        <div
          className={what}
          onClick={() => setLibraryHovered(!libraryHovered)}
        >
          <img src={library} alt='' />
          {libraryHovered && <button>Book</button>}
        </div>
        <div
          className={active}
          onClick={() => setStudioHovered(!studioHovered)}
        >
          <img src={studio} alt='' />
          {studioHovered && <button>Podcast</button>}
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
