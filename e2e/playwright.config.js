const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env.e2e') });

const { defineConfig, devices } = require('@playwright/test');

const frontendURL = process.env.E2E_FRONTEND_URL || 'http://localhost:3031';

/**
 * QA-001 — configuración Playwright.
 *
 * - baseURL apunta al frontend real (Next.js).
 * - workers: 1 y fullyParallel: false para evitar carreras sobre el dataset
 *   sembrado (login/logout y cambios de estado de sesión son globales por
 *   usuario).
 * - Traces/videos/screenshots solo ante fallo para mantener artefactos útiles
 *   sin inflar el almacenamiento de CI.
 */
module.exports = defineConfig({
  testDir: './tests',
  outputDir: 'test-results',
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  forbidOnly: Boolean(process.env.CI),
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
  ],
  use: {
    baseURL: frontendURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    ignoreHTTPSErrors: true,
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  globalSetup: require.resolve('./global-setup.js'),
});
