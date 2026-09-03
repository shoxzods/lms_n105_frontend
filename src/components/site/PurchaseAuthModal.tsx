"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { DeviceMobileIcon, EyeOffIcon, UserIcon } from "@/components/ui/icons";
import { register, verifyOtp } from "@/api/auth";
import { getApiErrorMessage } from "@/api/client";
import { useAuthStore } from "@/store/auth";

const BOT_USERNAME = process.env.NEXT_PUBLIC_BOT_USERNAME ?? "";
const ADMIN_TELEGRAM = process.env.NEXT_PUBLIC_ADMIN_TELEGRAM ?? "";
const CODE_LENGTH = 6;
const PHONE_PATTERN = /^\+998\d{9}$/;

function formatCode(digits: string) {
  if (digits.length <= 3) return digits;
  return `${digits.slice(0, 3)} - ${digits.slice(3)}`;
}

function SendIcon({ small = false }: { small?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={small ? "size-5" : "size-9 text-[#12b76a]"}
      aria-hidden
    >
      <path d="M21 3L3 10.5l7 3 3 7z" />
      <path d="M21 3l-11 11" />
    </svg>
  );
}

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
    </svg>
  );
}

export function PurchaseAuthModal({
  open,
  onClose,
  onAuthenticated,
}: {
  open: boolean;
  onClose: () => void;
  onAuthenticated: () => void;
}) {
  const setToken = useAuthStore((s) => s.setToken);

  const [step, setStep] = useState<"register" | "otp" | "done">("register");

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("+998");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [code, setCode] = useState("");
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (open) return;

    setStep("register");
    setFullName("");
    setPhone("+998");
    setPassword("");
    setConfirm("");
    setCode("");
    setTouched(false);
  }, [open]);

  const signUp = useMutation({
    mutationFn: () => register({ full_name: fullName.trim(), phone, password }),
    onSuccess: () => {
      setStep("otp");
      setTouched(false);
    },
  });

  const confirmCode = useMutation({
    mutationFn: () => verifyOtp({ phone, otp: code }),
    onSuccess: (data) => {
      setToken(data.accessToken, data.refreshToken);
      onAuthenticated();
      setStep("done");
    },
  });

  const nameInvalid = touched && fullName.trim().length < 3;
  const phoneInvalid = touched && !PHONE_PATTERN.test(phone);
  const passwordInvalid = touched && password.length < 8;
  const confirmInvalid = touched && confirm !== password;
  const codeInvalid = touched && code.length !== CODE_LENGTH;

  function submitRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setTouched(true);

    if (fullName.trim().length < 3) return;
    if (!PHONE_PATTERN.test(phone)) return;
    if (password.length < 8) return;
    if (confirm !== password) return;

    signUp.mutate();
  }

  function submitCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setTouched(true);

    if (code.length !== CODE_LENGTH) return;

    confirmCode.mutate();
  }

  async function pasteCode() {
    try {
      const text = await navigator.clipboard.readText();
      setCode(text.replace(/\D/g, "").slice(0, CODE_LENGTH));
    } catch {
      setTouched(true);
    }
  }

  if (step === "done") {
    return (
      <Modal open={open} title="" onClose={onClose} width={460}>
        <div className="flex flex-col items-center gap-5 pb-2 text-center">
          <span className="flex size-20 items-center justify-center rounded-full bg-[#ecfdf3]">
            <SendIcon />
          </span>

          <h3 className="text-2xl leading-8 font-bold text-page-fg">
            Ro&rsquo;yxatdan muvaffaqiyatli o&rsquo;tdingiz!
          </h3>

          <p className="text-sm leading-5 text-ink-500">
            Kursni xarid qilish uchun adminga murojaat qiling:
            <br />
            <span className="font-bold text-brand-500">@{ADMIN_TELEGRAM}</span>
          </p>

          <a
            href={`https://t.me/${ADMIN_TELEGRAM}`}
            target="_blank"
            rel="noreferrer"
            className="flex w-full items-center justify-center gap-2.5 rounded-lg bg-brand-500 py-3.5 text-base font-bold text-white transition-colors hover:bg-brand-600"
          >
            <SendIcon small />
            Telegramga o&rsquo;tish
          </a>

          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer text-sm font-medium text-ink-500 hover:text-page-fg"
          >
            Keyinroq
          </button>
        </div>
      </Modal>
    );
  }

  if (step === "otp") {
    return (
      <Modal open={open} title="Tasdiqlash kodi" onClose={onClose} width={460}>
        <form onSubmit={submitCode} className="flex flex-col gap-5">
          <Input
            id="purchase-otp"
            label="Tasdiqlash kodi"
            requiredMark
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder="0 0 0 - 0 0 0"
            value={formatCode(code)}
            onChange={(e) =>
              setCode(e.target.value.replace(/\D/g, "").slice(0, CODE_LENGTH))
            }
            rightSlot={
              <button
                type="button"
                onClick={pasteCode}
                aria-label="Kodni qoyish"
                className="cursor-pointer"
              >
                <PasteIcon />
              </button>
            }
            error={
              codeInvalid
                ? "Kod 6 ta raqamdan iborat bolsin"
                : confirmCode.isError
                  ? getApiErrorMessage(confirmCode.error, "Kod xato kiritildi")
                  : null
            }
          />

          <p className="text-center text-sm leading-5 text-ink-500">
            Tasdiqlash kodi kiritilgan telefon raqamining telegram akkaunti
            orqali telegram bot:{" "}
            <a
              href={`https://t.me/${BOT_USERNAME}`}
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-brand-500 hover:underline"
            >
              @{BOT_USERNAME}
            </a>{" "}
            dan tasdiqlash kodini oling!
          </p>

          <Button
            type="submit"
            disabled={confirmCode.isPending}
            className="w-full"
          >
            {confirmCode.isPending ? "Tekshirilmoqda..." : "Davom etish →"}
          </Button>
        </form>
      </Modal>
    );
  }

  return (
    <Modal open={open} title="Ro&rsquo;yxatdan o&rsquo;tish" onClose={onClose} width={460}>
      <form onSubmit={submitRegister} className="flex flex-col gap-5">
        <Input
          id="purchase-name"
          label="To&rsquo;liq ismingizni kiriting"
          requiredMark
          placeholder="Kiritish"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          rightSlot={<UserIcon />}
          error={nameInvalid ? "Kamida 3 ta belgi" : null}
        />

        <Input
          id="purchase-phone"
          label="Telefon raqamingiz"
          requiredMark
          inputMode="tel"
          placeholder="+998"
          value={phone}
          onChange={(e) => {
            const digits = e.target.value.replace(/\D/g, "").replace(/^998/, "");
            setPhone("+998" + digits.slice(0, 9));
          }}
          rightSlot={<DeviceMobileIcon />}
          error={phoneInvalid ? "Telefon raqam toliq emas" : null}
        />

        <Input
          id="purchase-password"
          label="Parolni kiriting"
          requiredMark
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          placeholder="********"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          rightSlot={
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label="Parolni korsatish"
              className="cursor-pointer"
            >
              <EyeOffIcon dimmed={showPassword} />
            </button>
          }
          error={passwordInvalid ? "Kamida 8 ta belgi, harf va raqam bilan" : null}
        />

        <Input
          id="purchase-confirm"
          label="Parolni tasdiqlang"
          requiredMark
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          placeholder="********"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          rightSlot={
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label="Parolni korsatish"
              className="cursor-pointer"
            >
              <EyeOffIcon dimmed={showPassword} />
            </button>
          }
          error={confirmInvalid ? "Parollar mos kelmadi" : null}
        />

        {signUp.isError && (
          <p className="text-sm font-medium text-danger-500">
            {getApiErrorMessage(signUp.error, "Royxatdan otib bolmadi")}
          </p>
        )}

        <Button type="submit" disabled={signUp.isPending} className="w-full">
          {signUp.isPending ? "Yuborilmoqda..." : "Davom etish →"}
        </Button>

        <p className="text-center text-sm text-ink-500">
          Kodni allaqachon olganmisiz?{" "}
          <button
            type="button"
            onClick={() => setStep("otp")}
            className="cursor-pointer font-semibold text-brand-500 hover:underline"
          >
            Kodni kiritish
          </button>
        </p>
      </form>
    </Modal>
  );
}
