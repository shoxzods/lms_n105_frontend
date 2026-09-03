# LMS API Documentation & Configuration

## 1. API Asosiy Manzillari (Base URLs)

- **API Base URL**: `process.env.NEXT_PUBLIC_API_URL` (Standart: `http://13.206.98.145:9191/api/v1`)
- **Fayllar va Media (Static files)**: `${NEXT_PUBLIC_API_URL.replace(/\/api\/v1$/, "")}/uploads/{folder}/{filename}`
  - Rasmlar: `/uploads/images/{filename}`
  - Videolar: `/uploads/videos/{filename}`
  - Fayllar: `/uploads/files/{filename}`
- **WebSocket (Chat)**: `${NEXT_PUBLIC_API_URL.replace(/\/api\/v1$/, "")}/chat`

---

## 2. Loyihadagi API Fayllarining Joylashuvi

Barcha API bilan ishlash modullari **`src/api/`** katalogida joylashgan:

| Fayl | Tavsif |
| :--- | :--- |
| [`src/api/index.ts`](file:///home/shoxzod/Desktop/frontend/src/api/index.ts) | Barcha API modullarini umumiy eksport qiluvchi asosiy indeks fayl |
| [`src/api/client.ts`](file:///home/shoxzod/Desktop/frontend/src/api/client.ts) | Asosiy Axios instansiyasi, Interceptor-lar, Token saqlash (`lms_access_token`) va Token yangilash (`/auth/refresh`) |
| [`src/api/auth.ts`](file:///home/shoxzod/Desktop/frontend/src/api/auth.ts) | Autentifikatsiya (Login, Register, OTP tasdiqlash, Parolni tiklash) |
| [`src/api/public.ts`](file:///home/shoxzod/Desktop/frontend/src/api/public.ts) | Ommaviy ma'lumotlar (Kurslar, Kategoriyalar, Mentorlar, Fayl URL lari) |
| [`src/api/content.ts`](file:///home/shoxzod/Desktop/frontend/src/api/content.ts) | Kurslar, Bo'limlar, Darslar, Materiallar, Uyga vazifalar, Testlar CRUD va tekshirish |
| [`src/api/users.ts`](file:///home/shoxzod/Desktop/frontend/src/api/users.ts) | Foydalanuvchilar va Adminlarni boshqarish |
| [`src/api/mentors.ts`](file:///home/shoxzod/Desktop/frontend/src/api/mentors.ts) | Mentorlar ro'yxati, yaratish, o'zgartirish, o'chirish va mentor profili |
| [`src/api/assistants.ts`](file:///home/shoxzod/Desktop/frontend/src/api/assistants.ts) | Assistentlarni boshqarish |
| [`src/api/categories.ts`](file:///home/shoxzod/Desktop/frontend/src/api/categories.ts) | Kategoriyalar CRUD |
| [`src/api/payments.ts`](file:///home/shoxzod/Desktop/frontend/src/api/payments.ts) | To'lovlar, statusni o'zgartirish, kurs sotib olish |
| [`src/api/dashboard.ts`](file:///home/shoxzod/Desktop/frontend/src/api/dashboard.ts) | Boshqaruv paneli statistikasi va bildirishnomalar |
| [`src/lib/socket.ts`](file:///home/shoxzod/Desktop/frontend/src/lib/socket.ts) | Socket.io ulanishi (jonli chat) |

---

## 3. Barcha API Endpointlar Ro'yxati

### Autentifikatsiya (`/auth`)
- `POST /auth/login` — Tizimga kirish (telefon + parol)
- `POST /auth/register` — Yangi student ro'yxatdan o'tishi
- `POST /auth/verify-otp` — Telegram bot orqali kelgan OTP kodni tasdiqlash
- `POST /auth/reset-password` — Parolni tiklash
- `POST /auth/refresh` — Access tokenni yangilash (refresh token orqali)

### Ommaviy (`/public`)
- `GET /public/courses` — Ommaviy kurslar ro'yxati (qidiruv, filter, sahifalash)
- `GET /public/courses/:id` — Kursning batafsil ma'lumotlari
- `GET /public/categories` — Barcha faol kategoriyalar
- `GET /public/mentors` — Ommaviy mentorlar ro'yxati

### Dashboard & Statistika (`/dashboard`)
- `GET /dashboard/stats` — Dashboard umumiy statistikasi
- `GET /dashboard/notifications` — O'qilmagan bildirishnomalar soni

### Kurslar & Kontent Ierarxiyasi
- **Kurslar (`/courses`)**:
  - `GET /courses` — Kurslar ro'yxati (Admin)
  - `POST /courses` — Kurs yaratish (multipart/form-data: banner, intro_video)
  - `PATCH /courses/:id` — Kursni tahrirlash (multipart/form-data)
  - `DELETE /courses/:id` — Kursni o'chirish
- **Bo'limlar (`/sections`)**:
  - `GET /sections` — Kurs bo'limlari
  - `POST /sections` — Yangi bo'lim yaratish
  - `PATCH /sections/:id` — Bo'limni tahrirlash
  - `DELETE /sections/:id` — Bo'limni o'chirish
- **Darslar (`/lessons`)**:
  - `GET /lessons` — Darslar ro'yxati
  - `POST /lessons` — Dars yaratish (multipart/form-data)
  - `PATCH /lessons/:id` — Darsni tahrirlash (multipart/form-data)
  - `DELETE /lessons/:id` — Darsni o'chirish
- **Dars materiallari (`/materials`)**:
  - `GET /materials` — Materiallar
  - `POST /materials` — Material yuklash (multipart/form-data)
  - `PATCH /materials/:id` — Materialni yangilash
  - `DELETE /materials/:id` — Materialni o'chirish
- **Uyga vazifalar (`/homeworks`)**:
  - `GET /homeworks` — Vazifalar ro'yxati
  - `POST /homeworks` — Vazifa yaratish (multipart/form-data)
  - `PATCH /homeworks/:id` — Vazifani yangilash
  - `DELETE /homeworks/:id` — Vazifani o'chirish
- **Testlar va Imtihonlar (`/exams`)**:
  - `GET /exams` — Testlar ro'yxati
  - `POST /exams` — Test yaratish
  - `PATCH /exams/:id` — Testni tahrirlash
  - `DELETE /exams/:id` — Testni o'chirish
  - `POST /exams/check` — Test javoblarini tekshirish va natija olish

### Foydalanuvchilar & Xodimlar
- **Foydalanuvchilar (`/users`)**:
  - `GET /users` — Foydalanuvchilar ro'yxati (role bo'yicha filter)
  - `GET /users/:id` — Foydalanuvchi ma'lumotlari
  - `POST /users/admin` — Yangi admin yaratish (multipart/form-data)
  - `PATCH /users/:id` — Admin ma'lumotlarini yangilash
  - `DELETE /users/:id` — Foydalanuvchini o'chirish
- **Mentorlar (`/mentor`)**:
  - `GET /mentor` — Mentorlar ro'yxati
  - `POST /mentor/create` — Mentor yaratish (multipart/form-data)
  - `PATCH /mentor/:id` — Mentorni tahrirlash (multipart/form-data)
  - `DELETE /mentor/:id` — Mentorni o'chirish
  - `GET /mentor/profile` — Joriy mentorning o'z profili
  - `PATCH /mentor/profile` — Mentor profilini yangilash
- **Assistentlar (`/assistant`)**:
  - `GET /assistant` — Assistentlar ro'yxati
  - `POST /assistant` — Assistent yaratish (multipart/form-data)
  - `DELETE /assistant/:id` — Assistentni o'chirish

### Kategoriyalar (`/categories`)
- `GET /categories` — Kategoriyalar ro'yxati
- `POST /categories` — Kategoriya yaratish
- `PATCH /categories/:id` — Kategoriya nomini o'zgartirish
- `DELETE /categories/:id` — Kategoriyani o'chirish

### To'lovlar & Xaridlar (`/payments`)
- `GET /payments` — Barcha to'lovlar ro'yxati (Admin)
- `POST /payments` — Kurs sotib olish / to'lov yaratish
- `PATCH /payments/:userId/:courseId` — To'lov holatini tasdiqlash / rad etish (`PAID`, `PENDING`, `REJECTED`)
- `GET /payments/my` — Studentning sotib olgan kurslari ro'yxati

### Jonli Chat & Socket (`/chat`)
- `GET /chat/rooms` — Chat xonalari ro'yxati
- `WS /chat` — Socket.io orqali jonli xabarlar almashinuvi (`join`, `history`, `message`, `error_message`)
