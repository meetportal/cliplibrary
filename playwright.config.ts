import { defineConfig, devices } from '@playwright/test';

const PORT = 3100;
const { E2E_BASE_URL, CI } = process.env;
const external = E2E_BASE_URL;
const baseURL = external ?? `http://localhost:${PORT}`;

export default defineConfig({
  testDir: './e2e',
  globalSetup: './e2e/global-setup.ts',
  timeout: 180_000,
  expect: { timeout: 45_000 },
  fullyParallel: false,
  workers: 1,
  reporter: [['list']],
  use: {
    baseURL,
    trace: 'retain-on-failure',
    ...devices['Desktop Chrome'],
  },
  ...(external
    ? {}
    : {
        webServer: {
          command: `bunx next start --port ${PORT}`,
          url: baseURL,
          timeout: 180_000,
          reuseExistingServer: !CI,
        },
      }),
});
