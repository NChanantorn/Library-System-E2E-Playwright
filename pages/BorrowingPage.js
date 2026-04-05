// pages/BorrowingPage.js
class BorrowingPage {
  constructor(page) {
    this.page = page;

    // borrow.php — มีแค่ form ยืม
    this.memberInput = page.locator('input[placeholder*="member" i], input[name*="member" i]').first();
    this.bookSelect  = page.locator('select').first();
    this.submitBtn   = page.getByRole('button', { name: /Borrow Book/i });

    // return.php — มีตารางรายการทั้งหมด
    this.borrowingTable = page.locator('table tbody');
    this.overdueRows    = page.locator('table tbody tr').filter({ hasText: /Overdue/i });
    this.borrowedRows   = page.locator('table tbody tr').filter({ hasText: /Borrowed/i });
  }

  async gotoBorrowForm() {
    await this.page.goto('http://localhost:8080/borrow.php');
    await this.page.waitForLoadState('networkidle', { timeout: 15000 });
  }

  async gotoReturnList() {
    await this.page.goto('http://localhost:8080/return.php');
    await this.page.waitForLoadState('networkidle', { timeout: 15000 });
  }

  // เพื่อ backward compat กับโค้ดเดิม
  async goto() {
    await this.gotoBorrowForm();
  }

  async borrowBook(memberCode, bookIndex = 1) {
    await this.memberInput.waitFor({ state: 'visible', timeout: 8000 });
    await this.memberInput.fill(memberCode);
    await this.bookSelect.selectOption({ index: bookIndex });
    await this.submitBtn.click();
    await this.page.waitForLoadState('networkidle', { timeout: 15000 });
  }

  async getRecordCount() {
    return await this.page.locator('table tbody tr').count();
  }
}

module.exports = { BorrowingPage };