# Test Cases User Experience and End-to-End Testing - ทดสอบ UI/UX อย่างองค์รวม

**โครงการ**: User Experience and End-to-End Testing - ทดสอบ UI/UX อย่างองค์รวม
**วันที่**: 4 เมษายน 2026 
**เวอร์ชัน**: 1.0 
**รวม**: 50 Test Cases

TC-ID: TC-AUTH-01
Module: Authentication
หัวข้อการทดสอบ: Login ด้วย Username/Password ที่ถูกต้อง
ลำดับความสำคัญ: Critical
เงื่อนไขก่อน: มีบัญชี admin/admin123 ในระบบ
ขั้นตอน:
1. เปิด http://localhost:8080
2. กรอก username: admin
3. กรอก password: admin123
4. กดปุ่ม Login
ผลที่คาดหวัง:
- เข้าสู่ระบบสำเร็จ
- เปลี่ยนไปหน้า Dashboard
- แสดง 'System Administrator' มุมขวาบน"

TC-ID: TC-AUTH-02
Module: Authentication
หัวข้อการทดสอบ: Login ด้วย Password ที่ผิด
ลำดับความสำคัญ: High
เงื่อนไขก่อน: มีบัญชี admin ในระบบ
ขั้นตอน:
1. เปิด http://localhost:8080
2. กรอก username: admin
3. กรอก password: wrongpass
4. กดปุ่ม Login
ผลที่คาดหวัง:
- Login ไม่สำเร็จ
- แสดง error message
- ยังอยู่หน้า Login

TC-ID: TC-AUTH-03
Module: Authentication
หัวข้อการทดสอบ: Login ด้วย Username ที่ไม่มีในระบบ
ลำดับความสำคัญ: High
เงื่อนไขก่อน: ไม่มีบัญชี nobody ในระบบ
ขั้นตอน:
1. เปิด http://localhost:8080
2. กรอก username: nobody
3. กรอก password: admin123
4. กดปุ่ม Login
ผลที่คาดหวัง:
- Login ไม่สำเร็จ
- แสดง error message
- ยังอยู่หน้า Login

TC-ID: TC-AUTH-04
Module: Authentication
หัวข้อการทดสอบ:  ปล่อยช่องว่างทั้งหมด
ลำดับความสำคัญ: High
เงื่อนไขก่อน: อยู่ที่หน้า Login
ขั้นตอน:
1. เปิด http://localhost:8080
2. ไม่กรอกอะไรเลย
3. กดปุ่ม Login
ผลที่คาดหวัง:
- แสดง error validation
- ไม่สามารถ Login ได้
- ยังอยู่หน้า Login

TC-ID: TC-AUTH-05
Module: Authentication
หัวข้อการทดสอบ: Login ด้วย librarian account
ลำดับความสำคัญ: Medium
เงื่อนไขก่อน: มีบัญชี librarian/lib123 ในระบบ
ขั้นตอน:
1. เปิด http://localhost:8080
2. กรอก username: librarian
3. กรอก password: lib123
4. กดปุ่ม Login
ผลที่คาดหวัง:
- เข้าสู่ระบบสำเร็จ
- เข้าถึง Dashboard ได้

TC-ID: TC-AUTH-06
Module: Authentication
หัวข้อการทดสอบ: SQL Injection ใน Login form
ลำดับความสำคัญ: High
เงื่อนไขก่อน: อยู่ที่หน้า Login
ขั้นตอน:
1. กรอก username: ' OR '1'='1
2. กรอก password: ' OR '1'='1
3. กดปุ่ม Login
ผลที่คาดหวัง:
- Login ไม่สำเร็จ
- ระบบป้องกัน SQL Injection ได้
- ไม่เข้าสู่ระบบโดยไม่ได้รับอนุญาต

TC-ID: TC-AUTH-07
Module: Authentication
หัวข้อการทดสอบ: Logout ออกจากระบบ
ลำดับความสำคัญ: Critical
เงื่อนไขก่อน: Login เข้าระบบแล้ว
ขั้นตอน:
1. คลิกปุ่ม Logout มุมขวาบน
2. ดูผลลัพธ์
ผลที่คาดหวัง:
- Logout สำเร็จ
- กลับไปหน้า Login
- Session ถูกยกเลิก

