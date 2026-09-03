"use client";

import { useState } from "react";
import { CategoriesTable } from "@/components/categories/CategoriesTable";
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
  const [deleting, setDeleting] = useState<Category | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  /**
   * Hozircha `prompt` — Figma dagi modal oynasi hali qurilmagan.
   * Modal tayyor bo'lgach shu uch joy almashtiriladi.
   */
  function handleCreate() {
    const name = window.prompt("Yangi kategoriya nomi:");
    if (name?.trim()) {
      create.mutate(name.trim(), {
        onSuccess: () => setSuccess("Muvaffaqiyatli qo‘shildi"),
      });
    }
  }

  function handleEdit(category: Category) {
    const name = window.prompt("Yangi nom:", category.name);
    if (name?.trim() && name.trim() !== category.name) {
      update.mutate(
        { id: category.id, name: name.trim() },
        { onSuccess: () => setSuccess("Muvaffaqiyatli o‘zgartirildi") },
      );
    }
  }

  function confirmDelete() {
    if (!deleting) return;

    remove.mutate(deleting.id, {
      onSuccess: () => {
        setDeleting(null);
        setSuccess("Muvaffaqiyatli o‘chirildi");
      },
    });
  }

  const mutationError =
    create.error ?? update.error ?? remove.error ?? null;

  return (
    <>
      <PageHeader
        title="Kurs kategoriyalari"
        breadcrumb={["Materiallar", "Kurs kategoriyalari"]}
        action={
          <Button
            leftIcon={<CirclePlusIcon />}
            className="min-h-12"
            onClick={handleCreate}
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

          {mutationError && (
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
      <SuccessDialog
        open={success !== null}
        message={success ?? ""}
        onClose={() => setSuccess(null)}
      />

      <ConfirmDialog
        open={deleting !== null}
        isPending={remove.isPending}
        onConfirm={confirmDelete}
        onCancel={() => setDeleting(null)}
      />
    </>
  );
}
