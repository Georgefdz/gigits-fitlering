import React from "react";
import RadioGroup from "@mui/material/RadioGroup";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import Radio from "@mui/material/Radio";

function RadioGroup2({ options }) {
  return (
    <FormControl>
      <FormLabel id='demo-radio-buttons-group-label'></FormLabel>
      <RadioGroup
        aria-labelledby='demo-radio-buttons-group-label'
        defaultValue={options[0].toLowerCase().split(" ").join("-")}
        name='radio-buttons-group'
      >
        {options.map((option) => {
          let joined = option.toLowerCase().split(" ").join("-");
          return (
            <FormControlLabel
              key={option}
              value={joined}
              control={
                <Radio
                  sx={{
                    color: "#76b39d",
                    "&.Mui-checked": { color: "#76b39d" },
                  }}
                />
              }
              label={option}
              sx={{ color: "black", margin: "0px", padding: "5px 0px" }}
            />
          );
        })}
      </RadioGroup>
    </FormControl>
  );
}

export default RadioGroup2;