TC-ID: TC-AUTH-08
Module: Authentication
หัวข้อการทดสอบ: Auth Guard - เข้าหน้า /books โดยไม่ Login
ลำดับความสำคัญ: High
เงื่อนไขก่อน: ยังไม่ได้ Login
ขั้นตอน:
1. พิมพ์ URL: http://localhost:8080/books.php โดยตรง
2. ดูว่าระบบทำอะไร
ผลที่คาดหวัง:
- Redirect กลับหน้า Login อัตโนมัติ
- ไม่สามารถเข้าหน้า books ได้

TC-ID: TC-AUTH-09
Module: Authentication
หัวข้อการทดสอบ: Auth Guard - เข้าหน้า /members โดยไม่ Login
ลำดับความสำคัญ: High
เงื่อนไขก่อน: ยังไม่ได้ Login
ขั้นตอน:
1. พิมพ์ URL: http://localhost:8080/members.php โดยตรง
ผลที่คาดหวัง:
- Redirect กลับหน้า Login อัตโนมัติ

TC-ID: TC-AUTH-10
Module: Authentication
หัวข้อการทดสอบ: Auth Guard - เข้าหน้า /borrow โดยไม่ Login
ลำดับความสำคัญ: High
เงื่อนไขก่อน: ยังไม่ได้ Login
ขั้นตอน:
1. พิมพ์ URL: http://localhost:8080/borrow.php โดยตรง
ผลที่คาดหวัง:
- Redirect กลับหน้า Login อัตโนมัติ

TC-ID: TC-DASH-01
Module: Dashboard
หัวข้อการทดสอบ: Dashboard แสดงสถิติครบถ้วน
ลำดับความสำคัญ: Critical
เงื่อนไขก่อน: Login เป็น admin แล้ว
ขั้นตอน:
1. Login ด้วย admin/admin123
2. ดูที่หน้า Dashboard
ผลที่คาดหวัง:
- แสดง Total Books
- แสดง Available Books
- แสดง Active Members
- แสดง Borrowed Books
- ตัวเลขสมเหตุสมผล"

TC-ID: TC-DASH-02
Module: Dashboard
หัวข้อการทดสอบ: Dashboard ตัวเลข Available ต้องน้อยกว่า Total
ลำดับความสำคัญ: High
เงื่อนไขก่อน: Login เป็น admin แล้ว
ขั้นตอน:
1. Login ด้วย admin/admin123
2. ดูตัวเลข Total Books และ Available Books
ผลที่คาดหวัง:
- Available Books <= Total Books
- Borrowed Books <= Total Books

TC-ID: TC-DASH-03
Module: Dashboard
หัวข้อการทดสอบ: Navigation ไปหน้าต่างๆ จาก Dashboard
ลำดับความสำคัญ: Critical
เงื่อนไขก่อน: อยู่ที่หน้า Dashboard
ขั้นตอน:
1. คลิก Books
2. ตรวจสอบว่าไปหน้า Books
3. กลับมา คลิก Members
4. คลิก Borrowing
5. คลิก 
ผลที่คาดหวัง:
- ทุกการ์ดพาไปหน้าที่ถูกต้อง
- ไม่มี 404 error

TC-ID: TC-BOOK-01
Module: Books
หัวข้อการทดสอบ: เปิดหน้า Books Management
ลำดับความสำคัญ: Critical
เงื่อนไขก่อน: Login เป็น admin แล้ว
ขั้นตอน:
1. คลิก Books ที่เมนู
2. รอหน้าโหลด
ผลที่คาดหวัง:
- หน้าโหลดสำเร็จ
- แสดงรายการหนังสือ
- มีปุ่ม + Add Book

TC-ID: TC-BOOK-02
Module: Books
หัวข้อการทดสอบ: แสดงรายการหนังสือทั้งหมด
ลำดับความสำคัญ: High
เงื่อนไขก่อน: มีหนังสือในระบบ
ขั้นตอน:
1. ไปหน้า Books
2. ดูตารางรายการหนังสือ
ผลที่คาดหวัง:
- แสดงข้อมูลครบ: ID, Title, Author, ISBN, Total Copies, Available
- มีปุ่ม Edit, Delete

TC-ID: TC-BOOK-03
Module: Books
หัวข้อการทดสอบ: เพิ่มหนังสือใหม่ด้วยข้อมูลครบถ้วน
ลำดับความสำคัญ: Critical
เงื่อนไขก่อน: อยู่ที่หน้า Books
ขั้นตอน:
1. คลิก + Add Book
2. กรอก Title: 'Test Book'
3. กรอก Author: 'Test Author'
4. กรอก ISBN: '999-999-999-9'
5. กรอก Total Copies: 3
6. คลิก Save
ผลที่คาดหวัง:
- หนังสือถูกเพิ่มสำเร็จ
- ขึ้น 'Book added successfully'
- หนังสือใหม่ปรากฏในรายการ

