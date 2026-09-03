"use client";

import { useState } from "react";
import { AdminListLayout } from "@/components/layout/AdminListLayout";
import { ExamsTable } from "@/components/content/ContentTables";
import { ExamFormModal } from "@/components/content/ContentForms";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { SuccessDialog } from "@/components/ui/SuccessDialog";
import { CirclePlusIcon } from "@/components/ui/icons";
import { formatDateTime } from "@/lib/format";
import { useExamsList, useExamMutations } from "@/hooks/useContent";
import type { Exam } from "@/types";

export default function ExamsPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");

  const { exams, meta, isLoading, isError, error } = useExamsList({
    page,
    limit,
    search: search || undefined,
  });

  const { create, update, remove } = useExamMutations();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Exam | null>(null);
  const [deleting, setDeleting] = useState<Exam | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  function handleSubmit(body: Parameters<typeof create.mutate>[0]) {
    const done = (message: string) => () => {
      setFormOpen(false);
      setEditing(null);
      setSuccess(message);
    };

    if (editing) {
      update.mutate(
        { id: editing.id, ...body },
        { onSuccess: done("Muvaffaqiyatli o‘zgartirildi") },
      );
    } else {
      create.mutate(body, { onSuccess: done("Muvaffaqiyatli qo‘shildi") });
    }
  }

  return (
    <>
      <AdminListLayout
        title="Testlar"
        breadcrumb={["Materiallar", "Testlar"]}
        action={
          <Button
            leftIcon={<CirclePlusIcon />}
            className="min-h-12"
            onClick={() => {
              setEditing(null);
              setFormOpen(true);
            }}
          >
            Qo&rsquo;shish
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
        exportName="testlar"
        exportRows={exams.map((exam) => ({
            ID: exam.id,
            Savol: exam.question,
            Dars: exam.lessons?.name ?? "",
            "To’g’ri javob": exam.answer ?? "",
            Sana: formatDateTime(exam.create_at),
        }))}
        error={isError ? error : null}
        mutationError={
          remove.isError
            ? "Testni o‘chirib bo‘lmadi."
            : create.isError || update.isError
              ? "Saqlab bo‘lmadi. Maydonlarni tekshiring."
              : null
        }
      >
        <ExamsTable
          items={exams}
          isLoading={isLoading}
          onEdit={(item) => {
            setEditing(item);
            setFormOpen(true);
          }}
          onDelete={setDeleting}
        />
      </AdminListLayout>

      <ExamFormModal
        open={formOpen}
        editing={editing}
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
