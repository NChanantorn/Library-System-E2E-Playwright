const { test, expect } = require('@playwright/test');

test('Visual Regression - All System Pages (Full Check)', async ({ page }) => {
  // 1. ตั้งค่า Timeout และการเตรียมตัว
  test.setTimeout(120000);

  // --- ขั้นตอนที่ 1: Login ---
  console.log('🔐 Logging in...');
  await page.goto('http://localhost:8080/login.php');
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveScreenshot('01-login.png');

  await page.fill('input[name="username"]', 'admin');
  await page.fill('input[name="password"]', 'admin123');
  
  await Promise.all([
    page.waitForURL('**/index.php'),
    page.click('button[type="submit"]'),
  ]);

  // --- ขั้นตอนที่ 2: แคปหน้าจอหลัก (Main Pages) ---
  const mainPages = [
    { name: '02-dashboard', url: 'index.php' },
    { name: '03-books-list', url: 'books.php' },
    { name: '05-members-list', url: 'members.php' },
    { name: '07-borrow-books', url: 'borrow.php' },
    { name: '08-return-books', url: 'return.php' },
    { name: '09-reports', url: 'reports.php' },
  ];

  for (const pageInfo of mainPages) {
    console.log(`📸 Capturing Page: ${pageInfo.url}`);
    await page.goto(`http://localhost:8080/${pageInfo.url}`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000); 
    await expect(page).toHaveScreenshot(`${pageInfo.name}.png`);
  }

  // --- ขั้นตอนที่ 3: ทดสอบ Visual บน Modal ---

  // 📕 ทดสอบ Add Book Modal
  console.log('📸 Capturing Modal: Add Book');
  await page.goto('http://localhost:8080/books.php');
  await page.waitForLoadState('networkidle');
  
  // ใช้ Attribute เจาะจงสำหรับปุ่มเปิด Modal ของหนังสือ
  const addBookBtn = page.locator('button[data-bs-target*="Book"], button[data-bs-target*="book"]').filter({ visible: true }).first();
  await addBookBtn.click();
  
  await page.waitForSelector('.modal.show', { state: 'visible', timeout: 10000 });
  await page.waitForTimeout(1000); 
  await expect(page).toHaveScreenshot('04-add-book-modal.png');
  await page.keyboard.press('Escape'); 
  await page.waitForTimeout(500);

  // 👥 ทดสอบ Add Member Modal (อ้างอิงตาม HTML members.php ของคุณ)
  console.log('📸 Capturing Modal: Add Member');
  await page.goto('http://localhost:8080/members.php');
  await page.waitForLoadState('networkidle');
  
  // จากโค้ดคุณ: <button class="btn btn-primary" data-bs-target="#addMemberModal">
  // เราจะเลือกปุ่มที่มี data-bs-target โดยตรง เพราะมัน "ไม่ซ้ำ" กับปุ่ม Submit ใน Modal
  const addMemberBtn = page.locator('button[data-bs-target="#addMemberModal"]');
  
  await expect(addMemberBtn).toBeVisible();
  await addMemberBtn.click();
  
  // รอจน ID ของ Modal ปรากฏและมี Class .show (Bootstrap Animation)
  await page.waitForSelector('#addMemberModal.show', { state: 'visible', timeout: 10000 });
  await page.waitForTimeout(1000);
  await expect(page).toHaveScreenshot('06-add-member-modal.png');

  console.log('✅ Visual Regression Test Completed!');
});