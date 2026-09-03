"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { SuccessDialog } from "@/components/ui/SuccessDialog";
import { DeviceMobileIcon, EyeOffIcon, UserIcon } from "@/components/ui/icons";
import { useRegister } from "@/hooks/useRegister";

const PHONE_PREFIX = "+998";
const PHONE_PATTERN = /^\+998\d{9}$/;

/**
 * Figma: "Registration" (517:22310).
 *
 * Backend: POST /auth/register — rolni server o'zi STUDENT qilib qo'yadi.
 *
 * DIQQAT: dizaynda "Davom etish" tugmasidan keyin OTP ekrani turadi, lekin
 * backendda OTP moduli hali yo'q. Shu sabab hozircha to'g'ridan-to'g'ri
 * muvaffaqiyat oynasi chiqadi. OTP tayyor bo'lganda oraga /otp qo'shiladi.
 */
export function RegisterForm() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState(PHONE_PREFIX);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [touched, setTouched] = useState(false);
  const [done, setDone] = useState(false);

  const { submit, isPending, errorMessage } = useRegister(() => setDone(true));

  const nameInvalid = touched && fullName.trim().length < 3;
  const phoneInvalid = touched && !PHONE_PATTERN.test(phone);
  const passwordInvalid = touched && password.length < 6;
  const confirmInvalid = touched && confirm !== password;

  function handlePhoneChange(value: string) {
    const digits = value.replace(/\D/g, "").replace(/^998/, "");
    setPhone(PHONE_PREFIX + digits.slice(0, 9));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setTouched(true);

    if (fullName.trim().length < 3) return;
    if (!PHONE_PATTERN.test(phone)) return;
    if (password.length < 6) return;
    if (confirm !== password) return;

    submit({ full_name: fullName.trim(), phone, password });
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="flex w-[380px] max-w-full flex-col gap-6"
      >
        <h1 className="text-center text-[32px] font-bold text-page-fg">
          Ro&rsquo;yxatdan o&rsquo;tish
        </h1>

        <Input
          id="full_name"
          label="To&rsquo;liq ismingizni kiriting"
          requiredMark
          autoComplete="name"
          placeholder="Kiritish"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          rightSlot={<UserIcon />}
          error={nameInvalid ? "Kamida 3 ta belgi kiriting" : null}
        />

        <Input
          id="phone"
          label="Telefon raqamingiz"
          requiredMark
          inputMode="tel"
          autoComplete="tel"
          value={phone}
          onChange={(e) => handlePhoneChange(e.target.value)}
          rightSlot={<DeviceMobileIcon />}
          error={phoneInvalid ? "Telefon raqam to'liq kiritilmadi" : null}
        />

        <Input
          id="password"
          label="Parolni kiriting"
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
          label="Parolni tasdiqlang"
          type={showConfirm ? "text" : "password"}
          autoComplete="new-password"
          placeholder="********"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          rightSlot={
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              aria-label={
                showConfirm ? "Parolni yashirish" : "Parolni ko'rsatish"
              }
              className="cursor-pointer"
            >
              <EyeOffIcon dimmed={showConfirm} />
            </button>
          }
          error={confirmInvalid ? "Parollar mos kelmadi" : null}
        />

        {errorMessage && (
          <p className="text-center text-[15px] font-medium text-danger-500">
            {errorMessage}
          </p>
        )}

        <Button type="submit" pill disabled={isPending} className="w-full">
          {isPending ? "Yuborilmoqda..." : "Davom etish"}
        </Button>

        <p className="text-center text-sm font-medium text-ink-500">
          Menda hisob mavjud!{" "}
          <Link
            href="/login"
            className="font-semibold text-brand-500 hover:underline"
          >
            Kirish
          </Link>
        </p>
      </form>

      <SuccessDialog
        open={done}
        message="Muvaffaqiyatli ro’yxatdan o’tdingiz"
        actionLabel="Davom etish"
        onClose={() =>
          router.replace(
            `/otp?mode=register&phone=${encodeURIComponent(phone)}`,
          )
        }
      />
    </>
  );
}
