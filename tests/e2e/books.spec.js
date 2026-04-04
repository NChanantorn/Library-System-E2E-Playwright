const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../pages/LoginPage');
const { BooksPage } = require('../../pages/BooksPage');

test.describe('Books Management Finalized Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('admin', 'admin123'); 
  });

  test('TC-ADMIN-02: เพิ่มหนังสือใหม่สำเร็จ (Happy Path)', async ({ page }) => {
    const booksPage = new BooksPage(page);
    await booksPage.goto();
    const bookData = {
      isbn: '978-' + Math.floor(Math.random() * 1000000),
      title: 'Auto-Test-Book',
      author: 'Gemini AI',
      copies: 5
    };
    await booksPage.fillFullBookInfo(bookData);
    // ตรวจสอบว่า Modal ปิดลงและเจอข้อมูลในตาราง
    await expect(page.getByText(bookData.title)).toBeVisible({ timeout: 15000 });
  });

  test('TC-BORROW-03: [BUG 15] ตรวจสอบค่าติดลบ (Total Copies)', async ({ page }) => {
    const booksPage = new BooksPage(page);
    await booksPage.goto();
    const badData = { isbn: 'ERR-NEG', title: 'Negative Book', author: 'Tester', copies: -10 };

    await booksPage.fillFullBookInfo(badData);

    // ปรับ Logic: ถ้า Modal ปิดไป (ปุ่ม Add Book หายไป) แต่ไม่มี Error ขึ้น แสดงว่าเจอบั๊ก
    const isModalVisible = await booksPage.submitBtn.isVisible({ timeout: 5000 });
    const errorMsg = page.locator('.alert-danger, .text-danger, .error');
    const isErrorVisible = await errorMsg.first().isVisible({ timeout: 2000 });

    if (!isModalVisible && !isErrorVisible) {
        // กรณีนี้คือระบบยอมให้ผ่าน (Modal ปิด) แต่ไม่มีการแจ้งเตือน = BUG 15
        console.log("❌ DETECTED BUG 15: System accepted negative value.");
        expect(isErrorVisible).toBe(true); // สั่งให้ Fail แบบตั้งใจเพื่อให้รู้ว่าเจอบั๊ก
    }
  });

  test('TC-SEARCH-01: ค้นหาหนังสือ (Search Bar)', async ({ page }) => {
    const booksPage = new BooksPage(page);
    await booksPage.goto();
    
    // ดึง ISBN แถวแรกจากตารางมาค้นหา เพื่อให้มั่นใจว่า "ต้องเจอ"
    const firstIsbn = await page.locator('table tbody tr td').first().innerText();
    await booksPage.searchInput.fill(firstIsbn);
    await booksPage.searchBtn.click();
    
    // เช็คว่าต้องมีอย่างน้อย 1 แถว และแถวนั้นต้องมี ISBN ที่เราค้นหา
    const rowCount = await page.locator('table tbody tr').count();
    expect(rowCount).toBeGreaterThanOrEqual(1);
    await expect(page.locator('table tbody')).toContainText(firstIsbn);
  });
});