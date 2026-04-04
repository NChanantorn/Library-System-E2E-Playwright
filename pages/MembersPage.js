// pages/MembersPage.js
class MembersPage {
  constructor(page) {
    this.page = page;
    // ใช้ Selector ที่กว้างขึ้นเพื่อให้หาปุ่มเจอแน่นอน
    this.addMemberBtn = page.locator('button, a').filter({ hasText: /Add New Member|เพิ่มสมาชิก/i });
    this.codeInput = page.locator('input[name="member_code"]');
    this.nameInput = page.locator('input[name="member_name"]');
    this.emailInput = page.locator('input[name="member_email"]');
    this.phoneInput = page.locator('input[name="member_phone"]');
    this.submitBtn = page.locator('button[type="submit"], .btn-primary').filter({ hasText: /Add|Save|บันทึก/i });
  }

  async goto() {
    await this.page.goto('http://localhost:8080/members.php');
    // รอให้หน้าเว็บนิ่งจริงๆ ก่อนเริ่มทำงาน
    await this.page.waitForLoadState('networkidle');
  }

  async fillMemberInfo(code, name, email, phone) {
    // รอให้ปุ่ม Add ปรากฏก่อนค่อยกด
    await this.addMemberBtn.first().waitFor({ state: 'visible', timeout: 10000 });
    await this.addMemberBtn.first().click();
    
    // รอให้ Modal โหลดเสร็จ (สำคัญมาก!)
    await this.page.waitForTimeout(1000); 
    await this.codeInput.waitFor({ state: 'visible', timeout: 5000 });
    
    await this.codeInput.fill(code);
    await this.nameInput.fill(name);
    await this.emailInput.fill(email);
    await this.phoneInput.fill(phone);
    
    await this.submitBtn.first().click();
    // รอให้ Modal ปิดลงก่อนไปสเต็ปถัดไป
    await this.page.waitForLoadState('networkidle');
  }
}
module.exports = { MembersPage };