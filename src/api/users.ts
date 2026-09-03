import { apiClient } from "./client";
import type {
  ApiResponse,
  CreateAdminRequest,
  PaginatedResponse,
  UpdateAdminRequest,
  User,
  UsersQuery,
} from "@/types";

/** GET /users */
export async function getUsers(
  query: UsersQuery = {},
): Promise<PaginatedResponse<User>> {
  const { data } = await apiClient.get<PaginatedResponse<User>>("/users", {
    params: query,
  });
  return data;
}

/** POST /users/admin — multipart/form-data */
export async function createAdmin(
  payload: CreateAdminRequest,
): Promise<ApiResponse<User>> {
  const form = new FormData();
  form.append("full_name", payload.full_name);
  form.append("phone", payload.phone);
  form.append("email", payload.email);
  form.append("password", payload.password);
  if (payload.file) {
    form.append("file", payload.file);
  }

  const { data } = await apiClient.post<ApiResponse<User>>(
    "/users/admin",
    form,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return data;
}

/** PATCH /users/:id */
export async function updateAdmin(
  id: number,
  payload: UpdateAdminRequest,
): Promise<{ success: boolean; message: string }> {
  const { data } = await apiClient.patch<{ success: boolean; message: string }>(
    `/users/${id}`,
    payload,
  );
  return data;
}

/** DELETE /users/:id — faqat SUPERADMIN */
export async function deleteUser(id: number): Promise<ApiResponse<undefined>> {
  const { data } = await apiClient.delete<ApiResponse<undefined>>(
    `/users/${id}`,
  );
  return data;
}

/** GET /users/:id — faqat admin va superadmin uchun */
export async function getUser(id: number): Promise<ApiResponse<User>> {
  const { data } = await apiClient.get<ApiResponse<User>>(`/users/${id}`);
  return data;
}
