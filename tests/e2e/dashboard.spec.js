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

  // TC-DASH-01: Dashboard แสดงสถิติครบถ้วน
  test('TC-DASH-01: Dashboard แสดงสถิติครบถ้วน', async ({ page }) => {
    const dp = new DashboardPage(page);
    await dp.goto();

    await expect(page).toHaveURL(/index/i);

    await expect(dp.totalBooksCard).toBeVisible({ timeout: 10000 });
    await expect(dp.availableBooksCard).toBeVisible({ timeout: 10000 });
    await expect(dp.activeMembersCard).toBeVisible({ timeout: 10000 });
    await expect(dp.borrowedBooksCard).toBeVisible({ timeout: 10000 });

    const total     = await dp.getStatValue(dp.totalBooksCard);
    const available = await dp.getStatValue(dp.availableBooksCard);
    const members   = await dp.getStatValue(dp.activeMembersCard);
    const borrowed  = await dp.getStatValue(dp.borrowedBooksCard);

    expect(total).toBeGreaterThanOrEqual(0);
    expect(available).toBeGreaterThanOrEqual(0);
    expect(members).toBeGreaterThanOrEqual(0);
    expect(borrowed).toBeGreaterThanOrEqual(0);
  });

  // TC-DASH-02: [BUG 13] Available ต้องไม่เกิน Total
  test('TC-DASH-02: [BUG 13] Available ต้องน้อยกว่าหรือเท่ากับ Total', async ({ page }) => {
    const dp = new DashboardPage(page);
    await dp.goto();

    const total     = await dp.getStatValue(dp.totalBooksCard);
    const available = await dp.getStatValue(dp.availableBooksCard);
    const borrowed  = await dp.getStatValue(dp.borrowedBooksCard);

    expect(available,
      `[BUG 13 DETECTED] Available (${available}) มากกว่า Total (${total})`
    ).toBeLessThanOrEqual(total);

    expect(borrowed,
      `Borrowed (${borrowed}) มากกว่า Total (${total})`
    ).toBeLessThanOrEqual(total);

    expect(available + borrowed,
      `Available (${available}) + Borrowed (${borrowed}) = ${available + borrowed} เกิน Total (${total})`
    ).toBeLessThanOrEqual(total);
  });

  // TC-DASH-03: [BUG] Total Books ต้องไม่ติดลบ
  test('TC-DASH-03: [BUG] Total Books ต้องไม่ติดลบ', async ({ page }) => {
    const dp = new DashboardPage(page);
    await dp.goto();

    const total = await dp.getStatValue(dp.totalBooksCard);
    expect(total,
      `[BUG DETECTED] Total Books = ${total} ติดลบ`
    ).toBeGreaterThanOrEqual(0);
  });

  // TC-DASH-04: [BUG] ตรวจ Available ติดลบในตาราง Books
  test('TC-DASH-04: [BUG] Available ในตาราง Books ต้องไม่ติดลบ', async ({ page }) => {
    await page.goto('http://localhost:8080/books.php');
    await page.waitForLoadState('networkidle');

    const rows = page.locator('table tbody tr');
    const count = await rows.count();
    const errors = [];

    for (let i = 0; i < count; i++) {
      const cells = rows.nth(i).locator('td');
      // Total อยู่ col 4, Available อยู่ col 5
      const totalText     = (await cells.nth(4).textContent() || '').trim();
      const availableText = (await cells.nth(5).textContent() || '').trim();
      const titleText     = (await cells.nth(1).textContent() || '').trim();

      const total     = parseInt(totalText.replace(/[^0-9-]/g, ''), 10);
      const available = parseInt(availableText.replace(/[^0-9-]/g, ''), 10);

      if (total < 0) {
        errors.push(`"${titleText}": Total = ${total} ติดลบ`);
      }
      if (available < 0) {
        errors.push(`"${titleText}": Available = ${available} ติดลบ`);
      }
      if (available > total) {
        errors.push(`"${titleText}": Available (${available}) > Total (${total})`);
      }
    }

    expect(errors,
      `[BUG DETECTED] พบหนังสือที่มีค่าผิดปกติ:\n${errors.join('\n')}`
    ).toHaveLength(0);
  });

  // TC-DASH-05: Navigation ไปหน้าต่างๆ จาก Dashboard
  test('TC-DASH-05: Navigation ไปหน้าต่างๆ จาก Dashboard', async ({ page }) => {
    const dp = new DashboardPage(page);
    await dp.goto();

    // Books
    await dp.navigateTo(dp.booksLink);
    await expect(page).toHaveURL(/books/i);
    await page.goBack();
    await page.waitForLoadState('networkidle');

    // Members
    await dp.navigateTo(dp.membersLink);
    await expect(page).toHaveURL(/members/i);
    await page.goBack();
    await page.waitForLoadState('networkidle');

    // Borrow
    await dp.navigateTo(dp.borrowingLink);
    await expect(page).toHaveURL(/borrow/i);
    await page.goBack();
    await page.waitForLoadState('networkidle');

    // Reports
    await dp.navigateTo(dp.reportsLink);
    await expect(page).toHaveURL(/report/i);
  });

  // TC-DASH-06: [BUG] Warning overdue ต้องตรงกับจำนวน Overdue จริงใน return.php
  test('TC-DASH-06: [BUG] จำนวน Overdue ใน Warning ต้องตรงกับความเป็นจริง', async ({ page }) => {
    const dp = new DashboardPage(page);
    await dp.goto();

    // อ่านตัวเลขจาก Warning message
    const warningEl = page.locator('text=/overdue books/i').first();
    const hasWarning = await warningEl.isVisible().catch(() => false);

    if (!hasWarning) return;

    const warningText = await warningEl.textContent();
    const match = warningText.match(/(\d+)\s+overdue/i);
    const warningCount = match ? parseInt(match[1]) : 0;

    // ไปตรวจนับใน return.php
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

    expect(warningCount,
      `[BUG DETECTED] Warning บอก ${warningCount} overdue แต่จริงๆ มี ${actualOverdue}`
    ).toBe(actualOverdue);
  });
});