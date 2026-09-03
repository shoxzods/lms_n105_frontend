"use client";

import { useState } from "react";
import { CategoriesTable } from "@/components/categories/CategoriesTable";
import { CategoryFormModal } from "@/components/categories/CategoryFormModal";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { SuccessDialog } from "@/components/ui/SuccessDialog";
import { CirclePlusIcon } from "@/components/ui/icons";
import { Pagination } from "@/components/ui/Pagination";
import { SearchBar } from "@/components/ui/SearchBar";
import { apiErrorMessage } from "@/lib/apiError";
import { useCategoriesList, useCategoryMutations } from "@/hooks/useCategories";
import type { Category } from "@/types";

export default function CategoriesPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");

  const { categories, meta, isLoading, isError, error } = useCategoriesList({
    page,
    limit,
    search: search || undefined,
  });

  const { create, update, remove } = useCategoryMutations();

  // Create modal
  const [createOpen, setCreateOpen] = useState(false);

  // Edit modal
  const [editing, setEditing] = useState<Category | null>(null);

  // Delete confirm
  const [deleting, setDeleting] = useState<Category | null>(null);

  // Success message
  const [success, setSuccess] = useState<string | null>(null);

  function handleCreate(name: string) {
    create.mutate(name, {
      onSuccess: () => {
        setCreateOpen(false);
        create.reset();
        setSuccess("Kategoriya muvaffaqiyatli qo'shildi");
      },
    });
  }

  function handleEdit(category: Category) {
    setEditing(category);
  }

  function handleUpdate(name: string) {
    if (!editing) return;
    update.mutate(
      { id: editing.id, name },
      {
        onSuccess: () => {
          setEditing(null);
          update.reset();
          setSuccess("Kategoriya muvaffaqiyatli o'zgartirildi");
        },
      },
    );
  }

  function confirmDelete() {
    if (!deleting) return;
    remove.mutate(deleting.id, {
      onSuccess: () => {
        setDeleting(null);
        setSuccess("Muvaffaqiyatli o'chirildi");
      },
    });
  }

  return (
    <>
      <PageHeader
        title="Kurs kategoriyalari"
        breadcrumb={["Materiallar", "Kurs kategoriyalari"]}
        action={
          <Button
            leftIcon={<CirclePlusIcon />}
            className="min-h-12"
            onClick={() => setCreateOpen(true)}
          >
            Qo&rsquo;shish
          </Button>
        }
      />

      <div className="flex w-full max-w-[1600px] flex-col gap-6 pb-8">
        <Pagination
          page={meta.page}
          limit={meta.limit}
          total={meta.total}
          totalPages={meta.totalPages}
          onPageChange={setPage}
          onLimitChange={(next) => {
            setLimit(next);
            setPage(1);
          }}
        />

        <SearchBar
          defaultValue={search}
          onSearch={(value) => {
            setSearch(value);
            setPage(1);
          }}
        />

        <div className="px-6">
          {isError && (
            <p className="mb-3 text-sm font-medium text-danger-500">
              {apiErrorMessage(error)}
            </p>
          )}

          {(create.isError || update.isError || remove.isError) && (
            <p className="mb-3 text-sm font-medium text-danger-500">
              Amalni bajarib bo&rsquo;lmadi. Kategoriyada kurslar bor
              bo&rsquo;lishi mumkin.
            </p>
          )}

          <CategoriesTable
            categories={categories}
            isLoading={isLoading}
            onEdit={handleEdit}
            onDelete={setDeleting}
          />
        </div>
      </div>

      {/* Create modal */}
      <CategoryFormModal
        open={createOpen}
        onClose={() => {
          setCreateOpen(false);
          create.reset();
        }}
        onSubmit={handleCreate}
        isPending={create.isPending}
        error={create.error}
      />

      {/* Edit modal */}
      <CategoryFormModal
        open={editing !== null}
        initialName={editing?.name ?? ""}
        onClose={() => {
          setEditing(null);
          update.reset();
        }}
        onSubmit={handleUpdate}
        isPending={update.isPending}
        error={update.error}
      />

      {/* Success */}
      <SuccessDialog
        open={success !== null}
        message={success ?? ""}
        onClose={() => setSuccess(null)}
      />

      {/* Delete confirm */}
      <ConfirmDialog
        open={deleting !== null}
        isPending={remove.isPending}
        onConfirm={confirmDelete}
        onCancel={() => setDeleting(null)}
      />
    </>
  );
}
