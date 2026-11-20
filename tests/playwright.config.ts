import { defineConfig, devices } from '@playwright/test';
import { existsSync } from 'node:fs';

const linuxChromium = '/usr/bin/chromium';
const edge = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE ??
  [linuxChromium, edge].find(existsSync);

export default defineConfig({
  testDir: '.',
  testMatch: '**/*.spec.ts',
  timeout: 20_000,
  expect: { timeout: 7_000 },
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:4173',
    browserName: 'chromium',
    launchOptions: { executablePath },
    trace: 'off',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 1000 } } },
    { name: 'mobile', use: { ...devices['iPhone 13'], viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } },
  ],
});
