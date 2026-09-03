"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useVerifyOtp } from "@/hooks/useVerifyOtp";

const CODE_LENGTH = 6;
const RESEND_SECONDS = 46;

function formatTime(total: number) {
  const minutes = String(Math.floor(total / 60)).padStart(2, "0");
  const seconds = String(total % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}

/** Figma da kod "125 - 255" ko'rinishida yoziladi */
function formatCode(digits: string) {
  if (digits.length <= 3) return digits;
  return `${digits.slice(0, 3)} - ${digits.slice(3)}`;
}

/** Buferdan qo'yish ikonkasi (Figma: maydonning o'ng chekkasida) */
function PasteIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-4 text-ink-500"
      aria-hidden
    >
      <path d="M9.5 2.5h2a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-7a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1h2" />
      <rect x="6" y="1.5" width="4" height="2.5" rx=".8" />
      <path d="M6.5 8.5h3M6.5 10.5h3" />
    </svg>
  );
}

/**
 * Figma: "OTP" (517:22427).
 *
 * Ikkala oqim ham shu ekrandan o'tadi, `mode` bilan ajratiladi:
 *   /otp?mode=register  → ro'yxatdan o'tishni tasdiqlash
 *   /otp?mode=reset     → parolni tiklash, keyin /reset-password
 *
 * Ro'yxatdan o'tish oqimi `POST /auth/verify-otp` ga ulangan — kod to'g'ri
 * bo'lsa hisob faollashadi va foydalanuvchi darrov tizimga kiradi.
 *
 * Parolni tiklashda kod shu yerda tekshirilmaydi — telefon bilan birga
 * /reset-password ga uzatiladi va u yerda yangi parol bilan yuboriladi.
 * Backend kodni o'sha paytda tekshiradi.
 */
export function OtpForm() {
  const router = useRouter();
  const params = useSearchParams();
  const mode = params.get("mode") === "register" ? "register" : "reset";
  const phone = params.get("phone") ?? "";

  const { submit, isPending, errorMessage } = useVerifyOtp();

  const [code, setCode] = useState("");
  const [touched, setTouched] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setSecondsLeft((value) => (value <= 1 ? 0 : value - 1));
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const codeInvalid = touched && code.length !== CODE_LENGTH;
  const canResend = secondsLeft === 0;

  function handleCodeChange(value: string) {
    setCode(value.replace(/\D/g, "").slice(0, CODE_LENGTH));
  }

  async function handlePaste() {
    try {
      const text = await navigator.clipboard.readText();
      handleCodeChange(text);
    } catch {
      // brauzer ruxsat bermasa — qo'lda kiritiladi
    }
  }

  function handleResend() {
    if (!canResend) return;
    setSecondsLeft(RESEND_SECONDS);
    // TODO: POST /auth/otp/resend — backend tayyor bo'lgach
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setTouched(true);

    if (code.length !== CODE_LENGTH) return;

    /* Parolni tiklashda kod keyingi ekranga uzatiladi */
    if (mode === "reset") {
      router.push(
        `/reset-password?phone=${encodeURIComponent(phone)}&otp=${code}`,
      );
      return;
    }

    submit({ phone, otp: code });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-[380px] max-w-full flex-col gap-6"
    >
      <h1 className="text-center text-[32px] font-bold text-page-fg">
        Tasdiqlash kodi
      </h1>

      <Input
        id="otp"
        label="Tasdiqlash kodi"
        requiredMark
        inputMode="numeric"
        autoComplete="one-time-code"
        placeholder="0 0 0 - 0 0 0"
        value={formatCode(code)}
        onChange={(e) => handleCodeChange(e.target.value)}
        rightSlot={
          <button
            type="button"
            onClick={handlePaste}
            aria-label="Kodni buferdan qo'yish"
            className="cursor-pointer"
          >
            <PasteIcon />
          </button>
        }
        error={
          codeInvalid ? "Kod 6 ta raqamdan iborat bo'lsin" : errorMessage
        }
      />

      <div className="flex w-full flex-col items-center gap-3">
        <span className="flex h-[33px] w-[73px] items-center justify-center rounded-md bg-auth-hero text-sm font-medium text-page-fg">
          {formatTime(secondsLeft)}
        </span>

        <button
          type="button"
          onClick={handleResend}
          disabled={!canResend}
          className="text-sm font-medium text-page-fg enabled:cursor-pointer enabled:hover:underline disabled:cursor-not-allowed disabled:text-ink-500"
        >
          Kodni qayta yuborish
        </button>
      </div>

      <Button type="submit" pill disabled={isPending} className="w-full">
        {isPending ? "Tekshirilmoqda..." : "Davom etish"}
      </Button>
    </form>
  );
}
