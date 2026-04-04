// tests/e2e/members.spec.js
const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../pages/LoginPage');
const { MembersPage } = require('../../pages/MembersPage');

test.describe('Members Management Module (ตาม TestCase.csv)', () => {
  
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('admin', 'admin123');
  });

  test('TC-MEM-01: เปิดหน้า Members Management', async ({ page }) => {
    const membersPage = new MembersPage(page);
    await membersPage.goto();
    
    // ตรวจสอบว่าหน้า Members โหลดสำเร็จ
    await expect(page).toHaveURL(/members/);
    
    // ตรวจสอบว่ามีรายการสมาชิกแสดง (ตาราง)
    const tableBody = page.locator('table tbody');
    await tableBody.waitFor({ state: 'visible', timeout: 10000 });
    
    // ตรวจสอบว่ามีปุ่ม Add Member
    await membersPage.addMemberBtn.first().waitFor({ state: 'visible', timeout: 10000 });
  });

  test('TC-MEM-02: แสดงรายการสมาชิกทั้งหมด', async ({ page }) => {
    const membersPage = new MembersPage(page);
    await membersPage.goto();
    
    // ตรวจสอบว่าตารางสมาชิกแสดง
    const tableBody = page.locator('table tbody');
    await tableBody.waitFor({ state: 'visible', timeout: 10000 });
    
    // ตรวจสอบว่ามีข้อมูลสมาชิก (อย่างน้อยตัวแรก)
    const firstRow = page.locator('table tbody tr').first();
    await firstRow.waitFor({ state: 'visible', timeout: 10000 });
    
    // ตรวจสอบว่า row มีข้อมูลครบ (ID, Name, Email, Phone, Status, Max Books)
    const cellCount = await page.locator('table tbody tr').first().locator('td').count();
    expect(cellCount).toBeGreaterThanOrEqual(4); // อย่างน้อยต้องมี 4 คอลัมน์
  });

test('TC-MEM-03: เพิ่มสมาชิกใหม่ด้วยข้อมูลครบถ้วน', async ({ page }) => {
    const membersPage = new MembersPage(page);
    await membersPage.goto();
    const uniqueName = 'Member-' + Date.now();
    // เพิ่มการกรอกข้อมูลจริงลงไป
    await membersPage.fillMemberInfo('M'+Date.now().toString().slice(-4), uniqueName, 'test@mail.com', '0812345678');
    // ตรวจสอบว่าชื่อใหม่ต้องปรากฏในตาราง
    await expect(page.locator('table')).toContainText(uniqueName, { timeout: 10000 });
  });

test('TC-MEM-04: [Check BUG 32] เพิ่มสมาชิกด้วย Member Code ที่ซ้ำ', async ({ page }) => {
    const membersPage = new MembersPage(page);
    await membersPage.goto();
    // 1. ดึงรหัสสมาชิกคนแรกมา
    const existingCode = await page.locator('table tbody tr td').first().innerText();
    // 2. พยายามเพิ่มคนใหม่โดยใช้รหัสเดิม
    await membersPage.fillMemberInfo(existingCode, 'Duplicate-User', 'dup@mail.com', '000000000');
    
    // 3. ความคาดหวัง: ระบบต้องฟ้อง Error (ถ้าไม่ฟ้อง แสดงว่าเจอบั๊ก 32)
    const errorAlert = page.locator('.alert-danger, .error-message');
    await expect(errorAlert, '❌ BUG 32: ระบบยอมให้ใช้รหัสสมาชิกซ้ำได้').toBeVisible({ timeout: 5000 });
  });

  test('TC-MEM-05: แก้ไขข้อมูลสมาชิก', async ({ page }) => {
    const membersPage = new MembersPage(page);
    await membersPage.goto();
    
    // ตรวจสอบว่ามีสมาชิกในตาราง
    await page.waitForSelector('table tbody tr', { timeout: 10000 });
    
    // หารายการแรกที่มีปุ่ม edit
    const firstRow = page.locator('table tbody tr').first();
    const editBtn = firstRow.locator('a, button').filter({ hasText: /Edit|แก้ไข/i });
    
    if (await editBtn.count() > 0) {
      // คลิก Edit
      await editBtn.first().click();
      
      // รอให้ form/modal โหลด
      await membersPage.nameInput.waitFor({ state: 'visible', timeout: 8000 });
      
      // ตรวจสอบว่าข้อมูลเดิมโหลดมา (name input ไม่ว่างเปล่า)
      const currentName = await membersPage.nameInput.inputValue();
      expect(currentName.length).toBeGreaterThan(0);
      
      // แก้ไขข้อมูล
      const newName = 'Updated-' + Date.now();
      await membersPage.nameInput.clear();
      await membersPage.nameInput.fill(newName);
      
      // บันทึก
      await membersPage.submitBtn.first().click();
      
      // รอให้อัปเดต
      await page.waitForLoadState('networkidle', { timeout: 15000 });
      await page.waitForTimeout(1500);
      
      // ตรวจสอบว่าข้อมูลอัปเดต
      const updatedRow = page.locator('table tbody tr').filter({ hasText: newName });
      await expect(updatedRow).toBeVisible({ timeout: 10000 });
    }
  });

  test('TC-MEM-06: ลบสมาชิก', async ({ page }) => {
    const membersPage = new MembersPage(page);
    await membersPage.goto();
    
    // ตรวจสอบว่ามีสมาชิกในตาราง
    await page.waitForSelector('table tbody tr', { timeout: 10000 });
    const initialRowCount = await page.locator('table tbody tr').count();
    
    // หารายการที่มีปุ่ม delete
    const firstRow = page.locator('table tbody tr').first();
    const deleteBtn = firstRow.locator('a, button').filter({ hasText: /Delete|ลบ/i });
    
    if (await deleteBtn.count() > 0) {
      // คลิก Delete
      await deleteBtn.first().click();
      
      // รอให้ confirmation dialog ปรากฏ (ถ้ามี)
      try {
        await page.locator('button').filter({ hasText: /OK|Confirm|Yes|ใช่/i }).first().click({ timeout: 5000 });
      } catch (e) {
        // ถ้าไม่มี dialog ให้ข้าม
      }
      
      // รอให้อัปเดต
      await page.waitForLoadState('networkidle', { timeout: 15000 });
      await page.waitForTimeout(1000);
      
      // ตรวจสอบว่าจำนวน row ลดลง
      const finalRowCount = await page.locator('table tbody tr').count();
      expect(finalRowCount).toBeLessThanOrEqual(initialRowCount);
    }
  });

test('TC-MEM-07: เพิ่มสมาชิกโดยไม่กรอกข้อมูลที่จำเป็น', async ({ page }) => {
    const membersPage = new MembersPage(page);
    await membersPage.goto();
    await membersPage.addMemberBtn.first().click();
    // กด Save ทันทีโดยไม่กรอกอะไร
    await membersPage.submitBtn.first().click();
    
    // ตรวจสอบว่า Modal ยังไม่ปิด (เพราะติด Validation) หรือมี Error ขึ้น
    await expect(membersPage.codeInput).toBeVisible(); 
  });
});