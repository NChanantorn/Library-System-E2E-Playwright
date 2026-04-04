// tests/books.spec.js
const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../pages/LoginPage');
const { BooksPage } = require('../../pages/BooksPage');

// ──────────────────────────────────────────────────
// Helper: สร้างข้อมูลหนังสือที่ unique ทุกครั้ง
// ──────────────────────────────────────────────────
function uniqueBook(overrides = {}) {
  const ts = Date.now();
  return {
    isbn:   `978-${ts}`,
    title:  `Test-Book-${ts}`,
    author: 'Test Author',
    copies: 3,
    ...overrides,
  };
}

test.describe('Books Management', () => {

  // Login ก่อนทุก test
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('admin', 'admin123');
    await expect(page).not.toHaveURL(/login/);
  });

  // ──────────────────────────────────────────────
  // TC-BOOK-01: เปิดหน้า Books Management
  // ──────────────────────────────────────────────
  test('TC-BOOK-01: เปิดหน้า Books Management', async ({ page }) => {
    const booksPage = new BooksPage(page);
    await booksPage.goto();

    // หน้าโหลดสำเร็จ + มีตาราง + มีปุ่ม Add
    await expect(page).toHaveURL(/books/);
    await expect(booksPage.bookTable).toBeVisible({ timeout: 10000 });
    await expect(booksPage.addBtnHeader.first()).toBeVisible();
  });

  // ──────────────────────────────────────────────
  // TC-BOOK-02: แสดงรายการหนังสือทั้งหมด
  // ──────────────────────────────────────────────
  test('TC-BOOK-02: แสดงรายการหนังสือทั้งหมด', async ({ page }) => {
    const booksPage = new BooksPage(page);
    await booksPage.goto();

    // ตารางต้องมีอย่างน้อย 1 แถว
    const rows = page.locator('table tbody tr');
    await expect(rows.first()).toBeVisible({ timeout: 10000 });

    // แถวแรกต้องมีคอลัมน์ครบ (ID, Title, Author, ISBN, Total Copies, Available)
    const firstRow = rows.first();
    const cellCount = await firstRow.locator('td').count();
    expect(cellCount).toBeGreaterThanOrEqual(5);
  });

  // ──────────────────────────────────────────────
  // TC-BOOK-03: [Happy Path] เพิ่มหนังสือสำเร็จ
  // ──────────────────────────────────────────────
  test('TC-BOOK-03: เพิ่มหนังสือใหม่ด้วยข้อมูลครบถ้วน', async ({ page }) => {
    const booksPage = new BooksPage(page);
    await booksPage.goto();

    const book = uniqueBook({ title: 'Test Book', author: 'Test Author', isbn: '999-999-999-9', copies: 3 });
    await booksPage.addBook(book);

    // ต้องเห็นหนังสือในตาราง
    await expect(booksPage.rowWith(book.isbn)).toBeVisible({ timeout: 10000 });
  });

  // ──────────────────────────────────────────────
  // TC-BOOK-04: เพิ่มหนังสือโดยไม่กรอกข้อมูลที่จำเป็น
  // ──────────────────────────────────────────────
  test('TC-BOOK-04: เพิ่มหนังสือโดยไม่กรอกข้อมูลที่จำเป็น', async ({ page }) => {
    const booksPage = new BooksPage(page);
    await booksPage.goto();
    await booksPage.openAddForm();

    // Submit โดยไม่กรอกอะไรเลย
    await booksPage.submitBtn.first().click();
    await page.waitForTimeout(500);

    // ต้องมี validation error หรือ HTML5 required
    const titleRequired = await booksPage.titleInput.evaluate(n => n.validity.valueMissing).catch(() => false);
    const errorVisible  = await page.locator('[class*="alert"], [class*="error"], .text-danger').first()
                               .isVisible().catch(() => false);
    expect(titleRequired || errorVisible,
      'ต้องแสดง validation error เมื่อไม่กรอกข้อมูล'
    ).toBeTruthy();
  });

  // ──────────────────────────────────────────────
  // TC-BOOK-05: แก้ไขข้อมูลหนังสือ
  // ──────────────────────────────────────────────
  test('TC-BOOK-05: แก้ไขข้อมูลหนังสือ', async ({ page }) => {
    const booksPage = new BooksPage(page);
    await booksPage.goto();

    // ดึง ISBN แถวแรกเพื่อใช้ verify ภายหลัง
    await page.waitForSelector('table tbody tr', { timeout: 10000 });
    const firstIsbn = await page.locator('table tbody tr td:nth-child(1)').first().innerText();

    // คลิก Edit — อาจเป็น link (<a href="book_edit.php?id=...">) หรือ modal button
    const editBtn = page.locator('table tbody tr').first()
                        .locator('a, button').filter({ hasText: /Edit|แก้ไข/i });
    await editBtn.first().click();

    // รอให้ form ปรากฏ (ทั้งแบบ modal และแบบ navigate ไปหน้าใหม่)
    const titleField = page.locator('input[name="title"], input[name*="title"], #title').first();
    await titleField.waitFor({ state: 'visible', timeout: 10000 });

    const newTitle = 'Edited-' + Date.now();
    await titleField.fill(newTitle);

    // Submit (รองรับทั้ง "Update Book" และ "Save")
    const updateBtn = page.locator('button[type="submit"], input[type="submit"]')
                          .filter({ hasText: /Update|Save|บันทึก/i });
    await updateBtn.first().click();
    await page.waitForLoadState('networkidle', { timeout: 15000 });

    // ข้อมูลใหม่ต้องปรากฏ (ทั้งกรณีกลับมาหน้า books.php หรือหน้า edit เอง)
    await expect(page.locator('body')).toContainText(newTitle, { timeout: 10000 });
  });

  // ──────────────────────────────────────────────
  // TC-BOOK-06: ลบหนังสือออกจากระบบ
  // ──────────────────────────────────────────────
  test('TC-BOOK-06: ลบหนังสือออกจากระบบ', async ({ page }) => {
    const booksPage = new BooksPage(page);
    await booksPage.goto();

    // เพิ่มหนังสือใหม่ก่อนลบ เพื่อไม่กระทบข้อมูลจริง
    const book = uniqueBook({ title: 'Delete-Me' });
    await booksPage.addBook(book);
    await expect(booksPage.rowWith(book.isbn)).toBeVisible({ timeout: 10000 });

    // กด Delete
    const row = booksPage.rowWith(book.isbn);
    const deleteBtn = row.locator('a, button').filter({ hasText: /Delete|ลบ/i });
    
    // รับ dialog confirm อัตโนมัติ
    page.on('dialog', d => d.accept());
    await deleteBtn.first().click();
    await page.waitForLoadState('networkidle', { timeout: 15000 });

    // หนังสือต้องหายไป
    await expect(booksPage.rowWith(book.isbn)).not.toBeVisible({ timeout: 8000 });
  });

  // ──────────────────────────────────────────────
  // TC-BOOK-07: ค้นหาหนังสือด้วยชื่อ
  // ──────────────────────────────────────────────
  test('TC-BOOK-07: ค้นหาหนังสือด้วยชื่อ', async ({ page }) => {
    const booksPage = new BooksPage(page);
    await booksPage.goto();

    // ดึงชื่อหนังสือแถวแรกมาค้นหา
    await page.waitForSelector('table tbody tr', { timeout: 10000 });
    const firstTitle = await page.locator('table tbody tr td:nth-child(2)').first().innerText();

    await booksPage.search(firstTitle.trim());
    await expect(booksPage.bookTable).toContainText(firstTitle.trim(), { timeout: 8000 });
  });

  // ──────────────────────────────────────────────
  // TC-BOOK-08: ค้นหาหนังสือที่ไม่มีในระบบ
  // ──────────────────────────────────────────────
  test('TC-BOOK-08: ค้นหาหนังสือที่ไม่มีในระบบ', async ({ page }) => {
    const booksPage = new BooksPage(page);
    await booksPage.goto();
    await booksPage.search('ZZZZZZ_NOT_EXISTS');

    // ต้องแสดง "No books found" หรือตารางว่าง — ไม่มี error
    const noResult = await booksPage.noResultText.isVisible().catch(() => false);
    const emptyRow = await page.locator('table tbody tr').count() === 0;
    expect(noResult || emptyRow,
      'ควรแสดง No books found หรือตารางว่างเมื่อค้นหาไม่เจอ'
    ).toBeTruthy();
  });

  // ──────────────────────────────────────────────
  // TC-BOOK-09: ค้นหาด้วยชื่อผู้แต่ง
  // ──────────────────────────────────────────────
  test('TC-BOOK-09: ค้นหาด้วยชื่อผู้แต่ง', async ({ page }) => {
    const booksPage = new BooksPage(page);
    await booksPage.goto();

    await page.waitForSelector('table tbody tr', { timeout: 10000 });
    // ดึงชื่อ author จากคอลัมน์ที่ 3 (index 2)
    const firstAuthor = await page.locator('table tbody tr td:nth-child(3)').first().innerText();

    await booksPage.search(firstAuthor.trim());
    await expect(booksPage.bookTable).toContainText(firstAuthor.trim(), { timeout: 8000 });
  });

  // ──────────────────────────────────────────────
  // TC-BOOK-10: ค้นหาด้วย ISBN
  // ──────────────────────────────────────────────
  test('TC-BOOK-10: ค้นหาด้วย ISBN', async ({ page }) => {
    const booksPage = new BooksPage(page);
    await booksPage.goto();

    await page.waitForSelector('table tbody tr', { timeout: 10000 });
    // ISBN อยู่คอลัมน์แรก (ตรวจจาก Page snapshot: ISBN | Title | Author | Category | ...)
    const firstIsbn = await page.locator('table tbody tr td:nth-child(1)').first().innerText();

    await booksPage.search(firstIsbn.trim());
    await expect(booksPage.bookTable).toContainText(firstIsbn.trim(), { timeout: 8000 });
  });

  // ──────────────────────────────────────────────
  // TC ตรวจบัค (จาก BooksPage.js เดิม)
  // ──────────────────────────────────────────────

  // TC-BORROW-03 / BUG 15: ใส่ค่า copies ติดลบ
  test('TC-BORROW-03: [BUG 15] ระบบต้องปฏิเสธจำนวนหนังสือติดลบ', async ({ page }) => {
    const booksPage = new BooksPage(page);
    await booksPage.goto();
    await booksPage.openAddForm();
    await booksPage.fillAndSubmit({
      isbn: 'ERR-NEG-' + Date.now(),
      title: 'Neg-Book',
      author: 'Tester',
      copies: -99,
    });

    // ระบบที่ถูกต้องต้องแสดง error
    const errorVisible = await page.locator('[class*="alert"], [class*="error"], .text-danger')
                              .first().isVisible({ timeout: 5000 }).catch(() => false);
    if (!errorVisible) {
      console.warn('⚠️  [BUG 15 DETECTED] ระบบยอมรับค่าติดลบโดยไม่แสดง error');
    }
    expect(errorVisible,
      '[BUG 15 DETECTED] ระบบต้องปฏิเสธ copies = -99 แต่ไม่มี error แสดงขึ้น'
    ).toBeTruthy();
  });

  // BUG 17: ISBN ซ้ำ
  test('TC-BOOK-XX: [BUG 17] ระบบต้องปฏิเสธ ISBN ที่ซ้ำ', async ({ page }) => {
    const booksPage = new BooksPage(page);
    await booksPage.goto();

    const book = uniqueBook();

    // เพิ่มครั้งที่ 1
    await booksPage.addBook(book);
    await expect(booksPage.rowWith(book.isbn)).toBeVisible({ timeout: 10000 });

    // เพิ่มครั้งที่ 2 ด้วย ISBN เดิม
    await booksPage.addBook({ ...book, title: 'Duplicate ISBN Book' });

    const errorVisible = await page.locator('[class*="alert"], [class*="error"], .text-danger')
                              .first().isVisible({ timeout: 5000 }).catch(() => false);
    if (!errorVisible) {
      console.warn('⚠️  [BUG 17 DETECTED] ระบบยอมรับ ISBN ซ้ำโดยไม่แสดง error');
    }
    expect(errorVisible,
      '[BUG 17 DETECTED] ต้องแสดง error เมื่อ ISBN ซ้ำ'
    ).toBeTruthy();
  });
});