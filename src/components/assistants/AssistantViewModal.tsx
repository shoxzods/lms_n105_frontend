"use client";

import { Avatar } from "@/components/ui/Avatar";
import { Modal } from "@/components/ui/Modal";
import { formatDateTime, ROLE_LABELS } from "@/lib/format";
import type { Assistant } from "@/types";

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs font-medium text-ink-500">{label}</span>
      <span className="text-[15px] font-bold text-page-fg">{value}</span>
    </div>
  );
}

function SectionTitle({ children }: { children: string }) {
  return (
    <h3 className="border-b border-line pb-2 text-base font-bold text-page-fg">
      {children}
    </h3>
  );
}

/** Figma: "Assistent haqida" modali — ko'z tugmasi bosilganda */
export function AssistantViewModal({
  assistant,
  onClose,
}: {
  assistant: Assistant | null;
  onClose: () => void;
}) {
  if (!assistant) return null;

  const courses = assistant.courses ?? [];

  return (
    <Modal open title="Assistent haqida" onClose={onClose} width={590}>
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <Avatar
            fullName={assistant.full_name}
            file={assistant.file}
            size={56}
          />
          <p className="text-xl font-bold text-page-fg">
            {assistant.full_name}
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <SectionTitle>To&rsquo;liq ma&rsquo;lumotlar</SectionTitle>

          <Field label="Telefon raqami" value={assistant.phone} />
          <Field label="Rol" value={ROLE_LABELS[assistant.role]} />
          <Field
            label="Ro&rsquo;yxatdan o&rsquo;tgan vaqti"
            value={formatDateTime(assistant.create_at)}
          />
          {assistant.email && (
            <Field label="Email" value={assistant.email} />
          )}
        </div>

        <div className="flex flex-col gap-3">
          <SectionTitle>Biriktirilgan kurslar</SectionTitle>

          {courses.length === 0 ? (
            <p className="text-sm font-medium text-ink-500">
              Hech qanday kursga biriktirilmagan
            </p>
          ) : (
            <ul className="flex flex-col gap-2">
              {courses.map((course) => (
                <li
                  key={course.id}
                  className="rounded-lg bg-muted px-4 py-3 text-sm font-medium text-page-fg"
                >
                  {course.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Modal>
  );
}
