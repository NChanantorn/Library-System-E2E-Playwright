// tests/e2e/borrowing.spec.js
const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../pages/LoginPage');
const { BorrowingPage } = require('../../pages/BorrowingPage');

test.describe('Borrowing Management Module', () => {

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('admin', 'admin123');
    await expect(page).not.toHaveURL(/login/);
  });

  // TC-BOR-01: เปิดหน้า Borrow Form
  test('TC-BOR-01: เปิดหน้า Borrowing Management', async ({ page }) => {
    const bp = new BorrowingPage(page);
    await bp.gotoBorrowForm();

    await expect(page).toHaveURL(/borrow\.php/);

    // borrow.php มี form ยืม
    await expect(bp.memberInput).toBeVisible({ timeout: 5000 });
    await expect(bp.bookSelect).toBeVisible({ timeout: 5000 });
    await expect(bp.submitBtn).toBeVisible({ timeout: 5000 });
  });

  // TC-BOR-02: ยืมหนังสือ Happy Path
  test('TC-BOR-02: ยืมหนังสือที่มีอยู่ในระบบ', async ({ page }) => {
    const bp = new BorrowingPage(page);
    await bp.gotoReturnList();
    const beforeCount = await bp.getRecordCount();

    await bp.gotoBorrowForm();
    await bp.borrowBook('M001', 1);

    // ตรวจผลใน return.php
    await bp.gotoReturnList();
    const afterCount = await bp.getRecordCount();
    expect(afterCount).toBeGreaterThan(beforeCount);
  });

  // TC-BOR-03: คืนหนังสือ
  test('TC-BOR-03: คืนหนังสือ', async ({ page }) => {
    const bp = new BorrowingPage(page);
    await bp.gotoReturnList();

    const borrowedRow = page.locator('table tbody tr').filter({ hasText: /Borrowed/i }).first();
    const hasBorrowed = await borrowedRow.isVisible().catch(() => false);

    if (!hasBorrowed) {
      console.log('ℹ️  ไม่มีรายการ Borrowed ข้ามการทดสอบ');
      return;
    }

    const returnBtn = borrowedRow.getByRole('link', { name: /Return/i });
    await returnBtn.click();
    await page.waitForLoadState('networkidle', { timeout: 15000 });

    // หลัง return ต้องมีสถานะ Returned
    const returnedRow = page.locator('table tbody tr').filter({ hasText: /Returned/i }).first();
    await expect(returnedRow).toBeVisible({ timeout: 5000 });
  });

  // TC-BOR-04: ตารางมี column ครบ
  test('TC-BOR-04: ดูรายละเอียดการยืม (Details)', async ({ page }) => {
    const bp = new BorrowingPage(page);
    await bp.gotoReturnList();

    await expect(bp.borrowingTable).toBeVisible({ timeout: 5000 });
    const firstRow = page.locator('table tbody tr').first();
    const cellCount = await firstRow.locator('td').count();

    // Member, Book, Borrow Date, Due Date, Status, Actions
    expect(cellCount).toBeGreaterThanOrEqual(5);
  });

  // TC-BOR-05: [BUG 10] Overdue Status ต้องอัปเดตอัตโนมัติ
  test('TC-BOR-05: [BUG 10] ตรวจสอบ Overdue Status', async ({ page }) => {
    const bp = new BorrowingPage(page);
    await bp.gotoReturnList();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const borrowedRows = page.locator('table tbody tr').filter({ hasText: /Borrowed/i });
    const count = await borrowedRows.count();
    const errors = [];

    for (let i = 0; i < count; i++) {
      const cells = borrowedRows.nth(i).locator('td');
      const cellCount = await cells.count();

      for (let c = 0; c < cellCount; c++) {
        const text = await cells.nth(c).innerText();
        const match = text.match(/(\d{4}-\d{2}-\d{2})/);
        if (match) {
          const dueDate = new Date(match[1]);
          if (dueDate < today) {
            errors.push(`Row ${i+1}: Due Date ${match[1]} เลยแล้ว แต่ยัง Status = Borrowed`);
          }
          break;
        }
      }
    }

    expect(errors,
      `[BUG 10 DETECTED] พบรายการ Due Date เลยแล้วแต่ยัง Borrowed:\n${errors.join('\n')}`
    ).toHaveLength(0);
  });

  // TC-BOR-06: [BUG 23] Due Date ต้องแตกต่างตามประเภทสมาชิก
  // rules: Student=14วัน, Teacher=30วัน, Public=7วัน
  test('TC-BOR-06: [BUG 23] Due Date ต้องแตกต่างตามประเภทสมาชิก', async ({ page }) => {
    const bp = new BorrowingPage(page);
    await bp.gotoReturnList();

    const rows = page.locator('table tbody tr');
    const count = await rows.count();
    const loanPeriods = new Set();

    for (let i = 0; i < Math.min(count, 10); i++) {
      const cells = rows.nth(i).locator('td');
      const cellCount = await cells.count();
      const dates = [];

      for (let c = 0; c < cellCount; c++) {
        const text = (await cells.nth(c).innerText()).trim();
        if (/^\d{4}-\d{2}-\d{2}$/.test(text)) {
          dates.push(new Date(text));
        }
      }

      if (dates.length >= 2) {
        const diffDays = Math.round((dates[1] - dates[0]) / (1000 * 60 * 60 * 24));
        if (diffDays > 0) loanPeriods.add(diffDays);
      }
    }

    if (count >= 3 && loanPeriods.size === 1) {
      expect(loanPeriods.size,
        `[BUG 23 DETECTED] Loan period เหมือนกันทุกคน (${[...loanPeriods][0]} วัน) ระบบไม่แยกตามประเภทสมาชิก`
      ).toBeGreaterThan(1);
    }
  });

  // TC-BOR-07: [BUG 21] ป้องกันยืมหนังสือที่ Available = 0
  test('TC-BOR-07: [BUG 21] ป้องกันการยืมหนังสือที่ Available = 0', async ({ page }) => {
    const bp = new BorrowingPage(page);
    await bp.gotoBorrowForm();

    // ดู options ทั้งหมดใน select — ไม่ควรมีหนังสือที่ Available: 0
    const zeroOption = page.locator('select option').filter({ hasText: /Available: 0/i });
    const count = await zeroOption.count();

    if (count > 0) {
      // ถ้ามี option ที่ available=0 ต้องถูก disable
      for (let i = 0; i < count; i++) {
        const isDisabled = await zeroOption.nth(i).evaluate(n => n.disabled);
        expect(isDisabled,
          `[BUG 21 DETECTED] หนังสือ Available=0 ไม่ถูก disable — สามารถเลือกได้`
        ).toBeTruthy();
      }
    } else {
      console.log('ℹ️  ไม่มีหนังสือ Available=0 ในระบบ');
    }
  });

  // TC-BOR-08: [BUG] Fine rate ต้องเป็น 5 บาท/วัน ตามที่แสดงใน Borrowing Rules
  // แต่ reports.php คำนวณ Fine = Days x 5 (ตรงกับ rule)
  // แต่ TC-REP-03 พบว่า Fine ออกมาเป็น Days x 5 ไม่ใช่ Days x 10 ตาม spec
  test('TC-BOR-08: [BUG] Fine rate ใน Reports ไม่ตรงกับ Borrowing Rules', async ({ page }) => {
    // borrow.php บอก Fine = 5 Baht/day
    await page.goto('http://localhost:8080/borrow.php');
    await page.waitForLoadState('networkidle');

    const ruleText = await page.locator('text=/Fine/i').first().textContent();
    const rateMatch = ruleText.match(/(\d+)\s*Baht/i);
    const ruleRate = rateMatch ? parseInt(rateMatch[1]) : null;

    // reports.php แสดง Fine จริง
    await page.goto('http://localhost:8080/reports.php');
    await page.waitForLoadState('networkidle');

    const overdueTable = page.locator('table').filter({
      has: page.locator('th', { hasText: /Days Overdue/i })
    });
    const firstRow = overdueTable.locator('tbody tr').first();
    const hasRow = await firstRow.isVisible().catch(() => false);

    if (hasRow && ruleRate) {
      const daysText = await firstRow.locator('td').nth(5).textContent();
      const fineText = await firstRow.locator('td').nth(6).textContent();
      const days = parseInt(daysText.replace(/[^0-9]/g, ''));
      const fine = parseFloat(fineText.replace(/[^0-9.]/g, ''));
      const expectedFine = days * ruleRate;

      expect(fine,
        `[BUG DETECTED] Fine ใน Reports (${fine}) ไม่ตรงกับ rule ${ruleRate} Baht/day × ${days} days = ${expectedFine}`
      ).toBe(expectedFine);
    }
  });

  // TC-BOR-09: [BUG 20] สมาชิก suspended ต้องยืมหนังสือไม่ได้
  test('TC-BOR-09: [BUG 20] สมาชิก suspended ต้องยืมหนังสือไม่ได้', async ({ page }) => {
    const bp = new BorrowingPage(page);
    await bp.gotoBorrowForm();

    // ลองกรอก member code ที่ suspended
    await bp.memberInput.fill('M999'); // member ที่ไม่มีหรือ suspended
    await bp.bookSelect.selectOption({ index: 1 });
    await bp.submitBtn.click();
    await page.waitForLoadState('networkidle', { timeout: 15000 });

    // ต้องมี error message
    const errorMsg = page.locator('.alert-danger, .alert-warning, [class*="error"]');
    await expect(errorMsg.first()).toBeVisible({ timeout: 5000 });
  });

  // EDGE-CASE-BOR-01: หน้าโหลดภายใน 15 วินาที
  test('EDGE-CASE-BOR-01: หน้าโหลดภายใน 15 วินาที', async ({ page }) => {
    const bp = new BorrowingPage(page);
    const start = Date.now();
    await bp.gotoBorrowForm();
    expect(Date.now() - start).toBeLessThan(15000);
  });

  // EDGE-CASE-BOR-02: ข้อมูลคงที่หลัง reload
  test('EDGE-CASE-BOR-02: ข้อมูลคงที่หลัง reload', async ({ page }) => {
    const bp = new BorrowingPage(page);
    await bp.gotoReturnList();
    const before = await bp.getRecordCount();
    await page.reload();
    await page.waitForLoadState('networkidle', { timeout: 15000 });
    expect(await bp.getRecordCount()).toBe(before);
  });

  // EDGE-CASE-BOR-10: รูปแบบวันที่ถูกต้อง
  test('EDGE-CASE-BOR-10: รูปแบบวันที่ถูกต้อง', async ({ page }) => {
    const bp = new BorrowingPage(page);
    await bp.gotoReturnList();

    const dateCells = page.locator('table td').filter({ hasText: /\d{4}-\d{2}-\d{2}/ });
    const count = await dateCells.count();

    for (let i = 0; i < Math.min(count, 10); i++) {
      const text = (await dateCells.nth(i).innerText()).trim();
      expect(text).toMatch(/\d{4}-\d{2}-\d{2}/);
    }
  });
});