import React from "react";
import {
  FormControl,
  FormControlLabel,
  Checkbox,
  FormGroup,
  Divider,
} from "@mui/material";

function CheckboxGroup({ options, selectedOptions, onChange, name }) {
  const handleSelectAll = (event) => {
    const isChecked = event.target.checked;
    onChange(isChecked ? [...options] : [], { name });
  };

  const handleChange = (event) => {
    const value = event.target.name;
    const isChecked = event.target.checked;

    let newSelectedOptions;
    if (isChecked) {
      newSelectedOptions = [...selectedOptions, value];
    } else {
      newSelectedOptions = selectedOptions.filter((item) => item !== value);
    }

    onChange(newSelectedOptions, { name });
  };

  // Check if all options are selected
  const allSelected = options.length === selectedOptions.length;

  return (
    <FormControl component='fieldset'>
      <FormGroup className='formGroup'>
        {/* Select All option */}
        <FormControlLabel
          control={
            <Checkbox
              checked={allSelected}
              onChange={handleSelectAll}
              indeterminate={selectedOptions.length > 0 && !allSelected}
            />
          }
          label='Select All'
          sx={{
            "& .MuiTypography-root": {
              fontWeight: "bold",
            },
          }}
        />
        <Divider sx={{ my: 1 }} />

        {/* Individual options */}
        {options.map((option) => (
          <FormControlLabel
            key={option}
            control={
              <Checkbox
                checked={selectedOptions.includes(option)}
                onChange={handleChange}
                name={option}
              />
            }
            label={option.charAt(0).toUpperCase() + option.slice(1)}
          />
        ))}
      </FormGroup>
    </FormControl>
  );
}

export default CheckboxGroup;
