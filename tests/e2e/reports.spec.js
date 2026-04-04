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

    // ตรวจ column headers ครบ
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

  // TC-REP-03: [BUG] ตรวจสอบการคำนวณค่าปรับ — Fine ผิด (ระบบคิด Days x 5 แทน Days x 10) (Fine = Days Overdue x 10)
  test('TC-REP-03: [BUG] ตรวจสอบการคำนวณค่าปรับ — Fine ผิด (ระบบคิด Days x 5 แทน Days x 10)', async ({ page }) => {
    await reportsPage.goto();

    const rowCount = await reportsPage.getOverdueRecordsCount();
    expect(rowCount).toBeGreaterThan(0);

    const results = await reportsPage.verifyFineCalculation();
    const errors = [];

    for (const result of results) {
      const { record, isCorrect, expected, actual } = result;
      const days = parseInt(record.daysOverdue.replace(/[^0-9]/g, ''), 10) || 0;

      if (days > 0 && !isCorrect) {
        errors.push(
          `"${record.book}": DaysOverdue=${days}, Fine=${actual}, Expected=${expected}`
        );
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
});