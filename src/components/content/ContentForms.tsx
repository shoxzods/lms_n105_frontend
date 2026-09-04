"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { DropZoneInput } from "@/components/ui/DropZoneInput";
import { FileInput } from "@/components/ui/FileInput";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import {
  useCoursesList,
  useLessonsList,
  useSectionsList,
} from "@/hooks/useContent";
import type { Exam, Homework, Lesson, Material, Section } from "@/types";

/** Ro'yxatlarni to'ldirish uchun — bitta sahifada hammasi kelsin */
const ALL = { page: 1, limit: 100 };

const ANSWERS = [
  ["variantA", "A"],
  ["variantB", "B"],
  ["variantC", "C"],
  ["variantD", "D"],
] as const;

/** Har formaning pastki qismi bir xil */
function FormActions({
  isPending,
  onCancel,
  submitLabel,
}: {
  isPending: boolean;
  onCancel: () => void;
  submitLabel: string;
}) {
  return (
    <div className="flex justify-end gap-3 pt-2">
      <Button type="button" variant="secondary" onClick={onCancel}>
        Bekor qilish
      </Button>
      <Button type="submit" disabled={isPending}>
        {isPending ? "Saqlanmoqda..." : submitLabel}
      </Button>
    </div>
  );
}

/* ==================== Bo'lim ==================== */

export function SectionFormModal({
  open,
  editing,
  lockedCourseId,
  isPending,
  onClose,
  onSubmit,
}: {
  open: boolean;
  editing: Section | null;
  /** Kurs sahifasidan kirilgan bo'lsa oldindan tanlanadi */
  lockedCourseId?: number;
  isPending: boolean;
  onClose: () => void;
  onSubmit: (body: { name: string; courseId: number }) => void;
}) {
  const { courses } = useCoursesList(ALL);

  const [name, setName] = useState("");
  const [courseId, setCourseId] = useState("");
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (!open) return;
    setName(editing?.name ?? "");
    setCourseId(
      editing
        ? String(editing.courseId)
        : lockedCourseId
          ? String(lockedCourseId)
          : "",
    );
    setTouched(false);
  }, [open, editing, lockedCourseId]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setTouched(true);
    if (name.trim().length < 3 || !courseId) return;

    onSubmit({ name: name.trim(), courseId: Number(courseId) });
  }

  return (
    <Modal
      open={open}
      title={editing ? "Tahrirlash" : "Qo'shish"}
      onClose={onClose}
      width={420}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          id="section-name"
          label="Bo'lim nomi"
          placeholder="Kiriting"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={touched && name.trim().length < 3 ? "Kamida 3 ta belgi" : null}
        />

        <Select
          id="section-course"
          label="Kurs biriktirish"
          value={courseId}
          onChange={(e) => setCourseId(e.target.value)}
          error={touched && !courseId ? "Kurs tanlang" : null}
        >
          <option value="">Tanlang</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.name}
            </option>
          ))}
        </Select>

        <div className="flex justify-start pt-1">
          <Button type="submit" disabled={isPending} className="min-w-[110px]">
            {isPending ? "..." : "✓ Saqlash"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

/* ==================== Dars ==================== */

export function LessonFormModal({
  open,
  editing,
  isPending,
  defaultSectionId,
  onClose,
  onSubmit,
}: {
  open: boolean;
  editing: Lesson | null;
  isPending: boolean;
  /** Bo'lim ichidan qo'shilganda o'sha bo'lim oldindan tanlangan bo'ladi */
  defaultSectionId?: number;
  onClose: () => void;
  onSubmit: (form: FormData) => void;
}) {
  const { sections } = useSectionsList(ALL);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [sectionId, setSectionId] = useState("");
  const [video, setVideo] = useState<File | null>(null);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (!open) return;
    setName(editing?.name ?? "");
    setDescription(editing?.description ?? "");
    setSectionId(
      editing
        ? String(editing.sectionId)
        : defaultSectionId
          ? String(defaultSectionId)
          : "",
    );
    setVideo(null);
    setTouched(false);
  }, [open, editing, defaultSectionId]);

  const needsFile = !editing;
  const selectedSection = sections.find((s) => String(s.id) === sectionId);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setTouched(true);

    if (name.trim().length < 3) return;
    if (!description.trim()) return;
    if (!sectionId) return;
    if (needsFile && !video) return;

    const form = new FormData();
    form.append("name", name.trim());
    form.append("description", description.trim());
    form.append("sectionId", sectionId);
    if (video) form.append("file", video);

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
        {/* Bo'lim nomi (Bo'lim pre-selected bo'lganda disabled input, aks holda Select) */}
        {defaultSectionId || editing ? (
          <Input
            id="lesson-section-name"
            label="Bo'lim nomi"
            value={selectedSection?.name || ""}
            disabled
            placeholder="Kiriting"
          />
        ) : (
          <Select
            id="lesson-section"
            label="Bo'lim nomi"
            value={sectionId}
            onChange={(e) => setSectionId(e.target.value)}
            error={touched && !sectionId ? "Bo'lim tanlang" : null}
          >
            <option value="">Tanlang</option>
            {sections.map((section) => (
              <option key={section.id} value={section.id}>
                {section.name}
              </option>
            ))}
          </Select>
        )}

        <Input
          id="lesson-name"
          label="Dars nomi"
          placeholder="Kiriting"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={touched && name.trim().length < 3 ? "Kamida 3 ta belgi" : null}
        />

        <Input
          id="lesson-description"
          label="Dars haqida"
          placeholder="Kiriting"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          error={touched && !description.trim() ? "Tavsif kiriting" : null}
        />

        <DropZoneInput
          id="lesson-file"
          label="Fayl biriktirish"
          accept="video/*"
          currentName={editing?.file}
          onChange={(files) => setVideo(files?.[0] ?? null)}
          error={touched && needsFile && !video ? "Video tanlang" : null}
          uploadText="Bu yerga bosing"
          dragText="yoki faylni suring"
          hintText=".mp4 yoki .MOV"
        />

        <div className="mt-2 flex items-center justify-start">
          <Button
            type="submit"
            disabled={isPending}
            leftIcon={
              <svg className="size-4 stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
            }
          >
            Saqlash
          </Button>
        </div>
      </form>
    </Modal>
  );
}

