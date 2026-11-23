const sharedTheme = {
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
};

export const darkTheme = {
  ...sharedTheme,
  colors: {
    background: "#111318",
    surface: "#20232C",
    surfaceElevated: "#292D38",
    surfaceMuted: "#343946",

    primary: "#A78BFA",
    primaryDark: "#8B5CF6",
    primaryLight: "#C4B5FD",

    textPrimary: "#F4F4F5",
    textSecondary: "#A1A1AA",
    textMuted: "#71717A",
    textOnPrimary: "#171322",

    categories: {
      work: "#60A5FA",
      study: "#A78BFA",
      personal: "#34D399",
    },

    status: {
      success: "#34D399",
      warning: "#FBBF24",
      error: "#F87171",
      info: "#60A5FA",
    },

    border: "#343946",
    divider: "#292D38",
    overlay: "rgba(0, 0, 0, 0.65)",

    white: "#FFFFFF",
    black: "#000000",
    transparent: "transparent",
  },
};

export const lightTheme = {
  ...sharedTheme,
  colors: {
    background: "#F8F7FC",
    surface: "#FFFFFF",
    surfaceElevated: "#F0EDF8",
    surfaceMuted: "#E8E4F1",

    primary: "#8B5CF6",
    primaryDark: "#7C3AED",
    primaryLight: "#A78BFA",

    textPrimary: "#181523",
    textSecondary: "#625D70",
    textMuted: "#898397",
    textOnPrimary: "#FFFFFF",

    categories: {
      work: "#2563EB",
      study: "#8B5CF6",
      personal: "#059669",
    },

    status: {
      success: "#059669",
      warning: "#D97706",
      error: "#DC2626",
      info: "#2563EB",
    },

    border: "#E3DFEB",
    divider: "#EAE6F0",
    overlay: "rgba(24, 21, 35, 0.55)",

    white: "#FFFFFF",
    black: "#000000",
    transparent: "transparent",
  },
};

export type ThemeMode = "dark" | "light";

export type AppTheme = typeof darkTheme;

export const theme = darkTheme;

export default theme;
