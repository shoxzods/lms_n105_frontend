import { apiClient } from "./client";
import type {
  ApiResponse,
  Mentor,
  MentorProfile,
  MentorsQuery,
  PaginatedResponse,
} from "@/types";

/**
 * Backend javobida profil `mentorProfile` yoki `mentor` kaliti bilan
 * kelishi mumkin (schema ko'chirish davom etmoqda) — qaysi biri
 * bo'lsa o'shani oladi.
 */
export function mentorProfileOf(mentor: Mentor): MentorProfile | null {
  const list = mentor.mentor ?? mentor.mentorProfile ?? [];
  return list[0] ?? null;
}

/** GET /mentor */
export async function getMentors(
  query: MentorsQuery = {},
): Promise<PaginatedResponse<Mentor>> {
  const { data } = await apiClient.get<PaginatedResponse<Mentor>>("/mentor", {
    params: query,
  });
  return data;
}

/** DELETE /mentor/:id — faqat SUPERADMIN */
export async function deleteMentor(
  id: number,
): Promise<ApiResponse<undefined>> {
  const { data } = await apiClient.delete<ApiResponse<undefined>>(
    `/mentor/${id}`,
  );
  return data;
}

/** GET /mentor/profile — mentor o'z ma'lumotini shu yerdan oladi */
export async function getMyMentorProfile(): Promise<ApiResponse<Mentor>> {
  const { data } = await apiClient.get<ApiResponse<Mentor>>("/mentor/profile");
  return data;
}

/** PATCH /mentor/profile */
export async function updateMyMentorProfile(
  body: Record<string, string>,
): Promise<ApiResponse<Mentor>> {
  const { data } = await apiClient.patch<ApiResponse<Mentor>>(
    "/mentor/profile",
    body,
  );
  return data;
}

/** POST /mentor/create — multipart, rasm ixtiyoriy */
export async function createMentor(form: FormData): Promise<ApiResponse<Mentor>> {
  const { data } = await apiClient.post<ApiResponse<Mentor>>(
    "/mentor/create",
    form,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return data;
}

/** PATCH /mentor/:id — SUPERADMIN va ADMIN uchun, multipart */
export async function updateMentor(
  id: number,
  form: FormData,
): Promise<ApiResponse<Mentor>> {
  const { data } = await apiClient.patch<ApiResponse<Mentor>>(
    `/mentor/${id}`,
    form,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return data;
}

/** GET /mentor/my-students — o'qituvchining o'z kurslaridagi talabalari */
export async function getMyStudents(
  query: { page?: number; limit?: number; search?: string } = {},
): Promise<PaginatedResponse<any>> {
  const { data } = await apiClient.get<PaginatedResponse<any>>(
    "/mentor/my-students",
    { params: query },
  );
  return data;
}

/** GET /mentor/my-assistants — o'qituvchining o'z kurslaridagi assistentlari */
export async function getMyAssistants(
  query: { page?: number; limit?: number; search?: string } = {},
): Promise<PaginatedResponse<any>> {
  const { data } = await apiClient.get<PaginatedResponse<any>>(
    "/mentor/my-assistants",
    { params: query },
  );
  return data;
}

