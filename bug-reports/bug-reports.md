# 🐛 Bug Report

# Bug Reports - Library Management System Manual Testing

**Report Date:** 4 เมษายน 2026  
**Testing Period:** Manual Black Box Testing  
**Tester:** Manual Testing Team (66160026)
**Total Bugs Found:** In Progress

---

## BUG-001

Bug ID: BUG-001  
ชื่อ: PHP Warnings/Errors แสดงบนหน้า Login เมื่อ Password ผิด  
Severity: High  
Priority: High  
TC-ID: TC-AUTH-02  
Feature: Authentication / Login Page

### ขั้นตอนการทำซ้ำ:

1. เปิด http://localhost:8080/login.php
2. กรอก Username: admin
3. กรอก Password: wrongpass (รหัสผ่านที่ผิด)
4. คลิกปุ่ม Login

### คาดหวัง:

- Login ไม่สำเร็จ
- แสดง error message ที่เป็นมิตรต่อผู้ใช้: "ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง"
- กลับไปหน้า Login โดยไม่มี error ด้านเทคนิค
- หน้าสะอาด ไม่มี PHP warnings/errors

### ผลจริง:

- PHP Warnings และ Errors แสดงบนหน้า:
  - "Warning: Trying to access array offset on value of type null in /var/www/html/login.php on line 22"
  - "Warning: Trying to access array offset on value of type null in /var/www/html/login.php on line 23"
  - "Warning: Trying to access array offset on value of type null in /var/www/html/login.php on line 24"
  - "Warning: Trying to access array offset on value of type null in /var/www/html/login.php on line 25"
  - "Warning: Cannot modify header information - headers already sent by (output started at /var/www/html/login.php:22)"
- แสดง PHP technical errors ต่อผู้ใช้งาน
- ข้อมูล error ที่ซ้ำซ้อนและสับสน

### สาเหตุ:

- $\_POST['username'] และ $\_POST['password'] เข้าถึงโดยไม่ check isset() ก่อน
- ไม่มี input validation หรือ error handling
- Header redirect ส่งหลังจากเนื้อหาแล้ว (output buffer filled)

### Attachment: BUG-001.png

---

## BUG-002

Bug ID: BUG-002  
ชื่อ: PHP Warnings/Errors แสดงเมื่อ Login ด้วย Username ที่ไม่มีในระบบ  
Severity: High  
Priority: High  
TC-ID: TC-AUTH-03  
Feature: Authentication / Login Page

### ขั้นตอนการทำซ้ำ:

1. เปิด http://localhost:8080/login.php
2. กรอก Username: nobody (username ที่ไม่มีในระบบ)
3. กรอก Password: admin123 (รหัสใดก็ได้)
4. คลิกปุ่ม Login

### คาดหวัง:

- Login ไม่สำเร็จ
- แสดง error message ที่เป็นมิตรต่อผู้ใช้: "ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง"
- กลับไปหน้า Login
- หน้าสะอาด ไม่มี PHP warnings/errors

### ผลจริง:

- PHP Warnings และ Errors แสดงบนหน้า:
  - "Warning: Trying to access array offset on value of type null in /var/www/html/login.php on line 22"
  - "Warning: Trying to access array offset on value of type null in /var/www/html/login.php on line 23"
  - "Warning: Trying to access array offset on value of type null in /var/www/html/login.php on line 24"
  - "Warning: Trying to access array offset on value of type null in /var/www/html/login.php on line 25"
  - "Warning: Cannot modify header information - headers already sent"
- บราวเซอร์แสดง Google Password Manager dialog (เนื่องจากถูก HTTPS warning)
- ข้อมูล error ที่confusing หรือ unclear
- ไม่มี clear error message ให้ผู้ใช้

### สาเหตุ:

- $\_POST array access ไม่มี isset() check
- Redirect พยายาม output หลังจากมี error output ไปแล้ว
- ทำให้ browser แสดง password manager dialog

### Attachment: BUG-002.png

---

## BUG-003

