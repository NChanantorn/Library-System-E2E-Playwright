// tests/auth.spec.js
const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../pages/LoginPage');

test.describe('ระบบเข้าสู่ระบบ (Login System)', () => {

  // ─────────────────────────────────────────────
  // TC-01: Login สำเร็จด้วยข้อมูลที่ถูกต้อง
  // ─────────────────────────────────────────────
  test('TC-01: เข้าสู่ระบบสำเร็จด้วยข้อมูลที่ถูกต้อง', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('admin', 'admin123');
    await expect(page).not.toHaveURL(/login/);
  });

  // ─────────────────────────────────────────────
  // TC-02: Login ไม่สำเร็จเมื่อรหัสผ่านผิด
  // ─────────────────────────────────────────────
  test('TC-02: เข้าสู่ระบบไม่สำเร็จเมื่อใส่รหัสผ่านผิด', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('admin', 'wrongpassword');
    await expect(page).toHaveURL(/login/);
  });

  // ─────────────────────────────────────────────
  // TC-03: [BUG 5-7] SQL Injection
  // ระบบที่มีบัค → login สำเร็จโดยไม่ต้องรู้รหัสผ่าน
  // ถ้า test นี้ FAIL = พบบัค
  // ─────────────────────────────────────────────
  test('TC-03: [Security/BUG 5-7] ตรวจสอบช่องโหว่ SQL Injection ในหน้า Login', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login("' OR '1'='1' -- ", 'anything');

    await expect(page).toHaveURL(/login/, {
      message: '[BUG 5-7 DETECTED] SQL Injection ผ่านได้! ระบบไม่มีการ sanitize query'
    });
  });

  // ─────────────────────────────────────────────
  // TC-04: ไม่กรอก Username
  // ─────────────────────────────────────────────
  test('TC-04: เข้าสู่ระบบไม่สำเร็จเมื่อไม่กรอก Username', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('', 'admin123');
    await page.waitForTimeout(500);

    const isInvalid = await loginPage.usernameInput.evaluate(
      node => node.validity.valueMissing
    );
    const errorVisible = await page.locator('.alert-danger, .error, .alert').isVisible().catch(() => false);

    expect(isInvalid || errorVisible,
      'ควรมี validation error เมื่อไม่กรอก Username'
    ).toBeTruthy();
    await expect(page).toHaveURL(/login/);
  });

  // ─────────────────────────────────────────────
  // TC-05: ไม่กรอก Password
  // ─────────────────────────────────────────────
  test('TC-05: เข้าสู่ระบบไม่สำเร็จเมื่อไม่กรอก Password', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('admin', '');
    await page.waitForTimeout(500);

    const isInvalid = await loginPage.passwordInput.evaluate(
      node => node.validity.valueMissing
    );
    const errorVisible = await page.locator('.alert-danger, .error, .alert').isVisible().catch(() => false);

    expect(isInvalid || errorVisible,
      'ควรมี validation error เมื่อไม่กรอก Password'
    ).toBeTruthy();
    await expect(page).toHaveURL(/login/);
  });

  // ─────────────────────────────────────────────
  // TC-06: ไม่กรอกทั้งคู่
  // ─────────────────────────────────────────────
  test('TC-06: เข้าสู่ระบบไม่สำเร็จเมื่อไม่กรอกข้อมูลใดๆ', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('', '');
    await page.waitForTimeout(500);
    await expect(page).toHaveURL(/login/);
  });

  // ─────────────────────────────────────────────
  // TC-07: Password Masking
  // ─────────────────────────────────────────────
  test('TC-07: ตรวจสอบการแสดงผลรหัสผ่าน (Masking)', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    const type = await loginPage.passwordInput.getAttribute('type');
    expect(type, '[BUG DETECTED] Password field ไม่ได้ mask! type = ' + type).toBe('password');
  });

  // ─────────────────────────────────────────────
  // TC-08: [BUG 38] Logout + Session ต้องถูกล้าง
  // BUG 38 → session_destroy() ไม่สมบูรณ์
  // → เข้า dashboard หลัง logout ได้โดยไม่ต้อง login ใหม่
  // ─────────────────────────────────────────────
  test('TC-08: [BUG 38] ออกจากระบบสำเร็จและ Session ต้องถูกล้าง', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    // 1. Login
    await loginPage.login('admin', 'admin123');
    await expect(page).not.toHaveURL(/login/);

    // 2. Logout
    await page.getByRole('link', { name: /Logout|ออกจากระบบ/i }).click();
    await page.waitForLoadState('networkidle');

    // 3. ต้องกลับหน้า Login
    await expect(page).toHaveURL(/login/, {
      message: 'หลัง Logout ต้องกลับมาหน้า Login'
    });

    // 4. [BUG 38] ตรวจว่า session cookie ถูกล้างจริง
    const sessionCleared = await loginPage.isSessionCleared();
    expect(sessionCleared,
      '[BUG 38 DETECTED] Session cookie ยังคงอยู่หลัง logout! logout.php ไม่ได้ลบ cookie อย่างถูกต้อง'
    ).toBeTruthy();

    // 5. [BUG 38] พยายามเข้า dashboard ตรงๆ หลัง logout
    await page.goto('http://localhost:8080/dashboard.php');
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveURL(/login/, {
      message: '[BUG 38 DETECTED] เข้า dashboard ได้หลัง logout! session ไม่ถูก destroy อย่างสมบูรณ์'
    });
  });

});