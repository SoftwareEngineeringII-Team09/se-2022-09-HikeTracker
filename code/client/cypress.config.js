const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    theme: 'dark',
    experimentalSessionAndOrigin: true,
    setupNodeEvents(on, config) {
      
    },
  },
});
