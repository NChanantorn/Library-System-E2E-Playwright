// pages/DashboardPage.js
class DashboardPage {
  constructor(page) {
    this.page = page;
    
    // Dashboard Statistics Cards - ใช้ selector ที่รองรับหลายรูปแบบ
    this.totalBooksCard = page.locator('.card, .stat-card, [class*="card"]').filter({ hasText: /Total Books|หนังสือทั้งหมด/i }).first();
    this.availableBooksCard = page.locator('.card, .stat-card, [class*="card"]').filter({ hasText: /Available Books|หนังสือที่ว่าง/i }).first();
    this.activeMembersCard = page.locator('.card, .stat-card, [class*="card"]').filter({ hasText: /Active Members|สมาชิกที่ใช้งาน/i }).first();
    this.borrowedBooksCard = page.locator('.card, .stat-card, [class*="card"]').filter({ hasText: /Borrowed Books|หนังสือที่ยืม/i }).first();
    
    // Statistics Values - ดึงตัวเลขจากหลายอังค์ประกอบที่เป็นไปได้
    this.totalBooksValue = page.locator('h1, h2, h3, p, .number, .value, .count').filter({ hasText: /\d+/ }).first();
    this.availableBooksValue = page.locator('h1, h2, h3, p, .number, .value, .count').filter({ hasText: /\d+/ }).nth(1);
    this.activeMembersValue = page.locator('h1, h2, h3, p, .number, .value, .count').filter({ hasText: /\d+/ }).nth(2);
    this.borrowedBooksValue = page.locator('h1, h2, h3, p, .number, .value, .count').filter({ hasText: /\d+/ }).nth(3);
    
    // Navigation Links
    this.booksLink = page.locator('a, button, [role="link"], [role="button"]').filter({ hasText: /Books|หนังสือ/i });
    this.membersLink = page.locator('a, button, [role="link"], [role="button"]').filter({ hasText: /Members|สมาชิก/i });
    this.borrowingLink = page.locator('a, button, [role="link"], [role="button"]').filter({ hasText: /Borrowing|การยืม|Borrow/i });
    this.reportsLink = page.locator('a, button, [role="link"], [role="button"]').filter({ hasText: /Reports|รายงาน/i });
    
    // Dashboard title - ค้นหาจากหลายที่ที่เป็นไปได้
    this.dashboardTitle = page.locator('h1, h2, .title, [class*="title"]').filter({ hasText: /Dashboard|แดชบอร์ด/i }).first();
  }

  async goto() {
    await this.page.goto('http://localhost:8080/dashboard.php');
    await this.page.waitForLoadState('networkidle', { timeout: 15000 });
    await this.page.waitForTimeout(1000);
  }

  async getTotalBooksValue() {
    const text = await this.totalBooksValue.innerText();
    return parseInt(text, 10);
  }

  async getAvailableBooksValue() {
    const text = await this.availableBooksValue.innerText();
    return parseInt(text, 10);
  }

  async getActiveMembersValue() {
    const text = await this.activeMembersValue.innerText();
    return parseInt(text, 10);
  }

  async getBorrowedBooksValue() {
    const text = await this.borrowedBooksValue.innerText();
    return parseInt(text, 10);
  }

  async verifyAllStatisticsVisible() {
    await this.totalBooksCard.waitFor({ state: 'visible', timeout: 10000 });
    await this.availableBooksCard.waitFor({ state: 'visible', timeout: 10000 });
    await this.activeMembersCard.waitFor({ state: 'visible', timeout: 10000 });
    await this.borrowedBooksCard.waitFor({ state: 'visible', timeout: 10000 });
  }

  async navigateToBooks() {
    await this.booksLink.first().click();
    await this.page.waitForLoadState('networkidle', { timeout: 15000 });
  }

  async navigateToMembers() {
    await this.membersLink.first().click();
    await this.page.waitForLoadState('networkidle', { timeout: 15000 });
  }

  async navigateToBorrowing() {
    await this.borrowingLink.first().click();
    await this.page.waitForLoadState('networkidle', { timeout: 15000 });
  }

  async navigateToReports() {
    await this.reportsLink.first().click();
    await this.page.waitForLoadState('networkidle', { timeout: 15000 });
  }
}

module.exports = { DashboardPage };
