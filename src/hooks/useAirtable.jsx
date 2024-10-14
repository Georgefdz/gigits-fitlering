// src/hooks/useAirtableData.js

import { useState, useEffect } from "react";
import Airtable from "airtable";

/**
 * Custom hook to fetch and manage Airtable data.
 *
 * @param {string} tableName - The name of the Airtable table to fetch data from.
 * @param {function} formatRecords - Function to format the fetched records.
 * @param {object} initialFilters - Initial filter state.
 * @param {string} baseId - Airtable base ID.
 * @returns {object} - Contains records, filteredRecords, topPicks, filters, setFilters, uniqueFilters, and error.
 */
const useAirtableData = (
  tableName,
  formatRecords,
  initialFilters = {},
  baseId = "appz3L59vDo6XArUw"
) => {
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [topPicks, setTopPicks] = useState([]);
  const [filters, setFilters] = useState(initialFilters);
  const [uniqueFilters, setUniqueFilters] = useState({});
  const [error, setError] = useState(null);

  const API_KEY = import.meta.env.VITE_API_KEY;

  // Fetch data from Airtable
  useEffect(() => {
    const base = new Airtable({ apiKey: API_KEY }).base(baseId);

    base(tableName)
      .select({ maxRecords: 100, view: "Grid view" })
      .eachPage(
        (recordsPage, fetchNextPage) => {
          const formatted = formatRecords(recordsPage);
          setRecords(formatted);
          setFilteredRecords(formatted);

          // Determine Top Picks
          const top = formatted
            .filter((rec) => rec.topScore && !isNaN(rec.topScore))
            .sort((a, b) => b.topScore - a.topScore)
            .slice(0, 10);
          setTopPicks(top);

          // Extract unique filter values
          const fields = Object.keys(initialFilters);
          const unique = {};
          fields.forEach((field) => {
            unique[field] = extractUniqueValues(formatted, field);
          });
          setUniqueFilters(unique);

          fetchNextPage();
        },
        (err) => {
          if (err) {
            console.error(
              `Error fetching Airtable records for ${tableName}:`,
              err
            );
            setError(err);
            return;
          }
        }
      );
  }, [tableName, formatRecords, API_KEY, baseId, initialFilters]);

  // Helper function to extract unique values for filters
  const extractUniqueValues = (records, field) => {
    const set = new Set();
    records.forEach((rec) => {
      const values = rec[field];
      if (Array.isArray(values)) {
        values.forEach((val) => set.add(val.trim().toLowerCase()));
      }
    });
    return Array.from(set).sort();
  };

  // Handle filter changes
  const handleFilterChange = (selectedOptions, { name }) => {
    let selectedValues = [];
    if (Array.isArray(selectedOptions)) {
      if (
        selectedOptions.length > 0 &&
        typeof selectedOptions[0] === "string"
      ) {
        // From mobile (CheckboxGroup)
        selectedValues = selectedOptions;
      } else {
        // From desktop (React Select)
        selectedValues = selectedOptions.map((option) => option.value);
      }
    }

    setFilters((prev) => ({
      ...prev,
      [name]: selectedValues,
    }));
  };

  // Apply filters to records
  useEffect(() => {
    const filtered = records.filter((record) => {
      const matchesArray = (array, filter) =>
        filter.length === 0 ||
        array.some((value) => filter.includes(value.trim().toLowerCase()));

      return Object.keys(filters).every((field) =>
        matchesArray(record[field], filters[field])
      );
    });

    setFilteredRecords(filtered);
  }, [filters, records]);

  return {
    records,
    filteredRecords,
    topPicks,
    filters,
    setFilters,
    uniqueFilters,
    handleFilterChange,
    error,
  };
};

export default useAirtableData;
