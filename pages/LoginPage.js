// pages/LoginPage.js
class LoginPage {
  constructor(page) {
    this.page = page;
    this.defaultAccountsText = page.getByText('Default accounts: admin /');
    this.usernameInput = page.getByRole('textbox', { name: 'Username' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password' });
    this.loginButton = page.getByRole('button', { name: 'Login' });
  }

  async goto() {
    await this.page.goto('http://localhost:8080/login.php');
  }

  async clickDefaultAccountsMessage() {
    await this.defaultAccountsText.click();
  }

  async doubleClickDefaultAccountsMessage() {
    await this.defaultAccountsText.dblclick();
  }

  async login(username, password) {
    await this.usernameInput.click();
    await this.usernameInput.fill(username);
    await this.passwordInput.click();
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}
module.exports = { LoginPage };