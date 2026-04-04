// pages/ReportsPage.js
class ReportsPage {
  constructor(page) {
    this.page = page;

    this.reportsLink = page.getByRole('link', { name: /Reports/i });

    // ระบุตาราง Overdue โดยเฉพาะ ไม่ใช่ table แรก
    this.overdueTable = page.locator('table').filter({ has: page.locator('th', { hasText: /Days.?Overdue/i }) });
    this.overdueRows = this.overdueTable.locator('tbody tr');

    this.memberHeader = this.overdueTable.locator('th').filter({ hasText: /Member/i });
    this.bookHeader = this.overdueTable.locator('th').filter({ hasText: /Book/i });
    this.daysOverdueHeader = this.overdueTable.locator('th').filter({ hasText: /Days.?Overdue/i });
    this.fineHeader = this.overdueTable.locator('th').filter({ hasText: /Fine/i });
  }

  async goto() {
    await this.page.goto('http://localhost:8080/reports.php');
    await this.page.waitForLoadState('networkidle', { timeout: 15000 });
  }

  async clickReportsFromMenu() {
    await this.reportsLink.waitFor({ state: 'visible', timeout: 10000 });
    await this.reportsLink.click();
    await this.page.waitForLoadState('networkidle', { timeout: 15000 });
  }

  async verifyOverdueBooksTableVisible() {
    const m = await this.memberHeader.count();
    const b = await this.bookHeader.count();
    const d = await this.daysOverdueHeader.count();
    const f = await this.fineHeader.count();
    return m > 0 && b > 0 && d > 0 && f > 0;
  }

  async getOverdueRecordsCount() {
    return await this.overdueRows.count();
  }

  // Overdue table columns: MemberCode(0) MemberName(1) BookTitle(2) BorrowDate(3) DueDate(4) DaysOverdue(5) Fine(6)
  async getOverdueRecord(index) {
    const cells = this.overdueRows.nth(index).locator('td');
    return {
      memberCode:  ((await cells.nth(0).textContent()) || '').trim(),
      member:      ((await cells.nth(1).textContent()) || '').trim(),
      book:        ((await cells.nth(2).textContent()) || '').trim(),
      borrowDate:  ((await cells.nth(3).textContent()) || '').trim(),
      dueDate:     ((await cells.nth(4).textContent()) || '').trim(),
      daysOverdue: ((await cells.nth(5).textContent()) || '').trim(),
      fine:        ((await cells.nth(6).textContent()) || '').trim(),
    };
  }

  async verifyFineCalculation() {
    const count = await this.getOverdueRecordsCount();
    const results = [];

    for (let i = 0; i < count; i++) {
      const record = await this.getOverdueRecord(i);
      const daysOverdue = parseInt(record.daysOverdue.replace(/[^0-9]/g, ''), 10) || 0;
      const fine = parseFloat(record.fine.replace(/[^0-9.]/g, '')) || 0;
      const expected = daysOverdue * 10;

      results.push({
        record,
        isCorrect: fine === expected,
        expected,
        actual: fine,
      });
    }

    return results;
  }

  async getAllOverdueRecords() {
    const count = await this.getOverdueRecordsCount();
    const records = [];
    for (let i = 0; i < count; i++) {
      records.push(await this.getOverdueRecord(i));
    }
    return records;
  }

  async verifyOverdueDataDisplayed() {
    const rowCount = await this.overdueRows.count();
    if (rowCount === 0) return false;
    const text = await this.overdueRows.first().textContent();
    return (text || '').trim().length > 0;
  }

  async getPageHeader() {
    return await this.page.locator('h1, h2, h3, .page-title').first().textContent();
  }

  async checkPageLoaded() {
    try {
      await this.page.waitForLoadState('networkidle', { timeout: 10000 });
      return await this.page.locator('body').isVisible();
    } catch {
      return false;
    }
  }
}

module.exports = { ReportsPage };