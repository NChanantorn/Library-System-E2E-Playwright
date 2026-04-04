# Test Cases (40 Scenarios) - ระบบห้องสมุด E2E

**โครงการ**: ระบบห้องสมุด E2E Testing  
**เวอร์ชั่น**: 1.0  
**วันที่**: 4 เมษายน 2026  
**รวม Test Cases**: 40  

---

## เอกสารเส้นฐาน Test Case

**รูปแบบ ID**: `TC-[โมดูล]-[หมายเลข]` (เช่น TC-AUTH-01)

**โมดูล**: 
- AUTH (Authentication - การตรวจสอบตัวตน)
- SEARCH (Search & Browse - ค้นหาและเรียกดู)
- BORROW (Borrowing - การยืม)
- RETURN (Returns - การคืน)
- RES (Reservations - การจอง)
- PROFILE (User Profile - โปรไฟล์)
- ADMIN (Admin - ผู้ดูแล)
- NOTIF (Notifications - การแจ้งเตือน)
- PERF (Performance - ประสิทธิภาพ)

---

## 1. การทดสอบ AUTHENTICATION (5 Test Cases)

### TC-AUTH-01: ลงทะเบียน - ข้อมูลที่ถูกต้อง
**ลำดับความสำคัญ**: Critical | **โมดูล**: Authentication  
**คำอธิบาย**: ตรวจสอบว่าผู้ใช้สามารถลงทะเบียนด้วยข้อมูลประจำตัวที่ถูกต้อง  
**เงื่อนไขก่อน**: ผู้ใช้อยู่ที่หน้าลงทะเบียน, ใช้ Chrome/Firefox

**ขั้นตอน**:
1. ป้อนอีเมลที่ถูกต้อง (เช่น testuser@library.com)
2. ป้อนรหัสผ่าน (อย่างน้อย 8 ตัวอักษร, 1 พิมพ์ใหญ่, 1 ตัวเลข)
3. ยืนยันรหัสผ่าน
4. ยอมรับเงื่อนไขและข้อกำหนด
5. คลิก "ลงทะเบียน"

**ผลลัพธ์ที่คาดหวัง**: 
- บัญชีสร้างสำเร็จ
- แสดงข้อความยืนยัน
- เปลี่ยนเส้นทางไปยังหน้าเข้าสู่ระบบ หรือ Dashboard
- ไม่มีข้อผิดพลาด

**สภาวะหลังเสร็จ**: บัญชีผู้ใช้สร้างในฐานข้อมูล
**ข้อมูลทดสอบ**: อีเมล, รหัสผ่านที่แข็งแกร่ง
**การทำให้อัตโนมัติ**: ✓ สามารถทำได้

---

### TC-AUTH-02: ลงทะเบียน - รูปแบบอีเมลไม่ถูกต้อง
**ลำดับความสำคัญ**: High | **โมดูล**: Authentication  
**คำอธิบาย**: ระบบปฏิเสธการลงทะเบียนด้วยรูปแบบอีเมลที่ไม่ถูกต้อง

**ขั้นตอน**:
1. ป้อนอีเมลที่ไม่ถูกต้อง (เช่น "notanemail", "user@.com")
2. ป้อนรหัสผ่านที่ถูกต้อง
3. คลิก "ลงทะเบียน"

**ผลลัพธ์ที่คาดหวัง**: 
- ข้อความข้อผิดพลาด: "รูปแบบอีเมลไม่ถูกต้อง"
- การลงทะเบียนไม่เสร็จสิ้น
- ผู้ใช้ยังคงอยู่ที่แบบฟอร์ม

**สภาวะหลังเสร็จ**: ไม่มีบัญชีสร้าง
**ข้อมูลทดสอบ**: รูปแบบอีเมลที่ไม่ถูกต้อง
**การทำให้อัตโนมัติ**: ✓ สามารถทำได้

---

### TC-AUTH-03: ลงทะเบียน - รหัสผ่านอ่อนแอ
**ลำดับความสำคัญ**: High | **โมดูล**: Authentication  
**คำอธิบาย**: ระบบปฏิเสธรหัสผ่านที่อ่อนแอ

