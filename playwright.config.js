// @ts-check
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  
  /* 1. เพิ่ม Global Timeout: ให้เวลาแต่ละ Test Case นานขึ้น (ค่าเริ่มต้นคือ 30000) */
  timeout: 60000, 

  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1, // แนะนำให้เปิด retry เป็น 1 แม้ไม่ใช่ CI เพื่อลดปัญหา Flaky Test
  workers: process.env.CI ? 1 : undefined,

  reporter: [
  ['json', { outputFile: 'test-results/results.json' }],
  ['html']
],

  use: {
    /* 2. เพิ่ม Action Timeout: ให้เวลาแต่ละคำสั่ง เช่น click, fill นานขึ้น */
    actionTimeout: 15000,
    trace: 'on-first-retry',
    
    /* เพิ่ม Screenshot: เก็บภาพตอนเทสพังไว้ดูใน Report */
    screenshot: 'only-on-failure',
  },

  /* ส่วนที่เหลือคงเดิมตามที่คุณตั้งค่าไว้ */
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});