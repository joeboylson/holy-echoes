import { createContext, useContext, useEffect, useState } from "react";
import { WithChildren } from "@/types";

export type ThemeName = "light" | "dark" | "sepia";

interface ThemeContextType {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: WithChildren) {
  const [theme, setThemeState] = useState<ThemeName>(() => {
    // Get theme from localStorage or default to light
    const stored = localStorage.getItem("theme");
    return (stored as ThemeName) || "light";
  });

  useEffect(() => {
    // Apply theme class to html element
    const root = document.documentElement;
    root.classList.remove("light", "dark", "sepia");
    root.classList.add(theme);

    // Save to localStorage
    localStorage.setItem("theme", theme);
  }, [theme]);

  const setTheme = (newTheme: ThemeName) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