**ขั้นตอน**:
1. ป้อนอีเมลที่ถูกต้อง
2. ป้อนรหัสผ่านที่อ่อนแอ (เช่น "123456")
3. คลิก "ลงทะเบียน"

**ผลลัพธ์ที่คาดหวัง**: 
- ข้อความข้อผิดพลาด: "รหัสผ่านต้องมีตัวพิมพ์ใหญ่, ตัวเล็ก, ตัวเลข, อย่างน้อย 8 ตัวอักษร"
- ปิดกั้นการลงทะเบียน
- แสดงตัวบ่งชี้ความแข็งแกร่งของรหัสผ่าน

**สภาวะหลังเสร็จ**: ไม่มีบัญชีสร้าง
**ข้อมูลทดสอบ**: รหัสผ่านที่อ่อนแอ
**การทำให้อัตโนมัติ**: ✓ สามารถทำได้

---

### TC-AUTH-04: เข้าสู่ระบบ - ข้อมูลประจำตัวที่ถูกต้อง
**ลำดับความสำคัญ**: Critical | **โมดูล**: Authentication  
**คำอธิบาย**: ตรวจสอบว่าผู้ใช้สามารถเข้าสู่ระบบด้วยอีเมลและรหัสผ่านที่ถูกต้อง

**ขั้นตอน**:
1. ป้อนอีเมลที่ลงทะเบียน
2. ป้อนรหัสผ่านที่ถูกต้อง
3. คลิก "เข้าสู่ระบบ"

**ผลลัพธ์ที่คาดหวัง**: 
- เข้าสู่ระบบสำเร็จ
- เปลี่ยนเส้นทางไปยัง Dashboard
- สร้าง Session token
- แสดงชื่อผู้ใช้ในส่วนหัว

**สภาวะหลังเสร็จ**: ผู้ใช้ยืนยันตัวตนและเข้าสู่ระบบ
**ข้อมูลทดสอบ**: ข้อมูลประจำตัวที่ถูกต้อง
**การทำให้อัตโนมัติ**: ✓ สามารถทำได้

---

### TC-AUTH-05: เข้าสู่ระบบ - รหัสผ่านไม่ถูกต้อง
**ลำดับความสำคัญ**: High | **โมดูล**: Authentication  
**คำอธิบาย**: ระบบปฏิเสธการเข้าสู่ระบบด้วยรหัสผ่านที่ไม่ถูกต้อง

**ขั้นตอน**:
1. ป้อนอีเมลที่ถูกต้อง
2. ป้อนรหัสผ่านที่ไม่ถูกต้อง
3. คลิก "เข้าสู่ระบบ"

**ผลลัพธ์ที่คาดหวัง**: 
- ข้อความข้อผิดพลาด: "อีเมลหรือรหัสผ่านไม่ถูกต้อง"
- แสดงหน้าเข้าสู่ระบบ
- ไม่สร้าง Session

**สภาวะหลังเสร็จ**: ผู้ใช้ไม่ได้รับการยืนยัน
**ข้อมูลทดสอบ**: อีเมล, รหัสผ่านที่ไม่ถูกต้อง
**การทำให้อัตโนมัติ**: ✓ สามารถทำได้

### TC-AUTH-05: User Login - Invalid Password
**Priority**: High | **Module**: Authentication  
**Description**: System denies login with incorrect password  
**Pre-conditions**: User account exists, is on login page

**Steps**:
1. Enter valid registered email
2. Enter incorrect password
3. Click "Login" button

**Expected Result**: 
- Error message: "Invalid email or password"
- Login page displayed
- No session created
- Account remains unlocked (no brute force protection yet)

**Post-conditions**: User not authenticated
**Test Data**: Valid email, incorrect password
**Automation**: ✓ Automatable
---

## 2. SEARCH & BROWSE TESTS (6 Test Cases)

### TC-SEARCH-01: Search Books by Title
**Priority**: Critical | **Module**: Search & Browse  
**Description**: User can search and find books by title  
**Pre-conditions**: At least 50 books in catalog, user is on homepage

**Steps**:
1. Click search bar
2. Type book title (e.g., "The Great Gatsby")
3. Press Enter or click Search button

**Expected Result**: 
- Search results displayed
- Only books with matching title shown
- Result count displayed
- Book cards show: title, author, availability status

