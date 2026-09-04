export type UserRole =
  | "SUPERADMIN"
  | "ADMIN"
  | "TEACHER"
  | "ASSISTANT"
  | "STUDENT";

export interface User {
  id: number;
  full_name: string;
  phone: string;
  email: string | null;
  role: UserRole;
  file: string | null;
  create_at: string;
}

/** JWT ichidagi ma'lumot (backend: JwtToken.jwtAccessToken) */
export interface JwtPayload {
  id: number;
  full_name: string;
  role: UserRole;
  iat: number;
  exp: number;
}

export interface LoginRequest {
  phone: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  accessToken: string;
  refreshToken: string;
}

export interface RegisterRequest {
  full_name: string;
  phone: string;
  password: string;
}

export interface VerifyOtpRequest {
  phone: string;
  otp: string;
}

export interface ResetPasswordRequest {
  phone: string;
  otp: string;
  password: string;
}

export interface VerifyOtpResponse {
  success: boolean;
  message: string;
  accessToken: string;
  refreshToken: string;
}

export interface RegisterResponse {
  success: boolean;
  message?: string;
  accessToken: string;
  data?: {
    id: number;
    full_name: string;
    phone: string;
    role: UserRole;
  };
}

/** Backend javob shakli: { success, message?, data? } */
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta?: PaginationMeta;
}

export interface UsersQuery {
  page?: number;
  limit?: number;
  role?: UserRole;
  search?: string;
}

/** `Mentor` jadvalidagi profil (backend: MentorProfile → Mentor) */
export interface MentorProfile {
  id: number;
  userId: number;
  experience: number | null;
  job: string | null;
  web_link: string | null;
  description: string | null;
  facebook: string | null;
  telegram: string | null;
  linkedin?: string | null;
  linkedIn?: string | null;
  instagram: string | null;
  github: string | null;
}

/**
 * Mentor — bu `User` (role: MENTOR) + profil.
 *
 * Backend schema ko'chirish jarayonida bog'lanish nomi o'zgardi:
 * eski javobda `mentorProfile`, yangisida `mentor`. Ikkalasi ham
 * ixtiyoriy qilib qo'yildi — `mentorProfileOf()` qaysi biri
 * kelganini o'zi topadi.
 */
export interface Mentor extends User {
  mentorProfile?: MentorProfile[];
  mentor?: MentorProfile[];
}

export interface MentorsQuery {
  page?: number;
  limit?: number;
  search?: string;
}

export interface Category {
  id: number;
  name: string;
  create_at: string;
  update_at: string;
}

export interface CategoriesQuery {
  page?: number;
  limit?: number;
  search?: string;
}

export interface CreateAdminRequest {
  full_name: string;
  phone: string;
  email?: string;
  password: string;
  file?: File | null;
}

export interface UpdateAdminRequest {
  full_name?: string;
  phone?: string;
  email?: string;
}

/* ---------- Ochiq sayt (token kerak emas) ---------- */

export type CourseLevel =
  | "BEGINNER"
  | "ELEMENTARY"
  | "PRE_INTERMEDIATE"
  | "INTERMEDIATE"
  | "ADVANCED";

export interface PublicCourse {
  id: number;
  name: string;
  description: string;
  banner: string;
  price: string;
  level: CourseLevel;
  create_at: string;
  categories: { id: number; name: string };
  mentorProfile: {
    id: number;
    job: string | null;
    user: { id: number; full_name: string; file: string | null };
  } | null;
}

export interface PublicCourseDetail extends PublicCourse {
  intro_video: string;
  sections: {
    id: number;
    name: string;
    _count: { lessons: number };
    lessons: { id: number; name: string }[];
  }[];
}

export interface PublicCategory {
  id: number;
  name: string;
  _count: { courses: number };
}

export interface PublicMentor {
  id: number;
  full_name: string;
  file: string | null;
  image: string | null;
  mentorProfile: {
    job: string | null;
    experience: number | null;
    description: string | null;
    facebook: string | null;
    telegram: string | null;
    linkedin: string | null;
    instagram: string | null;
    github: string | null;
  }[];
}

export interface PublicCoursesQuery {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: number;
  level?: CourseLevel;
}

export type UserStatus = "ACTIVE" | "INACTIVE" | "PENDING";

export interface Assistant extends User {
  status?: UserStatus;
  /** Biriktirilgan kurslar — Courses.assistantId orqali */
  courses?: { id: number; name: string }[];
}

export interface AssistantsQuery {
  page?: number;
  limit?: number;
  search?: string;
}

