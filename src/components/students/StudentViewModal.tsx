"use client";

import { Avatar } from "@/components/ui/Avatar";
import { Modal } from "@/components/ui/Modal";
import { formatDateTime, ROLE_LABELS } from "@/lib/format";
import type { Student } from "@/types";

function Field({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs font-medium text-ink-500">{label}</span>
      <span className="text-[15px] font-bold text-page-fg">{value}</span>
    </div>
  );
}

/** Figma: "Student haqida" modali — ko'z tugmasi bosilganda */
export function StudentViewModal({
  student,
  onClose,
}: {
  student: Student | null;
  onClose: () => void;
}) {
  if (!student) return null;

  const payments = student.purchasedCourses ?? [];
  const paymentsCount = student._count?.purchasedCourses ?? payments.length;
  const completedCount = payments.filter(
    (p) => p.status === "COMPLETED",
  ).length;

  return (
    <Modal open title="Student haqida" onClose={onClose} width={590}>
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <Avatar fullName={student.full_name} file={student.file} size={56} />
          <p className="text-xl font-bold text-page-fg">{student.full_name}</p>
        </div>

        <div className="flex flex-col gap-4">
          <Field label="Telefon raqami" value={student.phone} />
          <Field label="Rol" value={ROLE_LABELS[student.role]} />
          <Field
            label="Ro‘yxatdan o‘tgan vaqti"
            value={formatDateTime(student.create_at)}
          />
          <Field label="O‘qigan kurslar soni:" value={completedCount} />
          <Field label="To‘lovlar soni:" value={paymentsCount} />
        </div>
      </div>
    </Modal>
  );
}
