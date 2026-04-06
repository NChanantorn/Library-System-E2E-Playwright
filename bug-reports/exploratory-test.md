# Exploratory Testing Report (SBTM & Heuristics)

**Project:** Library Management System  
**Testing Methodology:** Exploratory Testing (Session-Based Test Management)  
**Executed By:** Manual Tester (66160026)

---

## 🧭 1. ภาพรวมการทดสอบ (Executive Summary)

คือการทดสอบที่ให้อิสระผู้ทดสอบออกแบบและรันการทดสอบไปพร้อมกัน โดยอาศัยประสบการณ์และเทคนิค (Heuristics) เป็นเข็มทิศ แทนที่จะยึดกับสคริปต์ตายตัว
เพื่อให้วัดผลและควบคุมเวลาได้ เราจึงจัดการด้วย Session-Based Test Management (SBTM) แบ่งการทดสอบออกเป็น 4 เซสชันที่มีเป้าหมายชัดเจน

---

## 🎯 2. ผลการเจาะลึกผ่านเซสชัน (Exploratory Test Sessions)

---

### 🔐 Session 1: "Security Bypass Tour" & "Bad Neighborhood Tour"

**Charter (ภารกิจ):** สวมหมวกแฮกเกอร์ เดินทางสำรวจระบบ Authentication และโซนอันตรายที่มักรั่วไหล ทดสอบว่าระบบป้องกันตัวเองได้ดีแค่ไหนเมื่อถูกป้อนข้อมูลอันตราย  
**Time Box (กรอบเวลา):** 30 นาที  
**Test Techniques (เทคนิค):** Input Constraint Attack, Boundary Testing, Data Injection

**📝 Notes & Findings (บันทึกข้อค้นพบการโจมตี):**

- ลองทำผิดง่ายที่สุดก่อน พิมพ์รหัสผ่านผิดแล้วกด Login ดู **[Result]** พบ **BUG-001**: หน้าเว็บพ่น PHP Warnings ออกมาให้เห็นทั้งหน้า ระบบโชว์ path ไฟล์ภายในเช่น `/var/www/html/login.php on line 22` ให้คนนอกอ่านได้ฟรีๆ แทนที่จะแสดงแค่ "รหัสผ่านไม่ถูกต้อง" สั้นๆ
- เปลี่ยนสไตล์ พิมพ์ Username ที่ไม่มีในโลก `nobody` ลงไป **[Result]** พบ **BUG-002**: PHP Warnings ซัดออกมาเหมือนเดิมทุกประการ แถมเบราว์เซอร์ยังเด้ง Google Password Manager dialog ขึ้นมาบนหน้าจอโดยไม่ได้รับเชิญ เพราะ Header redirect ยิงหลัง Error output ไปแล้ว
- ขยับไประดับอันตราย ฉีด SQL Injection payload `' OR '1'='1` ลงทั้งช่อง Username และ Password **[Result]** พบ **BUG-003**: ระบบยอมแพ้ให้เข้าเลย แสดงว่า Login สำเร็จในฐานะ `System Administrator (admin)` ทั้งที่ไม่รู้รหัสผ่านจริงเลยแม้แต่ตัวเดียว สาเหตุคือ Query ต่อ String ตรงๆ ไม่ใช้ Prepared Statements ทำให้ payload เปลี่ยน `WHERE clause` เป็น `true` ตลอดเวลา

---

### 📊 Session 2: "Money Tour" & "Landmark Tour"

**Charter (ภารกิจ):** เดินสายตรวจ Dashboard และฟีเจอร์ดาวเด่นของระบบจัดการหนังสือ ตรวจว่าตัวเลขสำคัญบอกความจริง และปุ่มโดดเด่นทำงานได้จริงหรือเป็นแค่ฉากตกแต่ง  
**Time Box (กรอบเวลา):** 30 นาที  
**Test Techniques (เทคนิค):** Boundary Testing, Landmark Tour, Bad Neighborhood Tour

**📝 Notes & Findings (บันทึกข้อค้นพบการโจมตี):**