TC-ID: TC-BOOK-04
Module: Books
หัวข้อการทดสอบ: เพิ่มหนังสือโดยไม่กรอกข้อมูลที่จำเป็น
ลำดับความสำคัญ: High
เงื่อนไขก่อน: อยู่ที่หน้า Add Book
ขั้นตอน:
1. คลิก + Add Book
2. ไม่กรอกอะไรเลย
3. คลิก Save
ผลที่คาดหวัง:
- แสดง validation error
- ไม่บันทึกข้อมูล
- ระบุ field ที่จำเป็นต้องกรอก

TC-ID: TC-BOOK-05
Module: Books
หัวข้อการทดสอบ: แก้ไขข้อมูลหนังสือ
ลำดับความสำคัญ: Critical
เงื่อนไขก่อน: มีหนังสือในระบบ
ขั้นตอน:
1. คลิก Edit ของหนังสือเล่มใดก็ได้
2. แก้ไข Title
3. คลิก Update Book
ผลที่คาดหวัง:
- ข้อมูลเดิมโหลดมาใน form
- บันทึกสำเร็จ
- ข้อมูลใหม่แสดงในรายการ

TC-ID: TC-BOOK-06
Module: Books
หัวข้อการทดสอบ: ลบหนังสือออกจากระบบ
ลำดับความสำคัญ: High
เงื่อนไขก่อน: มีหนังสือที่ไม่ถูกยืมในระบบ
ขั้นตอน:
1. คลิก Delete ของหนังสือ
2. กด OK ยืนยัน
ผลที่คาดหวัง:
- ขึ้น popup ยืนยันก่อนลบ
- ลบสำเร็จ
- หนังสือหายไปจากรายการ

TC-ID: TC-BOOK-07
Module: Books
หัวข้อการทดสอบ: ค้นหาหนังสือด้วยชื่อ
ลำดับความสำคัญ: Critical
เงื่อนไขก่อน: มีหนังสือในระบบ
ขั้นตอน:
1. พิมพ์ชื่อหนังสือในช่อง Search
2. คลิก Search
ผลที่คาดหวัง:
- แสดงเฉพาะหนังสือที่ตรงกับคำค้นหา
- ผลลัพธ์ถูกต้อง

TC-ID: TC-BOOK-08
Module: Books
หัวข้อการทดสอบ: ค้นหาหนังสือที่ไม่มีในระบบ
ลำดับความสำคัญ: Medium
เงื่อนไขก่อน: อยู่ที่หน้า Books
ขั้นตอน:
1. พิมพ์ 'ZZZZZZ' ในช่อง Search
2. คลิก Search
ผลที่คาดหวัง:
- แสดง 'No books found'
- ไม่มี error

TC-ID: TC-BOOK-09
Module: Books
หัวข้อการทดสอบ: ค้นหาด้วยชื่อผู้แต่ง
ลำดับความสำคัญ: Medium
เงื่อนไขก่อน: มีหนังสือในระบบ
ขั้นตอน:
1. พิมพ์ชื่อผู้แต่งในช่อง Search
2. คลิก Search
ผลที่คาดหวัง:
- แสดงหนังสือของผู้แต่งนั้น

TC-ID: TC-BOOK-10
Module: Books
หัวข้อการทดสอบ: ค้นหาด้วย ISBN
ลำดับความสำคัญ: Medium
เงื่อนไขก่อน: มีหนังสือในระบบ
ขั้นตอน:
1. พิมพ์ ISBN ในช่อง Search
2. คลิก Search
ผลที่คาดหวัง:
- แสดงหนังสือที่ตรงกับ ISBN

TC-ID: TC-MEM-01
Module: Members
หัวข้อการทดสอบ: เปิดหน้า Members Management
ลำดับความสำคัญ: Critical
เงื่อนไขก่อน: Login เป็น admin แล้ว
ขั้นตอน:
1. คลิก Members ที่เมนู
2. รอหน้าโหลด
ผลที่คาดหวัง:
- หน้าโหลดสำเร็จ
- แสดงรายการสมาชิก
- มีปุ่ม + Add Member

