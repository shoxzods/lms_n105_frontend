"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { EyeOffIcon } from "@/components/ui/icons";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import { usePublicCourses } from "@/hooks/usePublic";
import { apiErrorMessage } from "@/lib/apiError";

const PHONE_PREFIX = "+998";
const PHONE_PATTERN = /^\+998\d{9}$/;

export interface AssistantFormValues {
  full_name: string;
  phone: string;
  password: string;
  courseId: number;
}

/** Figma: "Qo'shish" modali — F.I.SH, Telefon, Kurs biriktirish, Parol */
export function AssistantFormModal({
  open,
  onClose,
  onSubmit,
  isPending,
  error,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: AssistantFormValues) => void;
  isPending?: boolean;
  error?: unknown;
}) {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState(PHONE_PREFIX);
  const [password, setPassword] = useState("");
  const [courseId, setCourseId] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState(false);

  const { courses } = usePublicCourses({ limit: 100 });

  const nameInvalid = touched && fullName.trim().length < 3;
  const phoneInvalid = touched && !PHONE_PATTERN.test(phone);
  const passwordInvalid = touched && password.length < 6;
  const courseInvalid = touched && !courseId;

  function handlePhoneChange(value: string) {
    const digits = value.replace(/\D/g, "").replace(/^998/, "");
    setPhone(PHONE_PREFIX + digits.slice(0, 9));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setTouched(true);

    if (
      fullName.trim().length < 3 ||
      !PHONE_PATTERN.test(phone) ||
      password.length < 6 ||
      !courseId
    ) {
      return;
    }

    onSubmit({
      full_name: fullName.trim(),
      phone,
      password,
      courseId: Number(courseId),
    });
  }

  return (
    <Modal open={open} title="Qo‘shish" onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          id="full_name"
          label="F.I.SH"
          placeholder="Kiriting"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          error={nameInvalid ? "Kamida 3 ta belgi" : null}
        />

        <Input
          id="phone"
          label="Telefon raqami"
          inputMode="tel"
          value={phone}
          onChange={(e) => handlePhoneChange(e.target.value)}
          error={phoneInvalid ? "Telefon raqam to‘liq emas" : null}
        />

        <Select
          id="courseId"
          label="Kurs biriktirish"
          value={courseId}
          onChange={(e) => setCourseId(e.target.value)}
          error={courseInvalid ? "Kursni tanlang" : null}
        >
          <option value="">Tanlang</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.name}
            </option>
          ))}
        </Select>

        <Input
          id="password"
          label="Parol"
          type={showPassword ? "text" : "password"}
          placeholder="******"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          rightSlot={
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Yashirish" : "Ko‘rsatish"}
              className="cursor-pointer"
            >
              <EyeOffIcon dimmed={showPassword} />
            </button>
          }
          error={passwordInvalid ? "Kamida 6 ta belgi" : null}
        />

        {error ? (
          <p className="text-sm font-medium text-danger-500">
            {apiErrorMessage(error)}
          </p>
        ) : null}

        <Button type="submit" disabled={isPending} className="self-start">
          {isPending ? "Saqlanmoqda..." : "Saqlash"}
        </Button>
      </form>
    </Modal>
  );
}
