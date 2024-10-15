import React from "react";
import Select from "react-select";
import CustomMultiValue from "./CustomMultiValue"; // Import the custom MultiValue
import { customStyles } from "../utils/utils";

// Helper function to create Select component
const createSelect = ({
  name,
  options,
  filters,
  handleFilterChange,
  customStyles,
}) => (
  <Select
    name={name}
    options={options.map((option) => ({
      value: option,
      label: option.charAt(0).toUpperCase() + option.slice(1),
    }))}
    onChange={handleFilterChange}
    isMulti
    value={filters.map((filter) => ({
      value: filter,
      label: filter.charAt(0).toUpperCase() + filter.slice(1),
    }))}
    styles={customStyles}
    className='react-select-container'
    classNamePrefix='react-select'
    components={{ MultiValue: CustomMultiValue }} // Use the custom MultiValue
  />
);

const FilterComponent = ({
  filters,
  handleFilterChange,
  uniqueSkills,
  uniqueConcepts,
  uniqueTypes,
  uniqueLanguages,
  component,
}) => {
  const sharedFilters = [
    {
      label: "Skill not taught in school",
      name: "skill",
      options: uniqueSkills,
      filterValue: filters.skill,
    },
    {
      label: "Key Concept",
      name: "concept",
      options: uniqueConcepts,
      filterValue: filters.concept,
    },
  ];

  const componentSpecificFilters = {
    Books: [
      // {
      //   label: "Type",
      //   name: "type",
      //   options: uniqueTypes,
      //   filterValue: filters.type,
      // },
    ],
    Podcasts: [
      {
        label: "Language",
        name: "language",
        options: uniqueLanguages,
        filterValue: filters.language,
      },
      // {
      //   label: "Type",
      //   name: "type",
      //   options: uniqueTypes,
      //   filterValue: filters.type,
      // },
    ],
  };

  const renderFilters = (filterData) =>
    filterData.map(({ label, name, options, filterValue }) => (
      <div key={name} style={{ marginBottom: "16px" }}>
        <label
          style={{ display: "block", marginBottom: "8px", color: "white" }}
        >
          {label}:
        </label>
        {createSelect({
          name,
          options,
          filters: filterValue,
          handleFilterChange,
          customStyles,
        })}
      </div>
    ));

  return (
    <div className='filter-container'>
      {renderFilters(sharedFilters)}
      {componentSpecificFilters[component] &&
        renderFilters(componentSpecificFilters[component])}
    </div>
  );
};

export default FilterComponent;
