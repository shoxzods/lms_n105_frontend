import { apiClient } from "./client";
import type {
  AdminCourse,
  ApiResponse,
  CoursesQuery,
  Exam,
  ExamsQuery,
  Homework,
  HomeworksQuery,
  Lesson,
  LessonsQuery,
  Material,
  MaterialsQuery,
  PaginatedResponse,
  Section,
  SectionsQuery,
} from "@/types";

/**
 * Kurs materiallari zanjiri: Kurs → Bo'lim → Dars → Material/Vazifa/Test.
 *
 * Beshtasining ham backenddagi shakli bir xil — `GET /`, `GET /:id`,
 * `POST /`, `PATCH /:id`, `DELETE /:id` — shuning uchun bitta faylda
 * turgani qulay.
 */

/* ---------- Kurslar ---------- */

export async function getCourses(query: CoursesQuery = {}) {
  const { data } = await apiClient.get<PaginatedResponse<AdminCourse>>(
    "/courses",
    { params: query },
  );
  return data;
}

/** Kurs yaratish/tahrirlash multipart — banner va intro_video fayl */
export async function createCourse(form: FormData) {
  const { data } = await apiClient.post<ApiResponse<AdminCourse>>(
    "/courses",
    form,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return data;
}

export async function updateCourse(id: number, form: FormData) {
  const { data } = await apiClient.patch<ApiResponse<AdminCourse>>(
    `/courses/${id}`,
    form,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return data;
}

export async function deleteCourse(id: number) {
  const { data } = await apiClient.delete<ApiResponse<undefined>>(
    `/courses/${id}`,
  );
  return data;
}

/* ---------- Bo'limlar ---------- */

export async function getSections(query: SectionsQuery = {}) {
  const { data } = await apiClient.get<PaginatedResponse<Section>>(
    "/sections",
    { params: query },
  );
  return data;
}

export async function createSection(body: { name: string; courseId: number }) {
  const { data } = await apiClient.post<ApiResponse<Section>>(
    "/sections",
    body,
  );
  return data;
}

export async function updateSection(
  id: number,
  body: { name?: string; courseId?: number },
) {
  const { data } = await apiClient.patch<ApiResponse<Section>>(
    `/sections/${id}`,
    body,
  );
  return data;
}

export async function deleteSection(id: number) {
  const { data } = await apiClient.delete<ApiResponse<undefined>>(
    `/sections/${id}`,
  );
  return data;
}

/* ---------- Darslar ---------- */

export async function getLessons(query: LessonsQuery = {}) {
  const { data } = await apiClient.get<PaginatedResponse<Lesson>>("/lessons", {
    params: query,
  });
  return data;
}

export async function createLesson(form: FormData) {
  const { data } = await apiClient.post<ApiResponse<Lesson>>("/lessons", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function updateLesson(id: number, form: FormData) {
  const { data } = await apiClient.patch<ApiResponse<Lesson>>(
    `/lessons/${id}`,
    form,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return data;
}

export async function deleteLesson(id: number) {
  const { data } = await apiClient.delete<ApiResponse<undefined>>(
    `/lessons/${id}`,
  );
  return data;
}

/* ---------- Dars materiallari ---------- */

export async function getMaterials(query: MaterialsQuery = {}) {
  const { data } = await apiClient.get<PaginatedResponse<Material>>(
    "/materials",
    { params: query },
  );
  return data;
}

export async function createMaterial(form: FormData) {
  const { data } = await apiClient.post<ApiResponse<Material>>(
    "/materials",
    form,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return data;
}

export async function updateMaterial(id: number, form: FormData) {
  const { data } = await apiClient.patch<ApiResponse<Material>>(
    `/materials/${id}`,
    form,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return data;
}

export async function deleteMaterial(id: number) {
  const { data } = await apiClient.delete<ApiResponse<undefined>>(
    `/materials/${id}`,
  );
  return data;
}

/* ---------- Vazifalar ---------- */

export async function getHomeworks(query: HomeworksQuery = {}) {
  const { data } = await apiClient.get<PaginatedResponse<Homework>>(
    "/homeworks",
    { params: query },
  );
  return data;
}

export async function createHomework(form: FormData) {
  const { data } = await apiClient.post<ApiResponse<Homework>>(
    "/homeworks",
    form,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return data;
}

export async function updateHomework(id: number, form: FormData) {
  const { data } = await apiClient.patch<ApiResponse<Homework>>(
    `/homeworks/${id}`,
    form,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return data;
}

export async function deleteHomework(id: number) {
  const { data } = await apiClient.delete<ApiResponse<undefined>>(
    `/homeworks/${id}`,
  );
  return data;
}

/* ---------- Testlar ---------- */

export async function getExams(query: ExamsQuery = {}) {
  const { data } = await apiClient.get<PaginatedResponse<Exam>>("/exams", {
    params: query,
  });
  return data;
}

export async function createExam(body: Omit<Exam, "id" | "create_at">) {
  const { data } = await apiClient.post<ApiResponse<Exam>>("/exams", body);
  return data;
}

export async function updateExam(
  id: number,
  body: Partial<Omit<Exam, "id" | "create_at">>,
) {
  const { data } = await apiClient.patch<ApiResponse<Exam>>(
    `/exams/${id}`,
    body,
  );
  return data;
}

export async function deleteExam(id: number) {
  const { data } = await apiClient.delete<ApiResponse<undefined>>(
    `/exams/${id}`,
  );
  return data;
}

export interface ExamCheckResult {
  total: number;
  correct: number;
  wrong: number;
  percent: number;
}

export async function checkExam(
  lessonId: number,
  answers: { examId: number; answer: string }[],
) {
  const { data } = await apiClient.post<ApiResponse<ExamCheckResult>>(
    "/exams/check",
    { lessonId, answers },
  );
  return data;
}
