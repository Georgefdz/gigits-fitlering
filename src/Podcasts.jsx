import React, { useState, useEffect } from "react";
import { useWindowSize } from "@uidotdev/usehooks";
import Airtable from "airtable";
import Header from "./Components/Header.jsx";
import FilterComponent from "./Components/FilterComponent";
import TopPicks from "./Components/TopPicks.jsx";
import IndividualPodcastShelf from "./Components/IndividualPodcastShelf.jsx";
import PlusCircle from "./Components/PlusCircle.jsx";
import Modal from "./Components/Modal.jsx";
import Drawer from "./Components/Drawer2.jsx";
import Accordion2 from "./Components/Accordion2.jsx";

function Podcasts() {
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
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

  const { width } = useWindowSize();

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
            };
          });

          setRecords(formattedRecords);
          setFilteredRecords(formattedRecords);

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

  // const handleFilterChange = (selectedOptions, { name }) => {
  //   const selectedValues = selectedOptions
  //     ? selectedOptions.map((option) => option.value)
  //     : [];

  //   setFilters({
  //     ...filters,
  //     [name]: selectedValues,
  //   });
  // };

  useEffect(() => {
    const filtered = records.filter((record) => {
      const matchesArray = (array, filter) =>
        filter.length === 0 ||
        array.some((value) => filter.includes(value.trim().toLowerCase()));

      return (
        matchesArray(record.skill, filters.skill) &&
        matchesArray(record.concept, filters.concept) &&
        matchesArray(record.time, filters.time) &&
        matchesArray(record.type, filters.type)
      );
    });

    setFilteredRecords(filtered);
  }, [filters, records]);

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

      {width < 768 ? (
        <>
          <div className='body-container'>
            <div className='grid-divider-two'>
              {showTopPicks && <Modal title='Top Picks' topPicks={TopPicks} />}
              {/* Pass filteredRecords to IndividualBookShelf */}
              <IndividualPodcastShelf podcasts={filteredRecords} />
            </div>
            <button
              className='top-picks-button'
              onClick={() => setShowTopPicks((current) => !current)}
            >
              <PlusCircle fill='transparent' style={{ position: "relative" }} />
              <span>Top Picks</span>
            </button>
          </div>
          <Drawer className='drawer'>
            <Accordion2
              filters={filters}
              handleFilterChange={handleFilterChange}
              uniqueSkills={uniqueSkills}
              uniqueConcepts={uniqueConcepts}
              uniqueTypes={uniqueTypes}
              uniqueTimes={uniqueTimes}
            />
          </Drawer>
        </>
      ) : (
        <>
          <div className='body-container'>
            <FilterComponent
              filters={filters}
              handleFilterChange={handleFilterChange}
              uniqueSkills={uniqueSkills}
              uniqueConcepts={uniqueConcepts}
              uniqueTypes={uniqueTypes}
              uniqueTimes={uniqueTimes}
              customStyles={customStyles}
              component='Podcasts'
            />
            <div className='grid-divider-two'>
              {showTopPicks && <Modal title='Top Picks' topPicks={TopPicks} />}
              {/* Pass filteredRecords to IndividualBookShelf */}
              <IndividualPodcastShelf podcasts={filteredRecords} />
            </div>
          </div>
          <button
            className='top-picks-button'
            onClick={() => setShowTopPicks((current) => !current)}
          >
            <PlusCircle fill='transparent' style={{ position: "relative" }} />
            <span>Top Picks</span>
          </button>
        </>
      )}
    </>
  );
}

export default Podcasts;
