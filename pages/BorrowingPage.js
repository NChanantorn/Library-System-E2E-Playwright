// pages/BorrowingPage.js
class BorrowingPage {
  constructor(page) {
    this.page = page;

    this.newBorrowBtn  = page.locator('a, button').filter({ hasText: /New Borrow|Create Borrow|เพิ่มการยืม/i });
    this.borrowingTable= page.locator('table tbody');

    // Form fields — รองรับทั้ง <select> และ <input>
    this.memberSelect  = page.locator('select[name*="member"], input[name*="member"], [placeholder*="member" i]');
    this.bookSelect    = page.locator('select[name*="book"], input[name*="book"], [placeholder*="book" i]');
    this.borrowDateInput = page.locator('input[name*="borrow"], input[name*="date"], [placeholder*="borrow" i]');
    this.dueDateInput  = page.locator('input[name*="due"], input[name*="due_date"]');

    this.submitBtn  = page.locator('button[type="submit"], .btn-primary').filter({ hasText: /Save|Submit|Borrow|ยืม/i });
    this.returnBtn  = page.locator('button, a').filter({ hasText: /Return|คืน/i });
    this.detailsBtn = page.locator('button, a').filter({ hasText: /Details|Detail|รายละเอียด/i });

    this.statusCell    = page.locator('table td').filter({ hasText: /Borrowed|Returned|Overdue|ยืม|คืน|เกินกำหนด/i });
    this.returnDateCell= page.locator('table td').filter({ hasText: /\d{4}-\d{2}-\d{2}/ });
  }

  async goto() {
    await this.page.goto('http://localhost:8080/borrow.php');
    await this.page.waitForLoadState('networkidle', { timeout: 15000 });
    await this.page.waitForTimeout(500);
  }

  async clickNewBorrow() {
    await this.newBorrowBtn.first().waitFor({ state: 'visible', timeout: 10000 });
    await this.newBorrowBtn.first().click();
    await this.page.waitForTimeout(500);
  }

  async submitBorrow() {
    await this.submitBtn.first().click();
    await this.page.waitForLoadState('networkidle', { timeout: 15000 });
    await this.page.waitForTimeout(800);
  }

  async getRecordCount() {
    return await this.page.locator('table tbody tr').count();
  }
}

module.exports = { BorrowingPage };