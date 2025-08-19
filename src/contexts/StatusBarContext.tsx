import React, {
  createContext,
  useContext,
  useEffect,
  useCallback,
  useRef,
  ReactNode,
} from "react";
import { StatusBar, Style } from "@capacitor/status-bar";
import { Capacitor } from "@capacitor/core";

interface StatusBarContextType {
  setStatusBarColor: (hexColor: string) => Promise<void>;
  resetToThemeColor: () => Promise<void>;
}

const StatusBarContext = createContext<StatusBarContextType | undefined>(
  undefined
);

export const useStatusBar = () => {
  const context = useContext(StatusBarContext);
  if (context === undefined) {
    throw new Error("useStatusBar must be used within a StatusBarProvider");
  }
  return context;
};

interface StatusBarProviderProps {
  children: ReactNode;
}

export const StatusBarProvider: React.FC<StatusBarProviderProps> = ({
  children,
}) => {
  const currentColorRef = useRef<string | null>(null);

  const getContrastStyle = useCallback((hexColor: string): Style => {
    const hex = hexColor.replace("#", "");

    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    return luminance > 0.5 ? Style.Dark : Style.Light;
  }, []);

  const setStatusBarColor = useCallback(
    async (hexColor: string) => {
      if (Capacitor.isNativePlatform()) {
        try {
          const color = hexColor.startsWith("#") ? hexColor : `#${hexColor}`;

          await StatusBar.setBackgroundColor({ color });
          await StatusBar.setStyle({ style: getContrastStyle(color) });
          await StatusBar.setOverlaysWebView({ overlay: false });

          currentColorRef.current = color;
        } catch (error) {
          console.error("StatusBar color change error:", error);
        }
      }
    },
    [getContrastStyle]
  );

  const resetToThemeColor = useCallback(async () => {
    if (Capacitor.isNativePlatform()) {
      try {
        const isDark = document.documentElement.classList.contains("dark");

        if (isDark) {
          await StatusBar.setStyle({ style: Style.Dark });
          await StatusBar.setBackgroundColor({ color: "#252525" });
          currentColorRef.current = "#252525";
        } else {
          await StatusBar.setStyle({ style: Style.Light });
          await StatusBar.setBackgroundColor({ color: "#ffffff" });
          currentColorRef.current = "#ffffff";
        }

        await StatusBar.setOverlaysWebView({ overlay: false });
      } catch (error) {
        console.error("StatusBar setup error:", error);
      }
    }
  }, []);

  useEffect(() => {
    resetToThemeColor();

    const observer = new MutationObserver(() => {
      if (
        !currentColorRef.current ||
        currentColorRef.current === "#ffffff" ||
        currentColorRef.current === "#252525"
      ) {
        resetToThemeColor();
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, [resetToThemeColor]);

  const value = {
    setStatusBarColor,
    resetToThemeColor,
  };

  return (
    <StatusBarContext.Provider value={value}>
      {children}
    </StatusBarContext.Provider>
  );
};
