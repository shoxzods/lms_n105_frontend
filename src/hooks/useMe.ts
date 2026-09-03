"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUser, updateAdmin } from "@/lib/api/users";
import { getMyMentorProfile, updateMyMentorProfile } from "@/lib/api/mentors";
import { useAuthStore } from "@/store/auth";
import type { User } from "@/types";

/**
 * Joriy foydalanuvchining ma'lumoti.
 *
 * Backendda ikki xil yo'l bor:
 *   - admin/superadmin  -> GET /users/:id   (id tokendan olinadi)
 *   - mentor            -> GET /mentor/profile
 *
 * Student va assistent uchun alohida endpoint yo'q — ular uchun tokendagi
 * ma'lumot bilan cheklanamiz.
 */
export function useMe() {
  const user = useAuthStore((s) => s.user);

  const isAdmin = user?.role === "SUPERADMIN" || user?.role === "ADMIN";
  const isMentor = user?.role === "TEACHER";

  const result = useQuery({
    queryKey: ["me", user?.id, user?.role],
    queryFn: async () => {
      if (isMentor) return (await getMyMentorProfile()).data as User;
      return (await getUser(user!.id)).data;
    },
    enabled: Boolean(user) && (isAdmin || isMentor),
  });

  return {
    me: result.data ?? null,
    tokenUser: user,
    isLoading: result.isLoading,
    isError: result.isError,
    error: result.error,
    /** Ma'lumotni serverdan olib bo'lmasa — tokendagi nom ishlatiladi */
    canFetch: isAdmin || isMentor,
  };
}

/** Shaxsiy ma'lumotlarni saqlash */
export function useUpdateMe() {
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();

  const isMentor = user?.role === "TEACHER";

  return useMutation({
    mutationFn: async (body: {
      full_name?: string;
      phone?: string;
      email?: string;
    }) => {
      /* Ikki endpointning javob shakli biroz farq qiladi — bir xillashtiramiz */
      if (isMentor) {
        await updateMyMentorProfile(body as Record<string, string>);
      } else {
        await updateAdmin(user!.id, body);
      }

      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}