Bug ID: BUG-003  
ชื่อ: SQL Injection ใน Login form - Bypass การยืนยันตัวตน  
Severity: Critical  
Priority: High  
TC-ID: TC-AUTH-06  
Feature: Authentication / Login Page - Security

### ขั้นตอนการทำซ้ำ:

1. เปิด http://localhost:8080/login.php
2. กรอก Username: `' OR '1'='1`
3. กรอก Password: `' OR '1'='1`
4. คลิกปุ่ม Login

### คาดหวัง:

- Login ไม่สำเร็จ
- แสดง error message: "ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง"
- ไม่สามารถ bypass authentication ได้
- ระบบป้องกัน SQL Injection อย่างเหมาะสม
- ต้องใช้ Prepared Statements หรือ Parameterized Queries

### ผลจริง:

- **Login สำเร็จ!** ระบบให้เข้าได้เป็น Administrator (admin)
- เข้า Dashboard ได้โดยไม่ใส่รหัสผ่านจริง
- แสดง "System Administrator (admin)" ตรง top right
- SQL Injection payload ทำงานได้สำเร็จ
- ไม่มีการ validate หรือ sanitize input

### สาเหตุ:

- Login query ใช้ string concatenation แทน Prepared Statements
- Query: `WHERE username='$_POST[username]' AND password='$_POST[password]'`
- Payload ' OR '1'='1 ทำให้ WHERE clause เป็น true เสมอ
- ไม่มี input sanitization หรือ escaping

### Attachment: BUG-003.png

---

## BUG-004

Bug ID: BUG-004  
ชื่อ: Dashboard - จำนวน Available Books > Total Books (Logic Error)  
Severity: High  
Priority: High  
TC-ID: TC-DASH-02  
Feature: Dashboard / Statistics Display

### ขั้นตอนการทำซ้ำ:

1. Login เข้าระบบ ด้วย admin/admin123
2. ไป Dashboard page
3. ดูตัวเลขใน "Total Books" และ "Available" cards

### คาดหวัง:

- Total Books: X books
- Available Books: <= X books (ต้องน้อยกว่าหรือเท่ากับ Total)
- Borrowed Books: <= Total Books
- Available + Borrowed = Total (หรือใกล้เคียง)
- ตัวเลขทั้งหมดต้องสมเหตุสมผล และ logically consistent

### ผลจริง:

- Total Books: 8
- Available: 21 มากกว่า Total!
- Borrowed: 3
- Active Members: 5

**Logic Error:**
Available (21) > Total Books (8) ← ไม่สมเหตุสมผล!
Available + Borrowed = 21 + 3 = 24 ≠ Total (8)

### สาเหตุ:

- Available count query นับจากตาราง/view ไม่ถูกต้อง
- ต่างกับ Total Books count ที่นับจาก books table
- ไม่มี WHERE condition ที่กรองสถานะ borrowed อย่างถูกต้อง
- Available = ทั้งหมด แทนที่จะ = available_books เท่านั้น

### Attachment: BUG-004.png

---

## BUG-005

Bug ID: BUG-005  
ชื่อ: Edit Book page ไม่พบ (404 Not Found)  
Severity: Critical
Priority: Critical  
TC-ID: TC-BOOK-05  
Feature: Books / Edit Book Functionality

### ขั้นตอนการทำซ้ำ:

1. Login เข้าระบบด้วย admin/admin123
2. Go to Books page
3. Click "Edit" button
4. ระบบพยายาม redirect ไป book_edit.php

### คาดหวัง:

- เปิดหน้า Edit Book form ได้สำเร็จ
- แสดงข้อมูลหนังสือปัจจุบัน (Title, Author, ISBN, ฯลฯ)
- สามารถแก้ไข field ต่างๆ ได้
- สามารถ Update ข้อมูลได้

### ผลจริง:

- **404 Not Found Error** ✗
- "The requested URL was not found on this server"
- book_edit.php ไม่มีอยู่ หรือ path ผิด
- ไม่มี Edit form แสดง
- Edit functionality ไม่ทำงาน