**Post-conditions**: Search results page displayed
**Test Data**: Existing book titles in catalog
**Automation**: ✓ Automatable
---

### TC-SEARCH-02: Search Books by Author
**Priority**: High | **Module**: Search & Browse  
**Description**: User can search books by author name  
**Pre-conditions**: Books by multiple authors in system

**Steps**:
1. Click search/filter option
2. Select "Search by Author"
3. Enter author name (e.g., "F. Scott Fitzgerald")

**Expected Result**: 
- All books by specified author displayed
- Result count shows total matches
- No unrelated books in results

**Post-conditions**: Filtered results displayed
**Test Data**: Author names from catalog
**Automation**: ✓ Automatable
---

### TC-SEARCH-03: Filter Results by Availability
**Priority**: High | **Module**: Search & Browse  
**Description**: User can filter search results by availability status  
**Pre-conditions**: Search results page with mixed availability

**Steps**:
1. Display search results
2. Click "Availability" filter
3. Select "Available Only"

**Expected Result**: 
- Only available books shown
- Unavailable books hidden
- Filter badge shown as active
- Result count updated

**Post-conditions**: Filtered results displayed
**Test Data**: Books with mixed availability
**Automation**: ✓ Automatable
---

### TC-SEARCH-04: Sort Search Results
**Priority**: Medium | **Module**: Search & Browse  
**Description**: User can sort search results by different criteria  
**Pre-conditions**: Search results displaying

**Steps**:
1. Click "Sort" dropdown
2. Select sort option (e.g., "Most Popular", "Newest", "Title A-Z")

**Expected Result**: 
- Results reordered according to selection
- Sort order persists during pagination
- Correct sort indicator displayed

**Post-conditions**: Results sorted as selected
**Test Data**: Search results with sortable fields
**Automation**: ✓ Automatable
---

### TC-SEARCH-05: Pagination of Search Results
**Priority**: Medium | **Module**: Search & Browse  
**Description**: User can navigate through paginated results  
**Pre-conditions**: Search results with 25+ items

**Steps**:
1. View first page of results (showing 10 items)
2. Click "Next" or page number "2"
3. Verify different books shown

**Expected Result**: 
- Next page loaded
- Correct items (11-20) displayed
- Previous button enabled
- Page indicator shows "Page 2 of X"

**Post-conditions**: Pagination working correctly
**Test Data**: Search results with multiple pages
**Automation**: ✓ Automatable
---

### TC-SEARCH-06: View Full Book Details
**Priority**: Critical | **Module**: Search & Browse  
**Description**: User can view complete book information  
**Pre-conditions**: User viewing search results or catalog

**Steps**:
1. Click on a book card/title
2. Book detail page loads
3. Verify all information present

**Expected Result**: 
- Book detail page displays: title, author, ISBN, description, publication date, availability, category, number of copies
- All information is accurate
- "Borrow" and "Reserve" buttons visible
- Similar books section shows related titles

**Post-conditions**: Book detail page fully rendered
**Test Data**: Any book in catalog
**Automation**: ✓ Automatable
---

## 3. BORROWING WORKFLOW TESTS (7 Test Cases)

### TC-BORROW-01: Borrow Available Book - Success
**Priority**: Critical | **Module**: Borrowing  
**Description**: User successfully borrows an available book  
**Pre-conditions**: User logged in, viewing available book details

**Steps**:
1. Click "Borrow" button
2. Confirm borrow action
3. System processes request

**Expected Result**: 
- Confirmation message: "Book borrowed successfully"
- Book added to "My Loans" section
- Due date displayed (e.g., 14 days from today)
- Book status changed to "Borrowed"
- Confirmation email sent

**Post-conditions**: Book marked as borrowed, loan recorded in database
**Test Data**: Available book, logged-in user
**Automation**: ✓ Automatable
---

### TC-BORROW-02: Borrow Unavailable Book - Error
**Priority**: High | **Module**: Borrowing  
**Description**: System prevents borrowing of unavailable books  
**Pre-conditions**: User viewing unavailable book details

**Steps**:
1. Click "Borrow" button (if available) or attempt to borrow
2. System checks availability

**Expected Result**: 
- Error message: "This book is not currently available"
- "Reserve" button suggested instead
- Borrow action not processed

