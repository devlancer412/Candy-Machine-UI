import React, { useState } from "react";
import { Drawer, IconButton, makeStyles, Theme } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import { Link } from "react-scroll";

const useStyles = makeStyles((theme: Theme) => ({
  paper: {
    backgroundColor: "transparent",
  },
  icon: {
    color: "white",
    position: "absolute",
    top: "10px",
    right: "10px",
  },
  navlinks: {
    display: "flex",
    justifyContent: "center",
    background: "rgba(0, 0, 0, 0.34)",
    boxShadow: "0px 10px 80px rgba(0, 0, 0, 0.09)",
    borderRadius: "56px",
    padding: "10px",
  },
  link: {
    textDecoration: "none",
    color: "white",
    fontSize: "12px",
    margin: theme.spacing(1),
    "&:hover": {
      color: "yellow",
      borderBottom: "1px solid yellow",
      cursor: "pointer",
    },
  },
}));

const DrawerComponent = () => {
  const classes = useStyles();
  const [openDrawer, setOpenDrawer] = useState(false);
  return (
    <>
      <Drawer
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        anchor={"top"}
        classes={{ paper: classes.paper }}
      >
        <div className={classes.navlinks}>
          <Link
            activeClass="active"
            to="home"
            spy={true}
            smooth={true}
            offset={-70}
            duration={500}
            className={classes.link}
          >
            Home
          </Link>

          <Link
            activeClass="active"
            to="about"
            spy={true}
            smooth={true}
            offset={-70}
            duration={500}
            className={classes.link}
          >
            About us
          </Link>

          <Link
            activeClass="active"
            to="roadmap"
            spy={true}
            smooth={true}
            offset={-70}
            duration={500}
            className={classes.link}
          >
            Roadmap
          </Link>

          <Link
            activeClass="active"
            to="faq"
            spy={true}
            smooth={true}
            offset={-70}
            duration={500}
            className={classes.link}
          >
            FAQ
          </Link>

          <Link
            activeClass="active"
            to="team"
            spy={true}
            smooth={true}
            offset={-70}
            duration={500}
            className={classes.link}
          >
            Team
          </Link>
        </div>
      </Drawer>
      <IconButton
        onClick={() => setOpenDrawer(!openDrawer)}
        className={classes.icon}
      >
        <MenuIcon />
      </IconButton>
    </>
  );
};
export default DrawerComponent;
