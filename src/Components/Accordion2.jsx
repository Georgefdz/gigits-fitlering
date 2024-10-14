import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CheckboxGroup from "./CheckboxGroup";

const matchh = ["at least 1 selected criteria", "all selected criteria"];

function Accordion2({
  filters,
  handleFilterChange,
  uniqueSkills,
  uniqueConcepts,
  uniqueTypes,
  uniqueTimes,
}) {
  return (
    <div style={{ paddingTop: "20px" }}>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls='panel1-content'
          id='panel1-header'
          sx={{
            backgroundColor: "#f4f4f4",
            borderRadius: "10px",
          }}
        >
          Skill not taught in School
        </AccordionSummary>
        <AccordionDetails
          sx={{ backgroundColor: "#f4f4f4", marginTop: "-20px" }}
        >
          <CheckboxGroup
            options={uniqueSkills}
            selectedOptions={filters.skill}
            onChange={handleFilterChange}
            name='skill'
          />
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls='panel2-content'
          id='panel2-header'
          sx={{ backgroundColor: "#f4f4f4", borderRadius: "10px" }}
        >
          Key Concept
        </AccordionSummary>
        <AccordionDetails
          sx={{ backgroundColor: "#f4f4f4", marginTop: "-20px" }}
        >
          <CheckboxGroup
            options={uniqueConcepts}
            selectedOptions={filters.concept}
            onChange={handleFilterChange}
            name='concept'
          />
        </AccordionDetails>
      </Accordion>
      {uniqueTimes && (
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls='panel3-content'
            id='panel3-header'
            sx={{ backgroundColor: "#f4f4f4", borderRadius: "10px" }}
          >
            Time to Finish
          </AccordionSummary>
          <AccordionDetails
            sx={{ backgroundColor: "#f4f4f4", marginTop: "-20px" }}
          >
            <CheckboxGroup
              options={uniqueTimes}
              selectedOptions={filters.time}
              onChange={handleFilterChange}
              name='time'
            />
          </AccordionDetails>
        </Accordion>
      )}
      {uniqueTypes && (
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls='panel4-content'
            id='panel4-header'
            sx={{ backgroundColor: "#f4f4f4", borderRadius: "10px" }}
          >
            Type
          </AccordionSummary>
          <AccordionDetails
            sx={{ backgroundColor: "#f4f4f4", marginTop: "-20px" }}
          >
            <CheckboxGroup
              options={uniqueTypes}
              selectedOptions={filters.type}
              onChange={handleFilterChange}
              name='type'
            />
          </AccordionDetails>
        </Accordion>
      )}
    </div>
  );
}

export default Accordion2;