**Post-conditions**: No loan created
**Test Data**: Unavailable book
**Automation**: ✓ Automatable
---

### TC-BORROW-03: Borrow Limit Enforcement
**Priority**: High | **Module**: Borrowing  
**Description**: System enforces maximum borrow limit (e.g., 5 books)  
**Pre-conditions**: User already has 5 books borrowed

**Steps**:
1. User attempts to borrow 6th book
2. Click "Borrow" button

**Expected Result**: 
- Error message: "You have reached maximum borrow limit (5 books)"
- Suggestion to return a book first
- Borrow not completed

**Post-conditions**: Loan not created, limit remains enforced
**Test Data**: User with max loans
**Automation**: ✓ Automatable
---

### TC-BORROW-04: Multiple Books Borrow in Sequence
**Priority**: Medium | **Module**: Borrowing  
**Description**: User can borrow multiple different books in session  
**Pre-conditions**: User logged in, at least 3 available books

**Steps**:
1. Borrow Book A (success)
2. Return to catalog
3. Borrow Book B (success)
4. Return to catalog
5. Borrow Book C (success)

**Expected Result**: 
- All three books appear in "My Loans"
- All confirmations successful
- Loan count updated

**Post-conditions**: Three loans recorded for user
**Test Data**: Multiple available books
**Automation**: ✓ Automatable
---

### TC-BORROW-05: Borrow Confirmation Receipt
**Priority**: Medium | **Module**: Borrowing  
**Description**: User receives detailed borrow confirmation and receipt  
**Pre-conditions**: Successful borrow action completed

**Steps**:
1. Borrow book successfully
2. View confirmation message
3. Click "Download Receipt" or view email

**Expected Result**: 
- Confirmation shows: Book title, author, borrow date, due date
- Receipt can be downloaded as PDF
- Email confirmation sent to user
- Receipt number/code generated

**Post-conditions**: Receipt available for user
**Test Data**: Successful borrow
**Automation**: ✓ Automatable
---

### TC-BORROW-06: Duplicate Borrow Prevention
**Priority**: High | **Module**: Borrowing  
**Description**: User cannot borrow the same book twice  
**Pre-conditions**: User has book borrowed, is viewing same book again

**Steps**:
1. User views borrowed book details
2. Attempts to click "Borrow"
3. System checks if already borrowed

**Expected Result**: 
- "Borrow" button disabled or shows "Already Borrowed"
- Error message: "You already have this book checked out"
- "Return" option shown instead

**Post-conditions**: Duplicate borrow prevented
**Test Data**: Book user already borrowed
**Automation**: ✓ Automatable
---

### TC-BORROW-07: Borrow with Different User Roles
**Priority**: Medium | **Module**: Borrowing  
**Description**: Different user types can borrow (student, faculty, public)  
**Pre-conditions**: Multiple user types registered

**Steps**:
1. Login as Student user, borrow book
2. Logout, login as Faculty user, borrow book
3. Logout, login as Public user, borrow book

**Expected Result**: 
- All user types successfully borrow
- Borrow limits may differ by role (e.g., Faculty: 10, Student: 5, Public: 3)
- All loans recorded correctly

**Post-conditions**: Loans recorded for all user types
**Test Data**: Users with different roles
**Automation**: ✓ Automatable
---

## 4. RETURN WORKFLOW TESTS (6 Test Cases)

### TC-RETURN-01: Return Borrowed Book - Success
**Priority**: Critical | **Module**: Return  
**Description**: User successfully returns a borrowed book  
**Pre-conditions**: User logged in with active loans

**Steps**:
1. Navigate to "My Loans" section
2. Select book to return
3. Click "Return Book"
4. Confirm return action

**Expected Result**: 
- Confirmation message: "Book returned successfully"
- Book removed from "My Loans"
- Return date recorded
- Book status changed to "Available"
- Confirmation email sent
- Book now available for other users

**Post-conditions**: Loan completed, book marked returned
**Test Data**: Book in "My Loans"
**Automation**: ✓ Automatable
---

### TC-RETURN-02: Return Overdue Book - With Penalty
**Priority**: High | **Module**: Return  
**Description**: System calculates and applies late fees for overdue returns  
**Pre-conditions**: User has overdue book (past due date)

