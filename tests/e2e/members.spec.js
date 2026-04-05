// tests/e2e/members.spec.js
const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../pages/LoginPage');
const { MembersPage } = require('../../pages/MembersPage');

function uniqueCode() {
  return 'M' + Date.now().toString().slice(-6);
}

test.describe('Members Management Module', () => {

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('admin', 'admin123');
    await expect(page).not.toHaveURL(/login/);
  });

  // ─────────────────────────────────────────────
  // TC-MEM-01: เปิดหน้า Members Management
  // ─────────────────────────────────────────────
  test('TC-MEM-01: เปิดหน้า Members Management', async ({ page }) => {
    const membersPage = new MembersPage(page);
    await membersPage.goto();

    await expect(page).toHaveURL(/members/);
    await expect(page.locator('table tbody')).toBeVisible({ timeout: 10000 });
    await expect(membersPage.addMemberBtn.first()).toBeVisible({ timeout: 10000 });
  });

  // ─────────────────────────────────────────────
  // TC-MEM-02: แสดงรายการสมาชิกทั้งหมด
  // ─────────────────────────────────────────────
  test('TC-MEM-02: แสดงรายการสมาชิกทั้งหมด', async ({ page }) => {
    const membersPage = new MembersPage(page);
    await membersPage.goto();

    const firstRow = page.locator('table tbody tr').first();
    await expect(firstRow).toBeVisible({ timeout: 10000 });

    // ต้องมีคอลัมน์ครบ: ID, Full Name, Email, Phone, Status, Max Books
    const cellCount = await firstRow.locator('td').count();
    expect(cellCount).toBeGreaterThanOrEqual(4);
  });

  // ─────────────────────────────────────────────
  // TC-MEM-03: เพิ่มสมาชิกใหม่ด้วยข้อมูลครบถ้วน
  // ─────────────────────────────────────────────
  test('TC-MEM-03: เพิ่มสมาชิกใหม่ด้วยข้อมูลครบถ้วน', async ({ page }) => {
    const membersPage = new MembersPage(page);
    await membersPage.goto();

    const code = uniqueCode();
    const name = 'Test-Member-' + Date.now();

    await membersPage.fillMemberInfo(code, name, 'test@mail.com', '0812345678');

    // สมาชิกใหม่ต้องปรากฏในตาราง
    await expect(membersPage.rowWith(name)).toBeVisible({ timeout: 10000 });
  });

  // ─────────────────────────────────────────────
  // TC-MEM-04: [BUG 32] เพิ่มสมาชิกด้วย Member Code ที่ซ้ำ
  // BUG 32 → ไม่ตรวจ member_code ซ้ำ → บันทึกซ้ำได้
  // ─────────────────────────────────────────────
  test('TC-MEM-04: [BUG 32] เพิ่มสมาชิกด้วย Member Code ที่ซ้ำ', async ({ page }) => {
    const membersPage = new MembersPage(page);
    await membersPage.goto();

    // ดึง code จากแถวแรก (คอลัมน์แรก = member_code)
    await page.waitForSelector('table tbody tr', { timeout: 10000 });
    const existingCode = (await page.locator('table tbody tr td').first().innerText()).trim();

    // พยายามเพิ่มด้วย code เดิม
    await membersPage.fillMemberInfo(existingCode, 'Duplicate-User', 'dup@mail.com', '000000000');

    // ระบบต้องแสดง error — ถ้าไม่มี = BUG 32
    const errorVisible = await page.locator('.alert-danger, .error-message, [class*="alert"], .text-danger')
                              .first().isVisible({ timeout: 5000 }).catch(() => false);
    expect(errorVisible,
      '[BUG 32 DETECTED] ระบบยอมให้ใช้ Member Code ซ้ำได้โดยไม่แสดง error'
    ).toBeTruthy();
  });

// TC-MEM-05: [BUG] ไม่มีปุ่ม Edit ในตาราง Members
test('TC-MEM-05: [BUG] แก้ไขข้อมูลสมาชิก — ไม่มีปุ่ม Edit', async ({ page }) => {
  const membersPage = new MembersPage(page);
  await membersPage.goto();

  await page.waitForSelector('table tbody tr', { timeout: 10000 });

  const editBtn = page.locator('table tbody tr').first()
                      .locator('a, button').filter({ hasText: /Edit|แก้ไข/i });

  const hasEdit = await editBtn.first().isVisible().catch(() => false);
  expect(hasEdit,
    '[BUG DETECTED] ไม่มีปุ่ม Edit ในตาราง Members'
  ).toBeTruthy();
});

