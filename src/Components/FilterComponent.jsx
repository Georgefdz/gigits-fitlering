import React from "react";
import Select from "react-select";

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
  />
);

const FilterComponent = ({
  filters,
  handleFilterChange,
  uniqueSkills,
  uniqueConcepts,
  uniqueTypes,
  uniqueTimes,
  uniqueLanguages,
  customStyles,
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
      {
        label: "Type",
        name: "type",
        options: uniqueTypes,
        filterValue: filters.type,
      },
    ],
    Podcasts: [
      {
        label: "Language",
        name: "language",
        options: uniqueLanguages,
        filterValue: filters.language,
      },
    ],
  };

  const renderFilters = (filterData) =>
    filterData.map(({ label, name, options, filterValue }) => (
      <label key={name}>
        {label}:
        {createSelect({
          name,
          options,
          filters: filterValue,
          handleFilterChange,
          customStyles,
        })}
      </label>
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
