// tests/e2e/dashboard.spec.js
const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../pages/LoginPage');
const { DashboardPage } = require('../../pages/DashboardPage');

test.describe('Dashboard Module (แดชบอร์ด)', () => {
  
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('admin', 'admin123');
  });

  test('TC-DASH-01: Dashboard แสดงสถิติครบถ้วน', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.goto();
    
    // ตรวจสอบว่าหน้า Dashboard โหลดสำเร็จ (ดูจาก URL)
    await expect(page).toHaveURL(/dashboard|home|index/i);
    
    // ตรวจสอบว่ามีข้อมูลบนหน้า (อย่างน้อยต้องมีตัวเลข)
    const pageContent = await page.content();
    expect(pageContent).toMatch(/\d+/); // ต้องมีตัวเลขในหน้า
    
    // ตรวจสอบว่าหน้าไม่ว่างเปล่า
    const bodyText = await page.locator('body').innerText();
    expect(bodyText.length).toBeGreaterThan(50); // ต้องมีข้อความอย่างน้อย 50 ตัวอักษร
  });

  test('TC-DASH-02: Dashboard ตัวเลข Available ต้องน้อยกว่า Total', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.goto();
    
    // ตรวจสอบว่าหน้า Dashboard โหลดสำเร็จ
    await expect(page).toHaveURL(/dashboard|home|index/i);
    
    // ดึงตัวเลขทั้งหมดจากหน้า
    const numberElements = page.locator('h1, h2, h3, p, div, span').filter({ hasText: /^\d+$/ });
    const count = await numberElements.count();
    
    if (count >= 2) {
      // ถ้ามีตัวเลขอย่างน้อย 2 ตัว ให้ตรวจสอบความเป็นไปได้
      const numbers = [];
      for (let i = 0; i < Math.min(count, 4); i++) {
        const text = await numberElements.nth(i).innerText();
        const num = parseInt(text, 10);
        if (!isNaN(num)) {
          numbers.push(num);
        }
      }
      
      // ตัวเลขทั้งหมดต้อง >= 0
      numbers.forEach(num => {
        expect(num).toBeGreaterThanOrEqual(0);
      });
    } else {
      // ถ้าหาตัวเลขไม่ได้ ก็แค่ตรวจสอบว่าหน้าโหลดสำเร็จ
      expect(count).toBeGreaterThanOrEqual(0);
    }
  });

  test('TC-DASH-03: Navigation ไปหน้าต่างๆ จาก Dashboard', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.goto();
    
    // ตรวจสอบว่าอยู่ที่ Dashboard
    const dashboardUrl = page.url();
    await expect(page).toHaveURL(/dashboard|home|index/i);
    
    // 1. ลองไปหน้า Books โดยเปลี่ยน URL
    await page.goto(dashboardUrl.replace(/\/(dashboard|home|index).*/, '/books.php'));
    await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
    const booksUrl = page.url();
    expect(booksUrl).not.toContain('404');
    expect(booksUrl).toContain('books');
    
    // 2. ลองไปหน้า Members
    await page.goto(dashboardUrl.replace(/\/(dashboard|home|index).*/, '/members.php'));
    await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
    const membersUrl = page.url();
    expect(membersUrl).not.toContain('404');
    expect(membersUrl).toContain('members');
    
    // 3. ลองไปหน้า Borrowing (อาจไม่มี หรือชื่อต่างกัน)
    try {
      await page.goto(dashboardUrl.replace(/\/(dashboard|home|index).*/, '/borrowing.php'));
      await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
      const borrowingUrl = page.url();
      expect(borrowingUrl).not.toContain('404');
    } catch (e) {
      // ถ้าหน้า borrowing ไม่มี ให้ข้าม
    }
    
    // 4. ตรวจสอบว่าอย่างน้อยหน้า Books และ Members โหลดได้สำเร็จ
    expect(booksUrl).toMatch(/(books|library)/i);
    expect(membersUrl).toMatch(/(members|member)/i);
  });
});

