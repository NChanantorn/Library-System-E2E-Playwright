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

  // ─────────────────────────────────────────────
  // TC-BOR-01: เปิดหน้า Borrowing Management
  // ─────────────────────────────────────────────
  test('TC-BOR-01: เปิดหน้า Borrowing Management', async ({ page }) => {
    const borrowingPage = new BorrowingPage(page);
    await borrowingPage.goto();

    await expect(page).toHaveURL(/borrow/);
    await expect(page.locator('table tbody')).toBeVisible({ timeout: 10000 });
    await expect(borrowingPage.newBorrowBtn.first()).toBeVisible({ timeout: 10000 });
  });

  // ─────────────────────────────────────────────
  // TC-BOR-02: ยืมหนังสือที่มีอยู่ในระบบ (Happy Path)
  // ─────────────────────────────────────────────
  test('TC-BOR-02: ยืมหนังสือที่มีอยู่ในระบบ', async ({ page }) => {
    const borrowingPage = new BorrowingPage(page);
    await borrowingPage.goto();

    const beforeCount = await borrowingPage.getRecordCount();

    await borrowingPage.clickNewBorrow();

    // กรอก Member ID/Code (ใช้ค่าที่มีจริงในระบบ)
    await borrowingPage.memberSelect.first().waitFor({ state: 'visible', timeout: 8000 });
    const memberTag = await borrowingPage.memberSelect.first().evaluate(n => n.tagName.toLowerCase());
    if (memberTag === 'select') {
      await borrowingPage.memberSelect.first().selectOption({ index: 1 });
    } else {
      await borrowingPage.memberSelect.first().fill('M001');
    }

    // เลือกหนังสือ
    const bookTag = await borrowingPage.bookSelect.first().evaluate(n => n.tagName.toLowerCase());
    if (bookTag === 'select') {
      await borrowingPage.bookSelect.first().selectOption({ index: 1 });
    } else {
      await borrowingPage.bookSelect.first().fill('1');
    }

    await borrowingPage.submitBorrow();

    // รายการต้องเพิ่มขึ้น
    const afterCount = await borrowingPage.getRecordCount();
    expect(afterCount).toBeGreaterThan(beforeCount);
  });

  // ─────────────────────────────────────────────
  // TC-BOR-03: คืนหนังสือ
  // ─────────────────────────────────────────────
  test('TC-BOR-03: คืนหนังสือ', async ({ page }) => {
    const borrowingPage = new BorrowingPage(page);
    await borrowingPage.goto();

    await page.waitForSelector('table tbody tr', { timeout: 10000 });

    // หาแถวที่สถานะ Borrowed
    const borrowedRow = page.locator('table tbody tr').filter({ hasText: /Borrowed|ยืม/ }).first();
    const hasBorrowed = await borrowedRow.isVisible().catch(() => false);

    if (!hasBorrowed) {
      console.log('ℹ️  ไม่มีรายการที่ยืมอยู่ ข้ามการทดสอบ');
      return;
    }

    // กด Return
    const returnBtn = borrowedRow.locator('a, button').filter({ hasText: /Return|คืน/i });
    await returnBtn.first().click();
    await page.waitForLoadState('networkidle', { timeout: 15000 });

    // แถวนั้นต้องเปลี่ยนสถานะเป็น Returned หรือหายไป
    const stillBorrowed = await borrowedRow.isVisible().catch(() => false);
    const returnedVisible = await page.locator('table tbody tr')
      .filter({ hasText: /Returned|คืนแล้ว/ }).first().isVisible().catch(() => false);
    expect(!stillBorrowed || returnedVisible).toBeTruthy();
  });

  // ─────────────────────────────────────────────
  // TC-BOR-04: ดูรายละเอียดการยืม (Details)
  // ─────────────────────────────────────────────
  test('TC-BOR-04: ดูรายละเอียดการยืม (Details)', async ({ page }) => {
    const borrowingPage = new BorrowingPage(page);
    await borrowingPage.goto();

    await page.waitForSelector('table tbody tr', { timeout: 10000 });
    const firstRow = page.locator('table tbody tr').first();
    const cellCount = await firstRow.locator('td').count();

    // ตารางต้องมีคอลัมน์ครบ: ID, Member, Book, Borrow Date, Due Date, Status, Actions
    expect(cellCount).toBeGreaterThanOrEqual(5);
  });

  // ─────────────────────────────────────────────
  // TC-BOR-05: [BUG 10] Overdue Status ต้องอัปเดตอัตโนมัติ
  // ─────────────────────────────────────────────
  test('TC-BOR-05: [BUG 10] ตรวจสอบ Overdue Status', async ({ page }) => {
    const borrowingPage = new BorrowingPage(page);
    await borrowingPage.goto();

    await page.waitForSelector('table tbody tr', { timeout: 10000 });

    // ดึงทุกแถวที่ยังสถานะ Borrowed
    const borrowedRows = page.locator('table tbody tr').filter({ hasText: /Borrowed/ });
    const count = await borrowedRows.count();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let overdueButNotMarked = 0;

    for (let i = 0; i < count; i++) {
      const row = borrowedRows.nth(i);
      const cells = row.locator('td');
      const cellCount = await cells.count();

      // หา Due Date จากเซลล์ (pattern YYYY-MM-DD)
      for (let c = 0; c < cellCount; c++) {
        const text = await cells.nth(c).innerText();
        const match = text.match(/(\d{4}-\d{2}-\d{2})/);
        if (match) {
          const dueDate = new Date(match[1]);
          if (dueDate < today) {
            overdueButNotMarked++;
            console.warn(`⚠️  [BUG 10 DETECTED] แถว ${i+1}: Due Date ${match[1]} เลยแล้ว แต่ยังแสดง "Borrowed"`);
          }
          break;
        }
      }
    }

    expect(overdueButNotMarked, 
      `[BUG 10 DETECTED] พบ ${overdueButNotMarked} รายการที่ Due Date เลยแล้วแต่ยัง Status = Borrowed`
    ).toBe(0);
  });

  // ─────────────────────────────────────────────
  // TC-BOR-06: [BUG 23] Due Date ต้องแตกต่างตามประเภทสมาชิก
  // BUG 23 → ทุกคนได้ 14 วัน (student/teacher/admin เท่ากันหมด)
  // ─────────────────────────────────────────────
  test('TC-BOR-06: [BUG 23] Due Date ต้องแตกต่างตามประเภทสมาชิก', async ({ page }) => {
    const borrowingPage = new BorrowingPage(page);
    await borrowingPage.goto();

    await page.waitForSelector('table tbody tr', { timeout: 10000 });

    // ดึง borrow_date และ due_date เพื่อคำนวณ loan period
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

      // คาดว่ามี borrow_date และ due_date อย่างน้อย 2 วัน
      if (dates.length >= 2) {
        const diffDays = Math.round((dates[1] - dates[0]) / (1000 * 60 * 60 * 24));
        if (diffDays > 0) loanPeriods.add(diffDays);
      }
    }

    console.log('Loan periods found:', [...loanPeriods]);

    if (loanPeriods.size === 1 && loanPeriods.has(14)) {
      console.warn('⚠️  [BUG 23 DETECTED] ทุกคนได้ 14 วันเท่ากัน ไม่แตกต่างตามประเภทสมาชิก');
    }

    // ถ้ามีข้อมูลหลายแถว ต้องมีหลาย loan period (แสดงว่าแยกตามประเภทสมาชิกจริง)
    if (count >= 3 && loanPeriods.size === 1) {
      expect(loanPeriods.size,
        '[BUG 23 DETECTED] Loan period เหมือนกันทุกคน ระบบไม่ได้แยกตามประเภทสมาชิก'
      ).toBeGreaterThan(1);
    }
  });

  // ─────────────────────────────────────────────
  // TC-BOR-07: [BUG 21] ป้องกันการยืมเมื่อ Available = 0
  // BUG 21 → ใช้ >= แทน > ทำให้ยืมได้แม้จะเต็มแล้ว
  // ─────────────────────────────────────────────
  test('TC-BOR-07: [BUG 21] ป้องกันการยืมหนังสือที่ Available = 0', async ({ page }) => {
    const borrowingPage = new BorrowingPage(page);
    await borrowingPage.goto();

    await borrowingPage.clickNewBorrow();
    await borrowingPage.memberSelect.first().waitFor({ state: 'visible', timeout: 8000 });

    // เลือก member
    const memberTag = await borrowingPage.memberSelect.first().evaluate(n => n.tagName.toLowerCase());
    if (memberTag === 'select') {
      await borrowingPage.memberSelect.first().selectOption({ index: 1 });
    } else {
      await borrowingPage.memberSelect.first().fill('M001');
    }

    // พยายามเลือกหนังสือที่ Available = 0
    // วิธีตรวจ: ดูว่า option ที่ available=0 ถูก disable ไว้หรือเปล่า
    const bookSelectEl = borrowingPage.bookSelect.first();
    const bookTag = await bookSelectEl.evaluate(n => n.tagName.toLowerCase());

    if (bookTag === 'select') {
      // ดึง options ทั้งหมด หา option ที่ข้อความระบุ "0" available
      const zeroAvailOption = page.locator('select option').filter({ hasText: /\(0\)|available: 0|0 available/i }).first();
      const hasZeroOpt = await zeroAvailOption.isVisible().catch(() => false);

      if (hasZeroOpt) {
        const isDisabled = await zeroAvailOption.evaluate(n => n.disabled);
        expect(isDisabled,
          '[BUG 21 DETECTED] หนังสือที่ Available=0 ไม่ถูก disable ในรายการ สามารถเลือกได้'
        ).toBeTruthy();
      } else {
        console.log('ℹ️  ไม่มีหนังสือที่ Available=0 ในระบบ ไม่สามารถทดสอบได้');
      }
    }

    expect(true).toBeTruthy(); // ผ่านถ้าไม่มีข้อมูลให้ทดสอบ
  });

  // ─────────────────────────────────────────────
  // EDGE-CASE: ตรวจสอบ BUG 20 — สมาชิก suspended ยืมได้
  // ─────────────────────────────────────────────
  test('EDGE-CASE-BOR: [BUG 20] สมาชิก suspended ต้องยืมหนังสือไม่ได้', async ({ page }) => {
    const borrowingPage = new BorrowingPage(page);
    await borrowingPage.goto();

    await borrowingPage.clickNewBorrow();
    await borrowingPage.memberSelect.first().waitFor({ state: 'visible', timeout: 8000 });

    const memberTag = await borrowingPage.memberSelect.first().evaluate(n => n.tagName.toLowerCase());

    if (memberTag === 'select') {
      // ดู option ที่ข้อความมีคำว่า suspended/inactive
      const suspendedOption = page.locator('select option')
        .filter({ hasText: /suspended|inactive|ระงับ/i }).first();
      const hasSuspended = await suspendedOption.isVisible().catch(() => false);

      if (hasSuspended) {
        await suspendedOption.click();

        // เลือกหนังสือ
        const bookTag = await borrowingPage.bookSelect.first().evaluate(n => n.tagName.toLowerCase());
        if (bookTag === 'select') {
          await borrowingPage.bookSelect.first().selectOption({ index: 1 });
        }

        await borrowingPage.submitBorrow();

        // ระบบต้องแสดง error — ไม่ให้ยืม
        const errorVisible = await page.locator('[class*="alert"], [class*="error"], .text-danger, .alert-danger')
          .first().isVisible({ timeout: 5000 }).catch(() => false);

        expect(errorVisible,
          '[BUG 20 DETECTED] สมาชิก suspended ยืมหนังสือได้โดยไม่มี error'
        ).toBeTruthy();
      } else {
        console.log('ℹ️  ไม่มีสมาชิก suspended ในระบบ ไม่สามารถทดสอบได้');
      }
    }

    expect(true).toBeTruthy();
  });

  // ─────────────────────────────────────────────
  // EDGE-CASE: Performance
  // ─────────────────────────────────────────────
  test('EDGE-CASE-BOR-01: หน้าโหลดภายใน 15 วินาที', async ({ page }) => {
    const borrowingPage = new BorrowingPage(page);
    const start = Date.now();
    await borrowingPage.goto();
    expect(Date.now() - start).toBeLessThan(15000);
  });

  // ─────────────────────────────────────────────
  // EDGE-CASE: ข้อมูลคงที่หลัง reload
  // ─────────────────────────────────────────────
  test('EDGE-CASE-BOR-02: ข้อมูลคงที่หลัง reload', async ({ page }) => {
    const borrowingPage = new BorrowingPage(page);
    await borrowingPage.goto();
    const before = await borrowingPage.getRecordCount();
    await page.reload();
    await page.waitForLoadState('networkidle', { timeout: 15000 });
    expect(await borrowingPage.getRecordCount()).toBe(before);
  });

  // ─────────────────────────────────────────────
  // EDGE-CASE: Date format ถูกต้อง
  // ─────────────────────────────────────────────
  test('EDGE-CASE-BOR-10: รูปแบบวันที่ถูกต้อง', async ({ page }) => {
    const borrowingPage = new BorrowingPage(page);
    await borrowingPage.goto();

    const dateCells = page.locator('table td').filter({ hasText: /\d{4}-\d{2}-\d{2}/ });
    const count = await dateCells.count();

    for (let i = 0; i < Math.min(count, 10); i++) {
      const text = (await dateCells.nth(i).innerText()).trim();
      expect(text).toMatch(/\d{4}-\d{2}-\d{2}/);
    }
  });
});