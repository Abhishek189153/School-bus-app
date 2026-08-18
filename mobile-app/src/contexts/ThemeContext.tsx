import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type ThemeContextValue = {
  darkMode: boolean;
  // updates in-memory state immediately (no re-fetch anywhere needed)
  // and persists to AsyncStorage in the background
  setDarkMode: (value: boolean) => void;
};

const ThemeContext = createContext<ThemeContextValue>({
  darkMode: false,
  setDarkMode: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkModeState] = useState(false);

  // read once on app start — no polling
  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem("darkMode");
        setDarkModeState(stored === "true");
      } catch (error) {
        console.log("THEME LOAD ERROR:", error);
      }
    })();
  }, []);

  const setDarkMode = useCallback((value: boolean) => {
    setDarkModeState(value);
    AsyncStorage.setItem("darkMode", value.toString()).catch((error) =>
      console.log("THEME SAVE ERROR:", error)
    );
  }, []);

  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

// every screen reads theme from here instead of its own AsyncStorage
// read/poll — toggling in Settings updates all tabs instantly
export function useTheme() {
  return useContext(ThemeContext);
}
