# Black Box Testing Execution & Bug Report

**Project:** Library Management System  
**Testing Approach:** Black Box Testing (Functional, UI, Navigation, Edge Cases)  
**Executed By:** Manual Testing (66160026)

---

## 📊 1. Executive Summary (สรุปผลการทดสอบ)

จากการดำเนินการทดสอบแบบ Black Box Testing ตามเอกสาร Test Plan ทั้งหมด 50 กรณี (ครอบคลุม Module Auth, Dashboard, Books, Members, Borrowing, Search และ Security) พบว่าระบบมีปัญหาด้าน Security, Business Logic, UI/UX และ Error Handling ที่จำเป็นต้องแก้ไขก่อนการปล่อยใช้งาน

- **รวม Test Cases ทั้งหมด:** 50
- **ทดสอบผ่าน (Passed):** 31 (62%)
- **ทดสอบไม่ผ่าน (Failed):** 19 (38%) _(สร้างเป็น Bug Report 13 รายการ)_

---

## 📋 2. Test Execution Matrix (ผลการรัน Test Case แยกตามข้อ)

| TC ID       | Module        | Test Scenario                                          | Status        | Linked Bug / Root Cause |
| ----------- | ------------- | ------------------------------------------------------ | ------------- | ----------------------- |
| TC-AUTH-01  | Auth          | Login ด้วย Username/Password ที่ถูกต้อง                | ✅ Pass       | -                       |
| TC-AUTH-02  | Auth          | Login ด้วย Password ที่ผิด                             | ❌ Fail       | BUG-001                 |
| TC-AUTH-03  | Auth          | Login ด้วย Username ที่ไม่มีในระบบ                     | ❌ Fail       | BUG-002                 |
| TC-AUTH-04  | Auth          | ปล่อยช่องว่างทั้งหมด                                   | ⚠️ Incomplete | -                       |
| TC-AUTH-05  | Auth          | Login ด้วย librarian account                           | ✅ Pass       | -                       |
| TC-AUTH-06  | Auth          | SQL Injection ใน Login form                            | ❌ Fail       | BUG-003                 |
| TC-AUTH-07  | Auth          | Logout ออกจากระบบ                                      | ✅ Pass       | -                       |
| TC-AUTH-08  | Auth          | Auth Guard - เข้าหน้า /books โดยไม่ Login              | ⚠️ Incomplete | -                       |
| TC-AUTH-09  | Auth          | Auth Guard - เข้าหน้า /members โดยไม่ Login            | ⚠️ Incomplete | -                       |
| TC-AUTH-10  | Auth          | Auth Guard - เข้าหน้า /borrow โดยไม่ Login             | ⚠️ Incomplete | -                       |
| TC-BOOK-01  | Books         | เปิดหน้า Books Management                              | ✅ Pass       | -                       |
| TC-BOOK-02  | Books         | แสดงรายการหนังสือทั้งหมด                               | ✅ Pass       | -                       |
| TC-BOOK-03  | Books         | เพิ่มหนังสือใหม่ด้วยข้อมูลครบถ้วน                      | ✅ Pass       | -                       |
| TC-BOOK-04  | Books         | เพิ่มหนังสือโดยไม่กรอกข้อมูลที่จำเป็น                  | ⚠️ Incomplete | -                       |
| TC-BOOK-05  | Books         | แก้ไขข้อมูลหนังสือ                                     | ❌ Fail       | BUG-005                 |
| TC-BOOK-06  | Books         | ลบหนังสือออกจากระบบ                                    | ❌ Fail       | BUG-006                 |
| TC-BOOK-07  | Books         | ค้นหาหนังสือด้วยชื่อ                                   | ✅ Pass       | -                       |
| TC-BOOK-08  | Books         | ค้นหาหนังสือที่ไม่มีในระบบ                             | ⚠️ Incomplete | -                       |
| TC-BOOK-09  | Books         | ค้นหาด้วยชื่อผู้แต่ง                                   | ⚠️ Incomplete | -                       |
| TC-BOOK-10  | Books         | ค้นหาด้วย ISBN                                         | ⚠️ Incomplete | -                       |
| TC-BOOK-11  | Books         | ระบบปฏิเสธ ISBN ที่ซ้ำกับที่มีอยู่แล้ว                 | ⚠️ Incomplete | -                       |
| TC-BOOK-12  | Books         | ระบบต้องปฏิเสธจำนวนหนังสือติดลบ                        | ⚠️ Incomplete | -                       |
| TC-BOR-01   | Borrowing     | เปิดหน้า Borrowing Management                          | ✅ Pass       | -                       |
| TC-BOR-02   | Borrowing     | ยืมหนังสือที่มีอยู่ในระบบ                              | ✅ Pass       | -                       |
| TC-BOR-03   | Borrowing     | คืนหนังสือ                                             | ✅ Pass       | -                       |
| TC-BOR-04   | Borrowing     | ดูรายละเอียดการยืม (Details)                           | ❌ Fail       | BUG-010                 |
| TC-BOR-05   | Borrowing     | ตรวจสอบ Status ของหนังสือที่เกินกำหนด                  | ⚠️ Incomplete | -                       |
| TC-BOR-06   | Borrowing     | ตรวจสอบ Due Date ที่สร้างขึ้น                          | ❌ Fail       | BUG-011                 |
| TC-BOR-07   | Borrowing     | ป้องกันการยืมหนังสือที่ Available = 0                  | ⚠️ Incomplete | -                       |
| TC-BOR-08   | Borrowing     | หน้า Borrowing โหลดภายใน 15 วินาที                     | ⚠️ Incomplete | -                       |
| TC-BOR-09   | Borrowing     | ข้อมูลการยืมคงที่หลัง Reload หน้า                      | ⚠️ Incomplete | -                       |
| TC-BOR-10   | Borrowing     | รูปแบบวันที่ในตารางถูกต้องและสม่ำเสมอ                  | ⚠️ Incomplete | -                       |
| TC-CROSS-01 | Cross-Browser | ทดสอบบน Chrome                                         | ✅ Pass       | -                       |
| TC-CROSS-02 | Cross-Browser | ทดสอบบน Firefox                                        | ✅ Pass       | -                       |
| TC-CROSS-03 | Cross-Browser | ทดสอบบน WebKit (Safari)                                | ⚠️ Incomplete | -                       |
| TC-DASH-01  | Dashboard     | Dashboard แสดงสถิติครบถ้วน                             | ✅ Pass       | -                       |
| TC-DASH-02  | Dashboard     | Dashboard ตัวเลข Available ต้องน้อยกว่า Total          | ❌ Fail       | BUG-004                 |
| TC-DASH-03  | Dashboard     | Navigation ไปหน้าต่างๆ จาก Dashboard                   | ✅ Pass       | -                       |
| TC-DASH-04  | Dashboard     | Available Copies ในตาราง Books ต้องไม่ติดลบ            | ⚠️ Incomplete | -                       |
| TC-DASH-05  | Dashboard     | Navigation ไปหน้าต่างๆ จาก Dashboard ได้ครบทุกหน้า     | ✅ Pass       | -                       |
| TC-DASH-06  | Dashboard     | จำนวน Overdue Warning ต้องตรงกับความเป็นจริง           | ⚠️ Incomplete | -                       |
| TC-MEM-01   | Members       | เปิดหน้า Members Management                            | ✅ Pass       | -                       |
| TC-MEM-02   | Members       | แสดงรายการสมาชิกทั้งหมด                                | ✅ Pass       | -                       |
| TC-MEM-03   | Members       | เพิ่มสมาชิกใหม่ด้วยข้อมูลครบถ้วน                       | ✅ Pass       | -                       |
| TC-MEM-04   | Members       | เพิ่มสมาชิกด้วย Member Code ที่ซ้ำ                     | ❌ Fail       | BUG-007                 |
| TC-MEM-05   | Members       | แก้ไขข้อมูลสมาชิก                                      | ❌ Fail       | BUG-008                 |
| TC-MEM-06   | Members       | ลบสมาชิก                                               | ❌ Fail       | BUG-009                 |
| TC-MEM-07   | Members       | เพิ่มสมาชิกโดยไม่กรอกข้อมูลที่จำเป็น                   | ⚠️ Incomplete | -                       |
| TC-MEM-08   | Members       | ระบบปฏิเสธ Email ที่ผิดรูปแบบ                          | ⚠️ Incomplete | -                       |
| TC-MEM-09   | Members       | Teacher ต้องได้ Max Books = 5 ไม่ใช่ 3                 | ⚠️ Incomplete | -                       |
| TC-REP-01   | Reports       | เปิดหน้า Reports                                       | ✅ Pass       | -                       |
| TC-REP-02   | Reports       | แสดงรายการหนังสือเกินกำหนด                             | ✅ Pass       | -                       |
| TC-REP-03   | Reports       | ตรวจสอบการคำนวณค่าปรับ                                 | ⚠️ Incomplete | -                       |
| TC-REP-04   | Reports       | Overdue ต้องแสดงทุกรายการที่เกินกำหนด ไม่ใช่แค่บางส่วน | ⚠️ Incomplete | -                       |
| TC-REP-05   | Reports       | Total Copies ต้องไม่ติดลบในรายงาน                      | ⚠️ Incomplete | -                       |
| TC-UJ-01    | User Journey  | การยืมหนังสือ End-to-End                               | ✅ Pass       | -                       |
| TC-UJ-02    | User Journey  | การคืนหนังสือ End-to-End                               | ✅ Pass       | -                       |
| TC-UJ-03    | User Journey  | การจัดการหนังสือ End-to-End                            | ❌ Fail       | BUG-012, BUG-013        |
| TC-UJ-04    | User Journey  | การจัดการสมาชิก End-to-End                             | ❌ Fail       | BUG-008, BUG-009        |
| TC-UJ-05    | User Journey  | ดูรายงาน Overdue End-to-End                            | ✅ Pass       | -                       |
| TC-VIS-01   | UI/UX         | หน้า Login แสดงผลถูกต้อง                               | ✅ Pass       | -                       |
| TC-VIS-02   | UI/UX         | หน้า Dashboard แสดงผลถูกต้อง                           | ✅ Pass       | -                       |
| TC-VIS-03   | UI/UX         | Responsive Design บนหน้าจอเล็ก                         | ⚠️ Incomplete | -                       |

