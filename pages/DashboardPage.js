// pages/DashboardPage.js
class DashboardPage {
  constructor(page) {
    this.page = page;

    // โครงสร้างจริง: generic[ref=e27] > h5 "Total Books"[ref=e28] + h2 "9"[ref=e29]
    // ใช้ getByRole heading แทน เพราะ generic ไม่มี class
    this.totalBooksCard     = page.locator('h5', { hasText: 'Total Books' });
    this.availableBooksCard = page.locator('h5', { hasText: 'Available' });
    this.activeMembersCard  = page.locator('h5', { hasText: 'Active Members' });
    this.borrowedBooksCard  = page.locator('h5', { hasText: 'Borrowed' });

    // Navigation links
    this.booksLink     = page.getByRole('link', { name: /^Books$/i });
    this.membersLink   = page.getByRole('link', { name: /^Members$/i });
    this.borrowingLink = page.getByRole('link', { name: /^Borrow$/i });
    this.reportsLink   = page.getByRole('link', { name: /^Reports$/i });
  }

  async goto() {
    await this.page.goto('http://localhost:8080/index.php');
    await this.page.waitForLoadState('networkidle', { timeout: 15000 });
  }

  // h5 กับ h2 เป็น sibling ใน parent เดียวกัน — ใช้ xpath หา h2 ถัดจาก h5
  async getStatValue(h5Locator) {
    await h5Locator.waitFor({ state: 'visible', timeout: 8000 });
    const h2 = h5Locator.locator('xpath=following-sibling::h2');
    const text = await h2.innerText();
    return parseInt(text.trim(), 10);
  }

  async navigateTo(linkLocator) {
    await linkLocator.waitFor({ state: 'visible', timeout: 8000 });
    await linkLocator.click();
    await this.page.waitForLoadState('networkidle', { timeout: 15000 });
  }
}

module.exports = { DashboardPage };