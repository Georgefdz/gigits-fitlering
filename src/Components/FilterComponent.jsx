// src/Components/FilterComponent.jsx
import React from "react";
import Select from "react-select";

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
  if (component == "Books") {
    return (
      <div className='filter-container'>
        <label>
          Skill not taught in school:
          <Select
            name='skill'
            options={uniqueSkills.map((skill) => ({
              value: skill,
              label: skill.charAt(0).toUpperCase() + skill.slice(1),
            }))}
            onChange={handleFilterChange}
            isMulti
            value={filters.skill.map((skill) => ({
              value: skill,
              label: skill.charAt(0).toUpperCase() + skill.slice(1),
            }))}
            styles={customStyles}
            className='react-select-container'
            classNamePrefix='react-select'
          />
        </label>
        <label>
          Key Concept:
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
        {/* <label>
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
        </label> */}
      </div>
    );
  }
  if (component === "Podcasts") {
    return (
      <div className='filter-container'>
        <label>
          Skill not taught in school:
          <Select
            name='skill'
            options={uniqueSkills.map((skill) => ({
              value: skill,
              label: skill.charAt(0).toUpperCase() + skill.slice(1),
            }))}
            onChange={handleFilterChange}
            isMulti
            value={filters.skill.map((skill) => ({
              value: skill,
              label: skill.charAt(0).toUpperCase() + skill.slice(1),
            }))}
            styles={customStyles}
            className='react-select-container'
            classNamePrefix='react-select'
          />
        </label>
        <label>
          Key Concept:
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
        {/* <label>
          Time to Finish:
          <Select
            name='time'
            options={uniqueTimes.map((time) => ({
              value: time,
              label: time.charAt(0).toUpperCase() + time.slice(1),
            }))}
            onChange={handleFilterChange}
            isMulti
            value={filters.time.map((time) => ({
              value: time,
              label: time.charAt(0).toUpperCase() + time.slice(1),
            }))}
            styles={customStyles}
            className='react-select-container'
            classNamePrefix='react-select'
          />
        </label> */}
        {/* <label>
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
        </label> */}
      </div>
    );
  }
};

export default FilterComponent;