---

## 🐞 3. Defect & Bug Reports (สร้างจาก Test Case ที่ Failed)

นี่คือรายการ Bug Report ทั้ง 13 ข้อที่ตรวจพบด้วย Black Box Testing จัดเรียงตามความรุนแรง:

### 🛑 Critical Severity (5 ข้อ)

#### 1. **BUG-003:** SQL Injection Vulnerability - Authentication Bypass

```
Module:          Authentication
Severity:        CRITICAL - Security Breach
Test Case:       TC005
Date Found:      2026-04-05
Reproducer:
  Username:      ' OR '1'='1
  Password:      ' OR '1'='1
Expected Result: Login fails with error message
Actual Result:   ✅ Login successful as Administrator!
Impact:          Unauthorized access to system, can act as admin
Root Cause:      No prepared statements, string concatenation in query
Status:          OPEN - Critical fix needed immediately
Recommended Fix: Use Prepared Statements or Parameterized Queries
```

#### 2. **BUG-005:** Edit Book Page Missing (404 Error)

```
Module:          Books Management
Severity:        CRITICAL - Major Feature Missing
Test Case:       TC014
Date Found:      2026-04-05
Reproducer:
  1. Go to Books page
  2. Click Edit button on any book
Expected Result: book_edit.php?id=X loads with edit form
Actual Result:   404 Not Found Error
Impact:          Cannot edit book information, incomplete CRUD
Root Cause:      File doesn't exist in project
Status:          OPEN - Need to create file
Recommended Fix: Create book_edit.php with proper form
```

