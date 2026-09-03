import { apiClient } from "./client";
import type {
  ApiResponse,
  CategoriesQuery,
  Category,
  PaginatedResponse,
} from "@/types";

/** GET /categories */
export async function getCategories(
  query: CategoriesQuery = {},
): Promise<PaginatedResponse<Category>> {
  const { data } = await apiClient.get<PaginatedResponse<Category>>(
    "/categories",
    { params: query },
  );
  return data;
}

/** POST /categories */
export async function createCategory(
  name: string,
): Promise<ApiResponse<Category>> {
  const { data } = await apiClient.post<ApiResponse<Category>>("/categories", {
    name,
  });
  return data;
}

/** PATCH /categories/:id */
export async function updateCategory(
  id: number,
  name: string,
): Promise<ApiResponse<Category>> {
  const { data } = await apiClient.patch<ApiResponse<Category>>(
    `/categories/${id}`,
    { name },
  );
  return data;
}

/** DELETE /categories/:id */
export async function deleteCategory(
  id: number,
): Promise<ApiResponse<undefined>> {
  const { data } = await apiClient.delete<ApiResponse<undefined>>(
    `/categories/${id}`,
  );
  return data;
}
