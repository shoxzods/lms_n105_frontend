"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import { useCoursesList } from "@/hooks/useContent";
import { useUsersList } from "@/hooks/useUsers";
import { formatPrice } from "@/lib/format";
import type { PaymentStatus } from "@/types";

const ALL = { page: 1, limit: 100 };

const STATUSES: [PaymentStatus, string][] = [
  ["PENDING", "Kutilmoqda"],
  ["COMPLETED", "To'landi"],
  ["REJECTED", "Rad etildi"],
];

export interface PaymentCreateBody {
  userId: number;
  courseId: number;
  status: PaymentStatus;
}

/**
 * Figma: To'lovlar sahifasidagi "Qo'shish" oynasi.
 *
 * "Yo'nalish" va "Kurs narxi" alohida tanlanmaydi — kurs tanlanganda
 * o'zi to'ladi, chunki ikkalasi ham kursning o'z ma'lumoti.
 *
 * DIQQAT: dizaynda "To'lov turi" (Payme, Naqd, Karta) maydoni ham bor,
 * lekin `schema.prisma` dagi `PurchasedCourse` da bunday ustun yo'q.
 * Schemaga `payment_type` qo'shilgach shu yerga qo'shiladi.
 */
export function PaymentCreateModal({
  open,
  isPending,
  errorMessage,
  onClose,
  onSubmit,
}: {
  open: boolean;
  isPending: boolean;
  errorMessage?: string | null;
  onClose: () => void;
  onSubmit: (body: PaymentCreateBody) => void;
}) {
  const { users: students } = useUsersList({ ...ALL, role: "STUDENT" });
  const { courses } = useCoursesList(ALL);

  const [userId, setUserId] = useState("");
  const [courseId, setCourseId] = useState("");
  const [status, setStatus] = useState<PaymentStatus>("PENDING");
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (!open) return;
    setUserId("");
    setCourseId("");
    setStatus("PENDING");
    setTouched(false);
  }, [open]);

  const course = useMemo(
    () => courses.find((c) => String(c.id) === courseId),
    [courses, courseId],
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setTouched(true);

    if (!userId || !courseId) return;

    onSubmit({
      userId: Number(userId),
      courseId: Number(courseId),
      status,
    });
  }

  return (
    <Modal open={open} title="Qo&rsquo;shish" onClose={onClose} width={440}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Select
          id="payment-user"
          label="Sotib oluvchi"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          error={touched && !userId ? "Studentni tanlang" : null}
        >
          <option value="">Tanlang</option>
          {students.map((student) => (
            <option key={student.id} value={student.id}>
              {student.full_name}
            </option>
          ))}
        </Select>

        <Select
          id="payment-course"
          label="Kurs"
          value={courseId}
          onChange={(e) => setCourseId(e.target.value)}
          error={touched && !courseId ? "Kursni tanlang" : null}
        >
          <option value="">Tanlang</option>
          {courses.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </Select>

        {/* Kursdan o'zi to'ladi — qo'lda kiritilmaydi */}
        <Input
          id="payment-category"
          label="Yo&rsquo;nalish"
          readOnly
          value={course?.categories?.name ?? ""}
          placeholder="Kurs tanlang"
        />

        <Input
          id="payment-price"
          label="Kurs narxi"
          readOnly
          value={course ? formatPrice(course.price) : ""}
          placeholder="Kurs tanlang"
        />

        <Select
          id="payment-status"
          label="Holati"
          value={status}
          onChange={(e) => setStatus(e.target.value as PaymentStatus)}
        >
          {STATUSES.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>

        {errorMessage && (
          <p className="text-sm font-medium text-danger-500">{errorMessage}</p>
        )}

        <div className="flex justify-start pt-2">
          <Button type="submit" disabled={isPending} className="min-w-[120px]">
            {isPending ? "Saqlanmoqda..." : "✓ Saqlash"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