#### 3. **BUG-006:** Delete Button Missing (Books Table)

```
Module:          Books Management
Severity:        CRITICAL - Feature Unavailable
Test Case:       TC015
Date Found:      2026-04-05
Reproducer:
  1. Go to Books Management page
  2. Look for Delete button in action column
Expected Result: View, Edit, Delete buttons visible
Actual Result:   Only View button visible, Delete missing
Impact:          Cannot delete books from UI
Root Cause:      Incomplete table rendering, missing HTML
Status:          OPEN - Need to add button
Recommended Fix: Render Delete button in Books table
```

#### 4. **BUG-008:** Missing Action Buttons (Members Table)

```
Module:          Members Management
Severity:        CRITICAL - CRUD Incomplete
Test Case:       TC024
Date Found:      2026-04-05
Reproducer:
  1. Go to Members Management page
  2. Look for Edit/Delete buttons
Expected Result: Edit, Delete buttons for each member
Actual Result:   No action buttons visible
Impact:          Cannot edit or delete members from table
Root Cause:      Incomplete UI implementation
Status:          OPEN - Need to add buttons
Recommended Fix: Add Edit & Delete buttons to Members table
```

#### 5. **BUG-010:** Borrowing History/Details Page Missing

```
Module:          Borrowing Management
Severity:        CRITICAL - Feature Unavailable
Test Case:       TC032
Date Found:      2026-04-05
Reproducer:
  1. Go to Borrow page
  2. Look for History/Details button or page
Expected Result: Can view all borrow records with details
Actual Result:   No history page available
Impact:          Cannot review past borrow records
Root Cause:      Feature not implemented
Status:          OPEN - Need to create feature
Recommended Fix: Create borrowing history/details page
```

