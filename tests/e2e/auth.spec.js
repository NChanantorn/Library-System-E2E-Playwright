// tests/auth.spec.js
const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../pages/LoginPage');

test.describe('Authentication', () => {

  // ─────────────────────────────────────────────
  // TC-AUTH-01: Login ด้วย Username/Password ที่ถูกต้อง
  // ─────────────────────────────────────────────
  test('TC-AUTH-01: Login ด้วย Username/Password ที่ถูกต้อง', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('admin', 'admin123');

    await expect(page).not.toHaveURL(/login/);
    await expect(page).toHaveURL(/index/);
  });

  // ─────────────────────────────────────────────
  // TC-AUTH-02: [BUG 6] Login ด้วย Password ที่ผิด
  // BUG 6 → Logic error ทำให้ query คืน null แล้ว PHP ขึ้น Warning
  //         "Trying to access array offset on value of type null"
  // ─────────────────────────────────────────────
  test('TC-AUTH-02: [BUG 6] Login ด้วย Password ที่ผิด', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('admin', 'wrongpassword');

    const bodyText = await page.locator('body').textContent();

    // ตรวจ PHP Warning — ถ้ามี = BUG 6 ยังอยู่
    const hasPhpWarning = bodyText.includes('Warning') && bodyText.includes('array offset');
    if (hasPhpWarning) {
      console.warn('⚠️  [BUG 6 DETECTED] PHP Warning: Trying to access array offset on null ใน login.php');
    }
    expect(hasPhpWarning,
      '[BUG 6 DETECTED] login.php มี PHP Warning — Logic error ใน authentication'
    ).toBeFalsy();

    // ต้องอยู่หน้า login (ไม่ redirect ออก)
    await expect(page).toHaveURL(/login/);
  });

  // ─────────────────────────────────────────────
  // TC-AUTH-03: [BUG 7] Login ด้วย Username ที่ไม่มีในระบบ
  // BUG 7 → ไม่ตรวจสอบว่ามี user จริง → PHP Warning เช่นกัน
  // ─────────────────────────────────────────────
  test('TC-AUTH-03: [BUG 7] Login ด้วย Username ที่ไม่มีในระบบ', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('nobody_xyz_999', 'admin123');

    const bodyText = await page.locator('body').textContent();

    // ตรวจ PHP Warning — ถ้ามี = BUG 7 ยังอยู่
    const hasPhpWarning = bodyText.includes('Warning') && bodyText.includes('array offset');
    if (hasPhpWarning) {
      console.warn('⚠️  [BUG 7 DETECTED] PHP Warning: ไม่ตรวจสอบว่ามี user จริงก่อน access array');
    }
    expect(hasPhpWarning,
      '[BUG 7 DETECTED] login.php มี PHP Warning — ไม่ตรวจสอบว่า user มีอยู่ในระบบ'
    ).toBeFalsy();

    await expect(page).toHaveURL(/login/);
  });

  // ─────────────────────────────────────────────
  // TC-AUTH-04: Login ปล่อยช่องว่างทั้งหมด
  // ─────────────────────────────────────────────
  test('TC-AUTH-04: Login ปล่อยช่องว่างทั้งหมด', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('', '');
    await page.waitForTimeout(500);

    const usernameInvalid = await loginPage.usernameInput.evaluate(n => n.validity.valueMissing).catch(() => false);
    const errorVisible    = await page.locator('.alert-danger, .alert, .error').isVisible().catch(() => false);

    expect(usernameInvalid || errorVisible,
      'ต้องแสดง validation error เมื่อไม่กรอกข้อมูลใดเลย'
    ).toBeTruthy();
    await expect(page).toHaveURL(/login/);
  });

  // ─────────────────────────────────────────────
  // TC-AUTH-05: Login ด้วย librarian account
  // ─────────────────────────────────────────────
  test('TC-AUTH-05: Login ด้วย librarian account', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('librarian', 'lib123');

    await expect(page).not.toHaveURL(/login/);
    await expect(page).toHaveURL(/index/);
  });

  // ─────────────────────────────────────────────
  // TC-AUTH-06: [BUG 5] SQL Injection ใน Login form
  // ─────────────────────────────────────────────
  test('TC-AUTH-06: [BUG 5] SQL Injection ใน Login form', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login("' OR '1'='1' -- ", 'anything');

    // ถ้า FAIL = พบ BUG 5
    await expect(page).toHaveURL(/login/, {
      message: '[BUG 5 DETECTED] SQL Injection ผ่านได้! ระบบไม่มีการ sanitize query'
    });
  });

  // ─────────────────────────────────────────────
  // TC-AUTH-07: [BUG 38] Logout ออกจากระบบ
  // ─────────────────────────────────────────────
  test('TC-AUTH-07: [BUG 38] Logout ออกจากระบบ', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    // Login ก่อน
    await loginPage.login('admin', 'admin123');
    await page.waitForURL('**/index.php', { waitUntil: 'networkidle' });

    // เปิด dropdown แล้วกด Logout
    await page.locator('#userDropdown').click();
    await page.getByRole('link', { name: /Logout|ออกจากระบบ/i }).click();
    await page.waitForURL('**/login.php', { waitUntil: 'networkidle' });

    // ต้องกลับมาหน้า Login
    await expect(page).toHaveURL(/login/);

    // [BUG 38] ตรวจ session cookie ถูกล้างจริง
    const sessionCleared = await loginPage.isSessionCleared();
    expect(sessionCleared,
      '[BUG 38 DETECTED] Session cookie ยังคงอยู่หลัง logout!'
    ).toBeTruthy();
  });

  // ─────────────────────────────────────────────
  // TC-AUTH-08: [BUG 8] Auth Guard - เข้าหน้า /books โดยไม่ Login
  // BUG 8 → ไม่ตรวจสอบ session timeout / auth guard
  // ─────────────────────────────────────────────
  test('TC-AUTH-08: [BUG 8] Auth Guard - เข้าหน้า /books โดยไม่ Login', async ({ page }) => {
    // ไม่ login เลย เข้า books.php ตรงๆ
    await page.goto('http://localhost:8080/books.php');
    await page.waitForLoadState('networkidle', { timeout: 10000 });

    // ถ้า FAIL (ไม่ redirect กลับ login) = พบ BUG 8
    await expect(page).toHaveURL(/login/, {
      message: '[BUG 8 DETECTED] เข้าหน้า books.php ได้โดยไม่ต้อง Login!'
    });
  });

  // ─────────────────────────────────────────────
  // TC-AUTH-09: [BUG 8] Auth Guard - เข้าหน้า /members โดยไม่ Login
  // ─────────────────────────────────────────────
  test('TC-AUTH-09: [BUG 8] Auth Guard - เข้าหน้า /members โดยไม่ Login', async ({ page }) => {
    await page.goto('http://localhost:8080/members.php');
    await page.waitForLoadState('networkidle', { timeout: 10000 });

    await expect(page).toHaveURL(/login/, {
      message: '[BUG 8 DETECTED] เข้าหน้า members.php ได้โดยไม่ต้อง Login!'
    });
  });

  // ─────────────────────────────────────────────
  // TC-AUTH-10: [BUG 8] Auth Guard - เข้าหน้า /borrowing โดยไม่ Login
  // ─────────────────────────────────────────────
  test('TC-AUTH-10: [BUG 8] Auth Guard - เข้าหน้า /borrowing โดยไม่ Login', async ({ page }) => {
    await page.goto('http://localhost:8080/borrow.php');
    await page.waitForLoadState('networkidle', { timeout: 10000 });

    await expect(page).toHaveURL(/login/, {
      message: '[BUG 8 DETECTED] เข้าหน้า borrow.php ได้โดยไม่ต้อง Login!'
    });
  });

});