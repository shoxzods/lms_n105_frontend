"use client";

import { useState } from "react";
import { AdminListLayout } from "@/components/layout/AdminListLayout";
import { HomeworksTable } from "@/components/content/ContentTables";
import { HomeworkFormModal } from "@/components/content/ContentForms";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { SuccessDialog } from "@/components/ui/SuccessDialog";
import { CirclePlusIcon } from "@/components/ui/icons";
import { formatDateTime } from "@/lib/format";
import { useHomeworksList, useHomeworkMutations } from "@/hooks/useContent";
import type { Homework } from "@/types";

export default function HomeworksPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");

  const { homeworks, meta, isLoading, isError, error } = useHomeworksList({
    page,
    limit,
    search: search || undefined,
  });

  const { create, update, remove } = useHomeworkMutations();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Homework | null>(null);
  const [deleting, setDeleting] = useState<Homework | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

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
        title="Vazifalar"
        breadcrumb={["Materiallar", "Vazifalar"]}
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
        exportName="vazifalar"
        exportRows={homeworks.map((homework) => ({
            ID: homework.id,
            Vazifa: homework.description,
            Dars: homework.lessons?.name ?? "",
            Fayl: homework.file ? "bor" : "yo‘q",
            Sana: formatDateTime(homework.create_at),
        }))}
        error={isError ? error : null}
        mutationError={
          remove.isError
            ? "Vazifani o‘chirib bo‘lmadi."
            : create.isError || update.isError
              ? "Saqlab bo‘lmadi. Maydonlarni tekshiring."
              : null
        }
      >
        <HomeworksTable
          items={homeworks}
          isLoading={isLoading}
          onEdit={(item) => {
            setEditing(item);
            setFormOpen(true);
          }}
          onDelete={setDeleting}
        />
      </AdminListLayout>

      <HomeworkFormModal
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