- Login สำเร็จ เปิด Dashboard ขึ้นมาแล้วจ้องดูตัวเลขสถิติ **[Result]** พบ **BUG-004**: ตัวเลข — `Total Books: 8` แต่ `Available: 21` หนังสือที่ว่างให้ยืมมีมากกว่าหนังสือทั้งหมดที่มีอยู่! เลข `Available + Borrowed = 21 + 3 = 24` ≠ `Total (8)` ไม่มีสมการไหนอธิบายได้ สาเหตุคือ Query คำนวณ Available count จากแหล่งข้อมูลคนละที่กับ Total Books
- ไปหน้าจัดการหนังสือ เดิน Landmark Tour ตรวจดูปุ่ม Action ทุกปุ่ม **[Result]** พบ **BUG-006** และ **BUG-013**: ตาราง Books โชว์เฉพาะปุ่ม View อย่างเดียว ปุ่ม Delete หายไปไม่มีร่องรอย และเมื่อตรวจลึกลงไป พบว่าปุ่ม Edit และ Delete ไม่ถูก render เลยตั้งแต่ต้น ทำให้ User Journey CRUD พังตั้งแต่ขั้นตอนที่ 3
- คลิกปุ่ม View และ Edit ที่ยังเหลืออยู่ดู **[Result]** พบ **BUG-005** และ **BUG-012**: ทั้งสองปุ่มพาไปหน้า `404 Not Found` — "The requested URL was not found on this server" เพราะ `book_edit.php` และ `book_view.php` ไม่ถูกสร้างขึ้นมาในโปรเจกต์เลย ปุ่มสวยงามมีอยู่ แต่ปลายทางว่างเปล่า

---

### 👥 Session 3: "Intellectual Tour" & "Back Alley Tour"

**Charter (ภารกิจ):** การจัดการสมาชิก, เวิร์กโฟลว์การยืม และการคำนวณวันกำหนดคืน ทดสอบว่า Business Logic แยกแยะผู้ใช้แต่ละประเภทได้จริงหรือเปล่า พร้อมเดินสำรวจฟีเจอร์ซอยแคบที่ไม่ค่อยมีใครแวะ  
**Time Box (กรอบเวลา):** 30 นาที  
**Test Techniques (เทคนิค):** Personas Testing, Input Constraint Attack, Intellectual Tour, Back Alley Tour

**📝 Notes & Findings (บันทึกข้อค้นพบการโจมตี):**

- ไปหน้า Members เปิดตารางแล้วมองหาปุ่มจัดการ **[Result]** พบ **BUG-008** และ **BUG-009**: ตาราง Members ไม่มี Actions column โผล่มาเลยสักอัน ไม่มี Edit ไม่มี Delete ไม่มี View — ผู้ดูแลระบบแก้ข้อมูลสมาชิกได้ด้วยวิธีไหนกัน? Pattern นี้เหมือน BUG-006 เป๊ะ แปลว่า Action buttons ไม่ถูก render ในทุก module
- ลอง Input Constraint Attack ด้วยการเพิ่มสมาชิกใหม่แล้วใส่รหัส `M001` ที่มีอยู่แล้วในระบบ **[Result]** พบ **BUG-007**: ระบบไม่กรองซ้ำเลยแม้แต่น้อย ปล่อยให้ชนกับ Database constraint แล้วพ่น PHP Fatal Error ออกมาตรงๆ ว่า `Integrity constraint violation: 1062 Duplicate entry 'M001' for key 'members.member_code'` ให้ผู้ใช้งานทั่วไปอ่านได้
- เดิน Back Alley Tour ไปหาหน้า Borrowing History ที่ไม่ค่อยมีคนสนใจ **[Result]** พบ **BUG-010**: หน้านี้ไม่มีอยู่จริงในระบบเลย มีแต่ฟอร์มสร้างการยืมใหม่ ไม่มีปุ่ม Details ไม่มีหน้า History ไม่มีทางตรวจสอบประวัติย้อนหลังได้เลย
- สวมบท Persona: อาจารย์ดร.วิชัย (Teacher) ยืมหนังสือไปวันที่ 25 ตุลาคม 2024 แล้วดู Due Date ที่ระบบกำหนดให้ **[Result]** พบ **BUG-011**: ระบบให้เวลาคืนแค่ 14 วัน (2024-11-08) ทั้งที่กฎของห้องสมุดระบุว่า Teacher ควรได้ถึง 30 วัน Business Logic ไม่ได้อ่านค่า `member_type` มาใช้ในการคำนวณ ปล่อยให้ default 14 วันไหลไปทุกประเภทสมาชิก

