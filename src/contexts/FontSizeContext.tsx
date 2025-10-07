import { createContext, useContext, useEffect, useState } from "react";
import { WithChildren } from "@/types";

export type FontSizeName = "small" | "medium" | "large";

interface FontSizeContextType {
  fontSize: FontSizeName;
  setFontSize: (size: FontSizeName) => void;
}

const FontSizeContext = createContext<FontSizeContextType | undefined>(
  undefined
);

export function FontSizeProvider({ children }: WithChildren) {
  const [fontSize, setFontSizeState] = useState<FontSizeName>(() => {
    // Get font size from localStorage or default to medium
    const stored = localStorage.getItem("fontSize");
    return (stored as FontSizeName) || "medium";
  });

  useEffect(() => {
    // Apply font size class to html element
    const root = document.documentElement;
    root.classList.remove("font-small", "font-medium", "font-large");
    root.classList.add(`font-${fontSize}`);

    // Save to localStorage
    localStorage.setItem("fontSize", fontSize);
  }, [fontSize]);

  const setFontSize = (newSize: FontSizeName) => {
    setFontSizeState(newSize);
  };

  return (
    <FontSizeContext.Provider value={{ fontSize, setFontSize }}>
      {children}
    </FontSizeContext.Provider>
  );
}

export function useFontSize() {
  const context = useContext(FontSizeContext);
  if (!context) {
    throw new Error("useFontSize must be used within FontSizeProvider");
  }
  return context;
}