**Steps**:
1. Navigate to "My Loans"
2. View overdue book (shows red "OVERDUE" badge)
3. Click "Return Book"
4. System calculates penalty

**Expected Result**: 
- Overdue status displayed
- Late fee calculated (e.g., $0.50/day)
- Total amount due shown
- Option to pay fine or note payment method
- Confirmation after return

**Post-conditions**: Return recorded, fine logged
**Test Data**: Book with date past due date
**Automation**: ✓ Automatable
---

### TC-RETURN-03: Return Book Not Yet Due
**Priority**: Medium | **Module**: Return  
**Description**: User can return book before due date  
**Pre-conditions**: User with active loan not yet due

**Steps**:
1. Navigate to "My Loans"
2. Click "Return Book" (due date still in future)
3. Confirm return

**Expected Result**: 
- Return processed successfully
- No penalties applied
- Early return noted in system (optional: credit or reward?)
- Book marked available

**Post-conditions**: Return recorded without penalties
**Test Data**: Book with future due date
**Automation**: ✓ Automatable
---

### TC-RETURN-04: Return Multiple Books
**Priority**: Medium | **Module**: Return  
**Description**: User can return multiple books in one session  
**Pre-conditions**: User with 3+ active loans

**Steps**:
1. Go to "My Loans"
2. Return Book 1
3. Return Book 2
4. Return Book 3

**Expected Result**: 
- Each return processed successfully
- All three marked as returned
- "My Loans" count decreases to 0 (if those were only loans)
- Confirmations received for all

**Post-conditions**: All three loans completed
**Test Data**: Multiple borrowed books
**Automation**: ✓ Automatable
---

### TC-RETURN-05: Return Book - View Return History
**Priority**: Medium | **Module**: Return  
**Description**: User can view history of returned books  
**Pre-conditions**: User has returned at least one book

**Steps**:
1. Navigate to Dashboard
2. Click "Return History" or "Loan History"
3. View completed loans

**Expected Result**: 
- Completed loans displayed with: book title, borrow date, return date
- Pagination if many returns
- Search/filter options available
- Download as report option

**Post-conditions**: Return history accessible
**Test Data**: User with return history
**Automation**: ✓ Automatable
---

### TC-RETURN-06: Return Physical Book via Kiosk
**Priority**: Low | **Module**: Return  
**Description**: User can return book via automated kiosk (if applicable)  
**Pre-conditions**: Physical kiosk available, user has RFID-tagged book

**Steps**:
1. Place book on kiosk scanner
2. Book scanned and recognized
3. System confirms return

**Expected Result**: 
- Return processed in system
- Confirmation printed/displayed on kiosk
- Book status updated to available
- User notified of successful return

**Post-conditions**: Return recorded, book available for checkout
**Test Data**: RFID-tagged book
**Automation**: ⚠ Manual or specialized testing
---

## 5. RESERVATION SYSTEM TESTS (5 Test Cases)

### TC-RES-01: Reserve Unavailable Book - Success
**Priority**: High | **Module**: Reservation  
**Description**: User can reserve a currently unavailable book  
**Pre-conditions**: Book is currently borrowed/unavailable, user logged in

**Steps**:
1. View unavailable book details
2. Click "Reserve" button
3. Confirm reservation

**Expected Result**: 
- Reservation confirmed
- Queue position displayed (e.g., "Position 2 of 3 waiting")
- Confirmation message shown
- Reservation added to "My Reservations"
- Confirmation email sent

**Post-conditions**: Reservation recorded in queue
**Test Data**: Unavailable book
**Automation**: ✓ Automatable
---

### TC-RES-02: Multiple Reservations - Queue Priority
**Priority**: High | **Module**: Reservation  
**Description**: Multiple users can reserve same book, queue position managed  
**Pre-conditions**: Book reserved by User A, User B reserves

**Steps**:
1. User A reserves book (position 1)
2. User B reserves same book
3. Verify queue positions

**Expected Result**: 
- User A sees "Position 1 of 2"
- User B sees "Position 2 of 2"
- When User A returns book, it's auto-assigned to User B
- User B notified of availability

**Post-conditions**: Queue managed correctly
**Test Data**: Multiple users, shared book
**Automation**: ✓ Automatable
---

