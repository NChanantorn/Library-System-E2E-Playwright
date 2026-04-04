// tests/auth.spec.js
const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../pages/LoginPage');

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
    await loginPage.login("' OR '1'='1", "anything");    // ตรวจสอบ: URL ต้องยังเป็นหน้า Login
    await expect(page).toHaveURL(/login/);
  });

  test('TC-04: เข้าสู่ระบบไม่สำเร็จเมื่อไม่กรอก Username', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('', 'admin123');
    
    // ตรวจสอบ HTML5 Validation หรือ Error Message
    const isInvalid = await loginPage.usernameInput.evaluate(node => node.validity.valueMissing);
    const errorVisible = await page.locator('.alert-danger, .error').isVisible();
    expect(isInvalid || errorVisible).toBeTruthy();
    await expect(page).toHaveURL(/login/);
  });

  test('TC-05: เข้าสู่ระบบไม่สำเร็จเมื่อไม่กรอก Password', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('admin', '');
    
    const isInvalid = await loginPage.passwordInput.evaluate(node => node.validity.valueMissing);
    const errorVisible = await page.locator('.alert-danger, .error').isVisible();
    expect(isInvalid || errorVisible).toBeTruthy();
    await expect(page).toHaveURL(/login/);
  });

  test('TC-06: เข้าสู่ระบบไม่สำเร็จเมื่อไม่กรอกข้อมูลใดๆ', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('', '');
    
    await expect(page).toHaveURL(/login/);
  });

  test('TC-07: ตรวจสอบการแสดงผลรหัสผ่าน (Masking)', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    const type = await loginPage.passwordInput.getAttribute('type');
    expect(type).toBe('password');
  });

  test('TC-08: ออกจากระบบสำเร็จ (Logout)', async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      
      // 1. Login เข้าไปก่อน (แก้เครื่องหมายคำพูดที่หายไปตรง 'admin')
      await loginPage.login('admin', 'admin123'); 
      
      // 2. กดปุ่ม Logout (สมมติว่าปุ่มชื่อ Logout หรือ ออกจากระบบ)
      // ให้เช็คในหน้าเว็บว่าปุ่ม Logout ของคุณใช้ Selector อะไร
      await page.getByRole('link', { name: /Logout|ออกจากระบบ/i }).click();

      // 3. ความคาดหวัง: หลังกด Logout ต้องโดนเด้งกลับมาหน้า Login
      await expect(page).toHaveURL(/login/); 
      
      // 4. ทดสอบซ้ำ (Check BUG 5): พยายามเข้าหน้า Dashboard ตรงๆ หลัง Logout แล้ว
      await page.goto('http://localhost:8080/dashboard.php'); // แก้ URL ให้ตรงกับโปรเจกต์
      
      // ถ้าระบบปกติ (ไม่มี BUG 5): มันต้องเด้งเรากลับมาหน้า Login เสมอ
      await expect(page).toHaveURL(/login/);
    });

});