/* ==================== Material ==================== */

export function MaterialFormModal({
  open,
  editing,
  lockedLesson,
  isPending,
  onClose,
  onSubmit,
}: {
  open: boolean;
  editing: Material | null;
  /** Dars sahifasidan ochilgan bo'lsa dars o'zgarmas bo'lib turadi */
  lockedLesson?: Lesson | null;
  isPending: boolean;
  onClose: () => void;
  onSubmit: (form: FormData) => void;
}) {
  const { lessons } = useLessonsList(ALL);

  const [description, setDescription] = useState("");
  const [lessonId, setLessonId] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (!open) return;
    setDescription(editing?.description ?? "");
    setLessonId(
      editing
        ? String(editing.lessonId)
        : lockedLesson
          ? String(lockedLesson.id)
          : "",
    );
    setFiles(null);
    setTouched(false);
  }, [open, editing, lockedLesson]);

  const needsFiles = !editing;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setTouched(true);

    if (!description.trim()) return;
    if (!lessonId) return;
    if (needsFiles && (!files || files.length === 0)) return;

    const form = new FormData();
    form.append("description", description.trim());
    form.append("lessonId", lessonId);

    if (files) {
      Array.from(files).forEach((file) => form.append("files", file));
    }

    onSubmit(form);
  }

  // Ro'yxatda lockedLesson bo'lmasa uni ham qo'shib qo'yamiz
  const allLessons = [...lessons];
  if (lockedLesson && !allLessons.some((l) => l.id === lockedLesson.id)) {
    allLessons.unshift(lockedLesson);
  }

  return (
    <Modal
      open={open}
      title={editing ? "Materialni tahrirlash" : "Material qo'shish"}
      onClose={onClose}
      width={520}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Select
          id="material-lesson"
          label="Dars"
          value={lessonId}
          onChange={(e) => setLessonId(e.target.value)}
          error={touched && !lessonId ? "Dars tanlang" : null}
        >
          <option value="">Tanlang</option>
          {allLessons.map((lesson) => (
            <option key={lesson.id} value={lesson.id}>
              {lesson.name}
            </option>
          ))}
        </Select>

        <Input
          id="material-description"
          label="Material uchun izoh"
          placeholder="Kiriting"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          error={touched && !description.trim() ? "Tavsif kiriting" : null}
        />

        <DropZoneInput
          id="material-files"
          label="Fayl biriktirish"
          multiple
          currentName={
            editing?.materialFiles?.length
              ? `${editing.materialFiles.length} ta fayl saqlangan`
              : null
          }
          onChange={setFiles}
          error={
            touched && needsFiles && !files?.length
              ? "Kamida bitta fayl tanlang"
              : null
          }
        />

        <div className="flex justify-start pt-2">
          <Button
            type="submit"
            disabled={isPending}
            className="min-w-[120px]"
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
        </div>
      </form>
    </Modal>
  );
}

/* ==================== Vazifa ==================== */