### สาเหตุ:

- File book_edit.php ไม่ถูกสร้าง หรือถูกลบ
- Route/URL mapping ไม่ถูกต้อง
- ไฟล์เก็บไว้ที่ path ไม่ถูก
- Missing file ในโปรเจค sourcecode

### Attachment: BUG-005.png

---

## BUG-006

Bug ID: BUG-006  
ชื่อ: Books Management - ไม่มี Delete button ในตาราง  
Severity: High  
Priority: High  
TC-ID: TC-BOOK-06  
Feature: Books / Delete Book Functionality

### ขั้นตอนการทำซ้ำ:

1. Login เข้าระบบด้วย admin/admin123
2. Go to Books Management page (localhost:8080/books.php)
3. ดูตาราง Books ที่มีหนังสือหลายเล่ม
4. ตรวจสอบ Actions column สำหรับแต่ละหนังสือ

### คาดหวัง:

- สำหรับแต่ละหนังสือในตาราง ควรมี 3 buttons:
  - **View** button (สีเทา)
  - **Edit** button (สีเหลือง)
  - **Delete** button (สีแดง)
- มี delete button ให้คลิกเพื่อลบหนังสือ
- Delete functionality พร้อมใช้งาน

### ผลจริง:

- ตาราง Books แสดง Actions column เฉพาะ:
  - **View** button ✓
  - **Edit** button ✓
  - **Delete** button ✗ ไม่มี
- ไม่สามารถลบหนังสือได้จากตาราง

### สาเหตุ:

- Delete button HTML ไม่ถูก render ในตาราง
- JavaScript หรือ PHP code ที่สร้าง Action buttons ไม่รวม delete

### Attachment: BUG-006.png

---

## BUG-007

Bug ID: BUG-007  
ชื่อ: Members - No Duplicate Check for Member Code + Fatal Error  
Severity: High  
Priority: High  
TC-ID: TC-MEM-04  
Feature: Members / Add Member - Validation & Error Handling

### ขั้นตอนการทำซ้ำ:

1. Login เข้าระบบด้วย admin/admin123
2. Go to Members Management page
3. Click "Add New Member" button
4. ใส่ Member Code: M001 (code ที่มีอยู่แล้ว)
5. ใส่ Full Name: Test Member
6. ใส่ Email: test@gmail.com และ Phone: 0949856426
7. Click "Add Member" button

### คาดหวัง:

- ระบบตรวจสอบ Member Code ไม่ให้ซ้ำกันก่อน submit
- ถ้า Member Code ซ้ำ → แสดง validation error message
- Error message: "Member code already exists" / "รหัสสมาชิกนี้มีอยู่แล้ว"
- Form ยังอยู่ ให้แก้ไขได้
- ไม่มี fatal/technical errors

### ผลจริง:

- ไม่มี front-end validation สำหรับ duplicate check
- Submit form ได้โดยใช้ Member Code ซ้ำ
- ระบบพยายาม insert ลงฐานข้อมูล
- **Fatal error แสดงต่อผู้ใช้:**
  ```
  Fatal error: Uncaught mysqli_sql_exception: Duplicate entry 'M001'
  for key 'members.member_code' in /var/www/html/member_add.php:31
  ```
- Technical/Database error ปรากฏต่อสาธารณะ
- ไม่มี graceful error handling

### สาเหตุ:

- ไม่มี form validation ในระดับ client-side (JavaScript)
- ไม่มี query ตรวจสอบ duplicate ก่อน insert
- ไม่มี try-catch สำหรับ database errors
- Database constraint unique key มีอยู่แต่ handled ไม่ดี
- Error reporting turned on → technical details ปรากฏต่อผู้ใช้

### Attachment: BUG-007.png

---

## BUG-008

Bug ID: BUG-008  
ชื่อ: Members Management - ไม่มี Action Buttons (Edit, Delete)  
Severity: High  
Priority: High  
TC-ID: TC-MEM-05
Feature: Members / Edit Member Functionality

