"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import { usePublicCourses } from "@/hooks/usePublic";
import { apiErrorMessage } from "@/lib/apiError";
import { ROLE_LABELS } from "@/lib/format";
import type { Student } from "@/types";

const PHONE_PREFIX = "+998";
const PHONE_PATTERN = /^\+998\d{9}$/;

export interface StudentEditValues {
  full_name: string;
  phone: string;
}

/** Figma: "Tahrirlash" modali */
export function StudentEditModal({
  student,
  onClose,
  onSubmit,
  isPending,
  error,
}: {
  student: Student | null;
  onClose: () => void;
  onSubmit: (values: StudentEditValues) => void;
  isPending?: boolean;
  error?: unknown;
}) {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState(PHONE_PREFIX);
  const [touched, setTouched] = useState(false);

  const { courses } = usePublicCourses({ limit: 100 });

  useEffect(() => {
    if (student) {
      setFullName(student.full_name);
      setPhone(student.phone);
      setTouched(false);
    }
  }, [student]);

  if (!student) return null;

  const nameInvalid = touched && fullName.trim().length < 3;
  const phoneInvalid = touched && !PHONE_PATTERN.test(phone);

  function handlePhoneChange(value: string) {
    const digits = value.replace(/\D/g, "").replace(/^998/, "");
    setPhone(PHONE_PREFIX + digits.slice(0, 9));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setTouched(true);

    if (fullName.trim().length < 3 || !PHONE_PATTERN.test(phone)) return;

    onSubmit({ full_name: fullName.trim(), phone });
  }

  return (
    <Modal open title="Tahrirlash" onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          id="edit_full_name"
          label="F.I.SH"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          error={nameInvalid ? "Kamida 3 ta belgi" : null}
        />

        <Input
          id="edit_phone"
          label="Telefon raqami"
          inputMode="tel"
          value={phone}
          onChange={(e) => handlePhoneChange(e.target.value)}
          error={phoneInvalid ? "Telefon raqam to‘liq emas" : null}
        />

        <Input
          id="edit_role"
          label="Rol"
          value={ROLE_LABELS[student.role]}
          readOnly
          disabled
        />

        <Select
          id="edit_course"
          label="Kurs"
          defaultValue=""
          disabled
          title="Kursni o‘zgartirish to‘lovlar moduli tayyor bo‘lgach ishlaydi"
        >
          <option value="">Tanlang</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.name}
            </option>
          ))}
        </Select>

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
