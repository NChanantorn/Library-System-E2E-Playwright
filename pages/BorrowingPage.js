// pages/BorrowingPage.js
class BorrowingPage {
  constructor(page) {
    this.page = page;
    
    // Navigation and main buttons
    this.newBorrowBtn = page.locator('a, button').filter({ hasText: /New Borrow|Create Borrow|เพิ่มการยืม/i });
    this.borrowingTable = page.locator('table tbody');
    
    // Form fields for new borrowing
    this.memberSelect = page.locator('select[name*="member"], input[name*="member"], [placeholder*="member" i]');
    this.bookSelect = page.locator('select[name*="book"], input[name*="book"], [placeholder*="book" i]');
    this.borrowDateInput = page.locator('input[name*="borrow"], input[name*="date"], [placeholder*="borrow" i]');
    this.dueDateInput = page.locator('input[name*="due"], input[name*="due_date"]');
    
    // Submit/Action buttons
    this.submitBtn = page.locator('button[type="submit"], .btn-primary').filter({ hasText: /Save|Submit|Borrow|ยืม/i });
    this.returnBtn = page.locator('button').filter({ hasText: /Return|คืน/i });
    this.detailsBtn = page.locator('button').filter({ hasText: /Details|Detail|รายละเอียด/i });
    
    // Table columns and data
    this.statusCell = page.locator('table td').filter({ hasText: /Borrowed|Returned|Overdue|ยืม|คืน|เกินกำหนด/i });
    this.returnDateCell = page.locator('table td').filter({ hasText: /\d{4}-\d{2}-\d{2}/ });
  }

  async goto() {
    await this.page.goto('http://localhost:8080/borrowing.php');
    await this.page.waitForLoadState('networkidle', { timeout: 15000 });
    await this.page.waitForTimeout(1000);
  }

  async clickNewBorrow() {
    await this.newBorrowBtn.first().waitFor({ state: 'visible', timeout: 10000 });
    await this.newBorrowBtn.first().click();
    await this.page.waitForTimeout(500);
  }

  async selectMember(memberName) {
    await this.memberSelect.first().click();
    await this.memberSelect.first().fill(memberName);
    await this.page.waitForTimeout(300);
    // Select first matching option
    const option = this.page.locator('option, [role="option"]').filter({ hasText: memberName }).first();
    if (await option.isVisible().catch(() => false)) {
      await option.click();
    } else {
      await this.page.keyboard.press('Enter');
    }
  }

  async selectBook(bookTitle) {
    await this.bookSelect.first().click();
    await this.bookSelect.first().fill(bookTitle);
    await this.page.waitForTimeout(300);
    // Select first matching option
    const option = this.page.locator('option, [role="option"]').filter({ hasText: bookTitle }).first();
    if (await option.isVisible().catch(() => false)) {
      await option.click();
    } else {
      await this.page.keyboard.press('Enter');
    }
  }

  async submitBorrow() {
    await this.submitBtn.first().click();
    await this.page.waitForLoadState('networkidle', { timeout: 15000 });
    await this.page.waitForTimeout(1000);
  }

  async getBorrowingStatus() {
    const statusElements = await this.page.locator('table td').filter({ hasText: /Borrowed|Returned|Overdue/ });
    return statusElements;
  }

  async getRecordCount() {
    return await this.page.locator('table tbody tr').count();
  }
}

module.exports = { BorrowingPage };
