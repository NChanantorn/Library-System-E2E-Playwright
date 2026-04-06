🛠 Technical Setup & Usage Guide
คู่มือการติดตั้งสภาพแวดล้อมและการใช้งานระบบทดสอบอัตโนมัติ (Playwright) สำหรับโปรเจกต์ระบบจัดการห้องสมุด

📋 สิ่งที่ต้องติดตั้งก่อน (Prerequisites)
Node.js (แนะนำเวอร์ชัน 18 ขึ้นไป)

Docker & Docker Compose (สำหรับรัน Database และ Web Server)

Git (สำหรับจัดการเวอร์ชันของโค้ด)

🏗 การเตรียมระบบ (System Setup)
1. การรันระบบผ่าน Docker
เพื่อให้ระบบ Web และ Database พร้อมใช้งาน ให้รันคำสั่ง:

Bash
docker-compose up -d
ระบบจะเปิดใช้งานที่: http://localhost:8080

2. การติดตั้ง dependencies ของโปรเจกต์
ใช้ npm ในการติดตั้งไลบรารีที่จำเป็นทั้งหมด:

Bash
npm install
3. การติดตั้ง Playwright Browsers
หลังจากติดตั้ง npm เสร็จ ต้องโหลดตัวเบราว์เซอร์สำหรับรันเทส:

Bash
npx playwright install
🧪 การรันการทดสอบ (Running Tests)
คุณสามารถเลือกการรันเทสได้หลายรูปแบบตามความต้องการ:

1. รันเทสทั้งหมด (โหมดซ่อนหน้าจอ - Headless)
ใช้สำหรับตรวจสอบผลลัพธ์แบบรวดเร็ว:

Bash
npx playwright test
2. รันเทสแบบเปิดหน้าจอ (Headed Mode)
ใช้เมื่อต้องการดูขั้นตอนการทำงานของบอททีละ Step:

Bash
npx playwright test --headed
3. รันเทสเฉพาะบางโมดูล (Specific File)
ตัวอย่างเช่น ต้องการรันเฉพาะหน้า Login:

Bash
npx playwright test tests/e2e/auth.spec.js
4. การใช้ Playwright UI Mode
โหมดนี้ดีที่สุดสำหรับการ Debug เพราะมีหน้าจอ Dashboard ให้กดเลือกเทสได้:

Bash
npx playwright test --ui
📊 การดูรายงาน (Generating Reports)
หลังจากรันเทสเสร็จสิ้น ระบบจะสร้างรายงานในรูปแบบหน้าเว็บ HTML:

Bash
npx playwright show-report
รายงานจะแสดงผลการ Pass/Fail พร้อม Screenshot และ Video บันทึกหน้าจอขณะเกิดบั๊ก (ถ้ามี)

📂 โครงสร้างโปรเจกต์ที่สำคัญ
/tests/e2e : ไฟล์สคริปต์การทดสอบหลัก (.spec.js)

/pages : ไฟล์ Page Object Model (POM) สำหรับเก็บ Logic การเข้าถึง Element

playwright.config.js : ไฟล์ตั้งค่าหลักของ Playwright (เช่น URL พื้นฐาน, Timeout)

package.json : รายการไลบรารีและเวอร์ชันที่ใช้งาน

