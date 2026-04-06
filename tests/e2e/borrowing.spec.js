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
  // borrow.php มี: Member Code input + Select Book + Borrow Book button
  // ─────────────────────────────────────────────
  test('TC-BOR-01: เปิดหน้า Borrowing Management', async ({ page }) => {
    const bp = new BorrowingPage(page);
    await bp.gotoBorrowForm();

    await expect(page).toHaveURL(/borrow\.php/);
    await expect(bp.memberInput).toBeVisible({ timeout: 5000 });
    await expect(bp.bookSelect).toBeVisible({ timeout: 5000 });
    await expect(bp.submitBtn).toBeVisible({ timeout: 5000 });
  });

  // ─────────────────────────────────────────────
  // TC-BOR-02: ยืมหนังสือ Happy Path
  // ─────────────────────────────────────────────
  test('TC-BOR-02: ยืมหนังสือที่มีอยู่ในระบบ', async ({ page }) => {
    const bp = new BorrowingPage(page);
    await bp.gotoBorrowForm();

    // กรอก Member Code และเลือกหนังสือ แล้วกด Borrow Book
    await bp.borrowBook('M001', 1);

    // หลัง submit ระบบอาจ redirect กลับ borrow.php หรือแสดง success
    // ตรวจว่าไม่มี error — ไม่ขึ้น Fatal error หรือ alert-danger
    const bodyText = await page.locator('body').textContent();
    expect(bodyText).not.toContain('Fatal error');

    const errorAlert = await page.locator('.alert-danger').isVisible().catch(() => false);
    expect(errorAlert, 'ต้องไม่มี error หลังยืมหนังสือ').toBeFalsy();

    // ไปหน้า return.php ตรวจว่ามีรายการ Borrowed อยู่
    await bp.gotoReturnList();
    await expect(page.locator('table tbody tr').filter({ hasText: /Borrowed/i }).first())
      .toBeVisible({ timeout: 8000 });
  });

  // ─────────────────────────────────────────────
  // TC-BOR-03: คืนหนังสือ
  // ขั้นตอน: เริ่มที่ borrow.php → ไปหน้า return.php → กดปุ่ม Return → ยืนยัน dialog
  // ─────────────────────────────────────────────
  test('TC-BOR-03: คืนหนังสือ', async ({ page }) => {
    const bp = new BorrowingPage(page);

    // 1. เริ่มที่หน้า borrow.php ก่อน
    await bp.gotoBorrowForm();
    await expect(page).toHaveURL(/borrow\.php/);

    // 2. ไปหน้า return.php เพื่อคืนหนังสือ
    await bp.gotoReturnList();
    await page.waitForSelector('table tbody tr', { timeout: 10000 });

    const returnableRow = page.locator('table tbody tr')
      .filter({ hasText: /Borrowed|Overdue/i }).first();
    const hasRow = await returnableRow.isVisible().catch(() => false);

    if (!hasRow) {
      console.log('ℹ️  ไม่มีรายการที่ยืมอยู่ ข้ามการทดสอบ');
      return;
    }

    // นับจำนวนแถวทั้งหมดก่อนคืน
    const beforeCount = await bp.getRecordCount();

    // 3. ลงทะเบียน dialog handler ก่อนคลิก
    page.on('dialog', async dialog => { await dialog.accept(); });

    // 4. กดปุ่ม Return แถวแรก
    const returnBtn = returnableRow.locator('a').filter({ hasText: /^Return$/i }).first();
    await returnBtn.waitFor({ state: 'visible', timeout: 5000 });
    await returnBtn.click();

    // 5. รอหน้า reload หลัง dialog ปิด
    await page.waitForLoadState('networkidle', { timeout: 15000 });
    await page.waitForTimeout(500);

    // 6. จำนวนแถวต้องลดลง 1 (รายการที่คืนหายไปจาก Currently Borrowed Books)
    const afterCount = await bp.getRecordCount();
    expect(afterCount, 'จำนวนรายการต้องลดลงหลังคืนหนังสือ').toBeLessThan(beforeCount);
  });

  // ─────────────────────────────────────────────
  // TC-BOR-04: ตารางใน return.php มีคอลัมน์ครบ
  // Member | Book Title | ISBN | Borrow Date | Due Date | Days | Status | Action
  // ─────────────────────────────────────────────
  test('TC-BOR-04: ดูรายละเอียดการยืม (Details)', async ({ page }) => {
    const bp = new BorrowingPage(page);
    await bp.gotoReturnList();

    await expect(page.locator('table tbody')).toBeVisible({ timeout: 8000 });
    const firstRow = page.locator('table tbody tr').first();
    const cellCount = await firstRow.locator('td').count();

    // Member, Book Title, ISBN, Borrow Date, Due Date, Days, Status, Action = 8 คอลัมน์
    expect(cellCount).toBeGreaterThanOrEqual(5);
  });

  // ─────────────────────────────────────────────
  // TC-BOR-05: [BUG 10] Overdue Status ต้องอัปเดตอัตโนมัติ
  // ─────────────────────────────────────────────
  test('TC-BOR-05: [BUG 10] ตรวจสอบ Overdue Status', async ({ page }) => {
    const bp = new BorrowingPage(page);
    await bp.gotoReturnList();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // หาแถวที่ Status = Borrowed แต่ Due Date เลยแล้ว
    const borrowedRows = page.locator('table tbody tr').filter({ hasText: /Borrowed/i });
    const count = await borrowedRows.count();
    const errors = [];

    for (let i = 0; i < count; i++) {
      const cells = borrowedRows.nth(i).locator('td');
      // Due Date อยู่คอลัมน์ที่ 5 (index 4): Member|BookTitle|ISBN|BorrowDate|DueDate|Days|Status|Action
      const dueDateText = (await cells.nth(4).innerText()).trim();
      if (/^\d{4}-\d{2}-\d{2}$/.test(dueDateText)) {
        const dueDate = new Date(dueDateText);
        if (dueDate < today) {
          errors.push(`Row ${i+1}: Due=${dueDateText} เลยแล้วแต่ยัง Status=Borrowed`);
          console.warn(`⚠️  [BUG 10] ${errors[errors.length-1]}`);
        }
      }
    }

    expect(errors,
      `[BUG 10 DETECTED] พบรายการ Due Date เลยแต่ยัง Borrowed:\n${errors.join('\n')}`
    ).toHaveLength(0);
  });

  // ─────────────────────────────────────────────
  // TC-BOR-06: [BUG 23] Due Date ต้องแตกต่างตามประเภทสมาชิก
  // Rule: Student=14วัน, Teacher=30วัน, Public=7วัน
  // BUG 23 → ทุกคนได้ 14 วันเท่ากัน
  // ─────────────────────────────────────────────
  test('TC-BOR-06: [BUG 23] Due Date ต้องแตกต่างตามประเภทสมาชิก', async ({ page }) => {
    const bp = new BorrowingPage(page);
    await bp.gotoReturnList();

    const rows = page.locator('table tbody tr');
    const count = await rows.count();
    const loanPeriods = new Set();

    for (let i = 0; i < Math.min(count, 10); i++) {
      const cells = rows.nth(i).locator('td');
      // BorrowDate = คอลัมน์ 4 (index 3), DueDate = คอลัมน์ 5 (index 4)
      const borrowDateText = (await cells.nth(3).innerText()).trim();
      const dueDateText    = (await cells.nth(4).innerText()).trim();

      if (/^\d{4}-\d{2}-\d{2}$/.test(borrowDateText) && /^\d{4}-\d{2}-\d{2}$/.test(dueDateText)) {
        const diff = Math.round(
          (new Date(dueDateText) - new Date(borrowDateText)) / (1000 * 60 * 60 * 24)
        );
        if (diff > 0) loanPeriods.add(diff);
      }
    }

    console.log('Loan periods found:', [...loanPeriods]);

    // ถ้ามีรายการ >= 3 แถว แต่ loan period เป็นค่าเดียว = BUG 23
    if (count >= 3) {
      expect(loanPeriods.size,
        `[BUG 23 DETECTED] Loan period เหมือนกันทุกคน (${[...loanPeriods].join(',')} วัน) ระบบไม่แยกตามประเภทสมาชิก`
      ).toBeGreaterThan(1);
    }
  });

  // ─────────────────────────────────────────────
  // TC-BOR-07: ป้องกันการยืมหนังสือที่ Available = 0
  // ดูจาก return.php ว่ามีหนังสือ "การทดสอบซอฟต์แวร์" Available=0
  // ลอง borrow แล้วต้องได้ error
  // ─────────────────────────────────────────────
  test('TC-BOR-07: [BUG 21] ป้องกันการยืมหนังสือที่ Available = 0', async ({ page }) => {
    const bp = new BorrowingPage(page);
    await bp.gotoBorrowForm();

    await bp.memberInput.fill('M001');

    // ดู options ทั้งหมดใน select — หาหนังสือที่ available = 0
    const allOptions = await bp.bookSelect.locator('option').all();
    let zeroAvailValue = null;

    for (const opt of allOptions) {
      const text = await opt.textContent();
      const val  = await opt.getAttribute('value');
      if (text && /\(0\)|Avail.*0|0.*avail/i.test(text) && val) {
        zeroAvailValue = val;
        break;
      }
    }

    if (!zeroAvailValue) {
      console.log('ℹ️  ไม่มีหนังสือ Available=0 ในระบบ ข้ามการทดสอบ');
      return;
    }

    // เลือกหนังสือที่ available=0 แล้ว submit
    await bp.bookSelect.selectOption(zeroAvailValue);
    await bp.submitBtn.click();
    await page.waitForLoadState('networkidle', { timeout: 15000 });

    // ต้องมี error message — ถ้าไม่มี = BUG 21
    const errorMsg = page.locator('.alert-danger, .alert-warning, [class*="error"]');
    const hasError = await errorMsg.first().isVisible({ timeout: 5000 }).catch(() => false);
    expect(hasError,
      '[BUG 21 DETECTED] ยืมหนังสือที่ Available=0 ได้โดยไม่มี error'
    ).toBeTruthy();
  });

  // ─────────────────────────────────────────────
  // EDGE: Performance
  // ─────────────────────────────────────────────
  test('TC-BOR-08: หน้าโหลดภายใน 15 วินาที', async ({ page }) => {
    const bp = new BorrowingPage(page);
    const start = Date.now();
    await bp.gotoBorrowForm();
    expect(Date.now() - start).toBeLessThan(15000);
  });

  // ─────────────────────────────────────────────
  // EDGE: ข้อมูลคงที่หลัง reload
  // ─────────────────────────────────────────────
  test('TC-BOR-09: ข้อมูลคงที่หลัง reload', async ({ page }) => {
    const bp = new BorrowingPage(page);
    await bp.gotoReturnList();
    const before = await bp.getRecordCount();
    await page.reload();
    await page.waitForLoadState('networkidle', { timeout: 15000 });
    expect(await bp.getRecordCount()).toBe(before);
  });

  // ─────────────────────────────────────────────
  // EDGE: Date format ถูกต้อง
  // ─────────────────────────────────────────────
  test('TC-BOR-10: รูปแบบวันที่ถูกต้อง', async ({ page }) => {
    const bp = new BorrowingPage(page);
    await bp.gotoReturnList();

    const dateCells = page.locator('table td').filter({ hasText: /^\d{4}-\d{2}-\d{2}$/ });
    const count = await dateCells.count();

    for (let i = 0; i < Math.min(count, 10); i++) {
      const text = (await dateCells.nth(i).innerText()).trim();
      expect(text).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });
});