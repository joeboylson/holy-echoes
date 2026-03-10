import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.holyechoes.app",
  appName: "Holy Echoes",
  webDir: "dist",
  plugins: {
    StatusBar: {
      style: "LIGHT",
      backgroundColor: "#0082cb",
      overlaysWebView: true,
    },
  },
};

export default config;
