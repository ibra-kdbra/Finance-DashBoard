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
    // sophisticated indigo
    100: "#eef2ff",
    200: "#e0e7ff",
    300: "#c7d2fe",
    400: "#a5b4fc",
    500: "#818cf8",
    600: "#6366f1",
    700: "#4f46e5",
    800: "#4338ca",
    900: "#3730a3",
  },
  secondary: {
    // electric neon (preserved)
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
  tertiary: {
    // neon purple (preserved)
    500: "#b19fff",
    600: "#8884d8",
  },
  background: {
    light: "#1a1a2e",
    main: "#0d0d14",
    glass: "rgba(255, 255, 255, 0.02)",
    glassSelected: "rgba(255, 255, 255, 0.06)",
    glassBorder: "rgba(255, 255, 255, 0.05)",
    neon: "linear-gradient(135deg, #1affd6 0%, #b19fff 100%)",
    aura: "radial-gradient(circle at 50% -20%, #1e1e30 0%, #0d0d14 100%)",
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
          backgroundColor: "#0d0d14",
          backgroundImage: tokens.background.aura,
          backgroundAttachment: "fixed",
          color: tokens.grey[200], // lightened default text
          margin: 0,
          padding: 0,
          minHeight: "100vh",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(20, 20, 28, 0.8)",
          backdropFilter: "blur(40px)",
          border: `1px solid ${tokens.background.glassBorder}`,
          borderRadius: "1.5rem",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
          backgroundImage: "none",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: "0.75rem",
          fontWeight: 700,
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: "0.75rem",
          backgroundColor: "rgba(255,255,255,0.03)",
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: tokens.grey[800],
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: tokens.primary[400],
          },
        },
        select: {
          color: tokens.grey[100],
        },
        icon: {
          color: tokens.primary[500],
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: "rgba(26, 26, 46, 0.95)",
          backdropFilter: "blur(20px)",
          border: `1px solid ${tokens.grey[800]}`,
          boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          color: tokens.grey[200],
          margin: "4px 8px",
          borderRadius: "0.5rem",
          "&:hover": {
            backgroundColor: "rgba(129, 138, 248, 0.1)",
            color: tokens.primary[400],
          },
          "&.Mui-selected": {
            backgroundColor: "rgba(129, 138, 248, 0.2) !important",
            color: tokens.primary[300],
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            color: tokens.grey[100],
            backgroundColor: "rgba(255, 255, 255, 0.03)",
            borderRadius: "0.75rem",
            "& fieldset": {
              borderColor: tokens.grey[800],
              borderWidth: "1.5px",
              transition: "all 0.3s ease",
            },
            "&:hover fieldset": {
              borderColor: tokens.primary[400],
            },
            "&.Mui-focused fieldset": {
              borderColor: tokens.primary[500],
              boxShadow: "0 0 12px rgba(129, 140, 248, 0.2)",
            },
          },
          "& .MuiInputLabel-root": {
            color: tokens.grey[500],
            "&.Mui-focused": {
              color: tokens.primary[400],
            },
          },
        },
      },
    },
  },

  typography: {
    fontFamily: ["Outfit", "Inter", "sans-serif"].join(","),
    fontSize: 12,
    h1: {
      fontFamily: ["Outfit", "sans-serif"].join(","),
      fontSize: 32,
      fontWeight: 700,
    },
    h2: {
      fontFamily: ["Outfit", "sans-serif"].join(","),
      fontSize: 24,
      fontWeight: 600,
    },
    h3: {
      fontFamily: ["Outfit", "sans-serif"].join(","),
      fontSize: 20,
      fontWeight: 800,
      color: tokens.grey[100],
    },
    h4: {
      fontFamily: ["Outfit", "sans-serif"].join(","),
      fontSize: 14,
      fontWeight: 600,
      color: tokens.grey[200],
    },
    h5: {
      fontFamily: ["Outfit", "sans-serif"].join(","),
      fontSize: 12,
      fontWeight: 400,
      color: tokens.grey[400],
    },
    h6: {
      fontFamily: ["Outfit", "sans-serif"].join(","),
      fontSize: 10,
      color: tokens.grey[600],
    },
  },
};

export const nivoTheme = (palette: any) => ({
  axis: {
    domain: {
      line: { stroke: palette.grey[800], strokeWidth: 1 },
    },
    legend: {
      text: { fill: palette.grey[300], fontWeight: 600, fontSize: 12 },
    },
    ticks: {
      line: { stroke: palette.grey[800], strokeWidth: 1 },
      text: { fill: palette.grey[400], fontWeight: 500, fontSize: 10 },
    },
  },
  grid: {
    line: { stroke: palette.grey[800], strokeWidth: 1 },
  },
  legends: {
    text: { fill: palette.grey[300], fontWeight: 600, fontSize: 11 },
  },
  tooltip: {
    container: {
      background: "rgba(13, 13, 20, 0.95)",
      color: palette.grey[100],
      fontSize: 12,
      borderRadius: "12px",
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
      border: `1px solid ${palette.grey[800]}`,
      backdropFilter: "blur(20px)",
      padding: "12px",
    },
  },
});
