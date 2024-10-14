import { useState } from "react";
import mic from "/mic2.png";
import woodenshelf from "/woodenshelfV2.png";
import Arrow from "/arrowRight.png";
import styles from "./pods.module.css";
import { useWindowSize } from "@uidotdev/usehooks";

function Pods({ selectedSkills, records, selectedTimes, setSelectedPodcast }) {
  const [currentIndices, setCurrentIndices] = useState({});
  const { width } = useWindowSize();

  let numberDisplayed;

  if (width > 768) {
    numberDisplayed = 6;
  } else {
    numberDisplayed = 4;
  }

  const handleArrowClick = (skill, totalCount, numberDisplayed, direction) => {
    setCurrentIndices((prev) => {
      const currentIndex = prev[skill] || 0;
      let newIndex;

      if (direction === "next") {
        newIndex =
          currentIndex + numberDisplayed < totalCount
            ? currentIndex + numberDisplayed
            : currentIndex;
      } else if (direction === "prev") {
        newIndex =
          currentIndex - numberDisplayed >= 0
            ? currentIndex - numberDisplayed
            : 0;
      }

      return { ...prev, [skill]: newIndex };
    });
  };

  const handlePodcastClick = (podcast) => {
    const spotifyUrl = convertToEmbedUrl(podcast.spotifyUrl);
    setSelectedPodcast({ ...podcast, spotifyUrl });
  };

  const convertToEmbedUrl = (url) => {
    if (!url) {
      console.log("No URL provided");
      return "";
    }

    const episodeId = url.match(/episode\/([a-zA-Z0-9]+)/)?.[1];
    // console.log("Extracted Spotify Episode ID:", episodeId);
    const embedUrl = episodeId
      ? `https://open.spotify.com/embed/episode/${episodeId}?utm_source=generator`
      : "";
    // console.log("Final Embed URL:", embedUrl);
    return embedUrl;
  };

  function getMicStyle(time) {
    const timeToMicStyle = {
      "< 30 mins": styles.micOne,
      "31-45 mins": styles.micTwo,
      "45-60 mins": styles.micThree,
      "1-2 hours": styles.micFour,
      "2-3 hours": styles.micFive,
      "+3 hours": styles.micSix,
      ">3 hours": styles.micSix,
    };
    return timeToMicStyle[time] || styles.micDefault;
  }

  // Determine which skills to display
  const skillsToDisplay =
    selectedSkills.length > 0
      ? selectedSkills
      : Array.from(new Set(records.flatMap((record) => record.skill)));

  return (
    <>
      {skillsToDisplay.map((skill) => {
        const skillRecords = records.filter((record) => {
          const hasSkill = record.skill
            .map((s) => s.toLowerCase())
            .includes(skill.toLowerCase());

          if (!hasSkill) return false;

          if (selectedTimes.length === 0) return true;

          const recordTime = record.time[0];
          return selectedTimes.includes(recordTime);
        });

        if (skillRecords.length === 0) {
          return null;
        }

        const currentIndex = currentIndices[skill] || 0;
        const displayedPodcasts = skillRecords.slice(
          currentIndex,
          currentIndex + numberDisplayed
        );
        const hasMore = skillRecords.length > currentIndex + numberDisplayed;
        const hasPrevious = currentIndex > 0;

        return (
          <div key={skill} className={styles.podReel}>
            <div className={styles.slider}>
              {hasPrevious && (
                <img
                  src={Arrow}
                  alt='Previous podcasts'
                  className={`${styles.arrowIcon} ${styles.arrowIconLeft}`}
                  onClick={() =>
                    handleArrowClick(
                      skill,
                      skillRecords.length,
                      numberDisplayed,
                      "prev"
                    )
                  }
                  style={{ cursor: "pointer" }}
                />
              )}
              {displayedPodcasts.map((podcast) => {
                const time = podcast.time[0];
                const micStyle = getMicStyle(time);
                return (
                  <img
                    key={podcast.id}
                    src={mic}
                    alt=''
                    className={micStyle}
                    onClick={() => handlePodcastClick(podcast)}
                  />
                );
              })}
              {hasMore && (
                <img
                  src={Arrow}
                  alt='More podcasts'
                  className={styles.arrowIcon}
                  onClick={() =>
                    handleArrowClick(
                      skill,
                      skillRecords.length,
                      numberDisplayed,
                      "next"
                    )
                  }
                  style={{ cursor: "pointer" }}
                />
              )}
            </div>
            <div className={styles.woodContainer}>
              <img src={woodenshelf} alt='' />
              <span>{skill.charAt(0).toUpperCase() + skill.slice(1)}</span>
            </div>
          </div>
        );
      })}
    </>
  );
}

export default Pods;
