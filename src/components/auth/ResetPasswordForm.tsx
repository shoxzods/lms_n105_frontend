"use client";

import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { EyeOffIcon } from "@/components/ui/icons";
import { resetPassword } from "@/lib/api/auth";
import { getApiErrorMessage } from "@/lib/api/client";

/**
 * Figma: "Reset password" (517:22544).
 *
 * Telefon va Telegramdan kelgan kod oldingi ekrandan (/otp?mode=reset)
 * URL orqali keladi. Backend kodni yana bir bor tekshiradi — HTTP oldingi
 * qadamni eslab qolmaydi, shuning uchun ishonch faqat kodga bo'ladi.
 */
export function ResetPasswordForm() {
  const router = useRouter();
  const params = useSearchParams();

  const phone = params.get("phone") ?? "";
  const otp = params.get("otp") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState(false);

  const mutation = useMutation({
    mutationFn: () => resetPassword({ phone, otp, password }),
    onSuccess: () => router.replace("/login"),
  });

  const passwordInvalid = touched && password.length < 6;
  const confirmInvalid = touched && confirm !== password;
  const ready = Boolean(phone && otp);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setTouched(true);

    if (password.length < 6 || confirm !== password) return;

    mutation.mutate();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-[380px] max-w-full flex-col gap-6"
    >
      <h1 className="text-center text-[32px] font-bold text-page-fg">
        Parolni qayta tiklash
      </h1>

      {!ready && (
        <p className="text-center text-[15px] font-medium text-danger-500">
          Avval telefon raqamingizni tasdiqlang
        </p>
      )}

      <Input
        id="new_password"
        label="Yangi parolni kiriting"
        type={showPassword ? "text" : "password"}
        autoComplete="new-password"
        placeholder="********"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        rightSlot={
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={
              showPassword ? "Parolni yashirish" : "Parolni ko'rsatish"
            }
            className="cursor-pointer"
          >
            <EyeOffIcon dimmed={showPassword} />
          </button>
        }
        error={
          passwordInvalid ? "Parol kamida 6 ta belgidan iborat bo'lsin" : null
        }
      />

      <Input
        id="confirm_password"
        label="Yangi parolni tasdiqlang"
        type={showPassword ? "text" : "password"}
        autoComplete="new-password"
        placeholder="********"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        error={confirmInvalid ? "Parollar mos kelmadi" : null}
      />

      {mutation.isError && (
        <p className="text-center text-[15px] font-medium text-danger-500">
          {getApiErrorMessage(mutation.error, "Parolni o'zgartirib bo'lmadi")}
        </p>
      )}

      <Button
        type="submit"
        pill
        disabled={mutation.isPending || !ready}
        className="w-full"
      >
        {mutation.isPending ? "Saqlanmoqda..." : "Saqlash"}
      </Button>
    </form>
  );
}
