import { createMuiTheme } from "@material-ui/core/styles";
import LondrinaSolidBlack from "../fonts/Londrina/LondrinaSolid-Black.ttf";

const londrinaSolidBlack = {
  fontFamily: "LondrinaSolidBlack",
  fontStyle: "solid",
  fontDisplay: "swap",
  fontWeight: "900",
  src: `
   local('LondrinaSolidBlack'),
   local('LondrinaSolidBlack-Block'),
   url(${LondrinaSolidBlack}) format('ttf')
 `,
  unicodeRange:
    "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF",
};

const theme = createMuiTheme({
  typography: {
    fontFamily: ["LondrinaSolidBlack"].join(","),
    fontWeight: ["300", "500", "700", "900"].join(","),
  },
  overrides: {
    MuiCssBaseline: {
      "@global": {
        "@font-face": [londrinaSolidBlack],
        boxSizing: "border-box",
      },
    },
  },
});

export default theme;
