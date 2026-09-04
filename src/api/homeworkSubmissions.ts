import { apiClient } from "./client";
import type {
  ApiResponse,
  HomeworkSubmission,
  HomeworkSubmissionsQuery,
  PaginatedResponse,
} from "@/types";

/**
 * Talaba vazifa topshirishi (Submit homework)
 */
export async function submitHomework(
  formData: FormData,
): Promise<HomeworkSubmission> {
  const { data } = await apiClient.post<ApiResponse<HomeworkSubmission>>(
    "/homeworks/submit",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );
  return data.data;
}

/**
 * Talabaning o'z topshirgan vazifalarini olish
 */
export async function getMyHomeworkSubmissions(
  lessonId?: number,
): Promise<HomeworkSubmission[]> {
  const { data } = await apiClient.get<ApiResponse<HomeworkSubmission[]>>(
    "/homeworks/my-submissions",
    {
      params: lessonId ? { lessonId } : undefined,
    },
  );
  return data.data ?? [];
}

/**
 * O'qituvchi/Admin uchun topshirilgan barcha vazifalar ro'yxati
 */
export async function getHomeworkSubmissions(
  params?: HomeworkSubmissionsQuery,
): Promise<PaginatedResponse<HomeworkSubmission>> {
  const { data } = await apiClient.get<PaginatedResponse<HomeworkSubmission>>(
    "/homeworks/submissions",
    { params },
  );
  return data;
}

/**
 * Bitta topshirilgan vazifani olish
 */
export async function getHomeworkSubmission(
  id: number,
): Promise<HomeworkSubmission> {
  const { data } = await apiClient.get<ApiResponse<HomeworkSubmission>>(
    `/homeworks/submissions/${id}`,
  );
  return data.data;
}

/**
 * O'qituvchi tomonidan vazifani baholash (Grade submission)
 */
export async function gradeHomeworkSubmission(
  id: number,
  formData: FormData,
): Promise<HomeworkSubmission> {
  const { data } = await apiClient.post<ApiResponse<HomeworkSubmission>>(
    `/homeworks/submissions/${id}/grade`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );
  return data.data;
}

/**
 * Topshirilgan vazifani o'chirish
 */
export async function deleteHomeworkSubmission(id: number): Promise<void> {
  await apiClient.delete(`/homeworks/submissions/${id}`);
}
