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
    language: [],
    type: [],
  });
  const [uniqueSkills, setUniqueSkills] = useState([]);
  const [uniqueConcepts, setUniqueConcepts] = useState([]);
  const [uniqueLanguages, setUniqueLanguages] = useState([]);
  const [uniqueTypes, setUniqueTypes] = useState([]);
  const [showTopPicks, setShowTopPicks] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [filterMode, setFilterMode] = useState("all");

  const { width } = useWindowSize();
  const API_KEY = import.meta.env.VITE_API_KEY;

  useEffect(() => {
    const base = new Airtable({ apiKey: API_KEY }).base("appz3L59vDo6XArUw");

    base("Books")
      .select({ maxRecords: 100, view: "Grid view" })
      .eachPage(
        (records, fetchNextPage) => {
          const formattedRecords = formatRecords(records);
          setRecords(formattedRecords);
          setFilteredRecords(formattedRecords);
          setTopPicks(getTopPicks(formattedRecords));

          const skills = extractUniqueValues(formattedRecords, "skill");
          const concepts = extractUniqueValues(formattedRecords, "concept");
          const languages = extractUniqueValues(formattedRecords, "language");
          const types = extractUniqueValues(formattedRecords, "type");

          setUniqueSkills(skills);
          setUniqueConcepts(concepts);
          setUniqueLanguages(languages);
          setUniqueTypes(types);

          // Set initial filters for "all" mode
          if (filterMode === "all") {
            setFilters({
              skill: skills,
              concept: concepts,
              language: languages,
              type: types,
            });
          }

          fetchNextPage();
        },
        (err) => {
          if (err) console.error("Error fetching Airtable records:", err);
        }
      );
  }, []);

  const formatRecords = (records) =>
    records.map((record) => {
      const fields = record.fields || {};
      return {
        id: record.id,
        name: fields.Name || "",
        skill: fields["Skill not taught in School"]
          ? fields["Skill not taught in School"].map((s) => s.toLowerCase())
          : [],
        concept: fields["Key Concepts"]
          ? fields["Key Concepts"].map((c) => c.toLowerCase())
          : [],
        language: fields.Language
          ? fields.Language.map((l) => l.toLowerCase())
          : [],
        type: fields.Type ? fields.Type.map((t) => t.toLowerCase()) : [],
        recoImg: fields.Portadas?.[0]?.url || null,
        author: fields.Author || "unknown",
        oneLiner: fields["One-Liner"] || "",
        link: fields["Link to Reco"] || "",
        topScore: fields["Top"] || 0,
      };
    });

  const getTopPicks = (records) =>
    records
      .filter((record) => record.topScore && !isNaN(record.topScore))
      .sort((a, b) => b.topScore - a.topScore)
      .slice(0, 10);

  const extractUniqueValues = (records, field) => {
    const valueSet = new Set();
    records.forEach((record) => {
      const values = record[field];
      if (Array.isArray(values)) {
        values.forEach((value) => valueSet.add(value.trim().toLowerCase()));
      }
    });
    return Array.from(valueSet).sort();
  };

  useEffect(() => {
    if (filterMode === "all") {
      setFilters({
        skill: [...uniqueSkills],
        concept: [...uniqueConcepts],
        language: [...uniqueLanguages],
        type: [...uniqueTypes],
      });
    } else if (filterMode === "any") {
      setFilters({
        skill: [],
        concept: [],
        language: [],
        type: [],
      });
    }
  }, [filterMode, uniqueSkills, uniqueConcepts, uniqueLanguages, uniqueTypes]);

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

      // Check if all filter arrays are empty in the new state
      const allFiltersEmpty = Object.values(newFilters).every(
        (filterArray) => filterArray.length === 0
      );

      // If we're in "all" mode and all filters are empty, return completely empty filters
      if (filterMode === "all" && allFiltersEmpty) {
        return {
          skill: [],
          concept: [],
          language: [],
          type: [],
        };
      }

      return newFilters;
    });
  };

  useEffect(() => {
    if (filterMode === "all") {
      // Check if all filter arrays are empty
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
        // Use AND logic across all categories
        return Object.keys(filters).every((category) => {
          const selected = filters[category];
          if (selected.length === 0) return true; // Skip empty categories

          // AND logic - all selected options in this category must be present
          return selected.every((selectedItem) =>
            record[category].some(
              (item) => item.toLowerCase() === selectedItem.toLowerCase()
            )
          );
        });
      });
      setFilteredRecords(filtered);
    }
  }, [filters, records, filterMode]);

  const suggestRandomBook = () => {
    if (filteredRecords.length === 0) return;
    const randomBook =
      filteredRecords[Math.floor(Math.random() * filteredRecords.length)];
    setSelectedBook(randomBook);
  };

  const closeDrawer = () => setClicked(true);

  const renderSelectedBookModal = () =>
    selectedBook && (
      <Modal
        author={selectedBook.author}
        oneLiner={selectedBook.oneLiner}
        cover={selectedBook.recoImg}
        link={selectedBook.link}
        skills={selectedBook.skill}
        concepts={selectedBook.concept}
        onClose={() => {
          setSelectedBook(null);
          setClicked(false);
        }}
      />
    );

  const renderTopPicksModal = () =>
    showTopPicks && (
      <Modal
        title='Top Picks'
        topPicks={() => <TopPicks topList={topPicks} type={"book"} />}
        onClose={() => {
          setShowTopPicks(false);
          setClicked(false);
        }}
      />
    );

  const renderButtons = () => (
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
  );

  return (
    <>
      <Header />
      {width < 768 ? (
        <>
          <div className={styles.bodyContainer}>
            {renderTopPicksModal()}
            <Buk
              selectedSkills={filters.skill}
              records={filteredRecords}
              setSelectedBook={setSelectedBook}
            />
          </div>
          <Drawer
            className='drawer'
            clicked={clicked}
            drawerText={"Swipe to filter your book preferences"}
            filterMode={filterMode}
            setFilterMode={setFilterMode}
          >
            <Accordion2
              filters={filters}
              handleFilterChange={handleFilterChange}
              uniqueSkills={uniqueSkills}
              uniqueConcepts={uniqueConcepts}
              uniqueTypes={uniqueTypes}
              uniqueLanguages={uniqueLanguages}
            />
            {renderButtons()}
          </Drawer>
          {renderSelectedBookModal()}
        </>
      ) : (
        <>
          <div className={styles.bodyContainer}>
            {renderTopPicksModal()}
            <div className={styles.filterContainer}>
              <FilterComponent
                filters={filters}
                handleFilterChange={handleFilterChange}
                uniqueSkills={uniqueSkills}
                uniqueConcepts={uniqueConcepts}
                uniqueTypes={uniqueTypes}
                uniqueLanguages={uniqueLanguages}
                component='Books'
              />
            </div>
            <div className={styles.bookSide}>
              <Buk
                selectedSkills={filters.skill}
                records={filteredRecords}
                setSelectedBook={setSelectedBook}
              />
            </div>
            <div className={styles.buttonSide}>{renderButtons()}</div>
          </div>
          {renderSelectedBookModal()}
        </>
      )}
    </>
  );
}

export default BooksMobile;