### TC-RES-03: Cancel Reservation
**Priority**: Medium | **Module**: Reservation  
**Description**: User can cancel pending reservation  
**Pre-conditions**: User has active reservation

**Steps**:
1. Go to "My Reservations"
2. Select reservation to cancel
3. Click "Cancel Reservation"
4. Confirm cancellation

**Expected Result**: 
- Cancellation confirmed
- Reservation removed from "My Reservations"
- Queue positions of other users updated
- Cancellation email sent

**Post-conditions**: Reservation removed from system
**Test Data**: Pending reservation
**Automation**: ✓ Automatable
---

### TC-RES-04: Auto-assign Reserved Book When Available
**Priority**: High | **Module**: Reservation  
**Description**: System automatically assigns book to next queued user when returned  
**Pre-conditions**: Book reserved by User A, User B; currently unavailable

**Steps**:
1. Book is returned/becomes available
2. System check for reservations
3. Auto-assign to User A (position 1)

**Expected Result**: 
- Book assigned to User A
- User A receives notification: "Reserved book now available"
- User A has 48 hours to pick up/confirm
- If not confirmed, goes to next in queue (User B)

**Post-conditions**: Book assigned to User A
**Test Data**: Book with queue, book return event
**Automation**: ✓ Automatable
---

### TC-RES-05: Reservation Expiration
**Priority**: Medium | **Module**: Reservation  
**Description**: Reservation expires if user doesn't confirm within timeframe  
**Pre-conditions**: User A reserved book, now available for 48 hours

**Steps**:
1. Book assigned to User A
2. Wait 48 hours (or simulate)
3. User A has not confirmed pick-up
4. System auto-expires reservation

**Expected Result**: 
- Reservation expired message shown to User A
- Book moves to next in queue
- User notified of expiration
- Option to re-reserve offered

**Post-conditions**: Reservation moved to next user
**Test Data**: Reservation with expiration timer
**Automation**: ✓ Automatable (with time manipulation)
---

## 6. USER PROFILE TESTS (4 Test Cases)

### TC-PROFILE-01: View User Dashboard
**Priority**: High | **Module**: User Profile  
**Description**: User can view personal dashboard with loans and activity  
**Pre-conditions**: User logged in

**Steps**:
1. Click "Dashboard" or user menu
2. Dashboard loads

**Expected Result**: 
- Personal info displayed: name, email, membership type
- Active loans section with count
- Reservations section
- Overdue alerts (if any)
- Quick links to actions
- User activity stats

**Post-conditions**: Dashboard fully rendered
**Test Data**: Logged-in user
**Automation**: ✓ Automatable
---

### TC-PROFILE-02: Update User Profile Information
**Priority**: Medium | **Module**: User Profile  
**Description**: User can update profile details  
**Pre-conditions**: User on profile settings page

**Steps**:
1. Click "Edit Profile"
2. Update phone number
3. Update address
4. Save changes

**Expected Result**: 
- Changes saved successfully
- Confirmation message displayed
- Updated info reflected in dashboard
- Email confirmation sent (optional)

**Post-conditions**: Profile information updated
**Test Data**: Valid contact information
**Automation**: ✓ Automatable
---

### TC-PROFILE-03: Change Password
**Priority**: High | **Module**: User Profile  
**Description**: User can change account password  
**Pre-conditions**: User on account settings, authenticated

**Steps**:
1. Go to "Change Password"
2. Enter current password
3. Enter new password (different, strong)
4. Confirm new password
5. Save

**Expected Result**: 
- Password changed successfully
- Confirmation message shown
- Email notification sent
- User can login with new password
- Old password no longer works

**Post-conditions**: Password updated
**Test Data**: Valid current password, new strong password
**Automation**: ✓ Automatable
---

### TC-PROFILE-04: View Membership Details
**Priority**: Medium | **Module**: User Profile  
**Description**: User can view membership type and benefits  
**Pre-conditions**: User on profile page

**Steps**:
1. Navigate to "Membership" section
2. View membership details

**Expected Result**: 
- Membership type displayed: Student/Faculty/Public
- Membership benefits shown: borrow limit, loan period, fine rate
- Renewal date shown
- Option to upgrade membership (if applicable)

**Post-conditions**: Membership info displayed
**Test Data**: User profile
**Automation**: ✓ Automatable
---

