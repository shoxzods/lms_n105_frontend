"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Dropzone } from "@/components/ui/Dropzone";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { TrashIcon } from "@/components/ui/icons";
import { useAuthStore } from "@/store/auth";
import { useAssistantsList } from "@/hooks/useAssistants";
import { useCategoriesList } from "@/hooks/useCategories";
import { useMentorsList } from "@/hooks/useMentors";
import { useSectionsList } from "@/hooks/useContent";
import { usePaymentsList } from "@/hooks/usePayments";
import { fileUrl } from "@/api/public";
import { formatDateTime, formatPrice } from "@/lib/format";
import type { AdminCourse } from "@/types";

const ALL = { page: 1, limit: 100 };

const LEVELS = [
  ["BEGINNER", "Beginner"],
  ["ELEMENTARY", "Elementary"],
  ["PRE_INTERMEDIATE", "Pre-Intermediate"],
  ["INTERMEDIATE", "Intermediate"],
  ["ADVANCED", "Advanced"],
] as const;

/* ==================== Qo'shish / Tahrirlash ==================== */

export function CourseFormModal({
  open,
  editing,
  isPending,
  errorMessage,
  onClose,
  onSubmit,
}: {
  open: boolean;
  editing: AdminCourse | null;
  isPending: boolean;
  errorMessage?: string | null;
  onClose: () => void;
  onSubmit: (form: FormData) => void;
}) {
  const role = useAuthStore((s) => s.user?.role);
  const isMentor = role === "TEACHER";

  const { categories } = useCategoriesList(ALL);
  const { mentors } = useMentorsList(ALL, !isMentor);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [level, setLevel] = useState<string>("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [mentorId, setMentorId] = useState("");
  const [banner, setBanner] = useState<File | null>(null);
  const [video, setVideo] = useState<File | null>(null);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (!open) return;

    setName(editing?.name ?? "");
    setDescription(editing?.description ?? "");
    setLevel(editing?.level ?? "");
    setPrice(editing ? String(Number(editing.price)) : "");
    setCategoryId(editing ? String(editing.categoryId) : "");
    setMentorId(editing ? String(editing.mentorId) : "");
    setBanner(null);
    setVideo(null);
    setTouched(false);
  }, [open, editing]);

  const needsFiles = !editing;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setTouched(true);

    if (name.trim().length < 3) return;
    if (!description.trim()) return;
    if (!level || !price || !categoryId) return;
    if (!isMentor && !mentorId) return;
    if (needsFiles && (!banner || !video)) return;

    const form = new FormData();
    form.append("name", name.trim());
    form.append("description", description.trim());
    form.append("price", price);
    form.append("level", level);
    form.append("categoryId", categoryId);
    if (!isMentor) form.append("mentorId", mentorId);
    if (banner) form.append("banner", banner);
    if (video) form.append("intro_video", video);

    onSubmit(form);
  }

  return (
    <Modal
      open={open}
      title={editing ? "Tahrirlash" : "Qo'shish"}
      onClose={onClose}
      width={520}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Dropzone
            id="course-banner"
            label="Banner"
            hint="SVG, PNG, JPG or GIF (max. 800x400px)"
            accept="image/*"
            previewUrl={fileUrl("images", editing?.banner)}
            onChange={setBanner}
            error={touched && needsFiles && !banner ? "Rasm tanlang" : null}
          />

          <Dropzone
            id="course-video"
            label="Intro video"
            hint=".mp4 fayl kengaytma mumkin (max. 5 Mb)"
            accept="video/*"
            kind="video"
            previewUrl={fileUrl("videos", editing?.intro_video)}
            onChange={setVideo}
            error={touched && needsFiles && !video ? "Video tanlang" : null}
          />
        </div>

        <Input
          id="course-name"
          label="Kurs nomi"
          placeholder="Kiriting"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={touched && name.trim().length < 3 ? "Kamida 3 ta belgi" : null}
        />

        <Textarea
          id="course-description"
          label="Kurs haqida"
          placeholder="Kiriting"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          error={touched && !description.trim() ? "Tavsif kiriting" : null}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Select
            id="course-level"
            label="Darajasi"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            error={touched && !level ? "Darajani tanlang" : null}
          >
            <option value="">Tanlang</option>
            {LEVELS.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>

          <Input
            id="course-price"
            label="Narxi"
            inputMode="numeric"
            placeholder="0.00 so'm"
            value={price}
            onChange={(e) => setPrice(e.target.value.replace(/\D/g, ""))}
            error={touched && !price ? "Narx kiriting" : null}
          />
        </div>

        <Select
          id="course-category"
          label="Kategoriya"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          error={touched && !categoryId ? "Kategoriya tanlang" : null}
        >
          <option value="">Tanlang</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </Select>

        {/*
          Dizaynda mentor maydoni yo'q, chunki u yerda kursni mentor o'zi
          yaratadi. Bizda admin ham yarata oladi, backend esa `mentorId` ni
          majburiy so'raydi — shuning uchun qo'shildi.
        */}
        {!isMentor && (
        <Select
          id="course-mentor"
          label="Mentor"
          value={mentorId}
          onChange={(e) => setMentorId(e.target.value)}
          error={touched && !mentorId ? "Mentor tanlang" : null}
        >
          <option value="">Tanlang</option>
          {mentors.map((mentor) => {
            /* Backend `mentorId` deb MentorProfile.id ni kutadi, User.id ni emas */
            const profileId =
              mentor.mentorProfile?.[0]?.id ?? mentor.mentor?.[0]?.id;

            if (!profileId) return null;

            return (
              <option key={mentor.id} value={profileId}>
                {mentor.full_name}
              </option>
            );
          })}
        </Select>
        )}

        {errorMessage && (
          <p className="text-sm font-medium text-danger-500">{errorMessage}</p>
        )}

        <div className="flex justify-start pt-1">
          <Button type="submit" disabled={isPending} className="min-w-[120px]">
            {isPending ? "Saqlanmoqda..." : "✓ Saqlash"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

/* ==================== Batafsil ==================== */

function DetailRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium text-ink-500">{label}</span>
      <span className="text-sm font-bold text-page-fg">{children}</span>
    </div>
  );
}

export function CourseDetailModal({
  course,
  onClose,
  onEdit,
  onDelete,
  onAssignAssistant,
  onRemoveAssistant,
  isRemoving,
}: {
  course: AdminCourse | null;
  onClose: () => void;
  onEdit: () => void;
  onDelete?: () => void;
  onAssignAssistant: () => void;
  onRemoveAssistant: () => void;
  isRemoving: boolean;
}) {
  /* Sotuvlar soni — shu kursga tegishli to'lovlar soni */
  const { meta } = usePaymentsList({
    page: 1,
    limit: 1,
    courseId: course?.id,
  });

  const { assistants } = useAssistantsList(ALL);

  if (!course) return null;

  const banner = fileUrl("images", course.banner);
  const assistant = assistants.find((a) => a.id === course.assistantId);

  return (
    <Modal open title="Batafsil" onClose={onClose} width={420}>
      <div className="flex flex-col gap-4">
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onEdit}
            aria-label="Tahrirlash"
            className="cursor-pointer rounded-full bg-subtle p-1.5 transition-colors hover:bg-hover"
          >
            <svg
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.3"
              className="size-4"
              aria-hidden
            >
              <path d="M11.5 2.5l2 2L6 12H4v-2l7.5-7.5z" />
            </svg>
          </button>

          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              aria-label="O'chirish"
              className="cursor-pointer rounded-full bg-subtle p-1.5 transition-colors hover:bg-hover"
            >
              <TrashIcon />
            </button>
          )}
        </div>

        <DetailRow label="Kurs nomi">{course.name}</DetailRow>

        {banner && (
          <>
            <Image
              src={banner}
              alt=""
              width={380}
              height={160}
              unoptimized
              className="h-40 w-full rounded-lg object-cover"
            />
            <a
              href={banner}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-medium text-brand-600 hover:underline"
            >
              {course.banner}
            </a>
          </>
        )}

        <div className="grid grid-cols-2 gap-4">
          <DetailRow label="Darajasi">{course.level}</DetailRow>
          <DetailRow label="Narxi">
            {formatPrice(course.price)} so&rsquo;m
          </DetailRow>
          <DetailRow label="Sana">{formatDateTime(course.create_at)}</DetailRow>
          <DetailRow label="Kategoriya">
            {course.categories?.name ?? "—"}
          </DetailRow>
        </div>

        <DetailRow label="Mentor">
          {course.mentorProfile?.user.full_name ?? "—"}
        </DetailRow>

        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium text-ink-500">Assistent</span>

          {course.assistantId ? (
            <span className="flex items-center justify-between gap-3">
              <span className="text-sm font-bold text-page-fg">
                {assistant?.full_name ?? `#${course.assistantId}`}
              </span>

              <button
                type="button"
                onClick={onRemoveAssistant}
                disabled={isRemoving}
                aria-label="Assistentni olib tashlash"
                className="cursor-pointer text-danger-500 disabled:opacity-50"
              >
                <TrashIcon />
              </button>
            </span>
          ) : (
            <span>
              <Button
                type="button"
                onClick={onAssignAssistant}
                className="h-9 px-4 text-xs"
              >
                Biriktirish
              </Button>
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <DetailRow label="Sotuvlar soni">
            <Link
              href={`/all-courses/${course.id}/students`}
              onClick={onClose}
              className="text-brand-600 hover:underline"
            >
              {meta.total}
            </Link>
          </DetailRow>
          <DetailRow label="Holati">
            {course.published ? "Faol" : "Nofaol"}
          </DetailRow>
        </div>
      </div>
    </Modal>
  );
}

