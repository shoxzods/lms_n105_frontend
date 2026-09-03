import { apiClient } from "./client";
import type {
  ApiResponse,
  Assistant,
  AssistantsQuery,
  PaginatedResponse,
} from "@/types";

/** GET /assistant */
export async function getAssistants(
  query: AssistantsQuery = {},
): Promise<PaginatedResponse<Assistant>> {
  const { data } = await apiClient.get<PaginatedResponse<Assistant>>(
    "/assistant",
    { params: query },
  );
  return data;
}

/** POST /assistant — multipart/form-data */
export async function createAssistant(payload: {
  full_name: string;
  phone: string;
  password: string;
  courseId: number;
}): Promise<ApiResponse<Assistant>> {
  const form = new FormData();
  form.append("full_name", payload.full_name);
  form.append("phone", payload.phone);
  form.append("password", payload.password);
  form.append("courseId", String(payload.courseId));

  const { data } = await apiClient.post<ApiResponse<Assistant>>(
    "/assistant",
    form,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return data;
}

/** DELETE /assistant/:id — faqat SUPERADMIN */
export async function deleteAssistant(
  id: number,
): Promise<ApiResponse<undefined>> {
  const { data } = await apiClient.delete<ApiResponse<undefined>>(
    `/assistant/${id}`,
  );
  return data;
}