## 7. ADMIN FUNCTIONS TESTS (4 Test Cases)

### TC-ADMIN-01: Admin Login - Access Control
**Priority**: Critical | **Module**: Admin  
**Description**: Only admin users can access admin panel  
**Pre-conditions**: Admin account exists

**Steps**:
1. Admin user logs in
2. Navigate to admin panel
3. Admin dashboard loads

**Expected Result**: 
- Admin dashboard accessible
- Regular user cannot access admin panel (authenticated but not authorized)
- Role-based menu items shown only for admin
- Admin tools available

**Post-conditions**: Admin access verified
**Test Data**: Admin credentials, regular user credentials
**Automation**: ✓ Automatable
---

### TC-ADMIN-02: Add New Book to Catalog
**Priority**: High | **Module**: Admin  
**Description**: Admin can add new books to library system  
**Pre-conditions**: Admin logged in, on admin panel

**Steps**:
1. Click "Add Book"
2. Fill form: title, author, ISBN, description, category, copies
3. Submit form

**Expected Result**: 
- Book added successfully
- Confirmation message displayed
- Book appears in catalog
- Search finds new book
- ISBN validated for uniqueness

**Post-conditions**: Book in database and searchable
**Test Data**: Valid book details
**Automation**: ✓ Automatable
---

### TC-ADMIN-03: Edit Book Information
**Priority**: High | **Module**: Admin  
**Description**: Admin can update existing book information  
**Pre-conditions**: Books in catalog, admin logged in

**Steps**:
1. Search and select a book
2. Click "Edit"
3. Change: description, category, copies available
4. Save changes

**Expected Result**: 
- Changes saved
- Confirmation message shown
- Changes reflected in catalog

**Post-conditions**: Book info updated
**Test Data**: Existing book
**Automation**: ✓ Automatable
---

### TC-ADMIN-04: Generate Library Report
**Priority**: Medium | **Module**: Admin  
**Description**: Admin can generate circulation reports  
**Pre-conditions**: Admin on reports page, circulation data exists

**Steps**:
1. Click "Generate Report"
2. Select report type: "Circulation Summary"
3. Select date range
4. Generate

**Expected Result**: 
- Report generated successfully
- Shows: total loans, returns, overdue items, popular books
- Can export to PDF/Excel
- Report displays correctly

**Post-conditions**: Report generated and available
**Test Data**: Date range with data
**Automation**: ✓ Automatable
---

## 8. NOTIFICATION TESTS (2 Test Cases)

### TC-NOTIF-01: Email Confirmation on Borrow
**Priority**: Medium | **Module**: Notifications  
**Description**: User receives email confirmation after borrowing book  
**Pre-conditions**: User borrows book, email system configured

**Steps**:
1. User borrows book
2. Check email account
3. Verification email received

**Expected Result**: 
- Email received within 5 minutes
- Contains: book title, author, due date, return instructions
- Email comes from library system
- Has clickable link to dashboard

**Post-conditions**: Email delivered to user
**Test Data**: Valid email, borrow action
**Automation**: ✓ Automatable (email service testing)
---

### TC-NOTIF-02: Overdue Reminder Notification
**Priority**: High | **Module**: Notifications  
**Description**: User receives notification when book becomes overdue  
**Pre-conditions**: Book past due date, notification system configured

**Steps**:
1. Book due date passed
2. System check at scheduled time
3. Overdue notification sent

**Expected Result**: 
- Email notification sent
- In-app notification displayed (next login)
- Shows: book title, days overdue, fine amount
- Links to return book quickly

**Post-conditions**: Notification delivered
**Test Data**: Overdue book scenario
**Automation**: ✓ Automatable
---

## 9. PERFORMANCE & LOAD TESTS (1 Test Case)

### TC-PERF-01: System Response Time Under Normal Load
**Priority**: Medium | **Module**: Performance  
**Description**: System performs satisfactorily with concurrent users  
**Pre-conditions**: Load testing tool configured, staging environment available

**Steps**:
1. Simulate 25 concurrent users
2. Load testing for 10 minutes
3. Monitor: response times, CPU, memory, errors

**Expected Result**: 
- Page load time < 3 seconds (95th percentile)
- Search response < 2 seconds
- No error rate (0% failures)
- CPU usage < 80%
- Memory stable

