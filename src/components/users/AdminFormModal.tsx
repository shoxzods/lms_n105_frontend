"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { EyeOffIcon } from "@/components/ui/icons";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { apiErrorMessage } from "@/lib/apiError";
import type { CreateAdminRequest, UpdateAdminRequest } from "@/types";

const PHONE_PREFIX = "+998";
const PHONE_PATTERN = /^\+998\d{9}$/;

interface BaseProps {
  open: boolean;
  onClose: () => void;
  isPending?: boolean;
  error?: unknown;
}

interface CreateProps extends BaseProps {
  mode?: "create";
  initialValues?: undefined;
  onSubmit: (values: CreateAdminRequest) => void;
}

interface EditProps extends BaseProps {
  mode: "edit";
  initialValues: { full_name: string; phone: string; email?: string | null };
  onSubmit: (values: UpdateAdminRequest) => void;
}

type AdminFormModalProps = CreateProps | EditProps;

export function AdminFormModal({
  open,
  onClose,
  onSubmit,
  isPending,
  error,
  mode = "create",
  initialValues,
}: AdminFormModalProps) {
  const isEdit = mode === "edit";

  const [fullName, setFullName] = useState(initialValues?.full_name ?? "");
  const [phone, setPhone] = useState(initialValues?.phone ?? PHONE_PREFIX);
  const [email, setEmail] = useState(initialValues?.email ?? "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState(false);

  // Modal ochilganda maydonlarni yangilash (edit rejimi uchun muhim)
  useEffect(() => {
    if (open) {
      setFullName(initialValues?.full_name ?? "");
      setPhone(initialValues?.phone ?? PHONE_PREFIX);
      setEmail(initialValues?.email ?? "");
      setPassword("");
      setTouched(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const nameInvalid = touched && fullName.trim().length < 3;
  const phoneInvalid = touched && !PHONE_PATTERN.test(phone);
  const emailInvalid =
    touched &&
    email.trim().length > 0 &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const passwordInvalid = !isEdit && touched && password.length < 6;

  function handlePhoneChange(value: string) {
    const digits = value.replace(/\D/g, "").replace(/^998/, "");
    setPhone(PHONE_PREFIX + digits.slice(0, 9));
  }

  function handleClose() {
    setTouched(false);
    onClose();
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setTouched(true);

    const emailOk =
      email.trim().length === 0 ||
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

    if (fullName.trim().length < 3 || !PHONE_PATTERN.test(phone) || !emailOk) {
      return;
    }

    if (isEdit) {
      const body: UpdateAdminRequest = {
        full_name: fullName.trim(),
        phone,
        email: email.trim() || undefined,
      };
      (onSubmit as (v: UpdateAdminRequest) => void)(body);
    } else {
      if (password.length < 6) return;
      const body: CreateAdminRequest = {
        full_name: fullName.trim(),
        phone,
        email: email.trim() || undefined,
        password,
      };
      (onSubmit as (v: CreateAdminRequest) => void)(body);
    }
  }

  return (
    <Modal
      open={open}
      title={isEdit ? "Tahrirlash" : "Qo'shish"}
      onClose={handleClose}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          id="admin_full_name"
          label="F.I.Sh"
          placeholder="Kiriting"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          error={nameInvalid ? "To'liq kiritilmadi" : null}
        />

        <Input
          id="admin_phone"
          label="Telefon raqami"
          inputMode="tel"
          value={phone}
          onChange={(e) => handlePhoneChange(e.target.value)}
          error={phoneInvalid ? "Telefon raqam to'liq emas" : null}
        />

        <Input
          id="admin_email"
          label="Elektron pochta (Email)"
          type="email"
          placeholder="admin@example.com"
          value={email ?? ""}
          onChange={(e) => setEmail(e.target.value)}
          error={emailInvalid ? "Email formati noto'g'ri" : null}
        />

        {!isEdit && (
          <Input
            id="admin_password"
            label="Parol"
            type={showPassword ? "text" : "password"}
            placeholder="******"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            rightSlot={
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Yashirish" : "Ko'rsatish"}
                className="cursor-pointer text-ink-400 hover:text-ink-600"
              >
                <EyeOffIcon dimmed={showPassword} />
              </button>
            }
            error={passwordInvalid ? "Kamida 6 ta belgi" : null}
          />
        )}

        {error ? (
          <p className="text-sm font-medium text-danger-500">
            {apiErrorMessage(error)}
          </p>
        ) : null}

        <Button
          type="submit"
          disabled={isPending}
          className="self-start min-w-[120px]"
          leftIcon={
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-4"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          }
        >
          {isPending ? "Saqlanmoqda..." : "Saqlash"}
        </Button>
      </form>
    </Modal>
  );
}
