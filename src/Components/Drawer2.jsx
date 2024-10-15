// Drawer2.jsx
import React, { useEffect } from "react";
import { Global } from "@emotion/react";
import { styled } from "@mui/material/styles";
import { grey } from "@mui/material/colors";
import Typography from "@mui/material/Typography";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";

const drawerBleeding = 56;

const StyledBox = styled("div")(({ theme }) => ({
  backgroundColor: "var(--main-bg-color);",
  ...theme.applyStyles("dark", {
    backgroundColor: grey[800],
  }),
}));

const Puller = styled("div")(({ theme }) => ({
  width: 30,
  height: 6,
  backgroundColor: grey[300],
  borderRadius: 3,
  position: "absolute",
  top: 8,
  left: "calc(50% - 15px)",
  ...theme.applyStyles("dark", {
    backgroundColor: grey[900],
  }),
}));

function Drawer2({
  children,
  drawerText,
  clicked,
  filterMode,
  setFilterMode,
  allFilterOptions,
  ...props
}) {
  const { window } = props;
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    if (clicked) {
      setOpen(false);
    }
  }, [clicked]);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const container =
    window !== undefined ? () => window().document.body : undefined;

  const handleFilterModeChange = (mode) => {
    setFilterMode(mode);
  };

  return (
    <>
      <Global
        styles={{
          ".MuiDrawer-root > .MuiPaper-root": {
            height: `calc(75% - ${drawerBleeding}px)`,
            overflow: "visible",
          },
          ".MuiDrawer-root": {},
        }}
      />
      <SwipeableDrawer
        container={container}
        anchor='bottom'
        open={open}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
        swipeAreaWidth={drawerBleeding}
        disableSwipeToOpen={false}
        ModalProps={{
          keepMounted: true,
        }}
      >
        {/* Radio Buttons for Filter Mode */}
        <div
          className='filterModeContainer'
          style={{
            display: "flex",
            padding: "5px",
            backgroundColor: "rgb(32, 32, 32)",
            justifyContent: "space-around",
            borderRight: ".5px solid rgb(118, 179, 157)",
            borderLeft: ".5px solid rgb(118, 179, 157)",
          }}
        >
          <label
            style={{
              marginBottom: "8px",
              color: "white",
              backgroundColor: "rgb(32, 32, 32)",
              fontSize: "12px",
            }}
          >
            <input
              type='radio'
              name='filterMode'
              value='all'
              checked={filterMode === "all"}
              onChange={() => handleFilterModeChange("all")}
              style={{ marginRight: "8px" }}
            />
            All Selected Criteria
          </label>
          <label
            style={{
              color: "white",
              backgroundColor: "rgb(32, 32, 32)",
              fontSize: "12px",
            }}
          >
            <input
              type='radio'
              name='filterMode'
              value='any'
              checked={filterMode === "any"}
              onChange={() => handleFilterModeChange("any")}
              style={{ marginRight: "8px" }}
            />
            At Least 1 Selected Criteria
          </label>
        </div>
        <StyledBox
          sx={{
            position: "absolute",
            top: -drawerBleeding,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            visibility: "visible",
            right: 0,
            left: 0,
            borderTop: ".5px solid #76b39d",
            display: "flex",
            justifyContent: "center",
            borderRight: ".5px solid #76b39d",
            borderLeft: ".5px solid #76b39d",
          }}
        >
          <Puller />
          <Typography
            sx={{
              p: 2,
              pt: 3,
              color: "white",
              fontWeight: "bold",
              display: "flex",
            }}
          >
            {drawerText}
          </Typography>
        </StyledBox>
        <StyledBox
          sx={{
            px: 2,
            pb: 4,
            height: "100%",
            overflow: "auto",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            borderLeft: ".5px solid #76b39d",
            borderRight: ".5px solid #76b39d",
          }}
        >
          {children}
        </StyledBox>
      </SwipeableDrawer>
    </>
  );
}

export default Drawer2;
