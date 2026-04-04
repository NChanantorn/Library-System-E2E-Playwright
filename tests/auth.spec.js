// tests/auth.spec.js
const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');

test.describe('ระบบเข้าสู่ระบบ (Login System)', () => {
  
  test('TC-01: เข้าสู่ระบบสำเร็จด้วยข้อมูลที่ถูกต้อง', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    
    // Click on default accounts message
    await loginPage.clickDefaultAccountsMessage();
    
    // Login with correct credentials
    await loginPage.login('admin', 'admin123');
    
    // ตรวจสอบว่า Login สำเร็จ
    await expect(page).not.toHaveURL(/login/);
  });

  test('TC-02: เข้าสู่ระบบไม่สำเร็จเมื่อใส่รหัสผ่านผิด', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    
    // Click on default accounts message
    await loginPage.clickDefaultAccountsMessage();
    
    // Login with incorrect password
    await loginPage.login('admin', 'wrongpassword');
    
    // ตรวจสอบว่า URL ยังคงอยู่ที่ login page
    await expect(page).toHaveURL(/login/);
  });
});