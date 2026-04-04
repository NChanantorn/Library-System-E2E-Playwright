# 🐛 Bug Report

# Bug Reports - Library Management System Manual Testing

**Report Date:** 4 เมษายน 2026  
**Testing Period:** Manual Black Box Testing  
**Tester:** Manual Testing Team  
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

### จริง:

- PHP Warnings และ Errors แสดงบนหน้า:
  - "Warning: Trying to access array offset on value of type null in /var/www/html/login.php on line 22"
  - "Warning: Trying to access array offset on value of type null in /var/www/html/login.php on line 23"
  - "Warning: Trying to access array offset on value of type null in /var/www/html/login.php on line 24"
  - "Warning: Trying to access array offset on value of type null in /var/www/html/login.php on line 25"
  - "Warning: Cannot modify header information - headers already sent by (output started at /var/www/html/login.php:22)"
- แสดง PHP technical errors ต่อผู้ใช้งาน
- ข้อมูล error ที่ซ้ำซ้อนและสับสน

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

### จริง:

- PHP Warnings และ Errors แสดงบนหน้า:
  - "Warning: Trying to access array offset on value of type null in /var/www/html/login.php on line 22"
  - "Warning: Trying to access array offset on value of type null in /var/www/html/login.php on line 23"
  - "Warning: Trying to access array offset on value of type null in /var/www/html/login.php on line 24"
  - "Warning: Trying to access array offset on value of type null in /var/www/html/login.php on line 25"
  - "Warning: Cannot modify header information - headers already sent"
- บราวเซอร์แสดง Google Password Manager dialog (เนื่องจากถูก HTTPS warning)
- ข้อมูล error ที่confusing หรือ unclear
- ไม่มี clear error message ให้ผู้ใช้

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

### จริง:

- **Login สำเร็จ!** ระบบให้เข้าได้เป็น Administrator (admin)
- เข้า Dashboard ได้โดยไม่ใส่รหัสผ่านจริง
- แสดง "System Administrator (admin)" ตรง top right
- SQL Injection payload ทำงานได้สำเร็จ
- ไม่มีการ validate หรือ sanitize input

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

### จริง:

- Total Books: **8**
- Available: **21** ← ❌ มากกว่า Total!
- Borrowed: 3
- Active Members: 5

**Logic Error:**

```
Available (21) > Total Books (8) ← ไม่สมเหตุสมผล!
Available + Borrowed = 21 + 3 = 24 ≠ Total (8)
```

### Attachment:

- BUG-004-dashboard-invalid-numbers.png
- BUG-004-statistics-mismatch.png

### Status:

New (ยืนยันแล้ว)

---

## บันทึก:

**BUG-001:** PHP Warnings on wrong password - TC-AUTH-02  
**BUG-002:** PHP Warnings on invalid username - TC-AUTH-03  
**BUG-003:** 🔴 SQL Injection Bypass Login - TC-AUTH-06  
**BUG-004:** Dashboard Logic Error (Available > Total) - TC-DASH-02

---

## สถานะ

**Total Bugs Found:** 4  
**Target:** 20-30 bugs  
**Remaining:** 16-26 bugs ต้องหา

**CRITICAL Bugs:** 1 (SQL Injection)  
**HIGH Bugs:** 3 (PHP Errors x2, Dashboard Logic)

---

**Last Updated:** 4 เมษายน 2026
