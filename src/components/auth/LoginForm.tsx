"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { DeviceMobileIcon, EyeOffIcon } from "@/components/ui/icons";
import { useLogin } from "@/hooks/useLogin";

const ADMIN_TELEGRAM = process.env.NEXT_PUBLIC_ADMIN_TELEGRAM ?? "";

const PHONE_PREFIX = "+998";
const PHONE_PATTERN = /^\+998\d{9}$/;

export function LoginForm() {
  const [phone, setPhone] = useState(PHONE_PREFIX);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState(false);

  const { submit, isPending, errorMessage, isPaymentPending } = useLogin();

  const phoneInvalid = touched && !PHONE_PATTERN.test(phone);
  const passwordInvalid = touched && password.length < 6;

  function handlePhoneChange(value: string) {
    // "+998" prefiksini o'chirib bo'lmaydi, keyin faqat raqam
    const digits = value.replace(/\D/g, "").replace(/^998/, "");
    setPhone(PHONE_PREFIX + digits.slice(0, 9));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setTouched(true);

    if (!PHONE_PATTERN.test(phone) || password.length < 6) return;

    submit({ phone, password });
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-[380px] max-w-full flex-col gap-6">
      <h1 className="text-center text-[32px] font-bold text-page-fg">Kirish</h1>

      <Input
        id="phone"
        label="Telefon raqamingiz"
        inputMode="tel"
        autoComplete="tel"
        value={phone}
        onChange={(e) => handlePhoneChange(e.target.value)}
        rightSlot={<DeviceMobileIcon />}
        error={
          phoneInvalid
            ? "Telefon raqam to'liq kiritilmadi"
            : errorMessage && !isPaymentPending
              ? "Login yoki parol xato kiritildi"
              : null
        }
      />

      <div className="flex w-full flex-col items-end gap-2.5">
        <Input
          id="password"
          label="Parol"
          type={showPassword ? "text" : "password"}
          autoComplete="current-password"
          placeholder="********"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          rightSlot={
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Parolni yashirish" : "Parolni ko'rsatish"}
              className="cursor-pointer"
            >
              <EyeOffIcon dimmed={showPassword} />
            </button>
          }
          error={
            passwordInvalid
              ? "Parol kamida 6 ta belgidan iborat bo'lsin"
              : errorMessage && !isPaymentPending
                ? "Login yoki parol xato kiritildi"
                : null
          }
        />

        <Link
          href={`/otp?mode=reset&phone=${encodeURIComponent(phone)}`}
          className="text-sm font-medium text-brand-600 hover:underline"
        >
          Parolni unutdingizmi?
        </Link>
      </div>

      {isPaymentPending && (
        <p className="rounded-lg border border-danger-500 bg-[#fef3f2] px-4 py-3 text-sm leading-5 font-medium text-danger-500">
          {errorMessage} Adminga murojaat:{" "}
          <a
            href={`https://t.me/${ADMIN_TELEGRAM}`}
            target="_blank"
            rel="noreferrer"
            className="font-bold underline"
          >
            @{ADMIN_TELEGRAM}
          </a>
        </p>
      )}

      <Button type="submit" pill disabled={isPending} className="w-full">
        {isPending ? "Yuklanmoqda..." : "Kirish"}
      </Button>

      <p className="text-center text-sm font-medium text-ink-500">
        Menda hisob mavjud emas!{" "}
        <Link href="/register" className="font-semibold text-brand-500 hover:underline">
          Ro&rsquo;yxatdan o&rsquo;tish
        </Link>
      </p>
    </form>
  );
}
