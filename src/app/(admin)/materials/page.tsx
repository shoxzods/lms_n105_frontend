"use client";

import { useState } from "react";
import { AdminListLayout } from "@/components/layout/AdminListLayout";
import { MaterialsTable } from "@/components/content/ContentTables";
import { MaterialFormModal } from "@/components/content/ContentForms";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { SuccessDialog } from "@/components/ui/SuccessDialog";
import { CirclePlusIcon } from "@/components/ui/icons";
import { formatDateTime } from "@/lib/format";
import { useMaterialsList, useMaterialMutations } from "@/hooks/useContent";
import type { Material } from "@/types";

export default function MaterialsPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");

  const { materials, meta, isLoading, isError, error } = useMaterialsList({
    page,
    limit,
    search: search || undefined,
  });

  const { create, update, remove } = useMaterialMutations();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Material | null>(null);
  const [deleting, setDeleting] = useState<Material | null>(null);
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
        title="Dars materiallari"
        breadcrumb={["Materiallar", "Dars materiallari"]}
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
        exportName="materiallar"
        exportRows={materials.map((material) => ({
            ID: material.id,
            Tavsif: material.description,
            Dars: material.lessons?.name ?? "",
            Fayllar: material.materialFiles?.length ?? 0,
            Sana: formatDateTime(material.create_at),
        }))}
        error={isError ? error : null}
        mutationError={
          remove.isError
            ? "Materialni o‘chirib bo‘lmadi."
            : create.isError || update.isError
              ? "Saqlab bo‘lmadi. Maydonlarni tekshiring."
              : null
        }
      >
        <MaterialsTable
          items={materials}
          isLoading={isLoading}
          onEdit={(item) => {
            setEditing(item);
            setFormOpen(true);
          }}
          onDelete={setDeleting}
        />
      </AdminListLayout>

      <MaterialFormModal
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
