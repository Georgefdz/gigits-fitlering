import { useState, useEffect } from "react";
import Header from "./Components/Header";
import Airtable from "airtable";
import Drawer from "./Components/Drawer2.jsx";
import Accordion2 from "./Components/Accordion2.jsx";
import TopPicks from "./Components/TopPicks.jsx";
import { useWindowSize } from "@uidotdev/usehooks";
import Modal from "./Components/Modal.jsx";
import FilterComponent from "./Components/FilterComponent.jsx";
import mic from "/mic2.png";
import Pods from "./Components/Pods.jsx";
import styles from "./podcastsmobile.module.css";

function PodcastsMobile() {
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [topPicks, setTopPicks] = useState([]);
  const [filters, setFilters] = useState({
    skill: [],
    concept: [],
    language: [],
  });
  const [uniqueSkills, setUniqueSkills] = useState([]);
  const [uniqueConcepts, setUniqueConcepts] = useState([]);
  const [uniqueTypes, setUniqueTypes] = useState([]);
  const [uniqueTimes, setUniqueTimes] = useState([]);
  const [uniqueLanguages, setUniqueLanguages] = useState([]);
  const [showTopPicks, setShowTopPicks] = useState(false);
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [clicked, setClicked] = useState(false);

  const API_KEY = import.meta.env.VITE_API_KEY;

  const { width } = useWindowSize();

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
              language: fields.Language || [],
            };
          });

          setRecords(formattedRecords);
          setFilteredRecords(formattedRecords);

          // Filter the top 10 podcasts based on the "Top" field
          const topPodcasts = formattedRecords
            .filter((record) => record.topScore && !isNaN(record.topScore))
            .sort((a, b) => b.topScore - a.topScore) // Higher score first
            .slice(0, 10);

          setTopPicks(topPodcasts);

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
          setUniqueLanguages(extractUniqueValues(formattedRecords, "language"));

          fetchNextPage();
        },
        (err) => {
          if (err) {
            console.error("Error fetching Airtable records:", err);
          }
        }
      );
  }, []);

  const handleFilterChange = (selectedOptions, { name }) => {
    let selectedValues = [];
    if (Array.isArray(selectedOptions)) {
      if (typeof selectedOptions[0] === "string") {
        // From mobile (CheckboxGroup)
        selectedValues = selectedOptions;
      } else {
        // From desktop (React Select)
        selectedValues = selectedOptions.map((option) => option.value);
      }
    }

    setFilters({
      ...filters,
      [name]: selectedValues,
    });
  };

  useEffect(() => {
    const filtered = records.filter((record) => {
      const matchesArray = (array, filter) =>
        filter.length === 0 ||
        array.some((value) => filter.includes(value.trim().toLowerCase()));

      return (
        matchesArray(record.skill, filters.skill) &&
        matchesArray(record.concept, filters.concept) &&
        matchesArray(record.language, filters.language)
      );
    });

    setFilteredRecords(filtered);
  }, [filters, records]);

  const closeDrawer = () => {
    setClicked(true);
  };

  useEffect(() => {
    return () => {
      setClicked(false);
    };
  }, [closeDrawer]);

  const timeOptions = [
    { label: "< 30 mins", style: styles.micOne, display: "< 30\nmins" },
    { label: "31-45 mins", style: styles.micTwo, display: "31-45\nmins" },
    { label: "45-60 mins", style: styles.micThree, display: "45-60\nmins" },
    { label: "1-2 hours", style: styles.micFour, display: "1-2\nhours" },
    { label: "2-3 hours", style: styles.micFive, display: "2-3\nhours" },
    { label: "+3 hours", style: styles.micSix, display: ">3\nhours" },
  ];

  const handleTimeClick = (timeLabel) => {
    setSelectedTimes((prevSelectedTimes) => {
      if (prevSelectedTimes.includes(timeLabel)) {
        return prevSelectedTimes.filter((time) => time !== timeLabel);
      } else {
        return [...prevSelectedTimes, timeLabel];
      }
    });
  };

  const customStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: "transparent",
      border: "2px solid rgb(6, 144, 103)",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? "rgb(6, 144, 103)" : "transparent", // Transparent background
      color: state.isSelected ? "rgb(6, 144, 103)" : "white", // Change color on selection
      ":hover": {
        backgroundColor: "rgb(6, 144, 103)", // Hover effect
      },
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "transparent", // Background color for the dropdown menu
      border: "2px solid rgb(6, 144, 103)", // Border for the dropdown menu
    }),
  };

  return (
    <>
      <Header />
      {width > 768 ? (
        <>
          <div className={styles.filterComponentsContainer}>
            <FilterComponent
              filters={filters}
              handleFilterChange={handleFilterChange}
              uniqueSkills={uniqueSkills}
              uniqueConcepts={uniqueConcepts}
              uniqueTypes={uniqueTypes}
              uniqueTimes={uniqueTimes}
              customStyles={customStyles}
              uniqueLanguages={uniqueLanguages}
              component='Podcasts'
            />
          </div>
          <div className={styles.bodyContainer}>
            <div className={styles.background}>
              <div className={styles.podContainer}>
                {showTopPicks && (
                  <Modal
                    title='Top Picks'
                    topPicks={() => <TopPicks topList={topPicks} />}
                    onClose={() => setShowTopPicks(false)}
                  />
                )}
                <Pods
                  uniqueSkills={uniqueSkills}
                  records={filteredRecords}
                  selectedTimes={selectedTimes}
                />
              </div>
            </div>
            <div className={styles.timeContainer}>
              <h3>Time available:</h3>
              <div className={styles.podcastsGrid}>
                {timeOptions.map((timeOption) => (
                  <div
                    key={timeOption.label}
                    className={`${styles.timeSpan} ${
                      selectedTimes.includes(timeOption.label)
                        ? styles.selected
                        : ""
                    }`}
                    onClick={() => handleTimeClick(timeOption.label)}
                  >
                    <img src={mic} alt='' className={timeOption.style} />
                    <span>{timeOption.display}</span>
                  </div>
                ))}
              </div>
              <div className={styles.buttonContainer}>
                <button
                  className={styles.button}
                  onClick={() => {
                    closeDrawer();
                    setShowTopPicks(true);
                  }}
                >
                  Top Picks
                </button>
                <button className={styles.button} onClick={() => closeDrawer()}>
                  Suggest a random book
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className={styles.bodyContainer}>
            <div className={styles.background}>
              <div className={styles.podContainer}>
                {showTopPicks && (
                  <Modal
                    title='Top Picks'
                    topPicks={() => <TopPicks topList={topPicks} />}
                    onClose={() => setShowTopPicks(false)}
                  />
                )}
                <Pods
                  uniqueSkills={uniqueSkills}
                  records={filteredRecords}
                  selectedTimes={selectedTimes}
                />
              </div>
            </div>
            <div className={styles.timeContainer}>
              <h3>Time available:</h3>
              <div className={styles.podcastsGrid}>
                {timeOptions.map((timeOption) => (
                  <div
                    key={timeOption.label}
                    className={`${styles.timeSpan} ${
                      selectedTimes.includes(timeOption.label)
                        ? styles.selected
                        : ""
                    }`}
                    onClick={() => handleTimeClick(timeOption.label)}
                  >
                    <img src={mic} alt='' className={timeOption.style} />
                    <span>{timeOption.display}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <Drawer className='drawer' clicked={clicked}>
            <Accordion2
              filters={filters}
              handleFilterChange={handleFilterChange}
              uniqueSkills={uniqueSkills}
              uniqueConcepts={uniqueConcepts}
            />
            <div className={styles.buttonContainer}>
              <button
                className={styles.button}
                onClick={() => {
                  closeDrawer();
                  setShowTopPicks(true);
                }}
              >
                Top Picks
              </button>
              <button className={styles.button} onClick={() => closeDrawer()}>
                Suggest a random book
              </button>
            </div>
          </Drawer>
        </>
      )}
    </>
  );
}

export default PodcastsMobile;