/* ==================== Assistent biriktirish ==================== */

export function AssistantAssignModal({
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
  onSubmit: (assistantId: number) => void;
}) {
  const { assistants } = useAssistantsList(ALL);
  const [value, setValue] = useState("");
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (!open) return;
    setValue("");
    setTouched(false);
  }, [open]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setTouched(true);
    if (!value) return;

    onSubmit(Number(value));
  }

  return (
    <Modal
      open={open}
      title="Assistent biriktirish"
      onClose={onClose}
      width={400}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Select
          id="assign-assistant"
          label="Assistentni tanlang"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          error={touched && !value ? "Assistentni tanlang" : null}
        >
          <option value="">Tanlash</option>
          {assistants.map((assistant) => (
            <option key={assistant.id} value={assistant.id}>
              {assistant.full_name}
            </option>
          ))}
        </Select>

        {errorMessage && (
          <p className="text-sm font-medium text-danger-500">{errorMessage}</p>
        )}

        <div className="flex justify-start">
          <Button type="submit" disabled={isPending} className="min-w-[110px]">
            {isPending ? "..." : "✓ Saqlash"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

/* ==================== Kursning bo'limlari ==================== */

export function CourseSectionsModal({
  course,
  onClose,
}: {
  course: AdminCourse | null;
  onClose: () => void;
}) {
  const { sections, isLoading } = useSectionsList({
    page: 1,
    limit: 100,
    courseId: course?.id,
  });

  if (!course) return null;

  return (
    <Modal open title={`${course.name} — bo'limlari`} onClose={onClose} width={420}>
      {isLoading && <p className="text-sm text-ink-500">Yuklanmoqda...</p>}

      {!isLoading && sections.length === 0 && (
        <p className="text-sm text-ink-500">
          Bu kursda hali bo&rsquo;lim yo&rsquo;q.
        </p>
      )}

      <ol className="flex flex-col gap-2">
        {sections.map((section, index) => (
          <li
            key={section.id}
            className="flex items-center gap-3 rounded-lg border border-line px-4 py-3"
          >
            <span className="text-xs font-semibold text-ink-500">
              {index + 1}
            </span>
            <span className="text-sm font-medium text-page-fg">
              {section.name}
            </span>
          </li>
        ))}
      </ol>
    </Modal>
  );
}
