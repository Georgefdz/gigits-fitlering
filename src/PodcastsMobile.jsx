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
    type: [],
    time: [],
  });
  const [uniqueSkills, setUniqueSkills] = useState([]);
  const [uniqueConcepts, setUniqueConcepts] = useState([]);
  const [uniqueTypes, setUniqueTypes] = useState([]);
  const [uniqueTimes, setUniqueTimes] = useState([]);
  const [uniqueLanguages, setUniqueLanguages] = useState([]);
  const [showTopPicks, setShowTopPicks] = useState(false);
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [clicked, setClicked] = useState(false);
  const [selectedPodcast, setSelectedPodcast] = useState(null);
  const [filterMode, setFilterMode] = useState("all");

  const API_KEY = import.meta.env.VITE_API_KEY;
  const { width } = useWindowSize();

  // Initial data fetch
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
              skill: fields["Skill not taught in School"]
                ? fields["Skill not taught in School"].map((s) =>
                    s.toLowerCase()
                  )
                : [],
              concept: fields["Key Concept"]
                ? fields["Key Concept"].map((c) => c.toLowerCase())
                : [],
              language: fields.Language
                ? fields.Language.map((l) => l.toLowerCase())
                : [],
              time: fields["Time to Finish"]
                ? fields["Time to Finish"].map((t) => t.toLowerCase())
                : [],
              type: fields.Type ? fields.Type.map((t) => t.toLowerCase()) : [],
              description: fields["Description"] || "",
              spotifyUrl: fields["Link to Reco"] || "",
              topScore: fields["Top"] || 0,
            };
          });

          setRecords(formattedRecords);
          setFilteredRecords(formattedRecords);

          const topPodcasts = formattedRecords
            .filter((record) => record.topScore && !isNaN(record.topScore))
            .sort((a, b) => b.topScore - a.topScore)
            .slice(0, 10);

          setTopPicks(topPodcasts);

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

          // After setting unique values, set initial filters if in "all" mode
          if (filterMode === "all") {
            setFilters({
              skill: extractUniqueValues(formattedRecords, "skill"),
              concept: extractUniqueValues(formattedRecords, "concept"),
              language: extractUniqueValues(formattedRecords, "language"),
              type: extractUniqueValues(formattedRecords, "type"),
              time: [], // Start with empty time array
            });
            setSelectedTimes([]); // Start with no times selected
          }

          fetchNextPage();
        },
        (err) => {
          if (err) {
            console.error("Error fetching Airtable records:", err);
          }
        }
      );
  }, [filterMode]);

  // Handle filter mode changes
  useEffect(() => {
    if (filterMode === "all") {
      setFilters({
        skill: [...uniqueSkills],
        concept: [...uniqueConcepts],
        language: [...uniqueLanguages],
        type: [...uniqueTypes],
        time: [], // Start with empty time array
      });
      setSelectedTimes([]); // Start with no times selected
    } else if (filterMode === "any") {
      setFilters({
        skill: [],
        concept: [],
        language: [],
        type: [],
        time: [],
      });
      setSelectedTimes([]);
    }
  }, [
    filterMode,
    uniqueSkills,
    uniqueConcepts,
    uniqueLanguages,
    uniqueTypes,
    uniqueTimes,
  ]);

  const handleFilterChange = (selectedOptions, { name }) => {
    let selectedValues = [];
    if (Array.isArray(selectedOptions)) {
      if (
        selectedOptions.length > 0 &&
        typeof selectedOptions[0] === "string"
      ) {
        selectedValues = selectedOptions.map((opt) => opt.toLowerCase());
      } else if (selectedOptions.length > 0 && selectedOptions[0].value) {
        selectedValues = selectedOptions.map((option) =>
          option.value.toLowerCase()
        );
      }
    }

    setFilters((prevFilters) => {
      const newFilters = {
        ...prevFilters,
        [name]: selectedValues,
      };

      // If this is a time filter change, sync it with selectedTimes
      if (name === "time") {
        setSelectedTimes(selectedValues);
      }

      return newFilters;
    });
  };

  // Filtering logic
  useEffect(() => {
    if (filterMode === "all") {
      const allFiltersEmpty = Object.values(filters).every(
        (filterArray) => filterArray.length === 0
      );

      if (allFiltersEmpty) {
        setFilteredRecords([]);
        return;
      }

      const filtered = records.filter((record) => {
        return Object.keys(filters).every((category) => {
          const selected = filters[category];
          if (selected.length === 0) return true;

          // Special handling for time filter
          if (category === "time") {
            return selected.some((time) =>
              record.time.some(
                (recordTime) => recordTime.toLowerCase() === time.toLowerCase()
              )
            );
          }

          return record[category].some((item) =>
            selected.includes(item.toLowerCase())
          );
        });
      });
      setFilteredRecords(filtered);
    } else if (filterMode === "any") {
      const hasAnyFilterSelected = Object.values(filters).some(
        (filterArray) => filterArray.length > 0
      );

      if (!hasAnyFilterSelected) {
        setFilteredRecords([]);
        return;
      }

      const filtered = records.filter((record) => {
        return Object.keys(filters).some((category) => {
          const selected = filters[category];
          if (selected.length === 0) return false;

          if (category === "time") {
            return selected.some((time) =>
              record.time.some(
                (recordTime) => recordTime.toLowerCase() === time.toLowerCase()
              )
            );
          }

          return record[category].some((item) =>
            selected.includes(item.toLowerCase())
          );
        });
      });
      setFilteredRecords(filtered);
    }
  }, [filters, records, filterMode]);

  const handleTimeClick = (timeLabel) => {
    setSelectedTimes((prevSelectedTimes) => {
      const newSelectedTimes = prevSelectedTimes.includes(timeLabel)
        ? prevSelectedTimes.filter((time) => time !== timeLabel)
        : [...prevSelectedTimes, timeLabel];

      // Sync with filters state
      setFilters((prev) => ({
        ...prev,
        time: newSelectedTimes,
      }));

      return newSelectedTimes;
    });
  };

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

  const convertToEmbedUrl = (url) => {
    if (!url) {
      return "";
    }
    const episodeId = url.match(/episode\/([a-zA-Z0-9]+)/)?.[1];
    const embedUrl = episodeId
      ? `https://open.spotify.com/embed/episode/${episodeId}?utm_source=generator`
      : "";
    return embedUrl;
  };

  const suggestRandomPodcast = () => {
    if (filteredRecords.length === 0) return;
    const randomIndex = Math.floor(Math.random() * filteredRecords.length);
    const randomPodcast = filteredRecords[randomIndex];
    const embedUrl = convertToEmbedUrl(randomPodcast.spotifyUrl);
    setSelectedPodcast({ ...randomPodcast, spotifyUrl: embedUrl });
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
                    topPicks={() => (
                      <TopPicks topList={topPicks} type={"podcast"} />
                    )}
                    onClose={() => setShowTopPicks(false)}
                  />
                )}
                <Pods
                  selectedSkills={filters.skill}
                  records={filteredRecords}
                  selectedTimes={selectedTimes}
                  setSelectedPodcast={setSelectedPodcast}
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
                <button
                  className={styles.button}
                  onClick={() => {
                    closeDrawer();
                    suggestRandomPodcast();
                  }}
                >
                  Suggest a random podcast
                </button>
              </div>
            </div>
          </div>
          {selectedPodcast && (
            <Modal
              description={selectedPodcast.description}
              spotifyUrl={selectedPodcast.spotifyUrl}
              time={selectedPodcast.time}
              skills={selectedPodcast.skill}
              concepts={selectedPodcast.concept}
              onClose={() => setSelectedPodcast(null)}
            />
          )}
        </>
      ) : (
        <>
          <div className={styles.bodyContainer}>
            <div className={styles.background}>
              <div className={styles.podContainer}>
                {showTopPicks && (
                  <Modal
                    title='Top Picks'
                    topPicks={() => (
                      <TopPicks topList={topPicks} type={"podcast"} />
                    )}
                    onClose={() => setShowTopPicks(false)}
                  />
                )}
                <Pods
                  selectedSkills={filters.skill}
                  records={filteredRecords}
                  selectedTimes={selectedTimes}
                  setSelectedPodcast={setSelectedPodcast}
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
          <Drawer
            className='drawer'
            clicked={clicked}
            drawerText={"Swipe to filter your podcast preferences"}
            filterMode={filterMode}
            setFilterMode={setFilterMode}
          >
            <Accordion2
              filters={filters}
              handleFilterChange={handleFilterChange}
              uniqueSkills={uniqueSkills}
              uniqueConcepts={uniqueConcepts}
              uniqueTimes={uniqueTimes}
              uniqueLanguages={uniqueLanguages}
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
              <button
                className={styles.button}
                onClick={() => {
                  closeDrawer();
                  suggestRandomPodcast();
                }}
              >
                Suggest a random podcast
              </button>
            </div>
          </Drawer>
          {selectedPodcast && (
            <Modal
              description={selectedPodcast.description}
              spotifyUrl={selectedPodcast.spotifyUrl}
              time={selectedPodcast.time}
              skills={selectedPodcast.skill}
              concepts={selectedPodcast.concept}
              onClose={() => setSelectedPodcast(null)}
            />
          )}
        </>
      )}
    </>
  );
}

export default PodcastsMobile;