TC-ID: TC-MEM-02
Module: Members
หัวข้อการทดสอบ: แสดงรายการสมาชิกทั้งหมด
ลำดับความสำคัญ: High
เงื่อนไขก่อน: มีสมาชิกในระบบ
ขั้นตอน:
1. ไปหน้า Members
2. ดูตารางรายการสมาชิก
ผลที่คาดหวัง:
- แสดงข้อมูลครบ: ID, Full Name, Email, Phone, Status, Max Books"

TC-ID: TC-MEM-03
Module: Members
หัวข้อการทดสอบ: เพิ่มสมาชิกใหม่ด้วยข้อมูลครบถ้วน
ลำดับความสำคัญ: Critical
เงื่อนไขก่อน: อยู่ที่หน้า Members
ขั้นตอน:
1. คลิก + Add Member
2. กรอก Member Code: M999
3. กรอก Full Name: Test Member
4. เลือก Member Type: Student
5. คลิก Save
ผลที่คาดหวัง:
- สมาชิกถูกเพิ่มสำเร็จ
- ปรากฏในรายการ

TC-ID: TC-MEM-04
Module: Members
หัวข้อการทดสอบ: เพิ่มสมาชิกด้วย Member Code ที่ซ้ำ
ลำดับความสำคัญ: High
เงื่อนไขก่อน: มีสมาชิก M001 อยู่แล้ว
ขั้นตอน:
1. คลิก + Add Member
2. กรอก Member Code: M001
3. กรอกข้อมูลอื่นครบ
4. คลิก Save
ผลที่คาดหวัง:
- แสดง error 'Member code already exists'
- ไม่บันทึกข้อมูล"

TC-ID: TC-MEM-05
Module: Members
หัวข้อการทดสอบ: แก้ไขข้อมูลสมาชิก
ลำดับความสำคัญ: High
เงื่อนไขก่อน: มีสมาชิกในระบบ
ขั้นตอน:
1. คลิก Edit ของสมาชิก
2. แก้ไขข้อมูล
3. คลิก Save
ผลที่คาดหวัง:
- ข้อมูลเดิมโหลดมาใน form
- บันทึกสำเร็จ

TC-ID: TC-MEM-06
Module: Members
หัวข้อการทดสอบ: ลบสมาชิก
ลำดับความสำคัญ: Medium
เงื่อนไขก่อน: มีสมาชิกที่ไม่มีการยืมค้างในระบบ
ขั้นตอน:
1. คลิก Delete ของสมาชิก
2. ยืนยัน
ผลที่คาดหวัง:
- ลบสำเร็จ
- สมาชิกหายไปจากรายการ

TC-ID: TC-MEM-07
Module: Members
หัวข้อการทดสอบ: เพิ่มสมาชิกโดยไม่กรอกข้อมูลที่จำเป็น
ลำดับความสำคัญ: High
เงื่อนไขก่อน: อยู่ที่หน้า Add Member
ขั้นตอน:
1. คลิก + Add Member
2. ไม่กรอกอะไรเลย
3. คลิก Save
ผลที่คาดหวัง:
- แสดง validation error
- ระบุ field ที่จำเป็น

TC-ID: TC-BOR-01
Module: Borrowing
หัวข้อการทดสอบ: เปิดหน้า Borrowing Management
ลำดับความสำคัญ: Critical
เงื่อนไขก่อน: Login เป็น admin แล้ว
ขั้นตอน:
1. คลิก Borrowing ที่เมนู
2. รอหน้าโหลด
ผลที่คาดหวัง:
- หน้าโหลดสำเร็จ
- แสดงรายการการยืม
- มีปุ่ม + New Borrow

TC-ID: TC-BOR-02
Module: Borrowing
หัวข้อการทดสอบ: ยืมหนังสือที่มีอยู่ในระบบ
ลำดับความสำคัญ: Critical
เงื่อนไขก่อน: มีหนังสือ Available และสมาชิกในระบบ
ขั้นตอน:
1. คลิก + New Borrow
2. เลือก Member
3. เลือก Book ที่ Available > 0
4. คลิก Save
ผลที่คาดหวัง:
- ยืมสำเร็จ
- แสดงในรายการ Borrowing
- Status = Borrowed

TC-ID: TC-BOR-03
Module: Borrowing
หัวข้อการทดสอบ: คืนหนังสือ
ลำดับความสำคัญ: Critical
เงื่อนไขก่อน: มีรายการยืมที่ยังไม่คืน
ขั้นตอน:
1. หารายการที่ Status = Borrowed
2. คลิกปุ่ม Return
3. กด OK ยืนยัน
ผลที่คาดหวัง:
- คืนสำเร็จ
- Status เปลี่ยนเป็น Returned
- Return Date แสดงวันที่คืน

