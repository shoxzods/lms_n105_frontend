import { apiClient } from "./client";
import type {
  ApiResponse,
  ExamResultDetail,
  ExamResultItem,
  ExamResultStats,
  ExamResultsQuery,
  PaginatedResponse,
} from "@/types";

export interface ExamResultsMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  passedCount?: number;
  failedCount?: number;
}

export interface ExamResultsResponse extends PaginatedResponse<ExamResultItem> {
  meta?: ExamResultsMeta;
}

/**
 * Admin, Superadmin, Mentor uchun barcha talabalar natijalari
 */
export async function getExamResults(query: ExamResultsQuery = {}) {
  const { data } = await apiClient.get<ExamResultsResponse>(
    "/exams/results",
    { params: query },
  );
  return data;
}

/**
 * Student uchun uning shaxsiy test natijalari tarixi
 */
export async function getMyExamResults(query: ExamResultsQuery = {}) {
  const { data } = await apiClient.get<PaginatedResponse<ExamResultItem>>(
    "/exams/results/my",
    { params: query },
  );
  return data;
}

/**
 * Imtihon natijalari bo'yicha umumiy statistika
 */
export async function getExamResultStats() {
  const { data } = await apiClient.get<ApiResponse<ExamResultStats>>(
    "/exams/results/stats",
  );
  return data;
}

/**
 * Bitta imtihon natijasini batafsil (savol va javoblar bilan) ko'rish
 */
export async function getExamResultById(id: number) {
  const { data } = await apiClient.get<ApiResponse<ExamResultDetail>>(
    `/exams/results/${id}`,
  );
  return data;
}

/**
 * Imtihon natijasini o'chirish (Admin/Superadmin)
 */
export async function deleteExamResult(id: number) {
  const { data } = await apiClient.delete<ApiResponse<undefined>>(
    `/exams/results/${id}`,
  );
  return data;
}
