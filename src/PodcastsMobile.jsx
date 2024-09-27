import { useState, useEffect } from "react";
import Header from "./Components/Header";
import styles from "./podcastsmobile.module.css";
import woodenshelf from "/woodenshelfV2.png";
import mic from "/mic2.png";
import Airtable from "airtable";

function PodcastsMobile() {
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [topPicks, setTopPicks] = useState([]);
  const [filters, setFilters] = useState({
    skill: [],
    concept: [],
    time: [],
    type: [],
  });
  const [uniqueSkills, setUniqueSkills] = useState([]);
  const [uniqueConcepts, setUniqueConcepts] = useState([]);
  const [uniqueTypes, setUniqueTypes] = useState([]);
  const [uniqueTimes, setUniqueTimes] = useState([]);
  const [showTopPicks, setShowTopPicks] = useState(false);

  const API_KEY = import.meta.env.VITE_API_KEY;

  useEffect(() => {
    const base = new Airtable({ apiKey: API_KEY }).base("appz3L59vDo6XArUw");

    base("Podcasts")
      .select({
        maxRecords: 100,
        view: "Grid view",
      })
      .eachPage(
        (records, fetchNextPage) => {
          const formattedRecords = records.map((record) => {
            const fields = record.fields || {};
            return {
              id: record.id,
              name: fields.Name || "",
              skill: fields["Skill not taught in School"] || [],
              concept: fields["Key Concept"] || [],
              time: fields["Time to Finish"] || [],
              type: fields.Type || [],
              description: fields["Description"] || "",
              spotifyUrl: fields["Link to Reco"] || "",
              topScore: fields["Top"] || 0,
            };
          });

          setRecords(formattedRecords);
          setFilteredRecords(formattedRecords);

          // Filter the top 10 podcasts based on the "Top" field
          const topPodcasts = formattedRecords
            .filter((record) => record.topScore && !isNaN(record.topScore)) // Ensure valid top scores
            .sort((a, b) => a.topScore - b.topScore) // Sort by "Top" field value
            .slice(0, 10); // Get the top 10 podcasts

          setTopPicks(topPodcasts); // Set top picks for display in the modal

          // Extract unique values for each filter field
          const extractUniqueValues = (records, field) => {
            const valueSet = new Set();
            records.forEach((record) => {
              const values = record[field];
              if (Array.isArray(values)) {
                values.forEach((value) =>
                  valueSet.add(value.trim().toLowerCase())
                );
              }
            });
            return Array.from(valueSet).sort();
          };

          setUniqueSkills(extractUniqueValues(formattedRecords, "skill"));
          setUniqueConcepts(extractUniqueValues(formattedRecords, "concept"));
          setUniqueTypes(extractUniqueValues(formattedRecords, "type"));
          setUniqueTimes(extractUniqueValues(formattedRecords, "time"));

          fetchNextPage();
        },
        (err) => {
          if (err) {
            console.error("Error fetching Airtable records:", err);
          }
        }
      );
  }, []);

  // console.log(uniqueSkills);
  console.log(records);

  return (
    <>
      <Header />
      <div className={styles.background}>
        <div className={styles.podContainer}>
          <Pods />
        </div>
      </div>
      <div className={styles.timeContainer}>
        <h3>Time available:</h3>
        <div className={styles.podcastsGrid}>
          <div className={styles.timeSpan}>
            <img src={mic} alt='' className={styles.micOne} />
            <span>
              {"< 30 "} <br />
              mins
            </span>
          </div>
          <div className={styles.timeSpan}>
            <img src={mic} alt='' className={styles.micTwo} />
            <span>
              {"31-45 "} <br />
              mins
            </span>
          </div>
          <div className={styles.timeSpan}>
            <img src={mic} alt='' className={styles.micThree} />
            <span>
              {"45-60 "} <br />
              mins
            </span>
          </div>
          <div className={styles.timeSpan}>
            <img src={mic} alt='' className={styles.micFour} />
            <span>
              {"1-2 "} <br />
              hours
            </span>
          </div>
          <div className={styles.timeSpan}>
            <img src={mic} alt='' className={styles.micFive} />
            <span>
              {"2-3 "} <br />
              hours
            </span>
          </div>
          <div className={styles.timeSpan}>
            <img src={mic} alt='' className={styles.micSix} />
            <span>
              {">3 "}
              <br />
              hours
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

export default PodcastsMobile;

function Pods() {
  return (
    <>
      <div className={styles.podReel}>
        <div className={styles.slider}>
          <img src={mic} alt='' className={styles.micOne} />
          <img src={mic} alt='' className={styles.micThree} />
          <img src={mic} alt='' className={styles.micFour} />
        </div>
        <div className={styles.woodContainer}>
          <img src={woodenshelf} alt='' />
          <span>Time Management & Habit Building</span>
        </div>
      </div>
    </>
  );
}