**Post-conditions**: Performance baseline established
**Test Data**: Generated user traffic
**Automation**: ✓ Automatable (load testing)
---

---

## ตารางสรุป

| โมดูล | Test Cases | จำนวน | ลำดับความสำคัญ |
|------|-----------|-------|-------------|
| Authentication | TC-AUTH-01 to TC-AUTH-05 | 5 | Critical/High |
| Search & Browse | TC-SEARCH-01 to TC-SEARCH-06 | 6 | Critical/High |
| Borrowing | TC-BORROW-01 to TC-BORROW-07 | 7 | Critical/High |
| Return | TC-RETURN-01 to TC-RETURN-06 | 6 | Critical/High |
| Reservation | TC-RES-01 to TC-RES-05 | 5 | High |
| User Profile | TC-PROFILE-01 to TC-PROFILE-04 | 4 | Medium/High |
| Admin | TC-ADMIN-01 to TC-ADMIN-04 | 4 | Critical/High |
| Notifications | TC-NOTIF-01 to TC-NOTIF-02 | 2 | Medium/High |
| Performance | TC-PERF-01 | 1 | Medium |
| **รวม** | | **40** | - |

---

## การติดตามการทดสอบ

### สถานะตัวบ่งชี้
- 🟢 **พร้อม** - Test Case เตรียมพร้อมสำหรับการทดสอบ
- 🟡 **ในการดำเนินการ** - กำลังทดสอบอยู่
- 🟢 **ผ่าน** - ทดสอบผ่าน ไม่มีปัญหา
- 🔴 **ล้มเหลว** - ทดสอบล้มเหลว พบปัญหา
- ⊘ **ข้ามไป** - ข้ามไป พร้อมเหตุผล

### เทมเพลต Execution Log
```
Test Case ID: TC-XXX-XX
สถานะ: [พร้อม/ในการดำเนินการ/ผ่าน/ล้มเหลว/ข้ามไป]
ทดสอบโดย: [ชื่อผู้ทดสอบ]
วันที่ทดสอบ: [วันที่]
สภาพแวดล้อม: [เบราว์เซอร์/OS]
ผลลัพธ์: [ผ่าน/ล้มเหลว]
ปัญหาที่พบ: [Bug ID]
หมายเหตุ: [หมายเหตุอื่นๆ]
```

---

## คำอธิบายระดับลำดับความสำคัญ

- **Critical**: ระบบเสีย, สูญเสียข้อมูล, ปัญหาด้านความปลอดภัย - ต้องผ่านก่อนปล่อย
- **High**: ฟีเจอร์หลักเสีย - ต้องผ่านก่อนปล่อย
- **Medium**: ฟีเจอร์บางส่วนเสีย - ควรผ่านก่อนปล่อย
- **Low**: ปัญหา UI เล็กน้อย - ปล่อยได้ก็ได้

---

## Test Cases เส้นทางสำคัญที่บังคับ (ต้องผ่าน)
1. TC-AUTH-01 - ลงทะเบียนที่ถูกต้อง
2. TC-AUTH-04 - เข้าสู่ระบบที่ถูกต้อง
3. TC-SEARCH-01 - ค้นหาหนังสือ
4. TC-SEARCH-06 - ดูรายละเอียดหนังสือ
5. TC-BORROW-01 - ยืมหนังสือสำเร็จ
6. TC-RETURN-01 - คืนหนังสือสำเร็จ
7. TC-RES-01 - จองหนังสือ
8. TC-ADMIN-01 - ควบคุมการเข้าถึง Admin
9. TC-ADMIN-02 - เพิ่มหนังสือ
10. TC-NOTIF-01 - อีเมลแจ้งเตือน
11. TC-PROFILE-01 - ดู Dashboard
12. TC-RES-04 - จัดสรรหนังสือที่จองอัตโนมัติ

---

**สถานะเอกสาร**: อนุมัติ  
**รวมที่สามารถทำให้อัตโนมัติได้**: 38 ของ 40 (95%)  
**การทดสอบด้วยตัวเอง**: 1 (Kiosk return)  
**เวอร์ชั่น**: 1.0  
**อัปเดตล่าสุด**: 4 เมษายน 2026
