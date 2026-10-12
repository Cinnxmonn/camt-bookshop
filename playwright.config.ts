import { defineConfig, devices } from '@playwright/test';

try {
  process.loadEnvFile();
} catch {
  // .env is optional in CI where secrets are passed via environment variables
}

const isCI = Boolean(process.env.CI);
const baseURL = process.env.BASE_URL?.trim();
const bypassSecret = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;

const extraHTTPHeaders: Record<string, string> = {};
if (bypassSecret) {
  extraHTTPHeaders['x-vercel-protection-bypass'] = bypassSecret;
  extraHTTPHeaders['x-vercel-set-bypass-cookie'] = 'samesitenone';
}

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 2 : undefined,
  reporter: isCI
    ? [
        ['html', { open: 'never', outputFolder: 'playwright-report' }],
        ['blob', { outputDir: 'blob-report' }],
        ['list'],
      ]
    : 'html',

  use: {
    baseURL: baseURL || 'http://localhost:3000',
    trace: 'on-first-retry',
    extraHTTPHeaders,
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],

  ...(baseURL
    ? {}
    : {
        webServer: {
          command: 'npm run build && npm start',
          url: 'http://localhost:3000',
          reuseExistingServer: !isCI,
          timeout: 180_000,
        },
      }),
});