TC-ID: TC-BOR-04
Module: Borrowing
หัวข้อการทดสอบ: ดูรายละเอียดการยืม (Details)
ลำดับความสำคัญ: Medium
เงื่อนไขก่อน:
ขั้นตอน:
1. คลิกปุ่ม Details ของรายการยืม
2. ดูข้อมูล
ผลที่คาดหวัง:
- แสดงรายละเอียดครบถ้วน
- ข้อมูลถูกต้อง

TC-ID: TC-BOR-05
Module: Borrowing
หัวข้อการทดสอบ: ตรวจสอบ Status ของหนังสือที่เกินกำหนด
ลำดับความสำคัญ: High
เงื่อนไขก่อน: มีรายการยืมที่เลย Due Date แล้ว
ขั้นตอน:
1. ดูรายการที่ Due Date ผ่านมาแล้ว
2. ตรวจสอบ Status
ผลที่คาดหวัง:
- Status ควรเป็น Overdue
- ไม่ใช่ Borrowed

TC-ID: TC-BOR-06
Module: Borrowing
หัวข้อการทดสอบ: ตรวจสอบ Due Date ที่สร้างขึ้น
ลำดับความสำคัญ: Medium
เงื่อนไขก่อน: ยืมหนังสือสำเร็จ
ขั้นตอน:
1. ยืมหนังสือ
2. ดู Due Date ที่แสดง
ผลที่คาดหวัง:
- Due Date = วันที่ยืม + 14 วัน
- วันที่ถูกต้อง

TC-ID: TC-BOR-07
Module: Borrowing
หัวข้อการทดสอบ: ป้องกันการยืมหนังสือที่ Available = 0
ลำดับความสำคัญ: High
เงื่อนไขก่อน: มีหนังสือที่ Available = 0
ขั้นตอน:
1. ลอง New Borrow
2. เลือกหนังสือที่ Available = 0
ผลที่คาดหวัง:
- ระบบป้องกันไม่ให้ยืมได้
- แสดง error message

TC-ID: TC-REP-01
Module: Reports
หัวข้อการทดสอบ: เปิดหน้า Reports
ลำดับความสำคัญ: Critical
เงื่อนไขก่อน: Login เป็น admin แล้ว
ขั้นตอน:
1. คลิก Reports ที่เมนู
2. รอหน้าโหลด
ผลที่คาดหวัง:
- หน้าโหลดสำเร็จ
- แสดงข้อมูล Overdue Books

TC-ID: TC-REP-02
Module: Reports
หัวข้อการทดสอบ: แสดงรายการหนังสือเกินกำหนด
ลำดับความสำคัญ: High
เงื่อนไขก่อน: มีรายการยืมที่เกิน Due Date
ขั้นตอน:
1. ไปหน้า Reports
2. ดูส่วน Overdue Books
ผลที่คาดหวัง:
- แสดงรายการที่เกินกำหนด
- แสดง Days Overdue และ Fine ถูกต้อง

TC-ID: TC-REP-03
Module: Reports
หัวข้อการทดสอบ: ตรวจสอบการคำนวณค่าปรับ
ลำดับความสำคัญ: High
เงื่อนไขก่อน: มีรายการ Overdue
ขั้นตอน:
1. ดูรายการ Overdue
2. ตรวจสอบ: Days Overdue x 10 = Fine
ผลที่คาดหวัง:
- Fine = Days Overdue x 10 baht
- คำนวณถูกต้อง

TC-ID: TC-CROSS-01
Module: Cross-Browser
หัวข้อการทดสอบ: ทดสอบบน Chrome
ลำดับความสำคัญ: High
เงื่อนไขก่อน: ติดตั้ง Chrome แล้ว
ขั้นตอน:
1. เปิดระบบด้วย Chrome
2. Login
3. ทดสอบฟีเจอร์หลัก
ผลที่คาดหวัง:
- ทุกฟีเจอร์ทำงานได้บน Chrome

TC-ID: TC-CROSS-02
Module: Cross-Browser
หัวข้อการทดสอบ: ทดสอบบน Firefox
ลำดับความสำคัญ: High
เงื่อนไขก่อน: ติดตั้ง Firefox แล้ว
ขั้นตอน:
1. เปิดระบบด้วย Firefox
2. Login
3. ทดสอบฟีเจอร์หลัก
ผลที่คาดหวัง:
- ทุกฟีเจอร์ทำงานได้บน Firefox

