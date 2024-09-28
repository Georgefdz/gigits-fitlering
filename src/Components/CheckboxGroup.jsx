import React from "react";
import {
  FormControl,
  FormControlLabel,
  Checkbox,
  FormGroup,
} from "@mui/material";

function CheckboxGroup({ options, selectedOptions, onChange, name }) {
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

  return (
    <FormControl component='fieldset'>
      <FormGroup className='formGroup'>
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
