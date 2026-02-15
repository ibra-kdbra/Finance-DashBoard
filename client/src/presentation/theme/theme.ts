export const tokens = {
  grey: {
    100: "#f0f0f3",
    200: "#e1e2e7",
    300: "#d1d3da",
    400: "#c2c5ce",
    500: "#b3b6c2",
    600: "#8f929b",
    700: "#6b6d74",
    800: "#48494e",
    900: "#242427",
  },
  primary: {
    // electric aquamarine
    100: "#e0fff9",
    200: "#b3fff1",
    300: "#80ffe8",
    400: "#4dffdf",
    500: "#1affd6",
    600: "#15ccab",
    700: "#109980",
    800: "#0b6656",
    900: "#05332b",
  },
  secondary: {
    // vivid gold/yellow
    100: "#fff9e6",
    200: "#fff0b3",
    300: "#ffe680",
    400: "#ffdd4d",
    500: "#ffd41a",
    600: "#cca915",
    700: "#997f10",
    800: "#66550b",
    900: "#332a05",
  },
  tertiary: {
    // neon purple
    500: "#b19fff",
    600: "#8884d8",
  },
  background: {
    light: "#1a1a24",
    main: "#0d0d10",
    glass: "rgba(255, 255, 255, 0.03)",
    glassSelected: "rgba(255, 255, 255, 0.08)",
    glassBorder: "rgba(255, 255, 255, 0.08)",
    neon: "linear-gradient(135deg, #1affd6 0%, #b19fff 100%)",
  },
};

// mui theme settings
export const themeSettings = {
  palette: {
    primary: {
      ...tokens.primary,
      main: tokens.primary[500],
      light: tokens.primary[400],
    },
    secondary: {
      ...tokens.secondary,
      main: tokens.secondary[500],
    },
    tertiary: {
      ...tokens.tertiary,
    },
    grey: {
      ...tokens.grey,
      main: tokens.grey[500],
    },
    background: {
      default: tokens.background.main,
      paper: tokens.background.light,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: tokens.background.main,
          backgroundImage: `
            radial-gradient(circle at 0% 0%, rgba(26, 255, 214, 0.05) 0%, transparent 25%),
            radial-gradient(circle at 100% 100%, rgba(177, 159, 255, 0.05) 0%, transparent 25%),
            radial-gradient(circle at 50% 50%, #1a1a2e 0%, #0d0d10 100%)
          `,
          backgroundAttachment: "fixed",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: tokens.background.glass,
          backdropFilter: "blur(20px)",
          border: `1px solid ${tokens.background.glassBorder}`,
          borderRadius: "1.25rem",
          boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
        },
      },
    },
  },
  typography: {
    fontFamily: ["Inter", "sans-serif"].join(","),
    fontSize: 12,
    h1: {
      fontFamily: ["Inter", "sans-serif"].join(","),
      fontSize: 32,
    },
    h2: {
      fontFamily: ["Inter", "sans-serif"].join(","),
      fontSize: 24,
    },
    h3: {
      fontFamily: ["Inter", "sans-serif"].join(","),
      fontSize: 20,
      fontWeight: 800,
      color: tokens.grey[200],
    },
    h4: {
      fontFamily: ["Inter", "sans-serif"].join(","),
      fontSize: 14,
      fontWeight: 600,
      color: tokens.grey[300],
    },
    h5: {
      fontFamily: ["Inter", "sans-serif"].join(","),
      fontSize: 12,
      fontWeight: 400,
      color: tokens.grey[500],
    },
    h6: {
      fontFamily: ["Inter", "sans-serif"].join(","),
      fontSize: 10,
      color: tokens.grey[700],
    },
  },
};
