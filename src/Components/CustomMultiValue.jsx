import React from "react";
import { components } from "react-select";
import Tooltip from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles"; // For custom styles

const MAX_VISIBLE = 2; // Number of visible tags

const CustomTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  "& .MuiTooltip-tooltip": {
    fontSize: "14px",
  },
});

const CustomMultiValue = (props) => {
  const { index, getValue } = props;
  const max = MAX_VISIBLE;
  const length = getValue().length;

  if (index < max) {
    return <components.MultiValue {...props} />;
  } else if (index === max) {
    const extra = length - max;
    const extraValues = getValue()
      .slice(max)
      .map((val) => val.label)
      .join(", ");

    return (
      <CustomTooltip title={extraValues} arrow>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "0 8px",
            borderRadius: "2px",
            backgroundColor: "#ccc",
            color: "#333",
            fontSize: "12px", // Normal font size for the tag
            margin: "2px",
            cursor: "pointer",
          }}
        >
          +{extra} more
        </div>
      </CustomTooltip>
    );
  } else {
    return null;
  }
};

export default CustomMultiValue;
