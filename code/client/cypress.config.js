const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    theme: 'dark',
    experimentalSessionAndOrigin: true,
    pageLoadTimeout: 90000,
    taskTimeout: 90000,
    execTimeout: 90000,
    requestTimeout: 10000,
    responseTimeout: 60000,
    setupNodeEvents(on, config) {
      require('@cypress/code-coverage/task')(on, config)
      return config
    },
    screenshotOnRunFailure: false,
    video: false,
    specPattern: [
      "cypress/e2e/**/*.cy.{js,jsx}",
      "cypress/integrations/**/*.integration.test.{js,jsx}"
    ],
  },
});
