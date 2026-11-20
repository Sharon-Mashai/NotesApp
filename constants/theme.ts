export const theme = {
  colors: {
    // Main application surfaces
    background: "#111318",
    surface: "#20232C",
    surfaceElevated: "#292D38",
    surfaceMuted: "#343946",

    // Brand colours
    primary: "#A78BFA",
    primaryDark: "#8B5CF6",
    primaryLight: "#C4B5FD",

    // Text colours
    textPrimary: "#F4F4F5",
    textSecondary: "#A1A1AA",
    textMuted: "#71717A",
    textOnPrimary: "#171322",

    // Category colours
    categories: {
      work: "#60A5FA",
      study: "#A78BFA",
      personal: "#34D399",
    },

    // Semantic status colours
    status: {
      success: "#34D399",
      warning: "#FBBF24",
      error: "#F87171",
      info: "#60A5FA",
    },

    // Borders and overlays
    border: "#343946",
    divider: "#292D38",
    overlay: "rgba(0, 0, 0, 0.65)",

    // General
    white: "#FFFFFF",
    black: "#000000",
    transparent: "transparent",
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    huge: 40,
  },

  radius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    full: 999,
  },

  typography: {
    sizes: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
      xxl: 24,
      heading: 28,
      display: 34,
    },

    weights: {
      regular: "400" as const,
      medium: "500" as const,
      semibold: "600" as const,
      bold: "700" as const,
    },
  },
} as const;

export type AppTheme = typeof theme;

export default theme;
