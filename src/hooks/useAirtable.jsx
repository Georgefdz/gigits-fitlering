import { useState, useEffect, useCallback } from "react";
import Airtable from "airtable";

/**
 * Custom hook to fetch and manage Airtable data with filtering capabilities.
 *
 * @param {Object} config - Configuration object.
 * @param {string} config.tableName - Airtable table name.
 * @param {string} config.baseId - Airtable base ID.
 * @param {string} config.apiKey - Airtable API key.
 * @param {Array<string>} config.filterFields - Fields to be used for filtering.
 * @returns {Object} - Data and handler functions.
 */
const useAirtable = ({
  tableName,
  baseId,
  apiKey,
  filterFields,
  maxRecords = 100,
  view = "Grid view",
}) => {
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [filters, setFilters] = useState(
    filterFields.reduce((acc, field) => ({ ...acc, [field]: [] }), {})
  );
  const [uniqueValues, setUniqueValues] = useState(
    filterFields.reduce((acc, field) => ({ ...acc, [field]: [] }), {})
  );
  const [topPicks, setTopPicks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to extract unique values for a given field
  const extractUniqueValues = useCallback((records, field) => {
    const valueSet = new Set();
    records.forEach((record) => {
      const values = record[field];
      if (Array.isArray(values)) {
        values.forEach((value) => valueSet.add(value.trim().toLowerCase()));
      } else if (typeof values === "string") {
        valueSet.add(values.trim().toLowerCase());
      }
    });
    return Array.from(valueSet).sort();
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(null);
    setRecords([]);
    setFilteredRecords([]);
    setUniqueValues(
      filterFields.reduce((acc, field) => ({ ...acc, [field]: [] }), {})
    );
    setTopPicks([]);

    const base = new Airtable({ apiKey }).base(baseId);

    const fetchData = () => {
      base(tableName)
        .select({
          maxRecords,
          view,
        })
        .eachPage(
          (fetchedRecords, fetchNextPage) => {
            const formattedRecords = fetchedRecords.map((record) => {
              const fields = record.fields || {};
              const formatted = {
                id: record.id,
                name: fields.Name || "",
                description: fields.Description || "",
                recoImg: fields.Reco_Image?.[0]?.url || null,
                author: fields.Author || "unknown",
                oneLiner: fields["One-Liner"] || "",
                spotifyUrl: fields["Link to Reco"] || "",
                topScore: fields["Top"] || 0,
              };
              filterFields.forEach((field) => {
                formatted[field] = fields[field] || [];
              });
              return formatted;
            });

            setRecords((prev) => [...prev, ...formattedRecords]);
            setFilteredRecords((prev) => [...prev, ...formattedRecords]);

            // Extract unique values for each filter field
            setUniqueValues((prevUniqueValues) => {
              const newUniqueValues = { ...prevUniqueValues };
              filterFields.forEach((field) => {
                const newValues = extractUniqueValues(formattedRecords, field);
                newUniqueValues[field] = Array.from(
                  new Set([...prevUniqueValues[field], ...newValues])
                ).sort();
              });

              // Check if uniqueValues have actually changed
              let hasChanged = false;
              filterFields.forEach((field) => {
                const oldValues = prevUniqueValues[field];
                const newVals = newUniqueValues[field];
                if (
                  oldValues.length !== newVals.length ||
                  !oldValues.every((val, idx) => val === newVals[idx])
                ) {
                  hasChanged = true;
                }
              });

              return hasChanged ? newUniqueValues : prevUniqueValues;
            });

            // Handle Top Picks if applicable
            if (tableName === "Podcasts") {
              setTopPicks((prevTopPicks) => {
                const newTopPicks = [...prevTopPicks, ...formattedRecords]
                  .filter(
                    (record) => record.topScore && !isNaN(record.topScore)
                  )
                  .sort((a, b) => b.topScore - a.topScore) // Descending order
                  .slice(0, 10);
                // Check if topPicks have changed
                const hasTopPicksChanged =
                  prevTopPicks.length !== newTopPicks.length ||
                  !prevTopPicks.every(
                    (item, index) => item.id === newTopPicks[index].id
                  );
                return hasTopPicksChanged ? newTopPicks : prevTopPicks;
              });
            }

            fetchNextPage();
          },
          (err) => {
            if (err) {
              console.error(
                `Error fetching Airtable records from ${tableName}:`,
                err
              );
              setError(err);
              setLoading(false);
            } else {
              setLoading(false);
            }
          }
        );
    };

    fetchData();
  }, [
    tableName,
    baseId,
    apiKey,
    filterFields,
    maxRecords,
    view,
    extractUniqueValues,
  ]);

  const handleFilterChange = useCallback((selectedOptions, { name }) => {
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
  }, []);

  // Apply filters
  useEffect(() => {
    const filtered = records.filter((record) => {
      return filterFields.every((field) => {
        const filter = filters[field];
        if (filter.length === 0) return true;
        const recordValues = Array.isArray(record[field])
          ? record[field].map((v) => v.trim().toLowerCase())
          : [record[field].trim().toLowerCase()];
        return recordValues.some((v) => filter.includes(v));
      });
    });
    setFilteredRecords(filtered);
  }, [filters, records, filterFields]);

  return {
    records,
    filteredRecords,
    filters,
    handleFilterChange,
    uniqueValues,
    topPicks,
    loading,
    error,
  };
};

export default useAirtable;
