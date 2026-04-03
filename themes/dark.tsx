import { WidgetConfig, WidgetThemeComponents } from "@lifi/widget";

export const darkTheme: Partial<WidgetConfig> = {
  theme: {
    palette: {
      primary: { main: "#653ba3" },
      secondary: { main: "#A1A3A7" },
      text: {
        primary: "#FFFFFF",
        secondary: "#A1A3A7",
      },
      background: {
        default: "#120f29",
        paper: "#121312",
      },
      success: {
        main: "#00B460",
      },
      warning: {
        main: "#FF8061",
      },
      error: {
        main: "#FF5F72",
      },
      info: {
        main: "#5FDDFF",
      },
      grey: {
        800: "#120f29",
      },
      common: {
        black: "#24203d",
        white: "#ffffff",
      },
    },
    container: {
      borderRadius: "30px",
      maxHeight: 720,
      overflow:"hidden"
    },
    shape: {
      borderRadius: 10,
    },
    typography: {
      fontFamily: '"DM Sans", Inter, system-ui, Helvetica, Arial, sans-serif',
    },
    components: {
      MuiCard: {
        defaultProps: { variant: "filled" },
      },
    } as unknown as WidgetThemeComponents,
  },
};
