"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var cypress_1 = require("cypress");
exports.default = (0, cypress_1.defineConfig)({
    e2e: {
        baseUrl: "http://localhost:5173",
        specPattern: "tests/e2e/**/*.cy.{js,jsx,ts,tsx}",
        supportFile: false,
        screenshotsFolder: "tests/screenshots",
        videosFolder: "tests/videos",
        setupNodeEvents: function (_on, _config) {
            // implement node event listeners here
        },
    },
});
