// pages/LoginPage.js
class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.getByRole('textbox', { name: 'Username' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password' });
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.defaultAccountsText = page.getByText('Default accounts: admin /');
  }

  async goto() {
    await this.page.goto('http://localhost:8080/login.php');
    await this.page.waitForLoadState('networkidle');
  }

  async login(username, password) {
    try {
      await this.defaultAccountsText.click({ timeout: 2000 });
    } catch (e) {
      // ไม่เจอก็ไม่เป็นไร
    }

    await this.usernameInput.waitFor({ state: 'visible', timeout: 5000 });
    await this.usernameInput.click();
    await this.usernameInput.fill(username);

    await this.passwordInput.waitFor({ state: 'visible', timeout: 5000 });
    await this.passwordInput.click();
    await this.passwordInput.fill(password);

    await this.loginButton.waitFor({ state: 'visible', timeout: 5000 });
    await this.page.waitForTimeout(500);
    await this.loginButton.click();

    await this.page.waitForLoadState('networkidle', { timeout: 15000 });
  }

  // ── Helper: ตรวจว่าตอนนี้อยู่หน้า Login อยู่หรือเปล่า ──
  async isOnLoginPage() {
    return this.page.url().includes('login');
  }

  // ── Helper: ตรวจสอบว่า session cookie ถูกล้างจริงหลัง logout ──
  // BUG 38 → logout.php ใช้ session_destroy() แต่ไม่ได้ unset $_SESSION
  // และไม่ได้ลบ cookie → session ยังใช้งานได้บางส่วน
  async isSessionCleared() {
    const cookies = await this.page.context().cookies();
    const sessionCookie = cookies.find(c => c.name === 'PHPSESSID');
    // ถ้า BUG 38 ยังอยู่ → cookie จะยังมีค่าอยู่ (ไม่ถูก expire)
    return !sessionCookie || sessionCookie.expires <= Date.now() / 1000;
  }
}

module.exports = { LoginPage };