"use client";

import { useLangStore, type Lang } from "@/store/lang";

/**
 * Oddiy tarjima lug'ati.
 *
 * Kalit sifatida **o'zbekcha matnning o'zi** ishlatiladi. Shuning uchun
 * lug'atda yo'q matn avtomatik o'zbekcha bo'lib qolaveradi — hech qayerda
 * bo'sh joy yoki `undefined` chiqmaydi.
 *
 * Yangi so'z qo'shish: shu jadvalga bitta qator qo'shiladi, xolos.
 */
const DICT: Record<string, Record<Lang, string>> = {
  /* ---------- Sidebar ---------- */
  "Boshqaruv paneli": {
    uz: "Boshqaruv paneli",
    ru: "Панель управления",
    en: "Dashboard panel",
  },
  Asosiy: { uz: "Asosiy", ru: "Главная", en: "Main" },
  Foydalanuvchilar: {
    uz: "Foydalanuvchilar",
    ru: "Пользователи",
    en: "Users",
  },
  Administratorlar: {
    uz: "Administratorlar",
    ru: "Администраторы",
    en: "Administrators",
  },
  Mentorlar: { uz: "Mentorlar", ru: "Менторы", en: "Mentors" },
  Assistentlar: { uz: "Assistentlar", ru: "Ассистенты", en: "Assistants" },
  Studentlar: { uz: "Studentlar", ru: "Студенты", en: "Students" },
  "To‘lovlar": { uz: "To‘lovlar", ru: "Платежи", en: "Payments" },
  Materiallar: { uz: "Materiallar", ru: "Материалы", en: "Materials" },
  "Barcha kurslar": {
    uz: "Barcha kurslar",
    ru: "Все курсы",
    en: "All courses",
  },
  Kategoriyalar: { uz: "Kategoriyalar", ru: "Категории", en: "Categories" },
  "Bo’limlar": { uz: "Bo’limlar", ru: "Разделы", en: "Sections" },
  Darslar: { uz: "Darslar", ru: "Уроки", en: "Lessons" },
  "Dars materiallari": {
    uz: "Dars materiallari",
    ru: "Материалы урока",
    en: "Lesson materials",
  },
  Vazifalar: { uz: "Vazifalar", ru: "Задания", en: "Assignments" },
  Testlar: { uz: "Testlar", ru: "Тесты", en: "Tests" },
  "Savol-javoblar": {
    uz: "Savol-javoblar",
    ru: "Вопросы и ответы",
    en: "Questions & answers",
  },
  Natijalar: { uz: "Natijalar", ru: "Результаты", en: "Results" },
  Kurslar: { uz: "Kurslar", ru: "Курсы", en: "Courses" },
  "Mening kurslarim": {
    uz: "Mening kurslarim",
    ru: "Мои курсы",
    en: "My courses",
  },

  /* ---------- Rollar ---------- */
  "Super administrator": {
    uz: "Super administrator",
    ru: "Супер администратор",
    en: "Super administrator",
  },
  Administrator: {
    uz: "Administrator",
    ru: "Администратор",
    en: "Administrator",
  },
  Mentor: { uz: "Mentor", ru: "Ментор", en: "Mentor" },
  Assistent: { uz: "Assistent", ru: "Ассистент", en: "Assistant" },
  Student: { uz: "Student", ru: "Студент", en: "Student" },

  /* ---------- Topbar / menyu ---------- */
  "Profil sozlamalari": {
    uz: "Profil sozlamalari",
    ru: "Настройки профиля",
    en: "Profile settings",
  },
  Chiqish: { uz: "Chiqish", ru: "Выйти", en: "Log out" },
  Bildirishnomalar: {
    uz: "Bildirishnomalar",
    ru: "Уведомления",
    en: "Notifications",
  },
  "Yangi bildirishnoma yo‘q": {
    uz: "Yangi bildirishnoma yo‘q",
    ru: "Новых уведомлений нет",
    en: "No new notifications",
  },
  "ta to‘lov tasdiqlanishini kutmoqda": {
    uz: "ta to‘lov tasdiqlanishini kutmoqda",
    ru: "платежей ждут подтверждения",
    en: "payments awaiting approval",
  },
  "ta yangi savol-javob xabari": {
    uz: "ta yangi savol-javob xabari",
    ru: "новых сообщений в чате",
    en: "new chat messages",
  },
  "Panelni yig‘ish": {
    uz: "Panelni yig‘ish",
    ru: "Свернуть панель",
    en: "Collapse panel",
  },
  "Panelni ochish": {
    uz: "Panelni ochish",
    ru: "Развернуть панель",
    en: "Expand panel",
  },

  /* ---------- Umumiy amallar ---------- */
  "Qo’shish": { uz: "Qo’shish", ru: "Добавить", en: "Add" },
  Saqlash: { uz: "Saqlash", ru: "Сохранить", en: "Save" },
  "Bekor qilish": { uz: "Bekor qilish", ru: "Отмена", en: "Cancel" },
  "O‘chirish": { uz: "O‘chirish", ru: "Удалить", en: "Delete" },
  Tahrirlash: { uz: "Tahrirlash", ru: "Редактировать", en: "Edit" },
  Batafsil: { uz: "Batafsil", ru: "Подробнее", en: "Details" },
  Izlash: { uz: "Izlash", ru: "Поиск", en: "Search" },
  Tanlang: { uz: "Tanlang", ru: "Выберите", en: "Select" },
  Kiriting: { uz: "Kiriting", ru: "Введите", en: "Enter" },
  Yopish: { uz: "Yopish", ru: "Закрыть", en: "Close" },
  Yuborish: { uz: "Yuborish", ru: "Отправить", en: "Send" },

  /* ---------- Holatlar ---------- */
  "Yuklanmoqda...": {
    uz: "Yuklanmoqda...",
    ru: "Загрузка...",
    en: "Loading...",
  },
  "Hech narsa topilmadi": {
    uz: "Hech narsa topilmadi",
    ru: "Ничего не найдено",
    en: "Nothing found",
  },
  "Siz rostdan ham o‘chirmoqchimisiz?": {
    uz: "Siz rostdan ham o‘chirmoqchimisiz?",
    ru: "Вы действительно хотите удалить?",
    en: "Are you sure you want to delete?",
  },
  "Muvaffaqiyatli qo‘shildi": {
    uz: "Muvaffaqiyatli qo‘shildi",
    ru: "Успешно добавлено",
    en: "Successfully added",
  },
  "Muvaffaqiyatli o‘zgartirildi": {
    uz: "Muvaffaqiyatli o‘zgartirildi",
    ru: "Успешно изменено",
    en: "Successfully updated",
  },
  "Muvaffaqiyatli o‘chirildi": {
    uz: "Muvaffaqiyatli o‘chirildi",
    ru: "Успешно удалено",
    en: "Successfully deleted",
  },

  /* ---------- Sahifalash ---------- */
  "Bir sahifada:": {
    uz: "Bir sahifada:",
    ru: "На странице:",
    en: "Per page:",
  },
  Keyingi: { uz: "Keyingi", ru: "Далее", en: "Next" },
  Oldingi: { uz: "Oldingi", ru: "Назад", en: "Previous" },
  "Yuklab olish": {
    uz: "Yuklab olish",
    ru: "Скачать",
    en: "Download",
  },

  /* ---------- Jadval ustunlari ---------- */
  Nomi: { uz: "Nomi", ru: "Название", en: "Name" },
  "F.I.Sh": { uz: "F.I.Sh", ru: "Ф.И.О", en: "Full name" },
  "Telefon raqami": {
    uz: "Telefon raqami",
    ru: "Номер телефона",
    en: "Phone number",
  },
  Narxi: { uz: "Narxi", ru: "Цена", en: "Price" },
  Holati: { uz: "Holati", ru: "Статус", en: "Status" },
  Tasdiqlash: { uz: "Tasdiqlash", ru: "Подтвердить", en: "Approve" },
  Tasdiqlangan: {
    uz: "Tasdiqlangan",
    ru: "Подтверждено",
    en: "Approved",
  },
  "To‘lov tasdiqlandi": {
    uz: "To‘lov tasdiqlandi",
    ru: "Платёж подтверждён",
    en: "Payment approved",
  },
  Amallar: { uz: "Amallar", ru: "Действия", en: "Actions" },
  "Yaratilgan vaqt": {
    uz: "Yaratilgan vaqt",
    ru: "Дата создания",
    en: "Created at",
  },
  Kategoriya: { uz: "Kategoriya", ru: "Категория", en: "Category" },
  Darajasi: { uz: "Darajasi", ru: "Уровень", en: "Level" },
  Dars: { uz: "Dars", ru: "Урок", en: "Lesson" },
  Savol: { uz: "Savol", ru: "Вопрос", en: "Question" },
  Javob: { uz: "Javob", ru: "Ответ", en: "Answer" },
  Fayllar: { uz: "Fayllar", ru: "Файлы", en: "Files" },
  Savollar: { uz: "Savollar", ru: "Вопросы", en: "Questions" },
  "Kurs kategoriyalari": {
    uz: "Kurs kategoriyalari",
    ru: "Категории курсов",
    en: "Course categories",
  },
  "Kursda qatnashuvchilar": {
    uz: "Kursda qatnashuvchilar",
    ru: "Участники курса",
    en: "Course participants",
  },
  "Shaxsiy ma’lumotlar": {
    uz: "Shaxsiy ma’lumotlar",
    ru: "Личные данные",
    en: "Personal information",
  },
  Xavfsizlik: { uz: "Xavfsizlik", ru: "Безопасность", en: "Security" },
  "Pochta bildirishnomalari": {
    uz: "Pochta bildirishnomalari",
    ru: "Уведомления по почте",
    en: "Email notifications",
  },
  "Kurs nomi": { uz: "Kurs nomi", ru: "Название курса", en: "Course name" },
  "Sotib oluvchi": { uz: "Sotib oluvchi", ru: "Покупатель", en: "Buyer" },
  "Yo’nalish": { uz: "Yo’nalish", ru: "Направление", en: "Direction" },
  Summa: { uz: "Summa", ru: "Сумма", en: "Amount" },
  Sana: { uz: "Sana", ru: "Дата", en: "Date" },
  Rol: { uz: "Rol", ru: "Роль", en: "Role" },
  Email: { uz: "Email", ru: "Эл. почта", en: "Email" },

  /* ---------- Landing sahifa ---------- */
  "Kelajak kasblarini": {
    uz: "Kelajak kasblarini",
    ru: "Профессии будущего",
    en: "Future professions",
  },
  "biz bilan o’rganing!": {
    uz: "biz bilan o’rganing!",
    ru: "изучайте вместе с нами!",
    en: "learn them with us!",
  },
  "Tekinga o‘qib, pul ishlashga nima deysiz? Ishonmayapsizmi? Biz buni isbotlaymiz. Hammasi o‘zingizga bog‘liq.": {
    uz: "Tekinga o‘qib, pul ishlashga nima deysiz? Ishonmayapsizmi? Biz buni isbotlaymiz. Hammasi o‘zingizga bog‘liq.",
    ru: "Учиться бесплатно и зарабатывать — как вам такое? Не верите? Мы докажем. Всё зависит от вас.",
    en: "Study for free and earn money — how about that? Don't believe it? We'll prove it. It all depends on you.",
  },
  "Kurslar bilan tanishish": {
    uz: "Kurslar bilan tanishish",
    ru: "Ознакомиться с курсами",
    en: "Browse the courses",
  },
  "Ommabop kurslar": {
    uz: "Ommabop kurslar",
    ru: "Популярные курсы",
    en: "Popular courses",
  },
  "Barcha kurslarni ko’rish": {
    uz: "Barcha kurslarni ko’rish",
    ru: "Смотреть все курсы",
    en: "View all courses",
  },
  "Bu bo‘limda hozircha kurs yo‘q.": {
    uz: "Bu bo‘limda hozircha kurs yo‘q.",
    ru: "В этом разделе пока нет курсов.",
    en: "No courses in this section yet.",
  },
  "Kursni ko’rish": {
    uz: "Kursni ko’rish",
    ru: "Посмотреть курс",
    en: "View course",
  },
  "Kurs narxi:": {
    uz: "Kurs narxi:",
    ru: "Цена курса:",
    en: "Course price:",
  },
  "Bizga qo’shiling": {
    uz: "Bizga qo’shiling",
    ru: "Присоединяйтесь к нам",
    en: "Join us",
  },
  "O’quvchimisiz?": {
    uz: "O’quvchimisiz?",
    ru: "Вы студент?",
    en: "Are you a student?",
  },
  "Mentormisiz?": {
    uz: "Mentormisiz?",
    ru: "Вы ментор?",
    en: "Are you a mentor?",
  },
  Boshlash: { uz: "Boshlash", ru: "Начать", en: "Get started" },
  "Qo’shilish": { uz: "Qo’shilish", ru: "Присоединиться", en: "Join" },
  "Istalgan nuqtadan onlayn o’qish imkoniyati": {
    uz: "Istalgan nuqtadan onlayn o’qish imkoniyati",
    ru: "Возможность учиться онлайн из любой точки",
    en: "Study online from anywhere",
  },
  "Biz sizga bu imkoniyatni taqdim qilamiz": {
    uz: "Biz sizga bu imkoniyatni taqdim qilamiz",
    ru: "Мы предоставляем вам такую возможность",
    en: "We give you that opportunity",
  },
  "Ro’yxatdan o’tish": {
    uz: "Ro’yxatdan o’tish",
    ru: "Регистрация",
    en: "Sign up",
  },
  "Tajribali Mentorlar": {
    uz: "Tajribali Mentorlar",
    ru: "Опытные менторы",
    en: "Experienced mentors",
  },
  "Hozircha mentorlar qo‘shilmagan.": {
    uz: "Hozircha mentorlar qo‘shilmagan.",
    ru: "Менторы пока не добавлены.",
    en: "No mentors added yet.",
  },
  Izohlar: { uz: "Izohlar", ru: "Отзывы", en: "Reviews" },
  "O’quvchilarimiz tomonidan qoldirilgan izohlar": {
    uz: "O’quvchilarimiz tomonidan qoldirilgan izohlar",
    ru: "Отзывы наших студентов",
    en: "Reviews left by our students",
  },
  "Biz bilan muvaffaqiyatga erishing": {
    uz: "Biz bilan muvaffaqiyatga erishing",
    ru: "Достигайте успеха вместе с нами",
    en: "Succeed with us",
  },
  "Eng kuchlilar biz bilan qoladi!": {
    uz: "Eng kuchlilar biz bilan qoladi!",
    ru: "Сильнейшие остаются с нами!",
    en: "The strongest stay with us!",
  },
  "Kirish / Ro’yxatdan o’tish": {
    uz: "Kirish / Ro’yxatdan o’tish",
    ru: "Вход / Регистрация",
    en: "Log in / Sign up",
  },
  Kirish: { uz: "Kirish", ru: "Вход", en: "Log in" },
  "Bosh sahifa": { uz: "Bosh sahifa", ru: "Главная", en: "Home" },
  "Agarda o’quvchi bo’lsangiz bizning xalqaro darajadagi tajribali mentorlarimizga shogird bo’ling": {
    uz: "Agarda o’quvchi bo’lsangiz bizning xalqaro darajadagi tajribali mentorlarimizga shogird bo’ling",
    ru: "Если вы студент — станьте учеником наших опытных менторов международного уровня",
    en: "If you are a student, become an apprentice to our world-class mentors",
  },
  "Bizning mualliflar jamoamizga qo’shilib, o’z tajribangizni boshqalar bilan oosn va qulay platforma orqali ulashing": {
    uz: "Bizning mualliflar jamoamizga qo’shilib, o’z tajribangizni boshqalar bilan oosn va qulay platforma orqali ulashing",
    ru: "Присоединяйтесь к команде авторов и делитесь опытом через удобную платформу",
    en: "Join our team of authors and share your experience on a convenient platform",
  },
  "Bizning safimizga nafaqat o’rganuvchi balki yetarkucha tajribangiz bo’lsa mentor sifatida ham qo’shilishingiz mumkin": {
    uz: "Bizning safimizga nafaqat o’rganuvchi balki yetarkucha tajribangiz bo’lsa mentor sifatida ham qo’shilishingiz mumkin",
    ru: "К нам можно присоединиться не только как студент, но и как ментор, если у вас достаточно опыта",
    en: "You can join us not only as a learner but also as a mentor if you have enough experience",
  },
  "Kasbga yo’nalitirilgan praktikumlar yordamida eng tez va samarali yo’llar bilan mutaxassislar qatoriga qo’shiling. Har bir praktikum soha mutaxassislari tomonidan eng zamoaviy o’quv reja asosida tayyorlangan": {
    uz: "Kasbga yo’nalitirilgan praktikumlar yordamida eng tez va samarali yo’llar bilan mutaxassislar qatoriga qo’shiling. Har bir praktikum soha mutaxassislari tomonidan eng zamoaviy o’quv reja asosida tayyorlangan",
    ru: "С помощью практикумов, ориентированных на профессию, станьте специалистом быстро и эффективно. Каждый практикум составлен экспертами отрасли по современной программе",
    en: "Become a specialist quickly and effectively with career-focused practicums. Each one is built by industry experts on a modern curriculum",
  },
  "Barcha kurslarimiz tajribali mentorlar tomonidan tayyorlangan": {
    uz: "Barcha kurslarimiz tajribali mentorlar tomonidan tayyorlangan",
    ru: "Все наши курсы подготовлены опытными менторами",
    en: "All our courses are prepared by experienced mentors",
  },
  "Kurslarni yuklab bo‘lmadi. Backend ishlab turibdimi?": {
    uz: "Kurslarni yuklab bo‘lmadi. Backend ishlab turibdimi?",
    ru: "Не удалось загрузить курсы. Бэкенд запущен?",
    en: "Could not load courses. Is the backend running?",
  },
  "Biz haqimizda": {
    uz: "Biz haqimizda",
    ru: "О нас",
    en: "About us",
  },
  "Bog‘lanish": { uz: "Bog‘lanish", ru: "Контакты", en: "Contact" },
  Faol: { uz: "Faol", ru: "Активен", en: "Active" },
  Nofaol: { uz: "Nofaol", ru: "Неактивен", en: "Inactive" },
};

/** Matnni joriy tilga o'giradi. Lug'atda bo'lmasa — o'zicha qaytaradi. */
export function useT() {
  const lang = useLangStore((s) => s.lang);

  return (text: string) => DICT[text]?.[lang] ?? text;
}
