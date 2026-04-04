// pages/BooksPage.js
class BooksPage {
  constructor(page) {
    this.page = page;
    // ปรับตามภาพหน้าจอจริงที่คุณส่งมา
    this.addBtnHeader = page.getByRole('button', { name: 'Add New Book' });
    this.isbnInput = page.locator('label:has-text("ISBN") + input, input[name*="isbn"]');
    this.titleInput = page.locator('label:has-text("Title") + input, input[name*="title"]');
    this.authorInput = page.locator('label:has-text("Author") + input, input[name*="author"]');
    this.publisherInput = page.locator('label:has-text("Publisher") + input');
    this.yearInput = page.locator('label:has-text("Publication Year") + input');
    this.categoryInput = page.locator('label:has-text("Category") + input, select[name*="category"]');
    this.copiesInput = page.locator('label:has-text("Total Copies") + input');
    this.locationInput = page.locator('label:has-text("Shelf Location") + input');
    
    // ปุ่มใน Modal
    this.submitBtn = page.getByRole('button', { name: 'Add Book', exact: true });
    
    // ค้นหา
    this.searchInput = page.locator('input[placeholder*="Search"]');
    this.searchBtn = page.getByRole('button', { name: 'Search' });
  }

  async goto() {
    await this.page.goto('http://localhost:8080/books.php');
    await this.page.waitForLoadState('networkidle');
  }

  async fillFullBookInfo(data) {
    await this.addBtnHeader.click();
    // รอให้ Modal ปรากฏ
    await this.isbnInput.waitFor({ state: 'visible' });
    
    await this.isbnInput.fill(data.isbn);
    await this.titleInput.fill(data.title);
    await this.authorInput.fill(data.author);
    await this.publisherInput.fill(data.publisher || 'Test Publisher');
    await this.yearInput.fill(data.year || '2024');
    await this.categoryInput.fill(data.category || 'General');
    await this.copiesInput.fill(data.copies.toString());
    await this.locationInput.fill(data.location || 'A-101');
    
    await this.submitBtn.click();
  }
}

module.exports = { BooksPage };