import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import SpotifyPlayer from "./SpotifyPlayer.jsx";
import PlusCircle from "./PlusCircle.jsx";
import styles from "./modal.module.css";
import { motion } from "framer-motion";
import { ContactEmergency } from "@mui/icons-material";

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
  time,
  skills,
  concepts,
}) {
  const modalRef = useRef(null);

  const TagScroll = ({ time, skills, concepts }) => {
    const containerRef = useRef(null);
    const [containerWidth, setContainerWidth] = React.useState(0);

    useEffect(() => {
      if (containerRef.current) {
        const tagGroupWidth = containerRef.current.scrollWidth;
        setContainerWidth(tagGroupWidth);
      }
    }, []);

    const tags = [...(time ? [time] : []), ...skills, ...concepts];

    return (
      <div className={styles.tagsWrapper}>
        <motion.div
          className={styles.tagsContainer}
          animate={{
            x: [0, -containerWidth / 2],
          }}
          transition={{
            duration: 15,
            ease: "linear",
            repeat: Infinity,
          }}
        >
          <div className={styles.tagGroup} ref={containerRef}>
            {tags.map((tag, index) => (
              <p key={`${tag}-1`}>{tag}</p>
            ))}
          </div>
          <div className={styles.tagGroup}>
            {tags.map((tag, index) => (
              <p key={`${tag}-2`}>{tag}</p>
            ))}
          </div>
        </motion.div>
      </div>
    );
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        if (onClose) {
          onClose();
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
        <div
          className={styles.modalPod}
          ref={modalRef}
          onClick={handleModalClick}
        >
          <SpotifyPlayer url={spotifyUrl} />
          <h3>{description}</h3>

          <TagScroll time={time} skills={skills} concepts={concepts} />
          {/* <motion.div
            animate={{ x: ["20%", "-100%"] }}
            initial={{ x: "0%" }}
            transition={{ ease: "linear", duration: 8, repeat: Infinity }}
            className={styles.tagsContainer}
          >
            <p>{time}</p>
            {skills.map((skill) => (
              <p key={skill}>{skill}</p>
            ))}
            {concepts.map((concept) => (
              <p key={concept}>{concept}</p>
            ))}
          </motion.div> */}

          <div className={styles.bottomSpan}>
            <a
              href='https://gigits.io'
              target='_blank'
              rel='noopener noreferrer'
            >
              <PlusCircle width='25' height='25' />
              <p>gigit</p> <span>your learning time</span>
            </a>
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
          <div className={styles.imageContainer}>
            <img src={cover} alt='' />
          </div>

          <h2>Author: {author}</h2>
          <h3>{oneLiner}</h3>
          <TagScroll time={time} skills={skills} concepts={concepts} />
          {/* <motion.div {...animationConfig} className={styles.tagsContainer}>
            {skills.map((skill) => (
              <p key={skill}>{skill}</p>
            ))}
            {concepts.map((concept) => (
              <p key={concept}>{concept}</p>
            ))}
          </motion.div> */}
          <div className={styles.actionRow}>
            <a href={link} target='_blank' rel='noopener noreferrer'>
              <button>Find book</button>
            </a>
          </div>
          <div className={styles.bottomSpan}>
            <a
              href='https://gigits.io'
              target='_blank'
              rel='noopener noreferrer'
            >
              <PlusCircle width='25' height='25' />
              <p>gigit</p> <span>your learning time</span>
            </a>
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
    document.body
  );
}

export default Modal;
