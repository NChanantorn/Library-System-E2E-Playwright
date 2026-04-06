// pages/MembersPage.js
class MembersPage {
  constructor(page) {
    this.page = page;

    this.addMemberBtn = page.locator('button, a').filter({ hasText: /Add New Member|\+ Add Member|เพิ่มสมาชิก/i });

    // Form inputs — ใช้ name attribute ตรงๆ (จาก member_add.php)
    this.codeInput  = page.locator('input[name="member_code"], #member_code');
    this.nameInput  = page.locator('input[name="member_name"], #member_name, input[name="full_name"], #full_name');
    this.emailInput = page.locator('input[name="email"], input[name="member_email"], #email');
    this.phoneInput = page.locator('input[name="phone"], input[name="member_phone"], #phone');
    this.typeSelect = page.locator('select[name="member_type"], select[name="type"], #member_type');

    this.submitBtn = page.locator('button[type="submit"]').filter({ hasText: /Add Member|Save|บันทึก/i });

    this.searchInput = page.locator('input[name*="search"], #search, [placeholder*="search" i]');
    this.searchBtn   = page.locator('button').filter({ hasText: /Search|ค้นหา/i });
  }

  async goto() {
    await this.page.goto('http://localhost:8080/members.php');
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(300);
  }

  async openAddForm() {
    await this.addMemberBtn.first().waitFor({ state: 'visible', timeout: 10000 });
    await this.addMemberBtn.first().click();
    await this.codeInput.waitFor({ state: 'visible', timeout: 8000 });
    await this.page.waitForTimeout(300);
  }

  async fillMemberInfo(code, name, email, phone, type = null) {
    await this.openAddForm();
    await this.codeInput.fill(String(code));
    await this.nameInput.fill(String(name));
    await this.emailInput.fill(String(email));
    if (await this.phoneInput.isVisible().catch(() => false))
      await this.phoneInput.fill(String(phone));
    if (type && await this.typeSelect.isVisible().catch(() => false))
      await this.typeSelect.selectOption(type);
    await this.submitBtn.first().waitFor({ state: 'visible', timeout: 5000 });
    await this.submitBtn.first().click();
    await this.page.waitForLoadState('networkidle', { timeout: 15000 });
    await this.page.waitForTimeout(500);
  }

  rowWith(text) {
    return this.page.locator('table tbody tr').filter({ hasText: text });
  }
}

module.exports = { MembersPage };