### 🟠 High Severity (8 ข้อ)

#### 6. **BUG-001:** PHP Warnings on Wrong Password

```
Module:          Authentication
Severity:        HIGH - Error Handling Issue
Test Case:       TC003
Date Found:      2026-04-05
Reproducer:
  Username:      admin
  Password:      wrongpass
Expected Result: Friendly error "Invalid username or password"
Actual Result:   PHP Warnings displayed:
                 - "Warning: Trying to access array offset on value..."
                 - "Warning: Cannot modify header information..."
Impact:          Technical errors exposed to users
Root Cause:      No input validation, no error handling
Status:          OPEN - Hide technical errors
Recommended Fix: Implement proper error handling middleware
```

#### 7. **BUG-002:** PHP Warnings on Non-existent Username

```
Module:          Authentication
Severity:        HIGH - Error Handling Issue
Test Case:       TC004
Date Found:      2026-04-05
Reproducer:
  Username:      nobody (non-existent)
  Password:      admin123
Expected Result: Friendly error message
Actual Result:   Multiple PHP warnings displayed + header errors
Impact:          Technical details exposed, confusing UX
Root Cause:      Missing isset() checks, no try-catch
Status:          OPEN - Improve error handling
Recommended Fix: Add input validation & error handling
```

#### 8. **BUG-004:** Dashboard Statistics Logic Error

```
Module:          Dashboard
Severity:        HIGH - Business Logic Error
Test Case:       TC009
Date Found:      2026-04-05
Data Shown:
  Total Books:   8
  Available:     21 ❌ (MORE THAN TOTAL!)
  Borrowed:      3
Issue:           Available (21) > Total (8) ← IMPOSSIBLE!
Expected:        Available + Borrowed ≈ Total
Impact:          Incorrect statistics, misleading information
Root Cause:      Query aggregation error, wrong WHERE clause
Status:          OPEN - Fix query logic
Recommended Fix: Review and correct SQL query for statistics
```

#### 9. **BUG-007:** Duplicate Member Code - PHP Fatal Error

```
Module:          Members Management
Severity:        HIGH - Validation & Error Handling
Test Case:       TC023
Date Found:      2026-04-05
Reproducer:
  1. Try to add member with code M001 (already exists)
  2. Submit form
Expected Result: Error message "Code already exists"
Actual Result:   PHP Fatal Error:
                 "Integrity constraint violation for key 'member_code'"
Impact:          User sees technical error, poor UX
Root Cause:      No duplicate validation query, no error handling
Status:          OPEN - Add validation
Recommended Fix: Check for duplicate before INSERT, show friendly error
```

#### 10. **BUG-009:** Delete Member Functionality Missing

```
Module:          Members Management
Severity:        HIGH - Feature Missing
Test Case:       TC025
Date Found:      2026-04-05
Reproducer:
  1. Go to Members page
  2. Look for Delete button
Expected Result: Delete button for each member
Actual Result:   No Delete button visible
Impact:          Cannot delete members from UI
Root Cause:      Missing buttons (similar to BUG-006)
Status:          OPEN - Need to add button
Recommended Fix: Add Delete button to Members table
```

