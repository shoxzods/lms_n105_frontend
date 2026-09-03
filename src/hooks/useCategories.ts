"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "@/api/categories";
import type { CategoriesQuery, PaginationMeta } from "@/types";

export const categoriesQueryKey = (query: CategoriesQuery = {}) =>
  ["categories", query] as const;

/**
 * `GET /categories` — backendda sahifalash, qidiruv va `meta` bor,
 * shuning uchun `useUsers` dagi kabi zaxira mantiq kerak emas.
 */
export function useCategoriesList(query: CategoriesQuery) {
  const { page = 1, limit = 10 } = query;

  const result = useQuery({
    queryKey: categoriesQueryKey(query),
    queryFn: () => getCategories(query),
  });

  const categories = result.data?.data ?? [];

  const meta: PaginationMeta = result.data?.meta ?? {
    total: categories.length,
    page,
    limit,
    totalPages: 1,
  };

  return {
    categories,
    meta,
    isLoading: result.isLoading,
    isError: result.isError,
    error: result.error,
  };
}

/** Yaratish / tahrirlash / o'chirish — muvaffaqiyatdan keyin ro'yxat yangilanadi */
export function useCategoryMutations() {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["categories"] });
  };

  const create = useMutation({
    mutationFn: (name: string) => createCategory(name),
    onSuccess: invalidate,
  });

  const update = useMutation({
    mutationFn: ({ id, name }: { id: number; name: string }) =>
      updateCategory(id, name),
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: (id: number) => deleteCategory(id),
    onSuccess: invalidate,
  });

  return { create, update, remove };
}
