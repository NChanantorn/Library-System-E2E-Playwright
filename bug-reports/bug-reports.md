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

### จริง:

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

- Members table ควรมี Actions column ที่แสดง buttons:
  - **View** button (สีเทา)
  - **Edit** button (สีเหลือง)
  - **Delete** button (สีแดง) OPT
- สำหรับแต่ละ row สามารถคลิก Edit เพื่อแก้ไขข้อมูลสมาชิก
- Edit functionality พร้อมใช้งาน

### จริง:

- **Members table ไม่มี Actions column เลย!**
- ตาราง แสดงเฉพาะ: Member Code, Full Name, Email, Phone, Type, Max Books, Status, Registration
- ไม่มี Edit button, Delete button, View button
- ไม่สามารถแก้ไขข้อมูลสมาชิกได้จากตาราง
- ผู้ใช้ไม่รู้ว่าจะทำอย่างไรเพื่อ edit

### สาเหตุ:

- Action buttons HTML ไม่ถูก render ในตาราง
- PHP code ที่สร้างตาราง ไม่รวม Actions column
- Incomplete table implementation
- Similar issue to BUG-006 (Missing Delete in Books)

### ผลกระทบ:

- **Functionality:** ไม่สามารถแก้ไขข้อมูลสมาชิกจากตาราง
- **Workaround:** ไม่มี alternative way ที่ชัดเจน
- **UX:** ผู้ใช้ confused ว่าจะ edit member ยังไง
- **Completeness:** CRUD ขาดครึ่ง (มี Add เท่านั้น)
- **Severity:** High - Edit functionality ขาดแล้ว

### Pattern Error:

นี่เป็นปัญหาเดียวกับ BUG-006 - Action buttons incomplete ในทั้ง Books และ Members modules

### Attachment: 
- BUG-008-members-no-action-buttons.png

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

---

## สถานะ

**Total Bugs Found:** 8  
**Target:** 20-30 bugs  
**Remaining:** 12-22 bugs ต้องหา

**CRITICAL Bugs:** 2 (SQL Injection, Missing Edit Page)  
**HIGH Bugs:** 6 (PHP Errors x2, Dashboard Logic, Missing Delete/Edit x2, Duplicate Check)

---

**Last Updated:** 5 เมษายน 2026
