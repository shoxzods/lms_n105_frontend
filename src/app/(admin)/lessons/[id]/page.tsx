"use client";

import { use, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import {
  ExamsTable,
  HomeworksTable,
  MaterialsTable,
} from "@/components/content/ContentTables";
import {
  ExamFormModal,
  HomeworkFormModal,
  MaterialFormModal,
} from "@/components/content/ContentForms";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { SuccessDialog } from "@/components/ui/SuccessDialog";
import { CirclePlusIcon } from "@/components/ui/icons";
import {
  useExamMutations,
  useExamsList,
  useHomeworkMutations,
  useHomeworksList,
  useLessonsList,
  useMaterialMutations,
  useMaterialsList,
  useSectionsList,
} from "@/hooks/useContent";
import { apiErrorMessage } from "@/lib/apiError";
import type { Exam, Homework, Material } from "@/types";

const ALL = { page: 1, limit: 100 };

const TABS = [
  { key: "materials", label: "Materiallar", addLabel: "Qo'shish" },
  { key: "homeworks", label: "Vazifalar", addLabel: "Vazifa qo'shish" },
  { key: "exams", label: "Imtihonlar", addLabel: "Imtihon savollarini qo'shish" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

type Deleting =
  | { kind: "material"; item: Material }
  | { kind: "homework"; item: Homework }
  | { kind: "exam"; item: Exam };

export default function LessonDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const lessonId = Number(id);

  const [tab, setTab] = useState<TabKey>("materials");

  /* Dars va uning bo'limi — sarlavha hamda yo'l zanjiri uchun */
  const { lessons } = useLessonsList(ALL);
  const lesson = lessons.find((item) => item.id === lessonId) ?? null;

  const { sections } = useSectionsList(ALL);
  const section = sections.find((item) => item.id === lesson?.sectionId);

  const materials = useMaterialsList({ ...ALL, lessonId });
  const homeworks = useHomeworksList({ ...ALL, lessonId });
  const exams = useExamsList({ ...ALL, lessonId });

  const materialMut = useMaterialMutations();
  const homeworkMut = useHomeworkMutations();
  const examMut = useExamMutations();

  const [materialForm, setMaterialForm] = useState<Material | null | false>(false);
  const [homeworkForm, setHomeworkForm] = useState<Homework | null | false>(false);
  const [examForm, setExamForm] = useState<Exam | null | false>(false);

  const [deleting, setDeleting] = useState<Deleting | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const added = () => setSuccess("Muvaffaqiyatli qo‘shildi");
  const changed = () => setSuccess("Muvaffaqiyatli o‘zgartirildi");

  const breadcrumb = [
    "Kurslar",
    section?.courses?.name ?? "Kurs",
    "Bo‘limlar",
    "Darslar",
    lesson?.name ?? `#${lessonId}`,
  ];

  function handleAdd() {
    if (tab === "materials") setMaterialForm(null);
    if (tab === "homeworks") setHomeworkForm(null);
    if (tab === "exams") setExamForm(null);
  }

  function confirmDelete() {
    if (!deleting) return;

    const done = () => {
      setDeleting(null);
      setSuccess("Muvaffaqiyatli o‘chirildi");
    };

    if (deleting.kind === "material")
      materialMut.remove.mutate(deleting.item.id, { onSuccess: done });
    if (deleting.kind === "homework")
      homeworkMut.remove.mutate(deleting.item.id, { onSuccess: done });
    if (deleting.kind === "exam")
      examMut.remove.mutate(deleting.item.id, { onSuccess: done });
  }

  const removePending =
    materialMut.remove.isPending ||
    homeworkMut.remove.isPending ||
    examMut.remove.isPending;

  const listError =
    (materials.isError && materials.error) ||
    (homeworks.isError && homeworks.error) ||
    (exams.isError && exams.error) ||
    null;

  const addLabel = TABS.find((item) => item.key === tab)!.addLabel;

  return (
    <>
      <PageHeader
        title={lesson?.name ?? "Dars"}
        breadcrumb={breadcrumb}
        action={
          <Button
            leftIcon={<CirclePlusIcon />}
            className="min-h-12"
            onClick={handleAdd}
          >
            {addLabel}
          </Button>
        }
      />

      <section className="flex w-full max-w-[1600px] flex-col gap-6 px-6 pb-8">
        <div className="flex flex-wrap items-center gap-3">
          {TABS.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setTab(item.key)}
              className={`cursor-pointer rounded-lg px-5 py-2.5 text-sm font-medium transition-colors ${
                tab === item.key
                  ? "bg-brand-500 text-white"
                  : "bg-card text-page-fg hover:bg-hover"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {listError && (
          <p className="text-sm font-medium text-danger-500">
            {apiErrorMessage(listError)}
          </p>
        )}

        {tab === "materials" && (
          <MaterialsTable
            items={materials.materials}
            isLoading={materials.isLoading}
            onEdit={setMaterialForm}
            onDelete={(item) => setDeleting({ kind: "material", item })}
          />
        )}

        {tab === "homeworks" && (
          <HomeworksTable
            items={homeworks.homeworks}
            isLoading={homeworks.isLoading}
            onEdit={setHomeworkForm}
            onDelete={(item) => setDeleting({ kind: "homework", item })}
          />
        )}

        {tab === "exams" && (
          <ExamsTable
            items={exams.exams}
            isLoading={exams.isLoading}
            onEdit={setExamForm}
            onDelete={(item) => setDeleting({ kind: "exam", item })}
          />
        )}
      </section>

      <MaterialFormModal
        open={materialForm !== false}
        editing={materialForm || null}
        lockedLesson={lesson}
        isPending={materialMut.create.isPending || materialMut.update.isPending}
        onClose={() => setMaterialForm(false)}
        onSubmit={(form) => {
          const editing = materialForm;

          const done = () => {
            setMaterialForm(false);
            if (editing) changed();
            else added();
          };

          if (editing) {
            materialMut.update.mutate({ id: editing.id, form }, { onSuccess: done });
          } else {
            materialMut.create.mutate(form, { onSuccess: done });
          }
        }}
      />

      <HomeworkFormModal
        open={homeworkForm !== false}
        editing={homeworkForm || null}
        lockedLesson={lesson}
        isPending={homeworkMut.create.isPending || homeworkMut.update.isPending}
        onClose={() => setHomeworkForm(false)}
        onSubmit={(form) => {
          const editing = homeworkForm;

          const done = () => {
            setHomeworkForm(false);
            if (editing) changed();
            else added();
          };

          if (editing) {
            homeworkMut.update.mutate({ id: editing.id, form }, { onSuccess: done });
          } else {
            homeworkMut.create.mutate(form, { onSuccess: done });
          }
        }}
      />

      <ExamFormModal
        open={examForm !== false}
        editing={examForm || null}
        lockedLesson={lesson}
        isPending={examMut.create.isPending || examMut.update.isPending}
        onClose={() => setExamForm(false)}
        onSubmit={(body) => {
          const editing = examForm;

          const done = () => {
            setExamForm(false);
            if (editing) changed();
            else added();
          };

          if (editing) {
            examMut.update.mutate({ id: editing.id, ...body }, { onSuccess: done });
          } else {
            examMut.create.mutate(body, { onSuccess: done });
          }
        }}
      />

      <ConfirmDialog
        open={deleting !== null}
        isPending={removePending}
        onConfirm={confirmDelete}
        onCancel={() => setDeleting(null)}
      />

      <SuccessDialog
        open={success !== null}
        message={success ?? ""}
        onClose={() => setSuccess(null)}
      />
    </>
  );
}
