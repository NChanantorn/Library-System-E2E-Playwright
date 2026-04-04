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

### สาเหตุ:

- ตัวแปร `$_POST['username']` และ `$_POST['password']` ถูกเข้าถึงโดยไม่ตรวจสอบ isset() ก่อน
- ไม่มี error handling ที่เหมาะสม
- PHP error reporting ตั้งค่าให้แสดง errors ต่อผู้ใช้งาน
- Headers พยายามส่งหลังจากที่มี output ส่งออกแล้ว
- ไม่มี try-catch หรือ conditional checks

### ผลกระทบ:

- **ประสบการณ์ผู้ใช้:** ผู้ใช้เห็น technical errors ที่ไม่เป็นมิตร
- **ความปลอดภัย:** Error messages อาจเปิดเผยข้อมูลโครงสร้างระบบ
- **ความน่าเชื่อถือ:** ระบบดูไม่เป็นมืออาชีพ
- **ความรุนแรง:** High - ขาดการจัดการ error พื้นฐาน
- **มาตรฐาน:** ละเมิด OWASP Top 10 #7: Identification and Authentication Failures

### Attachment: BUG-001.png

### Status:

New (ยืนยันแล้ว)

---

## บันทึก:

**BUG-001:** Login button ไม่ตอบสนอง - ส่วนหน้า UI

---

## สถานะ

**Total Bugs Found:** 1  
**Target:**
**Remaining:**

---

**Last Updated:** 4 เมษายน 2026