### ขั้นตอนการทำซ้ำ:

1. Login เข้าระบบด้วย admin/admin123
2. Go to Members Management page (localhost:8080/members.php)
3. ดูตาราง Members ที่แสดงรายชื่อสมาชิก
4. ตรวจสอบหาปุ่ม Edit สำหรับสมาชิก

### คาดหวัง:

- สามารถคลิก Edit เพื่อแก้ไขข้อมูลสมาชิก
- Edit functionality พร้อมใช้งาน
- ข้อมูลเดิมโหลดมาใน form
- บันทึกสำเร็จ

### ผลจริง:

- Members table ไม่มี Actions column เลย
- ไม่มี Edit button, Delete button, View button
- ไม่สามารถแก้ไขข้อมูลสมาชิกได้จากตาราง
- ผู้ใช้ไม่รู้ว่าจะทำอย่างไรเพื่อ edit

### สาเหตุ:

- Action buttons HTML ไม่ถูก render ในตาราง
- PHP code ที่สร้างตาราง ไม่รวม Actions column
- Incomplete table implementation
- Similar issue to BUG-006 (Missing Delete in Books)

### Pattern Error:

นี่เป็นปัญหาเดียวกับ BUG-006 - Action buttons incomplete ในทั้ง Books และ Members modules

### Attachment: BUG-008.png

---

## BUG-009

Bug ID: BUG-009  
ชื่อ: Members Management - ไม่สามารถลบสมาชิก (Delete Member Functionality Missing)  
Severity: High  
Priority: High  
TC-ID: TC-MEM-06  
Feature: Members / Delete Member Functionality

### ขั้นตอนการทำซ้ำ:

1. Login เข้าระบบด้วย admin/admin123
2. Go to Members Management page (localhost:8080/members.php)
3. ค้นหาปุ่ม "Delete" สำหรับสมาชิก
4. พยายาม delete สมาชิก

### คาดหวัง:

- ตาราง Members มี Actions column พร้อม Delete button
- สามารถคลิก Delete button สำหรับแต่ละสมาชิก
- แสดง confirmation dialog: "Do you want to delete this member?"
- หลังจาก confirm → สมาชิกถูกลบออกจากระบบ
- สมาชิกหายไปจากตาราง

### ผลจริง:

- ไม่มี Delete button ในตาราง
- ไม่มี delete functionality ที่มองเห็น

### สาเหตุ:

- Delete button ไม่ถูก render (เหมือน BUG-006, BUG-008)

### Attachment: BUG-009.png

---

## BUG-010

Bug ID: BUG-010  
ชื่อ: Borrowing - ไม่มี Borrowing History/Details Page  
Severity: Critical
Priority: Medium
TC-ID: TC-BOR-04  
Feature: Borrowing / Borrowing History & Details

### ขั้นตอนการทำซ้ำ:

1. Login เข้าระบบด้วย admin/admin123
2. Go to Borrow page (localhost:8080/borrow.php)
3. ค้นหาทำการยืมหนังสือ (ดู Borrow page)
4. หลังจากนั้น ค้นหา "Details" หรือ "View" button เพื่อดูรายละเอียดการยืม
5. หรือค้นหาหน้า Borrowing History เพื่อดูรายการยืมทั้งหมด

### คาดหวัง:

- มีหน้า Borrowing History / Borrowing Details เข้าถึงได้
- สามารถดูรายการยืมทั้งหมด (ตาราง history)
- สามารถดู detail สำหรับแต่ละการยืม:
  - Member info
  - Book info
  - Borrow date, Due date
  - Return date (ถ้า returned)
  - Fine amount (ถ้า overdue)
- ปุ่ม Details/View ในหน้า Borrow หรือ Return สำหรับแต่ละ record

### ผลจริง:

- ไม่มี Borrowing History page ในระบบ
- Borrow page มีเฉพาะ "Borrow Form" เพื่อสร้างการยืมใหม่
- ไม่มี Details button/link เพื่อดูรายละเอียด
- ไม่มี history tracking page

