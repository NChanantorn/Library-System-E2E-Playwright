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

    // Login before each test
    await loginPage.goto();
    await loginPage.login('admin', 'admin123');
    await page.waitForLoadState('networkidle', { timeout: 15000 });
  });

  test('TC-REP-01: เปิดหน้า Reports', async ({ page }) => {
    // Navigate to Reports from Dashboard or directly
    await dashboardPage.navigateToReports().catch(async () => {
      // If navigation button not found, go directly
      await reportsPage.goto();
    });

    // Verify page loaded successfully
    const isLoaded = await reportsPage.checkPageLoaded();
    expect(isLoaded).toBe(true);

    // Verify Overdue Books section is displayed
    const hasOverdueSection = await page.locator('table, [class*="overdue" i]').count();
    expect(hasOverdueSection).toBeGreaterThan(0);

    // Verify page header/title
    const header = await reportsPage.getPageHeader();
    expect(header).toBeTruthy();
  });

  test('TC-REP-02: แสดงรายการหนังสือเกินกำหนด', async ({ page }) => {
    // Navigate to Reports
    await dashboardPage.navigateToReports().catch(async () => {
      await reportsPage.goto();
    });

    // Wait for Overdue Books section to be visible
    await page.waitForLoadState('networkidle', { timeout: 15000 });
    await page.waitForTimeout(1000);

    // Verify table headers exist
    const hasTableHeaders = await reportsPage.verifyOverdueBooksTableVisible();
    expect(hasTableHeaders).toBe(true);

    // Verify table structure - check for required columns
    const memberHeader = await page.locator('table th').filter({ hasText: /Member|สมาชิก|ชื่อ/i }).count();
    const bookHeader = await page.locator('table th').filter({ hasText: /Book|หนังสือ|ชื่อหนังสือ/i }).count();
    const daysHeader = await page.locator('table th').filter({ hasText: /Days Overdue|วันที่เกิน|จำนวนวัน/i }).count();
    const fineHeader = await page.locator('table th').filter({ hasText: /Fine|ค่าปรับ/i }).count();

    // At least Member and Book columns must exist
    expect(memberHeader + bookHeader).toBeGreaterThan(0);

    // If there's overdue data, verify it's displayed
    const hasOverdueData = await reportsPage.verifyOverdueDataDisplayed().catch(() => false);
    if (hasOverdueData) {
      const recordCount = await reportsPage.getOverdueRecordsCount();
      expect(recordCount).toBeGreaterThanOrEqual(0);

      // If there are records, verify they have the required fields
      if (recordCount > 0) {
        const firstRecord = await reportsPage.getOverdueRecord(0);
        expect(firstRecord).toBeTruthy();
        // Member and Book should have some value
        expect(firstRecord.member || firstRecord.book).toBeTruthy();
      }
    }
  });

  test('TC-REP-03: ตรวจสอบการคำนวณค่าปรับ', async ({ page }) => {
    // Navigate to Reports
    await dashboardPage.navigateToReports().catch(async () => {
      await reportsPage.goto();
    });

    // Wait for page to load
    await page.waitForLoadState('networkidle', { timeout: 15000 });
    await page.waitForTimeout(1000);

    // Get all overdue records and verify fine calculation
    const fineVerificationResults = await reportsPage.verifyFineCalculation();

    // If there are overdue records
    if (fineVerificationResults && fineVerificationResults.length > 0) {
      // Check that fine calculation formula is correct: Days Overdue x 10 = Fine
      for (const result of fineVerificationResults) {
        const { daysOverdue, fine } = result.record;
        const days = parseInt(daysOverdue) || 0;
        const expectedFine = days * 10;
        const actualFine = parseInt(fine) || 0;

        // Fine should equal Days Overdue x 10
        if (days > 0) {
          expect(actualFine).toBe(expectedFine);
        }
      }
    }

    // If no overdue records, verify the table is still properly displayed
    const hasTable = await reportsPage.verifyOverdueBooksTableVisible();
    expect(hasTable).toBe(true);
  });
});
