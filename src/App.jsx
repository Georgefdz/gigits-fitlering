import React, { useState, useEffect } from "react";
import Airtable from "airtable";
import placeholderImage from "./assets/bookCover.png";
import Select from "react-select";

import "./App.css";
import Header from "./Components/Header";

const App = () => {
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [filters, setFilters] = useState({
    format: [],
    language: [],
    concept: [],
    timeToFinish: [],
    type: [],
  });
  const [uniqueFormats, setUniqueFormats] = useState([]);
  const [uniqueLanguages, setUniqueLanguages] = useState([]);
  const [uniqueConcepts, setUniqueConcepts] = useState([]);
  const [uniqueTimesToFinish, setUniqueTimesToFinish] = useState([]);
  const [uniqueTypes, setUniqueTypes] = useState([]);

  const API_KEY = import.meta.env.VITE_API_KEY;

  useEffect(() => {
    // Configure Airtable
    const base = new Airtable({ apiKey: API_KEY }).base("appz3L59vDo6XArUw");

    // Fetch records
    base("Content To-Go")
      .select({
        maxRecords: 100,
        view: "Grid view",
      })
      .eachPage(
        (records, fetchNextPage) => {
          const formattedRecords = records.map((record) => {
            const fields = record.fields || {};
            console.log("Fields:", fields);
            return {
              id: record.id,
              name: fields.Name || "",
              format:
                fields.Format && fields.Format.length > 0
                  ? fields.Format[0]
                  : "",
              language:
                fields.Language && fields.Language.length > 0
                  ? fields.Language[0]
                  : "",
              concept: fields.Concept || [], // Store all concepts
              timeToFinish: fields["Time to Finish"] || [],
              type: fields.Type || [],
              recoImg:
                fields.Reco_Image && fields.Reco_Image.length > 0
                  ? fields.Reco_Image[0].url
                  : null,
            };
          });

          setRecords(formattedRecords);
          setFilteredRecords(formattedRecords);

          // Extract and normalize unique format values
          const formatSet = new Set();
          formattedRecords.forEach((record) => {
            if (record.format) {
              const normalizedFormat = record.format.trim().toLowerCase();
              formatSet.add(normalizedFormat);
            }
          });
          setUniqueFormats(Array.from(formatSet).sort());

          // Extract and normalize unique language values
          const languageSet = new Set();
          formattedRecords.forEach((record) => {
            if (record.language) {
              const normalizedLanguage = record.language.trim().toLowerCase();
              languageSet.add(normalizedLanguage);
            }
          });
          setUniqueLanguages(Array.from(languageSet).sort());

          // Extract and normalize unique concept values
          const conceptSet = new Set();
          formattedRecords.forEach((record) => {
            if (record.concept && Array.isArray(record.concept)) {
              record.concept.forEach((concept) => {
                const normalizedConcept = concept.trim().toLowerCase();
                conceptSet.add(normalizedConcept);
              });
            }
          });
          setUniqueConcepts(Array.from(conceptSet).sort());

          // Extract and normalize unique time to finish values
          const timeToFinishSet = new Set();
          formattedRecords.forEach((record) => {
            if (Array.isArray(record.timeToFinish)) {
              record.timeToFinish.forEach((time) => {
                const normalizedTime = time.trim().toLowerCase();
                timeToFinishSet.add(normalizedTime);
              });
            }
          });
          setUniqueTimesToFinish(Array.from(timeToFinishSet).sort());

          // Extract and normalize unique type values
          const typeSet = new Set();
          formattedRecords.forEach((record) => {
            if (Array.isArray(record.type)) {
              record.type.forEach((type) => {
                const normalizedType = type.trim().toLowerCase();
                typeSet.add(normalizedType);
              });
            }
          });
          console.log("Unique Types:", Array.from(typeSet));
          setUniqueTypes(Array.from(typeSet).sort());

          fetchNextPage();
        },
        (err) => {
          if (err) {
            console.error("Error fetching Airtable records:", err);
            return;
          }
        }
      );
  }, []);

  const handleFilterChange = (selectedOptions, { name }) => {
    const selectedValues = selectedOptions
      ? selectedOptions.map((option) => option.value)
      : [];

    setFilters({
      ...filters,
      [name]: selectedValues,
    });
  };

  useEffect(() => {
    const filtered = records.filter((record) => {
      const matchesFormat =
        filters.format.length === 0 ||
        filters.format.includes(record.format.trim().toLowerCase());

      const matchesLanguage =
        filters.language.length === 0 ||
        filters.language.includes(record.language.trim().toLowerCase());

      const matchesConcept =
        filters.concept.length === 0 ||
        (Array.isArray(record.concept)
          ? record.concept
              .map((c) => c.trim().toLowerCase())
              .some((c) => filters.concept.includes(c))
          : filters.concept.includes(record.concept.trim().toLowerCase()));

      const matchesTimeToFinish =
        filters.timeToFinish.length === 0 ||
        (Array.isArray(record.timeToFinish)
          ? record.timeToFinish
              .map((time) => time.trim().toLowerCase())
              .some((time) => filters.timeToFinish.includes(time))
          : filters.timeToFinish.includes(
              record.timeToFinish.trim().toLowerCase()
            ));

      const matchesType =
        filters.type.length === 0 ||
        (Array.isArray(record.type)
          ? record.type
              .map((type) => type.trim().toLowerCase())
              .some((type) => filters.type.includes(type))
          : filters.type.includes(record.type.trim().toLowerCase()));

      return (
        matchesFormat &&
        matchesLanguage &&
        matchesConcept &&
        matchesTimeToFinish &&
        matchesType
      );
    });

    setFilteredRecords(filtered);
  }, [filters, records]);

  // Custom styles for react-select
  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      color: state.isSelected ? "white" : "black",
      backgroundColor: state.isSelected ? "#007BFF" : "white",
      ":hover": {
        backgroundColor: "#007BFF",
        color: "white",
      },
    }),
    control: (provided) => ({
      ...provided,
      backgroundColor: "#202020",
      borderColor: "#007BFF",
      color: "white",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "white",
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "#202020",
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: "#007BFF",
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: "white",
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: "white",
      ":hover": {
        backgroundColor: "#ff1744",
        color: "white",
      },
    }),
  };

  return (
    <>
      <Header />
      <div className='body-container'>
        <h1>gigits recommendations</h1>

        <div className='filter-container'>
          <label>
            Format:
            <Select
              name='format'
              options={uniqueFormats.map((format) => ({
                value: format,
                label: format.charAt(0).toUpperCase() + format.slice(1),
              }))}
              onChange={handleFilterChange}
              isMulti
              value={filters.format.map((format) => ({
                value: format,
                label: format.charAt(0).toUpperCase() + format.slice(1),
              }))}
              styles={customStyles}
              className='react-select-container'
              classNamePrefix='react-select'
            />
          </label>
          <label>
            Language:
            <Select
              name='language'
              options={uniqueLanguages.map((language) => ({
                value: language,
                label: language.charAt(0).toUpperCase() + language.slice(1),
              }))}
              onChange={handleFilterChange}
              isMulti
              value={filters.language.map((language) => ({
                value: language,
                label: language.charAt(0).toUpperCase() + language.slice(1),
              }))}
              styles={customStyles}
              className='react-select-container'
              classNamePrefix='react-select'
            />
          </label>
          <label>
            Concept:
            <Select
              name='concept'
              options={uniqueConcepts.map((concept) => ({
                value: concept,
                label: concept.charAt(0).toUpperCase() + concept.slice(1),
              }))}
              onChange={handleFilterChange}
              isMulti
              value={filters.concept.map((concept) => ({
                value: concept,
                label: concept.charAt(0).toUpperCase() + concept.slice(1),
              }))}
              styles={customStyles}
              className='react-select-container'
              classNamePrefix='react-select'
            />
          </label>
          <label>
            Time to Finish:
            <Select
              name='timeToFinish'
              options={uniqueTimesToFinish.map((time) => ({
                value: time,
                label: time.charAt(0).toUpperCase() + time.slice(1),
              }))}
              onChange={handleFilterChange}
              isMulti
              value={filters.timeToFinish.map((time) => ({
                value: time,
                label: time.charAt(0).toUpperCase() + time.slice(1),
              }))}
              styles={customStyles}
              className='react-select-container'
              classNamePrefix='react-select'
            />
          </label>
          <label>
            Type:
            <Select
              name='type'
              options={uniqueTypes.map((type) => ({
                value: type,
                label: type.charAt(0).toUpperCase() + type.slice(1),
              }))}
              onChange={handleFilterChange}
              isMulti
              value={filters.type.map((type) => ({
                value: type,
                label: type.charAt(0).toUpperCase() + type.slice(1),
              }))}
              styles={customStyles}
              className='react-select-container'
              classNamePrefix='react-select'
            />
          </label>
        </div>

        <ul className='item-container'>
          {filteredRecords.map((record) => (
            <div key={record.id} className='item'>
              <li className='list-item'>
                <img
                  src={record.recoImg || placeholderImage}
                  alt={record.name}
                />
                {record.name}
              </li>
            </div>
          ))}
        </ul>
      </div>
    </>
  );
};

export default App;
