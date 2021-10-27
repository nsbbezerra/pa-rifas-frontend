import { theme, extendTheme } from "@chakra-ui/react";

const customtheme = extendTheme({
  ...theme,
  breakpoints: ["30em", "48em", "52em", "62em", "80em"],
  fonts: {
    body: "Roboto Condensed, sans-serif",
    heading: "Roboto, sans-serif",
    mono: "Roboto Condensed, sans-serif",
  },
  fontWeights: {
    ...theme.fontWeights,
    normal: 400,
    medium: 500,
    bold: 700,
    bolder: 900,
  },
  colors: {
    ...theme.colors,
    orange: {
      100: "#ffe5b9",
      200: "#ffd897",
      300: "#ffcb74",
      400: "#febe4f",
      500: "#f9b220",
      600: "#cb9220",
      700: "#a0731e",
      800: "#76551b",
      900: "#4f3916",
    },
    green: {
      100: "#b0cbb8",
      200: "#8ab296",
      300: "#649975",
      400: "#3c8055",
      500: "#006837",
      600: "#0b562f",
      700: "#104527",
      800: "#11351f",
      900: "#102517",
    },
  },

  components: {
    Button: {
      baseStyle: { _focus: { boxShadow: "none" }, rounded: "full" },
    },
    Tabs: {
      baseStyle: { tab: { _focus: { boxShadow: "none" } } },
    },
    Menu: {
      baseStyle: {
        list: {
          boxShadow: "lg",
        },
        item: {
          _focus: { bg: "green.400", color: "white" },
          _hover: { bg: "green.500", color: "white" },
          _active: { bg: "green.500", color: "white" },
        },
      },
    },
    CloseButton: {
      baseStyle: { _focus: { boxShadow: "none" } },
    },
    Checkbox: {
      baseStyle: { control: { _focus: { boxShadow: "none" } } },
    },
    Slider: {
      baseStyle: {
        thumb: { _focus: { boxShadow: "none" } },
      },
    },
    Popover: {
      baseStyle: {
        content: { boxShadow: "lg" },
      },
    },
    Modal: {
      baseStyle: {
        dialog: { rounded: "xl" },
      },
    },
  },
});

export default customtheme;
