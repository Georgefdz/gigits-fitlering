import * as React from "react";
import { useEffect } from "react";
import { Global } from "@emotion/react";
import { styled } from "@mui/material/styles";
import { grey } from "@mui/material/colors";
import Typography from "@mui/material/Typography";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";

const drawerBleeding = 56;

const Root = styled("div")(({ theme }) => ({
  backgroundColor: "var(--main-bg-color);",
  ...theme.applyStyles("dark", {}),
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
        <div className='upperCheckboxes'>
          <label>
            <input type='checkbox' name='' id='' />
            At least 1 selected criteria
          </label>
          <label>
            <input type='checkbox' name='' id='' />
            All selected criteria
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
