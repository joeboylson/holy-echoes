import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:5173",
    specPattern: "tests/e2e/**/*.cy.{js,jsx,ts,tsx}",
    supportFile: false,
    screenshotsFolder: "tests/screenshots",
    videosFolder: "tests/videos",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setupNodeEvents(_on, _config) {
      // implement node event listeners here
    },
  },
});
