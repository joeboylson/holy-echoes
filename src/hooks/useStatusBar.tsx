import { useEffect } from "react";
import { StatusBar, Style } from "@capacitor/status-bar";
import { Capacitor } from "@capacitor/core";

export const useStatusBar = () => {
  /**
   *
   */
  useEffect(() => {
    const setupStatusBar = async () => {
      if (Capacitor.isNativePlatform()) {
        try {
          // Check if dark mode is enabled
          const isDark = document.documentElement.classList.contains("dark");

          if (isDark) {
            await StatusBar.setStyle({ style: Style.Dark });
            await StatusBar.setBackgroundColor({ color: "#252525" }); // oklch(0.145 0 0) converted to hex
          } else {
            await StatusBar.setStyle({ style: Style.Light });
            await StatusBar.setBackgroundColor({ color: "#ffffff" });
          }

          await StatusBar.setOverlaysWebView({ overlay: false });
        } catch (error) {
          console.log("StatusBar setup error:", error);
        }
      }
    };

    setupStatusBar();

    // Listen for theme changes
    const observer = new MutationObserver(setupStatusBar);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);
};
