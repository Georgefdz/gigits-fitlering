// BooksMobile.jsx
import { useState, useEffect } from "react";
import Header from "./Components/Header";
import Airtable from "airtable";
import Drawer from "./Components/Drawer2.jsx";
import Accordion2 from "./Components/Accordion2.jsx";
import TopPicks from "./Components/TopPicks.jsx";
import { useWindowSize } from "@uidotdev/usehooks";
import Modal from "./Components/Modal.jsx";
import FilterComponent from "./Components/FilterComponent.jsx";
import styles from "./booksmobile.module.css";
import Buk from "./Components/Buk.jsx";

function BooksMobile() {
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [topPicks, setTopPicks] = useState([]);
  const [filters, setFilters] = useState({
    skill: [],
    concept: [],
    type: [],
  });
  const [uniqueSkills, setUniqueSkills] = useState([]);
  const [uniqueConcepts, setUniqueConcepts] = useState([]);
  const [uniqueTypes, setUniqueTypes] = useState([]);
  const [showTopPicks, setShowTopPicks] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null); // New state

  const { width } = useWindowSize();

  const API_KEY = import.meta.env.VITE_API_KEY;

  useEffect(() => {
    const base = new Airtable({ apiKey: API_KEY }).base("appz3L59vDo6XArUw");

    base("Books")
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
              concept: fields["Key Concepts"] || [],
              type: fields.Type || [],
              recoImg: fields.Portadas?.[0]?.url || null, // Book cover image
              author: fields.Author || "unknown",
              oneLiner: fields["One-Liner"] || "",
              link: fields["Link to Reco"] || "",
              topScore: fields["Top"] || 0,
            };
          });

          setRecords(formattedRecords);
          setFilteredRecords(formattedRecords);

          const topBooks = formattedRecords
            .filter((record) => record.topScore && !isNaN(record.topScore))
            .sort((a, b) => b.topScore - a.topScore)
            .slice(0, 10);

          setTopPicks(topBooks);

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
        matchesArray(record.type, filters.type)
      );
    });

    setFilteredRecords(filtered);
  }, [filters, records]);

  const customStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: "transparent",
      border: "2px solid #76b39d",
      borderRadius: "12px",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? "rgb(6, 144, 103)" : "transparent", // Transparent background
      color: state.isSelected ? "rgb(6, 144, 103)" : "white", // Change color on selection
      ":hover": {
        backgroundColor: "#76b39d", // Hover effect
      },
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: "#76b39d",
      borderRadius: "4px",
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "transparent", // Background color for the dropdown menu
      border: "2px solid #76b39d", // Border for the dropdown menu
    }),
  };

  const closeDrawer = () => {
    setClicked(true);
  };

  useEffect(() => {
    return () => {
      setClicked(false);
    };
  }, [closeDrawer]);

  // Function to suggest a random book
  const suggestRandomBook = () => {
    if (filteredRecords.length === 0) return;
    const randomIndex = Math.floor(Math.random() * filteredRecords.length);
    const randomBook = filteredRecords[randomIndex];
    console.log("Random Book selected:", randomBook);

    setSelectedBook(randomBook);
  };

  return (
    <>
      <Header />
      {width < 768 ? (
        <>
          <div className={styles.bodyContainer}>
            {showTopPicks && (
              <Modal
                title='Top Picks'
                topPicks={() => <TopPicks topList={topPicks} type={"book"} />}
                onClose={() => setShowTopPicks(false)}
              />
            )}
            <Buk
              selectedSkills={filters.skill}
              records={filteredRecords}
              setSelectedBook={setSelectedBook} // Pass the setter
            />
          </div>
          <Drawer
            className='drawer'
            clicked={clicked}
            drawerText={"Swipe to filter your book preferences"}
          >
            <Accordion2
              filters={filters}
              handleFilterChange={handleFilterChange}
              uniqueSkills={uniqueSkills}
              uniqueConcepts={uniqueConcepts}
              uniqueTypes={uniqueTypes} // Include if needed
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
                  suggestRandomBook();
                }}
              >
                Suggest a random book
              </button>
            </div>
          </Drawer>
          {selectedBook && (
            <Modal
              author={selectedBook.author}
              oneLiner={selectedBook.oneLiner}
              cover={selectedBook.recoImg}
              link={selectedBook.link}
              onClose={() => setSelectedBook(null)}
            />
          )}
        </>
      ) : (
        <>
          <div className={styles.bodyContainer}>
            {showTopPicks && (
              <Modal
                title='Top Picks'
                topPicks={() => <TopPicks topList={topPicks} type={"book"} />}
                onClose={() => setShowTopPicks(false)}
              />
            )}
            <div className={styles.filterContainer}>
              <FilterComponent
                filters={filters}
                handleFilterChange={handleFilterChange}
                uniqueSkills={uniqueSkills}
                uniqueConcepts={uniqueConcepts}
                uniqueTypes={uniqueTypes}
                customStyles={customStyles}
                component='Books'
              />
            </div>
            <div className={styles.bookSide}>
              <Buk
                selectedSkills={filters.skill}
                records={filteredRecords}
                setSelectedBook={setSelectedBook} // Pass the setter
              />
            </div>
            <div className={styles.buttonSide}>
              <div className={styles.buttonsContainer}>
                <button
                  className={styles.buttons}
                  onClick={() => {
                    setShowTopPicks(true);
                  }}
                >
                  Top Picks
                </button>
                <button
                  className={styles.buttons}
                  onClick={() => {
                    suggestRandomBook();
                  }}
                >
                  Suggest a random book
                </button>
              </div>
            </div>
          </div>
          {selectedBook && (
            <Modal
              author={selectedBook.author}
              oneLiner={selectedBook.oneLiner}
              cover={selectedBook.recoImg}
              link={selectedBook.link}
              onClose={() => setSelectedBook(null)}
            />
          )}
        </>
      )}
    </>
  );
}

export default BooksMobile;
