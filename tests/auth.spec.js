// tests/auth.spec.js
const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');

test.describe('ระบบเข้าสู่ระบบ (Login System)', () => {

  test('TC-01: เข้าสู่ระบบสำเร็จด้วยข้อมูลที่ถูกต้อง', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    // ไปที่หน้า Login
    await loginPage.goto();
    
    // สั่ง Login ด้วยข้อมูลที่ถูกต้อง
    await loginPage.login('admin', 'admin123');
    
    // ตรวจสอบ: URL ต้องไม่ใช่หน้า Login แล้ว (แปลว่าข้ามไปหน้า Dashboard แล้ว)
    await expect(page).not.toHaveURL(/login/);
  });

  test('TC-02: เข้าสู่ระบบไม่สำเร็จเมื่อใส่รหัสผ่านผิด', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    // ไปที่หน้า Login
    await loginPage.goto();
    
    // สั่ง Login ด้วยรหัสที่ผิด
    await loginPage.login('admin', 'wrongpassword');
    
    // ตรวจสอบ: URL ยังต้องเป็นหน้า Login เหมือนเดิม
    await expect(page).toHaveURL(/login/);
  });

  test('TC-03: [Security] ตรวจสอบช่องโหว่ SQL Injection ในหน้า Login', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    
    // ใส่รหัส SQL Injection ยอดฮิต ' OR '1'='1
    await loginPage.login("' OR '1'='1", "anything");
    
    // ความคาดหวัง: ระบบ "ต้องไม่ยอม" ให้เข้าสู่ระบบ (URL ต้องยังเป็นหน้า Login)
    // แต่ถ้า BUG 5 ทำงาน: บอทจะหลุดเข้าไปหน้า Dashboard ได้ ซึ่งแปลว่าพัง!
    await expect(page).toHaveURL(/login/); 
  });

});