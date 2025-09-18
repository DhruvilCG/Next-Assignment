import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  reporter: [["html", { outputFolder: "playwright-report", open: "never" }]], // 👈 yaha report folder fix kiya
  use: {
    baseURL: "http://localhost:3000",
  },
});