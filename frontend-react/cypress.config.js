const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    specPattern: 'cypress/e2e/**/*.cy.js',
    supportFile: 'cypress/support/e2e.js',
    viewportWidth: 1366,
    viewportHeight: 900,
    defaultCommandTimeout: 15000,
    video: true,
    screenshotOnRunFailure: true,
    setupNodeEvents(on, config) {
      require('cypress-mochawesome-reporter/plugin')(on);
      return config;
    },
  },
  env: {
    apiUrl: 'http://localhost:8080',
    iaUrl: 'http://localhost:8000',
    adminEmail: 'admin@novasalud.com',
    adminPassword: 'AdminNova2026!',
    doctorEmail: 'doctor.cypress@novasalud.com',
    doctorPassword: 'DoctorCypress2026!',
    patientEmail: 'paciente.cypress@novasalud.com',
    patientPassword: 'PacienteCypress2026!',
  },
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    reportDir: 'cypress/reports',
    overwrite: true,
    html: true,
    json: true,
    charts: true,
    reportPageTitle: 'NovaSalud - Pruebas E2E',
    embeddedScreenshots: true,
    inlineAssets: true,
  },
});
