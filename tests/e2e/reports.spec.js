// tests/e2e/reports.spec.js
const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../pages/LoginPage');
const { DashboardPage } = require('../../pages/DashboardPage');
const { ReportsPage } = require('../../pages/ReportsPage');

test.describe('Reports Module (ตาม TestCase.csv)', () => {
  let loginPage, dashboardPage, reportsPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    reportsPage = new ReportsPage(page);

    await loginPage.goto();
    await loginPage.login('admin', 'admin123');
    await expect(page).not.toHaveURL(/login/, { timeout: 10000 });
  });

  // TC-REP-01: เปิดหน้า Reports
  test('TC-REP-01: เปิดหน้า Reports', async ({ page }) => {
    try {
      await dashboardPage.navigateToReports();
    } catch {
      await reportsPage.goto();
    }
    await page.waitForLoadState('networkidle', { timeout: 15000 });

    await expect(page).not.toHaveURL(/login/);
    await expect(page).toHaveURL(/reports\.php/, { timeout: 5000 });

    const header = page.locator('h1, h2, h3').first();
    await expect(header).toBeVisible({ timeout: 5000 });
    const headerText = await header.textContent();
    expect(headerText.trim().length).toBeGreaterThan(0);

    await expect(reportsPage.overdueTable).toBeVisible({ timeout: 5000 });
  });

  // TC-REP-02: แสดงรายการหนังสือเกินกำหนด
  test('TC-REP-02: แสดงรายการหนังสือเกินกำหนด', async ({ page }) => {
    await reportsPage.goto();

    await expect(reportsPage.overdueTable).toBeVisible({ timeout: 5000 });

    await expect(reportsPage.memberHeader.first()).toBeVisible({ timeout: 5000 });
    await expect(reportsPage.bookHeader.first()).toBeVisible({ timeout: 5000 });
    await expect(reportsPage.daysOverdueHeader.first()).toBeVisible({ timeout: 5000 });
    await expect(reportsPage.fineHeader.first()).toBeVisible({ timeout: 5000 });

    const rowCount = await reportsPage.getOverdueRecordsCount();

    if (rowCount > 0) {
      const firstRecord = await reportsPage.getOverdueRecord(0);
      expect(firstRecord.member.length).toBeGreaterThan(0);
      expect(firstRecord.book.length).toBeGreaterThan(0);
    } else {
      const emptyMsg = reportsPage.overdueTable.locator('td[colspan]');
      await expect(emptyMsg.first()).toBeVisible({ timeout: 3000 });
    }
  });

  // TC-REP-03: คำนวณ Days x 5 
  test('TC-REP-03: คำนวณ Days x 5 ', async ({ page }) => {
    await reportsPage.goto();

    const rowCount = await reportsPage.getOverdueRecordsCount();
    expect(rowCount).toBeGreaterThan(0);

    const results = await reportsPage.verifyFineCalculation();
    const errors = [];

    for (const result of results) {
      const { record, isCorrect, expected, actual } = result;
      const days = parseInt(record.daysOverdue.replace(/[^0-9]/g, ''), 10) || 0;

      if (days > 0 && !isCorrect) {
        errors.push(`"${record.book}": DaysOverdue=${days}, Fine=${actual}, Expected=${expected}`);
      }
      if (days < 0) {
        errors.push(`"${record.book}": DaysOverdue เป็นลบ (${days})`);
      }
      if (actual < 0) {
        errors.push(`"${record.book}": Fine เป็นลบ (${actual})`);
      }
    }

    expect(errors, `พบการคำนวณค่าปรับผิด:\n${errors.join('\n')}`).toHaveLength(0);
  });

  // TC-REP-04: [BUG] Overdue ต้องแสดงทุกรายการที่เกินกำหนด ไม่ใช่แค่บางส่วน
  // จาก snapshot: dashboard บอก 1 overdue แต่มีรายการ Borrowed ที่เลย due date หลายอัน
  test('TC-REP-04: [BUG] Overdue Books ต้องแสดงครบทุกรายการที่เกินกำหนด', async ({ page }) => {
    await reportsPage.goto();

    const overdueCount = await reportsPage.getOverdueRecordsCount();

    // นับรายการ Borrowed ที่เลย due date จริงใน return.php
    await page.goto('http://localhost:8080/return.php');
    await page.waitForLoadState('networkidle');

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const rows = page.locator('table tbody tr');
    const count = await rows.count();
    let actualOverdue = 0;

    for (let i = 0; i < count; i++) {
      const cells = rows.nth(i).locator('td');
      const cellCount = await cells.count();
      for (let c = 0; c < cellCount; c++) {
        const text = (await cells.nth(c).innerText()).trim();
        if (/^\d{4}-\d{2}-\d{2}$/.test(text)) {
          const dueDate = new Date(text);
          const statusText = await cells.nth(cellCount - 1).innerText();
          if (dueDate < today && /Borrowed/i.test(statusText)) {
            actualOverdue++;
          }
          break;
        }
      }
    }

    expect(overdueCount,
      `[BUG DETECTED] Reports แสดง Overdue ${overdueCount} รายการ แต่จริงๆ มี ${actualOverdue} รายการ`
    ).toBe(actualOverdue);
  });

  // TC-REP-05: [BUG] Books by Category Total Copies ต้องไม่ติดลบ
  // จาก snapshot: General category มี Total Copies = -10
  test('TC-REP-05: [BUG] Books by Category ต้องไม่มี Total Copies ติดลบ', async ({ page }) => {
    await reportsPage.goto();

    const categoryTable = page.locator('table').filter({
      has: page.locator('th', { hasText: /Category/i })
    });

    await expect(categoryTable).toBeVisible({ timeout: 5000 });

    const rows = categoryTable.locator('tbody tr');
    const count = await rows.count();
    const errors = [];

    for (let i = 0; i < count; i++) {
      const cells = rows.nth(i).locator('td');
      const category = ((await cells.nth(0).textContent()) || '').trim();
      const totalCopiesText = ((await cells.nth(2).textContent()) || '').trim();
      const totalCopies = parseInt(totalCopiesText, 10);

      if (totalCopies < 0) {
        errors.push(`Category "${category}": Total Copies = ${totalCopies} ติดลบ`);
      }
    }

    expect(errors,
      `[BUG DETECTED] พบ Category ที่มี Total Copies ติดลบ:\n${errors.join('\n')}`
    ).toHaveLength(0);
  });
});