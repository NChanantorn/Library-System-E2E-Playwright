// pages/BooksPage.js
class BooksPage {
  constructor(page) {
    this.page = page;
    this.addBtnHeader  = page.locator('button, a').filter({ hasText: /Add New Book/i });
    this.isbnInput     = page.locator('input[name*="isbn"], #isbn');
    this.titleInput    = page.locator('input[name*="title"], #title');
    this.authorInput   = page.locator('input[name*="author"], #author');
    this.publisherInput= page.locator('input[name*="publisher"], #publisher');
    this.yearInput     = page.locator('input[name*="year"], #year, input[name*="publication"]');
    this.categoryInput = page.locator('input[name*="category"], #category, select[name*="category"]');
    this.copiesInput   = page.locator('input[name*="copies"], input[name*="total"], #copies');
    this.locationInput = page.locator('input[name*="location"], input[name*="shelf"], #location');
    this.submitBtn     = page.locator('button[type="submit"]').filter({ hasText: /Add Book/i });
    this.searchInput   = page.locator('input[placeholder*="Search"], input[name*="search"]');
    this.searchBtn     = page.locator('button').filter({ hasText: /^Search$/i });
    this.noResultText  = page.locator('text=/No books found|ไม่พบ/i');
    this.bookTable     = page.locator('table tbody');
  }

  async goto() {
    await this.page.goto('http://localhost:8080/books.php');
    await this.page.waitForLoadState('networkidle', { timeout: 15000 });
    await this.page.waitForTimeout(500);
  }

  async openAddForm() {
    await this.addBtnHeader.first().waitFor({ state: 'visible', timeout: 10000 });
    await this.addBtnHeader.first().click();
    await this.isbnInput.waitFor({ state: 'visible', timeout: 8000 });
    await this.page.waitForTimeout(300);
  }

  // กรอกข้อมูลครบทุก field ที่มองเห็น
  async fillAndSubmit(data) {
    await this.isbnInput.fill(String(data.isbn ?? ''));
    await this.titleInput.fill(String(data.title ?? ''));
    await this.authorInput.fill(String(data.author ?? ''));

    if (await this.publisherInput.isVisible().catch(() => false))
      await this.publisherInput.fill(String(data.publisher ?? 'Test Publisher'));

    if (await this.yearInput.isVisible().catch(() => false))
      await this.yearInput.fill(String(data.year ?? '2024'));

    if (await this.categoryInput.isVisible().catch(() => false)) {
      const tag = await this.categoryInput.evaluate(n => n.tagName.toLowerCase());
      if (tag === 'select') {
        await this.categoryInput.selectOption({ index: 1 });
      } else {
        await this.categoryInput.fill(String(data.category ?? 'General'));
      }
    }

    await this.copiesInput.fill(String(data.copies ?? '1'));

    if (await this.locationInput.isVisible().catch(() => false))
      await this.locationInput.fill(String(data.location ?? 'A-101'));

    await this.submitBtn.first().waitFor({ state: 'visible', timeout: 5000 });
    await this.submitBtn.first().click();
    await this.page.waitForLoadState('networkidle', { timeout: 15000 });
    await this.page.waitForTimeout(800);
  }

  async addBook(data) {
    await this.openAddForm();
    await this.fillAndSubmit(data);
  }

  async search(keyword) {
    await this.searchInput.fill(keyword);
    await this.searchBtn.click();
    await this.page.waitForTimeout(800);
  }

  rowWith(text) {
    return this.page.locator('table tbody tr').filter({ hasText: text });
  }
}

module.exports = { BooksPage };