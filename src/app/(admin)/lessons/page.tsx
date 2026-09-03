"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AdminListLayout } from "@/components/layout/AdminListLayout";
import { LessonsTable } from "@/components/content/ContentTables";
import { LessonFormModal } from "@/components/content/ContentForms";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { SuccessDialog } from "@/components/ui/SuccessDialog";
import { CirclePlusIcon } from "@/components/ui/icons";
import { formatDateTime } from "@/lib/format";
import {
  useLessonsList,
  useLessonMutations,
  useSectionsList,
} from "@/hooks/useContent";
import type { Lesson } from "@/types";

const ALL = { page: 1, limit: 100 };

function LessonsPageInner() {
  const params = useSearchParams();
  const fromUrl = params.get("sectionId");

  const [sectionId, setSectionId] = useState(fromUrl ?? "");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");

  const { sections } = useSectionsList(ALL);
  const section = sections.find((item) => String(item.id) === sectionId);

  const { lessons, meta, isLoading, isError, error } = useLessonsList({
    page,
    limit,
    search: search || undefined,
    sectionId: sectionId ? Number(sectionId) : undefined,
  });

  const { create, update, remove } = useLessonMutations();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Lesson | null>(null);
  const [deleting, setDeleting] = useState<Lesson | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  /* Kurs → Bo'lim → Darslar zanjiri, faqat ma'lum bo'lgan bo'g'inlar */
  const breadcrumb = section
    ? ["Kurslar", section.courses?.name ?? "Kurs", "Bo‘limlar", section.name, "Darslar"]
    : ["Materiallar", "Darslar"];

  function handleSubmit(body: FormData) {
    const done = (message: string) => () => {
      setFormOpen(false);
      setEditing(null);
      setSuccess(message);
    };

    if (editing) {
      update.mutate(
        { id: editing.id, form: body },
        { onSuccess: done("Muvaffaqiyatli o‘zgartirildi") },
      );
    } else {
      create.mutate(body, { onSuccess: done("Muvaffaqiyatli qo‘shildi") });
    }
  }

  return (
    <>
      <AdminListLayout
        title="Darslar"
        breadcrumb={breadcrumb}
        action={
          <Button
            leftIcon={<CirclePlusIcon />}
            className="min-h-12"
            onClick={() => {
              setEditing(null);
              setFormOpen(true);
            }}
          >
            Dars qo&rsquo;shish
          </Button>
        }
        meta={meta}
        onPageChange={setPage}
        onLimitChange={(next) => {
          setLimit(next);
          setPage(1);
        }}
        search={search}
        onSearch={(value) => {
          setSearch(value);
          setPage(1);
        }}
        exportName="darslar"
        exportRows={lessons.map((lesson) => ({
          ID: lesson.id,
          Nomi: lesson.name,
          "Bo’lim": lesson.sections?.name ?? "",
          Tavsif: lesson.description,
          Sana: formatDateTime(lesson.create_at),
        }))}
        error={isError ? error : null}
        mutationError={
          remove.isError
            ? "Darsni o‘chirib bo‘lmadi — unga material, vazifa yoki test bog‘langan bo‘lishi mumkin."
            : create.isError || update.isError
              ? "Saqlab bo‘lmadi. Maydonlarni tekshiring."
              : null
        }
      >
        <LessonsTable
          items={lessons}
          isLoading={isLoading}
          linkTo={(lesson) => `/lessons/${lesson.id}`}
          onEdit={(item) => {
            setEditing(item);
            setFormOpen(true);
          }}
          onDelete={setDeleting}
        />
      </AdminListLayout>

      <LessonFormModal
        open={formOpen}
        editing={editing}
        defaultSectionId={
          editing ? undefined : sectionId ? Number(sectionId) : undefined
        }
        isPending={create.isPending || update.isPending}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={deleting !== null}
        isPending={remove.isPending}
        onConfirm={() => {
          if (!deleting) return;
          remove.mutate(deleting.id, {
            onSuccess: () => {
              setDeleting(null);
              setSuccess("Muvaffaqiyatli o‘chirildi");
            },
          });
        }}
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

export default function LessonsPage() {
  return (
    <Suspense fallback={null}>
      <LessonsPageInner />
    </Suspense>
  );
}
