// pages/LoginPage.js
class LoginPage {
  constructor(page) {
    this.page = page;
    // นิยามตำแหน่งปุ่มและช่องพิมพ์
    this.usernameInput = page.getByRole('textbox', { name: 'Username' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password' });
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.defaultAccountsText = page.getByText('Default accounts: admin /');
  }

  async goto() {
    await this.page.goto('http://localhost:8080/login.php');
    // รอให้หน้าเว็บโหลดจนนิ่งก่อนเริ่มทำอะไรต่อ
    await this.page.waitForLoadState('networkidle');
  }

  async login(username, password) {
    // 1. คลิกข้อความเพื่อ Focus หน้าจอ (ถ้าจำเป็น)
    try {
      await this.defaultAccountsText.click({ timeout: 2000 });
    } catch (e) {
      // ถ้าไม่เจอก็ไม่เป็นไร ดำเนินต่อ
    }
    
    // 2. พิมพ์ Username
    await this.usernameInput.waitFor({ state: 'visible', timeout: 5000 });
    await this.usernameInput.click();
    await this.usernameInput.fill(username);
    
    // 3. พิมพ์ Password
    await this.passwordInput.waitFor({ state: 'visible', timeout: 5000 });
    await this.passwordInput.click();
    await this.passwordInput.fill(password);
    
    // 4. รอให้ปุ่ม Login ปรากฏและกดได้จริงๆ (แก้ปัญหาบอทกดไวเกินไปใน Chrome)
    await this.loginButton.waitFor({ state: 'visible', timeout: 5000 });
    await this.page.waitForTimeout(500); // ให้เวลา render เสร็จ
    await this.loginButton.click();
    
    // 5. รอให้หน้าเว็บโหลดหลังจากกด Login
    await this.page.waitForLoadState('networkidle', { timeout: 15000 });
  }
}

module.exports = { LoginPage };