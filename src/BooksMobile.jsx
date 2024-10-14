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
  const [selectedBook, setSelectedBook] = useState(null);
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
        skill: fields["Skill not taught in School"] || [],
        concept: fields["Key Concepts"] || [],
        type: fields.Type || [],
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

  const handleFilterChange = (selectedOptions, { name }) => {
    const selectedValues = Array.isArray(selectedOptions)
      ? selectedOptions.map((option) =>
          typeof option === "string" ? option : option.value
        )
      : [];

    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: selectedValues,
    }));
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
        onClose={() => setSelectedBook(null)}
      />
    );

  const renderTopPicksModal = () =>
    showTopPicks && (
      <Modal
        title='Top Picks'
        topPicks={() => <TopPicks topList={topPicks} type={"book"} />}
        onClose={() => setShowTopPicks(false)}
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
          >
            <Accordion2
              filters={filters}
              handleFilterChange={handleFilterChange}
              uniqueSkills={uniqueSkills}
              uniqueConcepts={uniqueConcepts}
              uniqueTypes={uniqueTypes}
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
