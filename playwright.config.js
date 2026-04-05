// @ts-check
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  /* --- 1. เพิ่ม Global Timeout --- */
  timeout: 60000, 
  expect: {
    timeout: 10000, // ให้เวลาเช็ค Element 10 วินาที
    toHaveScreenshot: { 
      maxDiffPixels: 150, // ยอมรับจุดเพี้ยนได้บ้าง (แก้ปัญหาฟอนต์คนละเครื่อง)
      threshold: 0.2 
    },
  },

  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  /* --- 2. เพิ่ม Retry แม้รันในเครื่องตัวเอง --- */
  retries: process.env.CI ? 2 : 1, 
  workers: process.env.CI ? 1 : undefined,

  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    ['json', { outputFile: 'test-results/results.json' }]
  ],

  use: {
    /* --- 3. เพิ่ม Action & Navigation Timeout --- */
    actionTimeout: 15000,
    navigationTimeout: 30000,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure', // แคปภาพอัตโนมัติเมื่อพัง
    video: 'on-first-retry',      // อัดวิดีโอตอนรันซ้ำเพื่อ Debug
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});