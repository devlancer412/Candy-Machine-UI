import { Paper, useMediaQuery } from "@material-ui/core";
import Countdown from "react-countdown";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      padding: theme.spacing(0),
      "& > *": {
        margin: theme.spacing(0.4),
        width: theme.spacing(6),
        height: theme.spacing(6),
        display: "flex",
        flexDirection: "column",
        alignContent: "center",
        alignItems: "center",
        justifyContent: "center",
        background: "#384457",
        color: "white",
        borderRadius: 5,
        fontSize: 10,
      },
    },
    done: {
      display: "flex",
      margin: 0,
      marginBottom: theme.spacing(0.5),
      height: theme.spacing(3.5),
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
      paddingRight: theme.spacing(5),
      paddingLeft: theme.spacing(5),
      flexDirection: "column",
      alignContent: "center",
      alignItems: "center",
      justifyContent: "center",
      background: "#1B201D",
      color: "#56FB84",
      borderRadius: 5,
      fontSize: 35,
      fontFamily: "Londrina Solid",
      fontStyle: "normal",
      fontWeight: 400,
      lineHeight: "41px",
      letterSpacing: "1px",
      textTransform: "none",
    },
    item: {
      fontWeight: "bold",
      fontSize: 18,
    },
  })
);

interface MintCountdownProps {
  date: Date | undefined;
  style?: React.CSSProperties;
  status?: string;
  onComplete?: () => void;
}

interface MintCountdownRender {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  completed: boolean;
}

export const MintCountdown: React.FC<MintCountdownProps> = ({
  date,
  status,
  style,
  onComplete,
}) => {
  const matchesXS = useMediaQuery("(max-width:750px)");
  const matchesXXS = useMediaQuery("(max-width:450px)");
  const classes = useStyles();
  const renderCountdown = ({
    days,
    hours,
    minutes,
    seconds,
    completed,
  }: MintCountdownRender) => {
    hours += days * 24;
    if (completed) {
      return status ? (
        <span
          className={classes.done}
          style={
            matchesXXS
              ? { fontSize: "24px", padding: "4px 10px" }
              : matchesXS
              ? { fontSize: "24px" }
              : {}
          }
        >
          {status}
        </span>
      ) : null;
    } else {
      return (
        <div className={classes.root} style={style}>
          <Paper elevation={0}>
            <span
              className={classes.item}
              style={matchesXS ? { fontSize: "24px" } : {}}
            >
              {hours < 10 ? `0${hours}` : hours}
            </span>
            <span>hrs</span>
          </Paper>
          <Paper elevation={0} style={matchesXS ? { fontSize: "24px" } : {}}>
            <span className={classes.item}>
              {minutes < 10 ? `0${minutes}` : minutes}
            </span>
            <span>mins</span>
          </Paper>
          <Paper elevation={0} style={matchesXS ? { fontSize: "24px" } : {}}>
            <span className={classes.item}>
              {seconds < 10 ? `0${seconds}` : seconds}
            </span>
            <span>secs</span>
          </Paper>
        </div>
      );
    }
  };

  if (date) {
    return (
      <Countdown
        date={date}
        onComplete={onComplete}
        renderer={renderCountdown}
      />
    );
  } else {
    return null;
  }
};