---

### 💰 Session 4: "Money Tour" & "Bad Neighborhood Tour" (ค่าปรับ)

**Charter (ภารกิจ):** สำรวจเป้าหมายที่เกี่ยวข้องกับรายได้ของห้องสมุด (ค่าปรับ) และโซนอันตรายที่มักมีปัญหาบ่อย เพื่อทดสอบ Business Logic ของ Fine Calculation ให้พัง และค้นหาช่องโหว่ที่ทำให้หลบเลี่ยงค่าปรับได้  
**Time Box (กรอบเวลา):** 60 นาที  
**Test Techniques (เทคนิค):** Boundary Testing, Input Constraint Attack, Parameter Tampering

**📝 Notes & Findings (บันทึกข้อค้นพบการโจมตี):**

- สร้างเรกอร์ดยืมหนังสือที่มี `due_date` เป็นวันที่ผ่านมาแล้วหลายวัน แล้วเดินไปคืนผ่านหน้า Return **[Result]** พบ **BUG-014**: ค่าปรับแสดงเป็น 0 หรือ null ทุกกรณี ระบบไม่มีตรรกะคำนวณค่าปรับอัตโนมัติเลยแม้แต่บรรทัดเดียว ห้องสมุดจะเรียกเก็บเงินจากสมาชิกที่คืนช้าได้อย่างไร?
- ลองตั้ง `due_date` ย้อนหลังก่อนวันที่ยืม (Boundary Test: วันที่เป็นลบ) **[Result]** พบ **BUG-015**: ระบบไม่มี Date Validation ตรวจสอบว่า `due_date >= borrow_date` เลย บันทึกได้สบายๆ ทำให้สมาชิกติดค่าปรับตั้งแต่วันแรกที่ยืมโดยไม่รู้ตัว
- เปิด DevTools → Network tab แล้วดักจับ POST request ขณะคืนหนังสือ จากนั้นแก้ค่า `fine_amount=500` เป็น `fine_amount=0` แล้วยิง request กลับไปใหม่ **[Result]** พบ **BUG-016**: ระบบเชื่อค่าจาก Client อย่างสนิทใจ Fine amount ถูก override เป็น 0 ทันที ไม่มีการ recalculate ฝั่ง Server เลย ใครก็แก้ค่าปรับตัวเองให้หายไปได้ด้วย DevTools ธรรมดา
- สวมบท Personas ครบ 3 ประเภท: นักเรียน, Teacher, สาธารณะ — คืนหนังสือช้าเท่ากัน แล้วเปรียบ Fine ที่ได้ **[Result]** พบ **BUG-017**: ค่าปรับออกมาเท่ากันทุกประเภท ทั้งที่ Business Rule กำหนดไว้ต่างกันชัดเจน นักเรียน 3 บาท/วัน, Teacher 5 บาท/วัน, สาธารณะ 10 บาท/วัน — Fine Logic ไม่ได้ join ตาราง `members` มาอ่าน `member_type` เลย (Pattern เดียวกับ BUG-011)

---

## 🛠️ 3. สรุปแมทริกซ์การใช้ Test Heuristics (SFDIPOT Matrix)

การลงสนาม Exploratory Testing ครั้งนี้ คุมหางเสือการวิเคราะห์ด้วยสูตรจำ **SFDIPOT** เพื่อให้แน่ใจว่าเราโจมตีครบทุกมิติ:

