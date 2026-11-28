import { defineConfig } from "cypress"

export default defineConfig({
  e2e: {
    baseUrl: "http://127.0.0.1:3000",
    viewportWidth: 1280,
    viewportHeight: 800,
    defaultCommandTimeout: 25000,
    pageLoadTimeout: 60000,
    scrollBehavior: "center",
    video: false,
    screenshotOnRunFailure: true,
    setupNodeEvents(_on, _config) {
      // implement node event listeners here
    },
  },
})