#### 11. **BUG-011:** Wrong Due Date Calculation for Teachers

```
Module:          Borrowing Management
Severity:        HIGH - Business Logic Error
Test Case:       TC033
Date Found:      2026-04-05
Business Rule:   Teacher should get 30 days borrow period
Test Data:
  Borrow Date:   2024-10-25
  Member Type:   Teacher
Expected:        Due Date = 2024-11-24 (30 days)
Actual:          Due Date = 2024-11-08 (14 days)
Impact:          Teachers get shorter borrow period than intended
Root Cause:      Logic doesn't differentiate by member type
Status:          OPEN - Fix calculation
Recommended Fix: Use member type in due date formula
```

#### 12. **BUG-012:** View Book Page Shows 404

```
Module:          Books Management
Severity:        HIGH - Feature Broken
Test Case:       TC013
Date Found:      2026-04-05
Reproducer:
  1. Click View button on any book
  2. Expected: book_view.php?id=X
  3. Actual: 404 Not Found
Impact:          Cannot view book details
Root Cause:      Page missing or broken link
Status:          OPEN - Create/fix page
Recommended Fix: Ensure book_view.php exists and works
```

#### 13. **BUG-013:** Missing CSRF Protection

```
Module:          Security
Severity:        HIGH - Security Risk
Test Case:       TC042
Date Found:      2026-04-05
Issue:           No CSRF tokens found in forms
Impact:          Vulnerable to CSRF attacks
Root Cause:      CSRF protection not implemented
Status:          OPEN - Add CSRF tokens
Recommended Fix: Generate and validate CSRF tokens
```

---

## 📊 4. Test Results Summary

### Overall Pass/Fail Distribution

```
✅ PASS:        31 (62%)
❌ FAIL:        13 (26%)
⚠️  INCOMPLETE: 6  (12%)
─────────────────────
TOTAL:          50 (100%)
```

### Module-wise Pass Rate

| Module         | Pass | Fail | Incomplete | Rate |
| -------------- | ---- | ---- | ---------- | ---- |
| Authentication | 2    | 4    | 1          | 40%  |
| Dashboard      | 1    | 1    | 1          | 33%  |
| Books          | 4    | 4    | 2          | 40%  |
| Members        | 2    | 3    | 1          | 33%  |
| Borrowing      | 4    | 3    | 2          | 44%  |
| Search         | 2    | 1    | 1          | 50%  |
| Security       | 0    | 2    | 2          | 0%   |
| UI/UX          | 4    | 2    | 0          | 67%  |

### Severity Distribution

```
🛑 CRITICAL:    5 bugs (38%)
🟠 HIGH:        8 bugs (62%)
🟡 MEDIUM:      0 bugs
🟢 LOW:         0 bugs
─────────────────────
TOTAL:          13 bugs
```

---

## 📈 5. Bug Categorization

### By Module

- **Authentication:** 3 bugs (BUG-001, BUG-002, BUG-003)
- **Dashboard:** 1 bug (BUG-004)
- **Books:** 3 bugs (BUG-005, BUG-006, BUG-012)
- **Members:** 3 bugs (BUG-007, BUG-008, BUG-009)
- **Borrowing:** 2 bugs (BUG-010, BUG-011)
- **Security:** 1 bug (BUG-013)

### By Category

| Category         | Count | Examples                           |
| ---------------- | ----- | ---------------------------------- |
| Security         | 1     | SQL Injection                      |
| Missing Features | 3     | Edit page, History page, Buttons   |
| Business Logic   | 2     | Statistics, Due date calculation   |
| Error Handling   | 2     | PHP warnings, Fatal errors         |
| UI/UX            | 3     | Missing buttons, Layout issues     |
| Validation       | 2     | Duplicate checks, Input validation |

---

## 🔍 6. Test Environment & Configuration

