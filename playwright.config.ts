import { defineConfig, devices } 
from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30 * 1000,
  retries: 1,
  reporter: [['list'], ['html', {outputFolder: 'playwright-report', open: 'never' }]],
  use: {
    baseURL: 'https://www.demoblaze.com/',
    headless: true,
    screenshot:'on', // 'on' | 'off' |only-on-failure',
    video:'on', // 'on' | 'off' |only-on-failure',
    trace: 'on', // 'on' | 'off' |only-on-failure',
  },
  projects: [{name: 'chromium', 
    use: { ...devices['Desktop Chrome'] }}],
  });