| Heuristic Letter (ตัวชี้วัด)    | จุดโฟกัส (Focus Point)                                      | ผลจากการใช้ (Action / Found Issue)                                                                                                         |
| ------------------------------- | ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| **S** - Structure (โครงสร้าง)   | โครงสร้าง SQL Query / การต่อ String แทน Prepared Statements | พบ **BUG-003** — SQL Injection ทลายประตูเข้าระบบได้โดยไม่รู้รหัสผ่าน                                                                       |
| **F** - Function (ฟังก์ชัน)     | Logic การคำนวณ Due Date และ Fine ตามประเภทสมาชิก            | พบ **BUG-011, BUG-017** — ระบบใช้ค่า default ทุกประเภท ไม่อ่าน `member_type` มาคำนวณ                                                       |
| **D** - Data (ข้อมูล)           | ป้อนข้อมูล Edge Cases / ค่าลบ / วันที่ย้อนหลัง              | พบ **BUG-015, BUG-016** — `due_date` ย้อนหลังผ่านได้ และ `fine_amount` ถูก override ผ่าน POST ได้                                          |
| **I** - Interface (อินเตอร์เฟซ) | Form fields / Error messages / Action buttons               | พบ **BUG-001, BUG-002** — PHP Warnings โผล่ออก Interface แทนที่จะแสดง Error ที่เป็นมิตร                                                    |
| **P** - Platform (แพลตฟอร์ม)    | ตรวจสอบความสอดคล้องของข้อมูลข้ามหน้า                        | พบ **BUG-004** — ตัวเลข Dashboard ไม่ตรงกัน: Available (21) > Total (8)                                                                    |
| **O** - Operations (ปฏิบัติการ) | เวิร์กโฟลว์ CRUD ครบวงจร ตั้งแต่สร้างถึงลบ                  | พบ **BUG-005, BUG-006, BUG-007, BUG-008, BUG-009, BUG-010, BUG-012, BUG-013, BUG-014** — ปุ่มหายไป, หน้าหายไป, Feature ยังไม่ถูก implement |
| **T** - Time (เวลา)             | Timing ของ Header output / วันที่ขอบเขต                     | พบ **BUG-001, BUG-002** — Header redirect ยิงหลัง Error output ทำให้ PHP Warnings พ่นออกหน้าจอ                                             |

---

## 🏁 4. บทสรุปการสำรวจ (SBTM Debrief)

จากการปล่อยให้ผู้ทดสอบเข้าโจมตี Library Management System นอกกรอบ Test Cases พบว่าระบบสร้างการครอบคลุม **Happy Path** (พฤติกรรมใช้งานปกติ) ไว้ได้อย่างใช้ได้ — Login ด้วยข้อมูลถูกต้อง เพิ่มหนังสือได้ เพิ่มสมาชิกได้ (ถ้าไม่ซ้ำ) ยืมหนังสือสร้างเรกอร์ดได้

แต่เมื่อเจาะลงไปใน **Negative Paths (เคสเลวร้าย)** และ **Edge Cases (กรณีขอบเขตสุดโต่ง)** ระบบมี **ระดับความเสี่ยงทางสถาปัตยกรรมที่สูงมาก** ใน 3 ด้านหลัก:

1. **ด้านความปลอดภัย (Security):** SQL Injection ทลายประตู Login ได้ (BUG-003) และ Parameter Tampering แก้ค่าปรับเป็น 0 ได้จาก DevTools (BUG-016) — ช่องโหว่สองจุดนี้คือความเสี่ยงระดับ Critical ที่ห้าม Release ขึ้น Production เด็ดขาด
2. **ด้านฟีเจอร์ที่หายไป (Missing Features):** หน้า Edit Book, หน้า Borrowing History และปุ่ม CRUD ทั้งใน Books และ Members ต่างหายไปจาก UI — ระบบเหมือนบ้านที่ก่อฝาผนังแล้วแต่ประตูยังไม่ได้ติด
3. **ด้าน Business Logic:** ทั้ง Due Date (BUG-011) และ Fine Rate (BUG-017) ต่างไม่แยกแยะประเภทสมาชิก และระบบยังไม่มีตรรกะคำนวณค่าปรับอัตโนมัติ (BUG-014) เลยแม้แต่บรรทัดเดียว

แนะนำให้จัดลำดับความสำคัญซ่อม **Security bugs ก่อนเป็นอันดับแรก** ตามด้วย **Missing features** และ **Business Logic** ก่อนทำการ Release ขึ้นสู่ Production
