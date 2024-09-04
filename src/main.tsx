import ReactDOM from "react-dom/client";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import App from "./App";
import "./index.css";
import "./locales/i18n";

const theme = extendTheme({
  colors: {
    linkling: {
      50: "#E3FCEC",
      100: "#C6F6D5",
      200: "#9AEFBC",
      300: "#6EEFA4",
      400: "#4DEB93",
      500: "#73DA95",
      600: "#38A169",
      700: "#2F855A",
      800: "#276749",
      900: "#22543D",
    },
    customGreen: {
      50: "#73DA95",
      100: "#73DA95",
      200: "#73DA95",
      300: "#73DA95",
      400: "#73DA95",
      500: "#73DA95",
      600: "#73DA95",
      700: "#73DA95",
      800: "#73DA95",
      900: "#73DA95",
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ChakraProvider theme={theme}>
    <App />
  </ChakraProvider>
);
