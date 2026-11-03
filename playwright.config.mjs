import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./browser",
  testMatch: "**/*.spec.mjs",
  retries: 0,
  reporter: "list",
  use: { browserName: "chromium", baseURL: "http://127.0.0.1:8765", trace: "retain-on-failure" },
  projects: [
    { name: "desktop", use: { viewport: { width: 1280, height: 800 } } },
    { name: "mobile", use: { viewport: { width: 390, height: 844 }, isMobile: true, deviceScaleFactor: 1 } }
  ],
  webServer: {
    command: "node scripts/serve-product.mjs",
    url: "http://127.0.0.1:8765/",
    reuseExistingServer: !process.env.CI,
    timeout: 20000
  }
});