TC-ID: TC-CROSS-03
Module: Cross-Browser
หัวข้อการทดสอบ: ทดสอบบน Edge
ลำดับความสำคัญ: Medium
เงื่อนไขก่อน: ติดตั้ง Edge แล้ว
ขั้นตอน:
1. เปิดระบบด้วย Edge
2. Login
3. ทดสอบฟีเจอร์หลัก
ผลที่คาดหวัง:
- ทุกฟีเจอร์ทำงานได้บน Edge

TC-ID: TC-VIS-01
Module: Visual
หัวข้อการทดสอบ: หน้า Login แสดงผลถูกต้อง
ลำดับความสำคัญ: Medium
เงื่อนไขก่อน: เปิดระบบแล้ว
ขั้นตอน:
1. เปิด http://localhost:8080
2. ดู UI
ผลที่คาดหวัง:
- Form Login แสดงครบ
- ปุ่ม Login แสดงถูกต้อง

TC-ID: TC-VIS-02
Module: Visual
หัวข้อการทดสอบ: หน้า Dashboard แสดงผลถูกต้อง
ลำดับความสำคัญ: Medium
เงื่อนไขก่อน: Login แล้ว
ขั้นตอน:
1. ดูหน้า Dashboard
2. ตรวจสอบ Layout
ผลที่คาดหวัง:
- 4 การ์ดสถิติแสดงครบ
- 4 เมนูนำทางแสดงครบ

TC-ID: TC-VIS-03
Module: Visual
หัวข้อการทดสอบ:Responsive Design บนหน้าจอเล็ก
ลำดับความสำคัญ: Low
เงื่อนไขก่อน: Login แล้ว
ขั้นตอน:
1. กด F12
2. เปลี่ยน device เป็น mobile
3. ดูทุกหน้า
ผลที่คาดหวัง:
- หน้าแสดงผลได้บนจอมือถือ
- ไม่มีเนื้อหาเกินหน้าจอ

TC-ID: TC-UJ-01
Module: User Journey
หัวข้อการทดสอบ: การยืมหนังสือ End-to-End
ลำดับความสำคัญ: Critical
เงื่อนไขก่อน: Login เป็น admin แล้ว มีหนังสือและสมาชิก
ขั้นตอน:
1. Login
2. ไปหน้า Borrowing
3. คลิก + New Borrow
4. เลือกสมาชิกและหนังสือ
5. บันทึก
6. ดูรายการที่ Borrowed
7. Logout
- ยืมสำเร็จครบทุกขั้น
ผลที่คาดหวัง:
- รายการแสดงถูกต้อง

TC-ID: TC-UJ-02
Module: User Journey
หัวข้อการทดสอบ: การคืนหนังสือ End-to-End
ลำดับความสำคัญ: Critical
เงื่อนไขก่อน: มีรายการยืมที่ยังไม่คืน
ขั้นตอน:
1. Login
2. ไปหน้า Borrowing
3. คลิก Return
4. ยืนยัน
5. ตรวจสอบ Status = Returned
ผลที่คาดหวัง:
- คืนสำเร็จครบทุกขั้น

TC-ID: TC-UJ-03
Module: User Journey
หัวข้อการทดสอบ: การจัดการหนังสือ End-to-End
ลำดับความสำคัญ: High
เงื่อนไขก่อน: Login เป็น admin แล้ว
ขั้นตอน:
1. Login
2. เพิ่มหนังสือใหม่
3. แก้ไขหนังสือ
4. ลบหนังสือ
ผลที่คาดหวัง:
- CRUD ทุกขั้นทำงานได้

TC-ID: TC-UJ-04
Module: User Journey
หัวข้อการทดสอบ: การจัดการสมาชิก End-to-End
ลำดับความสำคัญ: High
เงื่อนไขก่อน: Login เป็น admin แล้ว
ขั้นตอน:
1. Login
2. เพิ่มสมาชิกใหม่
3. แก้ไขสมาชิก
4. ลบสมาชิก
ผลที่คาดหวัง:
- CRUD ทุกขั้นทำงานได้

TC-ID: TC-UJ-05
Module: User Journey
หัวข้อการทดสอบ: ดูรายงาน Overdue End-to-End
ลำดับความสำคัญ: High
เงื่อนไขก่อน: มีรายการ Overdue
ขั้นตอน:
1. Login
2. ไปหน้า Reports
3. ดู Overdue Books
4. ตรวจสอบข้อมูล
ผลที่คาดหวัง:
- ข้อมูลแสดงถูกต้องครบถ้วน