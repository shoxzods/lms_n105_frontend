"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMyStudents } from "@/api/mentors";
import { createAdmin, deleteUser, getUsers, updateAdmin } from "@/api/users";
import { matchPhone, matchStartsWith } from "@/lib/search";
import { useAuthStore } from "@/store/auth";
import type {
  CreateAdminRequest,
  PaginationMeta,
  UpdateAdminRequest,
  User,
  UsersQuery,
} from "@/types";

export const usersQueryKey = (query: UsersQuery = {}) =>
  ["users", query] as const;

interface NormalizedUsers {
  users: User[];
  meta: PaginationMeta;
  /** Backend `role`/`page` parametrlarini hali qo'llamayapti */
  clientSideFallback: boolean;
}

/**
 * `GET /users` javobini jadval kutgan shaklga keltiradi.
 *
 * Backendda pagination (5b) va filtr (5c) hali yozilmagan bo'lishi mumkin.
 * Shu sabab:
 *   - `meta` bo'lmasa — mijoz tomonida hisoblanadi
 *   - javobda boshqa rollar kelsa — demak `role` inobatga olinmagan,
 *     ro'yxat shu yerda filtrlanadi
 * Backend tayyor bo'lgach bu zaxira yo'l o'z-o'zidan ishlamay qoladi.
 */
export function useUsersList(query: UsersQuery) {
  const { page = 1, limit = 10, role, search } = query;
  const userRole = useAuthStore((s) => s.user?.role);

  const result = useQuery({
    queryKey: [...usersQueryKey(query), userRole],
    queryFn: () =>
      userRole === "TEACHER"
        ? getMyStudents({ page, limit, search })
        : getUsers(query),
  });

  const raw = result.data?.data ?? [];
  const serverMeta = result.data?.meta;

  let users = raw;
  let clientSideFallback = false;

  // Backend rolni filtrlamaganmi?
  if (role && raw.some((u) => u.role !== role)) {
    users = raw.filter((u) => u.role === role);
    clientSideFallback = true;
  }

  // Qidiruv (RegExp orqali boshlang'ich qatordan va so'z boshlaridan qidirish)
  if (search && !serverMeta) {
    users = users.filter(
      (u) =>
        matchStartsWith(u.full_name, search) ||
        matchPhone(u.phone, search) ||
        matchStartsWith(u.email, search),
    );
    clientSideFallback = true;
  }

  let meta: PaginationMeta;

  if (serverMeta && !clientSideFallback) {
    meta = serverMeta;
  } else {
    const total = users.length;
    meta = {
      total,
      page,
      limit,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    };
    // Sahifani ham o'zimiz kesamiz
    users = users.slice((page - 1) * limit, page * limit);
    clientSideFallback = true;
  }

  return {
    users,
    meta,
    clientSideFallback,
    isLoading: result.isLoading,
    isError: result.isError,
    error: result.error,
    refetch: result.refetch,
  };
}

export function useUserMutations() {
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: (body: CreateAdminRequest) => createAdmin(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const update = useMutation({
    mutationFn: ({ id, ...body }: { id: number } & UpdateAdminRequest) =>
      updateAdmin(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const remove = useMutation({
    mutationFn: (id: number) => deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  return { create, update, remove };
}
