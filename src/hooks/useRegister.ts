"use client";

import { useMutation } from "@tanstack/react-query";
import { register } from "@/lib/api/auth";
import { getApiErrorMessage } from "@/lib/api/client";
import type { RegisterRequest } from "@/types";

/**
 * Ro'yxatdan o'tgach foydalanuvchi darrov ichkariga kirmaydi: backend
 * hisobni `PENDING` qilib yaratadi va token bermaydi. Token faqat
 * Telegram kodi tasdiqlangach beriladi.
 */
export function useRegister(onDone: () => void) {
  const mutation = useMutation({
    mutationFn: (payload: RegisterRequest) => register(payload),
    onSuccess: onDone,
  });

  return {
    submit: mutation.mutate,
    isPending: mutation.isPending,
    errorMessage: mutation.isError
      ? getApiErrorMessage(
          mutation.error,
          "Ro'yxatdan o'tishda xatolik yuz berdi",
        )
      : null,
  };
}
