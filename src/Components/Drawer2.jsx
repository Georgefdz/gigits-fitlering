import * as React from "react";
import { useEffect } from "react";
import PropTypes from "prop-types";
import { Global } from "@emotion/react";
import { styled } from "@mui/material/styles";
import { grey } from "@mui/material/colors";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import Accordion2 from "./Accordion2";

const drawerBleeding = 56;

const Root = styled("div")(({ theme }) => ({
  //   height: "100%",
  backgroundColor: "var(--main-bg-color);",
  ...theme.applyStyles("dark", {
    // backgroundColor: theme.palette.background.default,
    // backgroundColor: "red",
  }),
}));

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

function Drawer2({ children, drawerText, clicked, ...props }) {
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

  // This is used only for the example
  const container =
    window !== undefined ? () => window().document.body : undefined;

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
      {/* <Box sx={{ textAlign: "center", pt: 1 }}>
        <Button onClick={toggleDrawer(true)}>Open</Button>
      </Box> */}
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
            {/* <FilterAltIcon
              sx={{
                fontSize: 28,
                fill: "none",
                stroke: "#76b39d",
                strokeWidth: 2,
              }}
            />{" "}
            Filter */}

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
          }}
        >
          {children}
        </StyledBox>
      </SwipeableDrawer>
    </>
  );
}

export default Drawer2;