export function HomeworkFormModal({
  open,
  editing,
  lockedLesson,
  isPending,
  onClose,
  onSubmit,
}: {
  open: boolean;
  editing: Homework | null;
  lockedLesson?: Lesson | null;
  isPending: boolean;
  onClose: () => void;
  onSubmit: (form: FormData) => void;
}) {
  const { lessons } = useLessonsList(ALL);

  const [description, setDescription] = useState("");
  const [lessonId, setLessonId] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (!open) return;
    setDescription(editing?.description ?? "");
    setLessonId(
      editing
        ? String(editing.lessonId)
        : lockedLesson
          ? String(lockedLesson.id)
          : "",
    );
    setFile(null);
    setTouched(false);
  }, [open, editing, lockedLesson]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setTouched(true);

    if (!description.trim()) return;
    if (!lessonId) return;

    const form = new FormData();
    form.append("description", description.trim());
    form.append("lessonId", lessonId);
    if (file) form.append("file", file);

    onSubmit(form);
  }

  const allLessons = [...lessons];
  if (lockedLesson && !allLessons.some((l) => l.id === lockedLesson.id)) {
    allLessons.unshift(lockedLesson);
  }

  return (
    <Modal
      open={open}
      title={editing ? "Vazifani tahrirlash" : "Vazifa qo'shish"}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          id="homework-description"
          label="Vazifa matni"
          requiredMark
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          error={touched && !description.trim() ? "Matn kiriting" : null}
        />

        <Select
          id="homework-lesson"
          label="Dars"
          value={lessonId}
          onChange={(e) => setLessonId(e.target.value)}
          error={touched && !lessonId ? "Dars tanlang" : null}
        >
          <option value="">Tanlang</option>
          {allLessons.map((lesson) => (
            <option key={lesson.id} value={lesson.id}>
              {lesson.name}
            </option>
          ))}
        </Select>

        <FileInput
          id="homework-file"
          label="Fayl (ixtiyoriy)"
          currentName={editing?.file}
          onChange={(files) => setFile(files?.[0] ?? null)}
        />

        <FormActions
          isPending={isPending}
          onCancel={onClose}
          submitLabel={editing ? "Saqlash" : "Qo'shish"}
        />
      </form>
    </Modal>
  );
}

/* ==================== Test ==================== */

export function ExamFormModal({
  open,
  editing,
  lockedLesson,
  isPending,
  onClose,
  onSubmit,
}: {
  open: boolean;
  editing: Exam | null;
  lockedLesson?: Lesson | null;
  isPending: boolean;
  onClose: () => void;
  onSubmit: (body: Omit<Exam, "id" | "create_at">) => void;
}) {
  const { lessons } = useLessonsList(ALL);

  const [question, setQuestion] = useState("");
  const [variants, setVariants] = useState({ a: "", b: "", c: "", d: "" });
  const [answer, setAnswer] = useState<Exam["answer"]>("variantA");
  const [lessonId, setLessonId] = useState("");
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (!open) return;

    setQuestion(editing?.question ?? "");
    setVariants({
      a: editing?.variantA ?? "",
      b: editing?.variantB ?? "",
      c: editing?.variantC ?? "",
      d: editing?.variantD ?? "",
    });
    setAnswer(editing?.answer ?? "variantA");
    setLessonId(
      editing
        ? String(editing.lessonId)
        : lockedLesson
          ? String(lockedLesson.id)
          : "",
    );
    setTouched(false);
  }, [open, editing, lockedLesson]);

  const emptyVariant = Object.values(variants).some((v) => !v.trim());

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setTouched(true);

    if (!question.trim() || emptyVariant || !lessonId) return;

    onSubmit({
      question: question.trim(),
      variantA: variants.a.trim(),
      variantB: variants.b.trim(),
      variantC: variants.c.trim(),
      variantD: variants.d.trim(),
      answer,
      lessonId: Number(lessonId),
    });
  }

  const allLessons = [...lessons];
  if (lockedLesson && !allLessons.some((l) => l.id === lockedLesson.id)) {
    allLessons.unshift(lockedLesson);
  }

  return (
    <Modal
      open={open}
      title={editing ? "Testni tahrirlash" : "Test qo'shish"}
      onClose={onClose}
      width={560}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          id="exam-question"
          label="Savol"
          requiredMark
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          error={touched && !question.trim() ? "Savol kiriting" : null}
        />

        {(["a", "b", "c", "d"] as const).map((key) => (
          <Input
            key={key}
            id={`exam-variant-${key}`}
            label={`${key.toUpperCase()} varianti`}
            requiredMark
            value={variants[key]}
            onChange={(e) =>
              setVariants((prev) => ({ ...prev, [key]: e.target.value }))
            }
            error={
              touched && !variants[key].trim() ? "Variant kiritilsin" : null
            }
          />
        ))}

        <Select
          id="exam-answer"
          label="To'g'ri javob"
          value={answer}
          onChange={(e) => setAnswer(e.target.value as Exam["answer"])}
        >
          {ANSWERS.map(([value, label]) => (
            <option key={value} value={value}>
              {label} varianti
            </option>
          ))}
        </Select>

        <Select
          id="exam-lesson"
          label="Dars"
          value={lessonId}
          onChange={(e) => setLessonId(e.target.value)}
          error={touched && !lessonId ? "Dars tanlang" : null}
        >
          <option value="">Tanlang</option>
          {allLessons.map((lesson) => (
            <option key={lesson.id} value={lesson.id}>
              {lesson.name}
            </option>
          ))}
        </Select>

        <FormActions
          isPending={isPending}
          onCancel={onClose}
          submitLabel={editing ? "Saqlash" : "Qo'shish"}
        />
      </form>
    </Modal>
  );
}