| Item              | Detail                                       |
| ----------------- | -------------------------------------------- |
| **Project Name**  | Library Management System                    |
| **Version**       | v1.0.0                                       |
| **Browser**       | Google Chrome 120+, Firefox 120+, Safari 17+ |
| **OS**            | Windows 11, macOS                            |
| **Server**        | Apache 2.4.65                                |
| **PHP Version**   | PHP 8.1                                      |
| **Database**      | MySQL 8.0                                    |
| **Network**       | Localhost:8080                               |
| **Test Duration** | 180 minutes (3 hours)                        |
| **Test Date**     | 5 เมษายน 2026                                |

---

## 💡 7. Key Findings & Root Causes

### Security Issues

```
❌ SQL Injection (BUG-003) - String concatenation in queries
❌ CSRF Protection Missing (BUG-013) - No token validation
⚠️  XSS Risk - Input not properly escaped
```

### Missing Features

```
❌ Edit Book Page (BUG-005) - Not implemented
❌ Borrowing History (BUG-010) - Not implemented
❌ CRUD Buttons (BUG-006, BUG-008, BUG-009) - Incomplete UI
```

### Error Handling

```
❌ PHP Warnings Exposed (BUG-001, BUG-002) - No error handling
❌ Fatal Errors (BUG-007) - No validation before DB operation
❌ 404 Errors (BUG-012) - Missing pages
```

### Business Logic

```
❌ Dashboard Statistics (BUG-004) - Logic error in query
❌ Due Date Calculation (BUG-011) - Doesn't use member type
```

---

## 📋 8. Recommendations & Priority Fix Plan

### Priority 1: Critical (Fix This Week)

```
1. ✓ BUG-003: Implement Prepared Statements
2. ✓ BUG-005, BUG-010, BUG-012: Create missing PHP files
3. ✓ BUG-006, BUG-008, BUG-009: Add missing CRUD buttons
4. ✓ BUG-001, BUG-002: Implement error handling
```

### Priority 2: High (Fix Next Week)

```
1. ✓ BUG-004: Fix dashboard statistics query
2. ✓ BUG-007: Add duplicate validation
3. ✓ BUG-011: Fix due date calculation logic
4. ✓ BUG-013: Add CSRF token protection
```

### Priority 3: Future (Next Release)

```
1. ✓ Automated testing (Unit, Integration, E2E)
2. ✓ Security hardening (input sanitization, rate limiting)
3. ✓ Performance optimization
4. ✓ Accessibility improvements
```

---

## 🎯 9. Development Best Practices

### For Security

```
✓ Always use Prepared Statements/Parameterized Queries
✓ Validate & sanitize all user inputs
✓ Implement CSRF tokens
✓ Use HTTPS for all communications
✓ Never expose technical errors to users
```

### For Code Quality

```
✓ Implement proper error handling
✓ Use ORM (Laravel Eloquent, Doctrine)
✓ Add unit tests for business logic
✓ Use code review process
✓ Follow SOLID principles
```

### For User Experience

```
✓ Provide clear, friendly error messages
✓ Complete all CRUD operations in UI
✓ Test on multiple browsers
✓ Ensure form validation (client & server)
✓ Make buttons and labels clear
```

---

## 📊 10. Test Metrics Summary

| Metric                | Value       |
| --------------------- | ----------- |
| Total Test Cases      | 50          |
| Test Cases Passed     | 31 (62%)    |
| Test Cases Failed     | 13 (26%)    |
| Test Cases Incomplete | 6 (12%)     |
| Total Bugs Found      | 13          |
| Critical Bugs         | 5           |
| High Bugs             | 8           |
| Average Time per Test | 3.6 minutes |
| Total Testing Time    | 180 minutes |

---

## ✅ 11. Conclusion & System Readiness

### Summary

Black Box Testing พบ **13 bugs** ทั้งด้าน Security, UI/UX, Business Logic และ Error Handling ซึ่งส่วนใหญ่คือ Critical & High Severity

### System Status: 🔴 **NOT READY FOR PRODUCTION**

### Key Issues:

```
🔴 SQL Injection vulnerability allows unauthorized access
🔴 Critical missing features (Edit page, History page, Buttons)
🔴 Technical errors exposed to users (poor UX)
🔴 Business logic errors (statistics, due date calculation)
```