### สาเหตุ:

- Borrowing History/Details page ไม่ถูกสร้าง
- No view/detail template for borrowing records
- Missing feature entirely
- Similar to BUG-005 (Missing Edit page)
- Incomplete feature implementation

### Pattern:

- BUG-005: Missing Book Edit page
- BUG-010: Missing Borrowing History page
- Pattern: Major feature pages missing from required modules

### Attachment: BUG-010.png

---

## BUG-011

Bug ID: BUG-011  
ชื่อ: Due Date คำนวณไม่ถูกต้องสำหรับผู้ยืมประเภท Teacher  
Severity: High  
Priority: High  
TC-ID: TC-BOR-06  
Feature: Borrowing / Due Date Calculation

### ขั้นตอนการทำซ้ำ:

1. Login เข้าระบบด้วย admin/admin123
2. Go to Return page (localhost:8080/return.php)
3. ดูรายการหนังสือที่ยังยืมอยู่
4. ตรวจสอบ Due Date ของสมาชิกประเภท Teacher (เช่น ดร.วิชัย อาจารย์)

### คาดหวัง:

- Teacher มี Due Date = Borrow Date + 30 days
- Students มี Due Date = Borrow Date + 14 days
- Public มี Due Date = Borrow Date + 7 days
- วันที่แสดงในระบบต้องถูกต้องตามบทบาท

### ผลจริง:

- ดร.วิชัย อาจารย์ (Teacher) ยืมวันที่ 2024-10-25
- Due Date ในระบบแสดงเป็น 2024-11-08
- เป็นเวลา 14 วันเท่านั้น ไม่ใช่ 30 วันตามกฎ Teacher
- Due Date คำนวณผิดสำหรับผู้ยืมประเภท Teacher

### สาเหตุ:

- Logic การคำนวณ Due Date ไม่แยกตาม member type
- อาจมี default 14 วัน สำหรับทุกประเภท
- Missing business rule branch for Teacher / Public

### ผลกระทบ:

- **Functionality:** Due Date ไม่สอดคล้องกับกฎการยืม
- **Business Rules:** Teacher ได้รับช่วงเวลายืมผิด
- **User Trust:** ผู้ใช้สับสนเมื่อระบบไม่ตาม policy
- **Severity:** High - คำนวณวันคืนผิดสำหรับกลุ่มผู้ใช้หนึ่ง

### Attachment: 
- BUG-011-due-date-wrong-teacher.png

### Status: 
New (ยืนยันแล้ว)

---

## บันทึก:

**BUG-001:** PHP Warnings on wrong password - TC-AUTH-02  
**BUG-002:** PHP Warnings on invalid username - TC-AUTH-03  
**BUG-003:** 🔴 SQL Injection Bypass Login - TC-AUTH-06  
**BUG-004:** Dashboard Logic Error (Available > Total) - TC-DASH-02  
**BUG-005:** 🔴 Edit Book page 404 Not Found - TC-BOOK-05  
**BUG-006:** Missing Delete Button in Books Table - TC-BOOK-06  
**BUG-007:** No Duplicate Check + Fatal Error on Member Code - TC-MEM-04  
**BUG-008:** Missing Action Buttons in Members Table - TC-MEM-05  
**BUG-009:** Missing Delete Member Functionality - TC-MEM-06  
**BUG-010:** 🔴 Missing Borrowing History/Details Page - TC-BOR-04  
**BUG-011:** Due Date Calculation Wrong for Teacher - TC-BOR-06

---

## สถานะ

**Total Bugs Found:** 11  
**Target:** 20-30 bugs  
**Remaining:** 9-19 bugs ต้องหา

**CRITICAL Bugs:** 3 (SQL Injection, Missing Edit Page, Missing History Page)  
**HIGH Bugs:** 8 (PHP Errors x2, Dashboard Logic, Missing Delete x2, Duplicate Check, Missing Edit, Due Date Calculation)

---

**Last Updated:** 5 เมษายน 2026
