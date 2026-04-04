// tests/e2e/dashboard.spec.js
const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../pages/LoginPage');
const { DashboardPage } = require('../../pages/DashboardPage');

test.describe('Dashboard Module', () => {

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('admin', 'admin123');
    await expect(page).not.toHaveURL(/login/);
  });

  // ─────────────────────────────────────────────
  // TC-DASH-01: Dashboard แสดงสถิติครบถ้วน
  // ─────────────────────────────────────────────
  test('TC-DASH-01: Dashboard แสดงสถิติครบถ้วน', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.goto();

    await expect(page).toHaveURL(/index|dashboard/i);

    // ทุก stat card ต้องมองเห็น
    await expect(dashboardPage.totalBooksCard).toBeVisible({ timeout: 10000 });
    await expect(dashboardPage.availableBooksCard).toBeVisible({ timeout: 10000 });
    await expect(dashboardPage.activeMembersCard).toBeVisible({ timeout: 10000 });
    await expect(dashboardPage.borrowedBooksCard).toBeVisible({ timeout: 10000 });

    // ตัวเลขทุกตัวต้อง >= 0
    const total     = await dashboardPage.getStatValue(/Total Books|หนังสือทั้งหมด/i);
    const available = await dashboardPage.getStatValue(/Available Books|หนังสือที่ว่าง/i);
    const members   = await dashboardPage.getStatValue(/Active Members|สมาชิกที่ใช้งาน/i);
    const borrowed  = await dashboardPage.getStatValue(/Borrowed Books|หนังสือที่ยืม/i);

    expect(total,     'Total Books ต้อง >= 0').toBeGreaterThanOrEqual(0);
    expect(available, 'Available Books ต้อง >= 0').toBeGreaterThanOrEqual(0);
    expect(members,   'Active Members ต้อง >= 0').toBeGreaterThanOrEqual(0);
    expect(borrowed,  'Borrowed Books ต้อง >= 0').toBeGreaterThanOrEqual(0);
  });

  // ─────────────────────────────────────────────
  // TC-DASH-02: [BUG 9/13] Available ต้องไม่เกิน Total
  // BUG 13 → ไม่ตรวจ available > total ใน books.php
  // BUG 9  → Overdue calculation ไม่พิจารณาเวลา
  // ─────────────────────────────────────────────
  test('TC-DASH-02: [BUG 13] Available ต้องน้อยกว่าหรือเท่ากับ Total', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.goto();

    await expect(dashboardPage.totalBooksCard).toBeVisible({ timeout: 10000 });

    const total     = await dashboardPage.getStatValue(/Total Books|หนังสือทั้งหมด/i);
    const available = await dashboardPage.getStatValue(/Available Books|หนังสือที่ว่าง/i);
    const borrowed  = await dashboardPage.getStatValue(/Borrowed Books|หนังสือที่ยืม/i);

    // Available ต้องไม่เกิน Total — ถ้าเกิน = BUG 13 ยังอยู่ในระบบ
    expect(available,
      `[BUG 13 DETECTED] Available (${available}) มากกว่า Total (${total})!`
    ).toBeLessThanOrEqual(total);

    // Borrowed ต้องไม่เกิน Total
    expect(borrowed,
      `Borrowed (${borrowed}) มากกว่า Total (${total})!`
    ).toBeLessThanOrEqual(total);

    // Available + Borrowed ต้องไม่เกิน Total (อาจมีหนังสือ damaged/lost)
    expect(available + borrowed,
      `Available (${available}) + Borrowed (${borrowed}) = ${available + borrowed} เกิน Total (${total})`
    ).toBeLessThanOrEqual(total);
  });

  // ─────────────────────────────────────────────
  // TC-DASH-03: Navigation ไปหน้าต่างๆ จาก Dashboard
  // ─────────────────────────────────────────────
  test('TC-DASH-03: Navigation ไปหน้าต่างๆ จาก Dashboard', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.goto();
    await expect(page).toHaveURL(/index|dashboard/i);

    // 1. Books
    await dashboardPage.navigateTo(dashboardPage.booksLink);
    await expect(page).toHaveURL(/books/i, { message: 'ต้องไปหน้า Books ได้' });
    await expect(page.locator('body')).not.toContainText(/404|not found/i);
    await page.goBack();
    await page.waitForLoadState('networkidle');

    // 2. Members
    await dashboardPage.navigateTo(dashboardPage.membersLink);
    await expect(page).toHaveURL(/members/i, { message: 'ต้องไปหน้า Members ได้' });
    await expect(page.locator('body')).not.toContainText(/404|not found/i);
    await page.goBack();
    await page.waitForLoadState('networkidle');

    // 3. Borrow
    await dashboardPage.navigateTo(dashboardPage.borrowingLink);
    await expect(page).toHaveURL(/borrow/i, { message: 'ต้องไปหน้า Borrow ได้' });
    await expect(page.locator('body')).not.toContainText(/404|not found/i);
    await page.goBack();
    await page.waitForLoadState('networkidle');

    // 4. Reports
    await dashboardPage.navigateTo(dashboardPage.reportsLink);
    await expect(page).toHaveURL(/report/i, { message: 'ต้องไปหน้า Reports ได้' });
    await expect(page.locator('body')).not.toContainText(/404|not found/i);
  });
});