// TC-MEM-06: [BUG] ไม่มีปุ่ม Delete ในตาราง Members
test('TC-MEM-06: [BUG] ลบสมาชิก — ไม่มีปุ่ม Delete', async ({ page }) => {
  const membersPage = new MembersPage(page);
  await membersPage.goto();

  await page.waitForSelector('table tbody tr', { timeout: 10000 });

  const deleteBtn = page.locator('table tbody tr').first()
                        .locator('a, button').filter({ hasText: /Delete|ลบ/i });

  const hasDelete = await deleteBtn.first().isVisible().catch(() => false);
  expect(hasDelete,
    '[BUG DETECTED] ไม่มีปุ่ม Delete ในตาราง Members'
  ).toBeTruthy();
});

  // ─────────────────────────────────────────────
  // TC-MEM-07: เพิ่มสมาชิกโดยไม่กรอกข้อมูลที่จำเป็น
  // ─────────────────────────────────────────────
  test('TC-MEM-07: เพิ่มสมาชิกโดยไม่กรอกข้อมูลที่จำเป็น', async ({ page }) => {
    const membersPage = new MembersPage(page);
    await membersPage.goto();

    await membersPage.openAddForm();

    // Submit โดยไม่กรอกอะไร
    await membersPage.submitBtn.first().click();
    await page.waitForTimeout(500);

    // ต้องมี validation error หรือ form ยังแสดงอยู่ (modal ไม่ปิด)
    const codeRequired = await membersPage.codeInput.evaluate(n => n.validity.valueMissing).catch(() => false);
    const nameRequired = await membersPage.nameInput.evaluate(n => n.validity.valueMissing).catch(() => false);
    const errorVisible = await page.locator('[class*="alert"], [class*="error"], .text-danger')
                              .first().isVisible().catch(() => false);
    const formStillOpen = await membersPage.codeInput.isVisible().catch(() => false);

    expect(codeRequired || nameRequired || errorVisible || formStillOpen,
      'ต้องมี validation error หรือ form ยังเปิดอยู่เมื่อไม่กรอกข้อมูล'
    ).toBeTruthy();
  });

  // ─────────────────────────────────────────────
  // TC-MEM-XX: [BUG 31] ไม่ตรวจสอบรูปแบบ Email
  // BUG 31 → กรอก email ผิดรูปแบบก็บันทึกได้
  // ─────────────────────────────────────────────
  test('TC-MEM-08: [BUG 31] ระบบต้องปฏิเสธ Email ที่ผิดรูปแบบ', async ({ page }) => {
    const membersPage = new MembersPage(page);
    await membersPage.goto();

    await membersPage.fillMemberInfo(
      uniqueCode(),
      'Invalid-Email-User',
      'not-an-email',   // ← email ผิดรูปแบบ
      '0812345678'
    );

    // ระบบที่ถูกต้องต้องแสดง error
    const htmlInvalid = await membersPage.emailInput.evaluate(n => !n.validity.valid).catch(() => false);
    const errorVisible = await page.locator('[class*="alert"], [class*="error"], .text-danger')
                              .first().isVisible({ timeout: 3000 }).catch(() => false);

    if (!htmlInvalid && !errorVisible) {
      console.warn('⚠️  [BUG 31 DETECTED] ระบบยอมรับ email ผิดรูปแบบ: "not-an-email"');
    }
    expect(htmlInvalid || errorVisible,
      '[BUG 31 DETECTED] ระบบต้องปฏิเสธ email ที่ไม่มี @ และ domain'
    ).toBeTruthy();
  });

  // ─────────────────────────────────────────────
  // TC-MEM-XX: [BUG 33] Teacher ได้ max_books = 3 แทนที่จะเป็น 5
  // ─────────────────────────────────────────────
  test('TC-MEM-09: [BUG 33] Teacher ต้องได้ max_books = 5 ไม่ใช่ 3', async ({ page }) => {
    const membersPage = new MembersPage(page);
    await membersPage.goto();

    const code = uniqueCode();
    const name  = 'Teacher-Test-' + Date.now();

    // เพิ่มสมาชิกประเภท teacher
    await membersPage.fillMemberInfo(code, name, 'teacher@mail.com', '0812345678', 'teacher');

    // หาแถวของสมาชิกใหม่
    const row = membersPage.rowWith(name);
    await expect(row).toBeVisible({ timeout: 10000 });

    // ดึงค่า max_books จากตาราง (คาดว่าอยู่คอลัมน์ Max Books)
    const cells = row.locator('td');
    const cellCount = await cells.count();
    let maxBooksValue = null;

    for (let i = 0; i < cellCount; i++) {
      const text = (await cells.nth(i).innerText()).trim();
      if (/^[35]$/.test(text)) {
        maxBooksValue = parseInt(text, 10);
        break;
      }
    }

    if (maxBooksValue !== null) {
      if (maxBooksValue === 3) {
        console.warn('⚠️  [BUG 33 DETECTED] Teacher ได้ max_books = 3 แทนที่จะเป็น 5');
      }
      expect(maxBooksValue,
        '[BUG 33 DETECTED] Teacher ต้องได้ max_books = 5'
      ).toBe(5);
    } else {
      console.log('ℹ️  ไม่พบค่า max_books ในตาราง ไม่สามารถตรวจสอบได้');
    }
  });
});