export interface Student extends User {
  status?: UserStatus;
  /** Jami to`lovlar soni */
  _count?: { purchasedCourses: number };
  /** Har to`lovning holati — tasdiqlanganlarini sanash uchun */
  purchasedCourses?: { status: "PENDING" | "COMPLETED" | "REJECTED" }[];
}

export type PaymentStatus = "PENDING" | "COMPLETED" | "REJECTED";

export interface Payment {
  userId: number;
  courseId: number;
  price: string;
  status: PaymentStatus;
  create_at: string;
  user: { id: number; full_name: string; phone: string; file: string | null };
  courses: {
    id: number;
    name: string;
    categories?: { id: number; name: string };
  };
}

export interface PaymentsQuery {
  page?: number;
  limit?: number;
  status?: PaymentStatus;
  courseId?: number;
}

/* ---------- Kurs boshqaruvi (admin) ---------- */

export interface AdminCourse {
  id: number;
  name: string;
  description: string;
  banner: string;
  intro_video: string;
  price: string;
  level: CourseLevel;
  published: boolean;
  categoryId: number;
  mentorId: number;
  assistantId: number | null;
  create_at: string;
  categories?: { id: number; name: string };
  mentorProfile?: {
    id: number;
    user: { id: number; full_name: string; phone: string };
  };
}

export interface CoursesQuery {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: number;
  level?: CourseLevel;
}

export interface Section {
  id: number;
  name: string;
  courseId: number;
  create_at: string;
  courses?: { id: number; name: string };
}

export interface SectionsQuery {
  page?: number;
  limit?: number;
  search?: string;
  courseId?: number;
}

export interface Lesson {
  id: number;
  name: string;
  description: string;
  file: string;
  sectionId: number;
  create_at: string;
  sections?: { id: number; name: string };
}

export interface LessonsQuery {
  page?: number;
  limit?: number;
  search?: string;
  sectionId?: number;
}

export interface MaterialFile {
  id: number;
  file: string;
  materialId: number;
}

export interface Material {
  id: number;
  description: string;
  lessonId: number;
  create_at: string;
  materialFiles?: MaterialFile[];
  lessons?: { id: number; name: string };
}

export interface MaterialsQuery {
  page?: number;
  limit?: number;
  search?: string;
  lessonId?: number;
}

export interface Homework {
  id: number;
  description: string;
  file: string | null;
  lessonId: number;
  create_at: string;
  lessons?: { id: number; name: string };
}

export interface HomeworksQuery {
  page?: number;
  limit?: number;
  search?: string;
  lessonId?: number;
}

export type ExamAnswer = "variantA" | "variantB" | "variantC" | "variantD";

export interface Exam {
  id: number;
  question: string;
  variantA: string;
  variantB: string;
  variantC: string;
  variantD: string;
  answer?: ExamAnswer;
  lessonId: number;
  create_at: string;
  lessons?: { id: number; name: string };
}

export interface ExamsQuery {
  page?: number;
  limit?: number;
  search?: string;
  lessonId?: number;
}

/* ---------- Imtihon natijalari (Exam Results) ---------- */

export type ExamStatus = "PASSED" | "FAILED";

export interface ExamResultStudent {
  id: number;
  fullName: string;
  phone: string;
  email: string | null;
  image: string | null;
}

export interface ExamResultItem {
  id: number;
  student?: ExamResultStudent;
  course: {
    id: number;
    name: string;
  };
  section: {
    id: number;
    name: string;
  };
  lesson: {
    id: number;
    name: string;
  };
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  percentage: number;
  status: ExamStatus;
  statusLabel: string;
  create_at: string;
}

export interface ExamResultDetailAnswer {
  questionId: number;
  question: string;
  selectedAnswer: ExamAnswer | string;
  correctAnswer: ExamAnswer | string;
  isCorrect: boolean;
  options: {
    variantA: string;
    variantB: string;
    variantC: string;
    variantD: string;
  };
}

export interface ExamResultDetail extends ExamResultItem {
  details?: ExamResultDetailAnswer[];
}

export interface ExamResultStats {
  totalAttempts: number;
  passedAttempts: number;
  failedAttempts: number;
  passRate: number;
}

export interface ExamResultsQuery {
  page?: number;
  limit?: number;
  search?: string;
  courseId?: number;
  sectionId?: number;
  lessonId?: number;
  status?: ExamStatus;
  dateRange?: string;
  startDate?: string;
  endDate?: string;
}

/** GET /dashboard/stats */
export interface DashboardStats {
  admins: number;
  mentors: number;
  assistants: number;
  students: number;
  courses: number;
}

/** GET /dashboard/notifications */
export interface NotificationCounts {
  payments: number;
  messages: number;
  total: number;
}

