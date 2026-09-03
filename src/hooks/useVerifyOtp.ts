"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { verifyOtp } from "@/api/auth";
import { getApiErrorMessage } from "@/api/client";
import { useAuthStore } from "@/store/auth";
import type { VerifyOtpRequest } from "@/types";

/**
 * Telegram botdan kelgan kodni tasdiqlaydi.
 *
 * Backend kod to'g'ri bo'lsa `User.status` ni `ACTIVE` qiladi va
 * `accessToken` beradi — ya'ni foydalanuvchi shu yerdayoq tizimga kiradi.
 */
export function useVerifyOtp() {
  const router = useRouter();
  const setToken = useAuthStore((s) => s.setToken);

  const mutation = useMutation({
    mutationFn: (payload: VerifyOtpRequest) => verifyOtp(payload),
    onSuccess: (data) => {
      setToken(data.accessToken, data.refreshToken);
      router.replace("/my-courses");
    },
  });

  return {
    submit: mutation.mutate,
    isPending: mutation.isPending,
    errorMessage: mutation.isError
      ? getApiErrorMessage(mutation.error, "Kod xato kiritildi")
      : null,
  };
}
