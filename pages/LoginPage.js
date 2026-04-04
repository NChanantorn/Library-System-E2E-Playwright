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
    await this.defaultAccountsText.click();
    
    // 2. พิมพ์ Username
    await this.usernameInput.click();
    await this.usernameInput.fill(username);
    
    // 3. พิมพ์ Password
    await this.passwordInput.click();
    await this.passwordInput.fill(password);
    
    // 4. รอให้ปุ่ม Login ปรากฏและกดได้จริงๆ (แก้ปัญหาบอทกดไวเกินไปใน Chrome)
    await this.loginButton.waitFor({ state: 'visible' });
    await this.loginButton.click();
    
    // 5. รอให้หน้าเว็บโหลดหลังจากกด Login
    await this.page.waitForLoadState('load');
  }
}

module.exports = { LoginPage };