// pages/ReportsPage.js
class ReportsPage {
  constructor(page) {
    this.page = page;
    
    // Navigation and main buttons
    this.reportsLink = page.locator('a, [role="button"]').filter({ hasText: /Reports|รายงาน/i }).first();
    
    // Overdue Books Section
    this.overdueSection = page.locator('div, section').filter({ hasText: /Overdue|เกินกำหนด/i });
    this.overdueTable = page.locator('table').filter({ hasText: /Overdue|Member|Book|Days/ });
    this.overdueRows = page.locator('table tbody tr');
    
    // Column selectors
    this.memberColumn = page.locator('table th').filter({ hasText: /Member|สมาชิก/i });
    this.bookColumn = page.locator('table th').filter({ hasText: /Book|หนังสือ/i });
    this.daysOverdueColumn = page.locator('table th').filter({ hasText: /Days Overdue|วันที่เกิน/i });
    this.fineColumn = page.locator('table th').filter({ hasText: /Fine|ค่าปรับ/i });
    
    // Fine calculation formula: Days Overdue x 10 = Fine
    this.fineValues = page.locator('table tbody td').filter({ hasText: /\d+/ });
  }

  async goto() {
    await this.page.goto('http://localhost:3000/reports');
    await this.page.waitForLoadState('networkidle', { timeout: 15000 });
    await this.page.waitForTimeout(1000);
  }

  async clickReportsFromMenu() {
    await this.reportsLink.waitFor({ state: 'visible', timeout: 10000 });
    await this.reportsLink.click();
    await this.page.waitForLoadState('networkidle', { timeout: 15000 });
    await this.page.waitForTimeout(1000);
  }

  async verifyOverdueBooksTableVisible() {
    const headerExists = await this.page.locator('table th').filter({ hasText: /Member|Book|Days Overdue|Fine/i }).count();
    return headerExists > 0;
  }

  async getOverdueRecordsCount() {
    await this.overdueTable.waitFor({ state: 'attached', timeout: 10000 }).catch(() => {});
    return await this.overdueRows.count();
  }

  async getOverdueRecord(index) {
    const row = this.overdueRows.nth(index);
    const cells = row.locator('td');
    
    const record = {
      member: await cells.nth(0).textContent().catch(() => ''),
      book: await cells.nth(1).textContent().catch(() => ''),
      borrowDate: await cells.nth(2).textContent().catch(() => ''),
      dueDate: await cells.nth(3).textContent().catch(() => ''),
      daysOverdue: await cells.nth(4).textContent().catch(() => ''),
      fine: await cells.nth(5).textContent().catch(() => '')
    };
    
    return record;
  }

  async verifyFineCalculation() {
    const recordsCount = await this.getOverdueRecordsCount();
    const results = [];
    
    for (let i = 0; i < Math.min(recordsCount, 10); i++) {
      const record = await this.getOverdueRecord(i);
      const daysOverdue = parseInt(record.daysOverdue) || 0;
      const fine = parseInt(record.fine) || 0;
      const expectedFine = daysOverdue * 10;
      
      results.push({
        record,
        isCorrect: fine === expectedFine,
        expected: expectedFine,
        actual: fine
      });
    }
    
    return results;
  }

  async getAllOverdueRecords() {
    const recordsCount = await this.getOverdueRecordsCount();
    const records = [];
    
    for (let i = 0; i < recordsCount; i++) {
      records.push(await this.getOverdueRecord(i));
    }
    
    return records;
  }

  async verifyOverdueDataDisplayed() {
    // Check if table has data
    const rowCount = await this.overdueRows.count();
    if (rowCount === 0) {
      return false;
    }
    
    // Check if at least one cell has meaningful content
    const firstRowText = await this.overdueRows.first().textContent();
    return firstRowText && firstRowText.trim().length > 0;
  }

  async getPageHeader() {
    return await this.page.locator('h1, h2, .page-title').first().textContent();
  }

  async checkPageLoaded() {
    try {
      await this.page.waitForLoadState('networkidle', { timeout: 10000 });
      const isVisible = await this.page.locator('body').isVisible();
      return isVisible;
    } catch {
      return false;
    }
  }
}

module.exports = { ReportsPage };
