import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  darkTheme,
  lightTheme,
  type AppTheme,
  type ThemeMode,
} from "@/constants/theme";

const THEME_STORAGE_KEY = "@notes_app/theme";

type ThemeContextType = {
  mode: ThemeMode;
  theme: AppTheme;
  isLoading: boolean;
  setMode: (mode: ThemeMode) => Promise<void>;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

type ThemeProviderProps = {
  children: ReactNode;
};

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [mode, setModeState] = useState<ThemeMode>("dark");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadTheme() {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);

        if (isMounted && (savedTheme === "light" || savedTheme === "dark")) {
          setModeState(savedTheme);
        }
      } catch (error) {
        console.error("Unable to load theme preference:", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadTheme();

    return () => {
      isMounted = false;
    };
  }, []);

  const setMode = useCallback(async (newMode: ThemeMode) => {
    setModeState(newMode);

    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newMode);
    } catch (error) {
      console.error("Unable to save theme preference:", error);
    }
  }, []);

  const selectedTheme = mode === "light" ? lightTheme : darkTheme;

  return (
    <ThemeContext.Provider
      value={{
        mode,
        theme: selectedTheme,
        isLoading,
        setMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }

  return context;
}
