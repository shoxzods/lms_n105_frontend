"use client";

import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { DeviceMobileIcon, EyeOffIcon } from "@/components/ui/icons";
import { resetPassword } from "@/api/auth";
import { getApiErrorMessage } from "@/api/client";
import { normalizePhone } from "@/lib/format";

const PHONE_PREFIX = "+998";
const PHONE_PATTERN = /^\+998\d{9}$/;

export function ResetPasswordForm() {
  const router = useRouter();
  const params = useSearchParams();

  const urlPhone = normalizePhone(params.get("phone") ?? "");
  const urlOtp = params.get("otp") ?? "";

  const [phone, setPhone] = useState(urlPhone || PHONE_PREFIX);
  const [otp, setOtp] = useState(urlOtp);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState(false);

  const mutation = useMutation({
    mutationFn: () => resetPassword({ phone, otp, password }),
    onSuccess: () => router.replace("/login"),
  });

  const phoneInvalid = touched && !PHONE_PATTERN.test(phone);
  const otpInvalid = touched && otp.trim().length !== 6;
  const passwordInvalid = touched && password.length < 6;
  const confirmInvalid = touched && confirm !== password;

  const showPhoneInput = !urlPhone || !PHONE_PATTERN.test(urlPhone);
  const showOtpInput = !urlOtp || urlOtp.trim().length !== 6;

  function handlePhoneChange(value: string) {
    const digits = value.replace(/\D/g, "").replace(/^998/, "");
    setPhone(PHONE_PREFIX + digits.slice(0, 9));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setTouched(true);

    if (!PHONE_PATTERN.test(phone)) return;
    if (otp.trim().length !== 6) return;
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

      {showPhoneInput && (
        <Input
          id="reset_phone"
          label="Telefon raqamingiz"
          inputMode="tel"
          autoComplete="tel"
          value={phone}
          onChange={(e) => handlePhoneChange(e.target.value)}
          rightSlot={<DeviceMobileIcon />}
          error={
            phoneInvalid
              ? "Telefon raqamingizni to'liq kiriting (+998XXXXXXXXX)"
              : null
          }
        />
      )}

      {showOtpInput && (
        <Input
          id="reset_otp"
          label="Tasdiqlash kodi (OTP)"
          inputMode="numeric"
          placeholder="123456"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
          error={otpInvalid ? "Tasdiqlash kodini kiriting (6 ta raqam)" : null}
        />
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
        disabled={mutation.isPending}
        className="w-full"
      >
        {mutation.isPending ? "Saqlanmoqda..." : "Saqlash"}
      </Button>
    </form>
  );
}
