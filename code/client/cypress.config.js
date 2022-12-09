const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    theme: 'dark',
    experimentalSessionAndOrigin: true,
    setupNodeEvents(on, config) {
    },
    screenshotOnRunFailure: false,
    video: false,
    specPattern: [
      "cypress/e2e/**/*.cy.{js,jsx}",
      "cypress/integrations/**/*.integration.test.{js,jsx}"
    ],
  },
});
