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

  // New state for filter mode
  const [filterMode, setFilterMode] = useState("all"); // 'all' or 'any'

  const { width } = useWindowSize();
  const API_KEY = import.meta.env.VITE_API_KEY;

  // Fetch Airtable records and initialize filters
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
          setUniqueSkills(extractUniqueValues(formattedRecords, "skill"));
          setUniqueConcepts(extractUniqueValues(formattedRecords, "concept"));
          setUniqueLanguages(extractUniqueValues(formattedRecords, "language"));
          setUniqueTypes(extractUniqueValues(formattedRecords, "type"));
          fetchNextPage();
        },
        (err) => {
          if (err) console.error("Error fetching Airtable records:", err);
        }
      );
  }, []);

  // Format Airtable records
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

  // Effect to handle filterMode changes
  useEffect(() => {
    if (filterMode === "all") {
      // When "All Selected Criteria" is selected, set all filters to include all options
      setFilters({
        skill: [...uniqueSkills],
        concept: [...uniqueConcepts],
        language: [...uniqueLanguages],
        type: [...uniqueTypes],
      });
    } else if (filterMode === "any") {
      // When "At Least 1 Selected Criteria" is selected, clear all filters
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
        // From mobile (CheckboxGroup)
        selectedValues = selectedOptions.map((opt) => opt.toLowerCase());
      } else if (selectedOptions.length > 0 && selectedOptions[0].value) {
        // From desktop (React Select)
        selectedValues = selectedOptions.map((option) =>
          option.value.toLowerCase()
        );
      }
    }

    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: selectedValues,
    }));
  };

  // Update filteredRecords based on filterMode and filters
  useEffect(() => {
    if (filterMode === "all") {
      // "All Selected Criteria" mode: AND logic across filter categories
      const filtered = records.filter((record) => {
        return Object.keys(filters).every((category) => {
          const selected = filters[category];
          if (selected.length === 0) return true; // No filters in this category

          // Check if the record matches at least one selected option in this category
          return record[category].some((item) =>
            selected.includes(item.toLowerCase())
          );
        });
      });
      setFilteredRecords(filtered);
    } else if (filterMode === "any") {
      // "At Least 1 Selected Criteria" mode: OR logic across all filter categories
      const hasAnyFilterSelected = Object.values(filters).some(
        (filterArray) => filterArray.length > 0
      );

      if (!hasAnyFilterSelected) {
        setFilteredRecords([]); // No filters selected, show nothing
        return;
      }

      const filtered = records.filter((record) => {
        return Object.keys(filters).some((category) => {
          const selected = filters[category];
          if (selected.length === 0) return false; // No filters in this category

          // Check if the record matches at least one selected option in this category
          return record[category].some((item) =>
            selected.includes(item.toLowerCase())
          );
        });
      });
      setFilteredRecords(filtered);
    }
  }, [filters, records, filterMode]);

  const suggestRandomBook = () => {
    const randomBook =
      filteredRecords[Math.floor(Math.random() * filteredRecords.length)];
    setSelectedBook(randomBook);
    // setClicked(false);
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
