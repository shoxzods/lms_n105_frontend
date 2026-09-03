"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { login } from "@/api/auth";
import { getApiErrorMessage } from "@/api/client";
import { useAuthStore } from "@/store/auth";
import type { LoginRequest } from "@/types";

export function useLogin() {
  const router = useRouter();
  const setToken = useAuthStore((s) => s.setToken);

  const mutation = useMutation({
    mutationFn: (payload: LoginRequest) => login(payload),
    onSuccess: (data) => {
      setToken(data.accessToken, data.refreshToken);
      router.replace("/dashboard");
    },
  });

  return {
    submit: mutation.mutate,
    isPending: mutation.isPending,
    errorMessage: mutation.isError
      ? getApiErrorMessage(mutation.error, "Login yoki parol xato kiritildi")
      : null,
    isPaymentPending:
      mutation.isError &&
      getApiErrorMessage(mutation.error, "").includes("tasdiqlanmagan"),
  };
}
