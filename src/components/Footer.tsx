import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { useMediaQuery } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    appbarClass: {
      background: `transparent`,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      fontSize: "46px",
      lineHeight: "100px",
      fontFamily: "LondrinaSolidBlack",
      fontWeight: 900,
      padding: "0px 40px",
      "&:hover": {
        cursor: "pointer",
      },
    },
    copyright: {
      fontFamily: "Londrina Solid",
      fontStyle: "normal",
      fontWeight: 300,
      fontSize: "15px",
      lineHeight: "26px",
      /* identical to box height, or 173% */

      textAlign: "center",
      letterSpacing: "1px",
      textTransform: "uppercase",

      color: "#FFFFFF",
    },
    navlinks: {
      margin: "0px 90px",
      display: "flex",
      justifyContent: "center",
      position: "relative",
    },
    link: {
      textDecoration: "none",
      color: "white",
      fontSize: "17px",
      background: "rgba(217, 217, 217, 0.45)",
      backdropFilter: "blur(7px)",
      /* Note: backdrop-filter has minimal browser support */

      borderRadius: "130px",
      margin: "5px",
      padding: "10px",
      width: "44px",
      height: "44px",
      boxSizing: "border-box",
      zIndex: 1,
      "&:hover": {
        cursor: "pointer",
      },
    },
    linkshadow: {
      position: "absolute",
      top: "50%",
      left: "50%",
      background: "#FF3232",
      borderRadius: "130px",
      zIndex: 0,
      width: "44px",
      height: "44px",
      transform: "translate(-50%, -50%)",
    },
  })
);

const Footer = () => {
  const classes = useStyles();
  const matchesXS = useMediaQuery("(max-width:750px)");

  const goToHome = () => {
    window.location.href = "/";
  };

  return (
    <div className={classes.root}>
      <AppBar position="relative" className={classes.appbarClass}>
        <Toolbar
          style={
            matchesXS
              ? { flexDirection: "column", padding: "0px" }
              : { padding: "0px" }
          }
        >
          <Typography
            className={classes.title}
            style={matchesXS ? { order: 1 } : {}}
          >
            DOKESI
          </Typography>
          <Typography
            className={classes.copyright}
            style={matchesXS ? { order: 3 } : { flexGrow: 1 }}
            onClick={goToHome}
          >
            Copyright @ 2022 Dokesi
          </Typography>
          <div style={matchesXS ? { order: 2 } : {}}>
            <div
              className={classes.navlinks}
              style={matchesXS ? { margin: "auto" } : {}}
            >
              <a href="#" style={{ position: "relative" }}>
                <div className={classes.linkshadow} />
                <img src="/assets/icon/ship.png" className={classes.link} />
              </a>
              <a href="#" style={{ position: "relative" }}>
                <div className={classes.linkshadow} />
                <img src="/assets/icon/twitter.png" className={classes.link} />
              </a>
              <a href="#" style={{ position: "relative" }}>
                <div className={classes.linkshadow} />
                <img src="/assets/icon/discord.png" className={classes.link} />
              </a>
            </div>
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Footer;
