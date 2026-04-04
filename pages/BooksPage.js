// pages/BooksPage.js
class BooksPage {
  constructor(page) {
    this.page = page;
    // ใช้ Selector ที่รองรับทั้งภาษาไทยและอังกฤษ และคลาสปุ่มมาตรฐาน
    this.addBtnHeader = page.locator('button, a').filter({ hasText: /Add New Book|เพิ่มหนังสือใหม่/i });
    this.isbnInput = page.locator('input[name*="isbn"], #isbn');
    this.titleInput = page.locator('input[name*="title"], #title');
    this.authorInput = page.locator('input[name*="author"], #author');
    this.publisherInput = page.locator('input[name*="publisher"]');
    this.yearInput = page.locator('input[name*="year"]');
    this.copiesInput = page.locator('input[name*="copies"], input[name*="qty"]');
    this.submitBtn = page.locator('button[type="submit"]').filter({ hasText: /Add Book|Save|บันทึก/i });
    
    this.searchInput = page.locator('input[name*="search"]');
    this.searchBtn = page.locator('button').filter({ hasText: /Search|ค้นหา/i });
  }

  async goto() {
    await this.page.goto('http://localhost:8080/books.php');
    await this.page.waitForLoadState('networkidle');
  }

  async fillFullBookInfo(data) {
    await this.addBtnHeader.first().click();
    // รอให้ฟอร์มปรากฏขึ้นมาก่อนกรอกข้อมูล
    await this.isbnInput.waitFor({ state: 'visible', timeout: 5000 });
    await this.isbnInput.fill(String(data.isbn));
    await this.titleInput.fill(data.title);
    await this.authorInput.fill(data.author);
    if (await this.publisherInput.isVisible()) await this.publisherInput.fill('Test Pub');
    // ใช้ String() เพื่อให้แน่ใจว่าจำนวนติดลบถูกส่งเป็น string
    await this.copiesInput.fill(String(data.copies));
    await this.submitBtn.first().click();
  }
}
module.exports = { BooksPage };