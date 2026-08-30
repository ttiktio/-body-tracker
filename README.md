# Body Tracker

เว็บจดสัดส่วนและคำนวณ % Body Fat แบบ local-first สำหรับ GitHub Pages

## Features
- บันทึก Weight, Waist, Neck, Hip, Chest, Arm, Thigh
- คำนวณ BMI
- ประมาณ % Body Fat ด้วย U.S. Navy formula
- คำนวณ Lean Mass / Fat Mass
- History + Edit / Delete
- กราฟ Weight / Body Fat / รอบสัดส่วน
- Export / Import backup JSON
- PWA / Add to Home Screen
- ข้อมูลเก็บใน localStorage ของอุปกรณ์ผู้ใช้

## Deploy on GitHub Pages
1. สร้าง Public repository ใหม่
2. อัปโหลดไฟล์ทั้งหมดในโฟลเดอร์นี้ไว้ที่ root ของ repo
3. ไปที่ Settings > Pages
4. Build and deployment > Deploy from a branch
5. Branch: main / root
6. Save
7. เปิด URL `https://USERNAME.github.io/REPOSITORY/`

## Privacy
ข้อมูลการวัดไม่ได้ถูกส่งไปยัง GitHub หรือ backend ของแอป
แต่ source code ของเว็บจะเป็น public หากใช้ public repository

## Important
ค่า Body Fat เป็นค่าประมาณ ไม่ใช่ผลตรวจทางการแพทย์
