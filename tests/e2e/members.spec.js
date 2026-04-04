// tests/e2e/members.spec.js
const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../pages/LoginPage');
const { MembersPage } = require('../../pages/MembersPage');

test.describe('Members Management Module (ตาม Excel)', () => {
  
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('admin', 'admin123');
  });

// แก้ไขเฉพาะจุดที่เช็คผล (Expect)
test('TC-MEM-01: เพิ่มสมาชิกใหม่สำเร็จ (Happy Path)', async ({ page }) => {
  const membersPage = new MembersPage(page);
  await membersPage.goto();
  const name = 'User-' + Date.now();
  await membersPage.fillMemberInfo('M'+Date.now().toString().slice(-5), name, 'test@mail.com', '0812345678');
  
  // เพิ่ม Timeout เป็น 15-20 วินาที เพื่อรองรับความช้าของระบบ
  await expect(page.getByText(name)).toBeVisible({ timeout: 15000 });
});

  test('TC-MEM-02: [BUG 31] ตรวจสอบการกรอก Email ผิดรูปแบบ', async ({ page }) => {
    const membersPage = new MembersPage(page);
    await membersPage.goto();
    // ใส่ Email ไม่มี @ หรือ .com
    await membersPage.fillMemberInfo('M-ERR-1', 'Bad Email', 'wrong-email-format', '099999999');
    
    // ถ้าเจอบั๊ก 31 ระบบจะยอมให้บันทึกผ่าน (Modal ปิด) แต่ถ้าปกติควรมี Error
    const errorMsg = page.locator('.invalid-feedback, .alert-danger, [validationMessage]');
    await expect(errorMsg.first(), '❌ BUG 31: ระบบยอมให้ใช้อีเมลผิดรูปแบบ').toBeVisible({ timeout: 5000 });
  });

  test('TC-MEM-03: ค้นหาสมาชิกด้วยรหัส (Search)', async ({ page }) => {
    const membersPage = new MembersPage(page);
    await membersPage.goto();
    
    // ดึงรหัสสมาชิกตัวแรกในตารางมาลองค้นหา
    const firstCode = await page.locator('table tbody tr td').first().innerText();
    await membersPage.searchInput.fill(firstCode);
    await membersPage.searchBtn.click();
    
    await expect(page.locator('table tbody')).toContainText(firstCode);
  });

  test('TC-MEM-04: [BUG 32] ป้องกันรหัสสมาชิกซ้ำ', async ({ page }) => {
    const membersPage = new MembersPage(page);
    await membersPage.goto();
    // ดึงรหัสที่มีอยู่แล้วมาใช้ใหม่
    const existingCode = await page.locator('table tbody tr td').first().innerText();
    await membersPage.fillMemberInfo(existingCode, 'Duplicate User', 'dup@mail.com', '011111111');
    
    // ถ้าเจอบั๊ก 32 ระบบจะบันทึกซ้ำได้ (Modal ปิด)
    const errorAlert = page.locator('.alert-danger, .error');
    await expect(errorAlert.first(), '❌ BUG 32: ระบบยอมให้ใช้รหัสสมาชิกซ้ำกันได้').toBeVisible({ timeout: 5000 });
  });

  test('TC-MEM-05: ตรวจสอบการปล่อยว่างฟิลด์ที่จำเป็น (Required Fields)', async ({ page }) => {
    const membersPage = new MembersPage(page);
    await membersPage.goto();
    await membersPage.addMemberBtn.click();
    // กดบันทึกทันทีโดยไม่กรอกอะไรเลย
    await membersPage.submitBtn.click();
    
    // เช็คว่า Modal ยังอยู่ (บันทึกไม่สำเร็จ)
    await expect(membersPage.codeInput).toBeVisible();
  });
});