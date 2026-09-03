"use client";

import { useState } from "react";
import {
  AssistantFormModal,
  type AssistantFormValues,
} from "@/components/assistants/AssistantFormModal";
import { AssistantsTable } from "@/components/assistants/AssistantsTable";
import { AssistantViewModal } from "@/components/assistants/AssistantViewModal";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { SuccessDialog } from "@/components/ui/SuccessDialog";
import { CirclePlusIcon } from "@/components/ui/icons";
import { Pagination } from "@/components/ui/Pagination";
import { SearchBar } from "@/components/ui/SearchBar";
import { useAssistantMutations, useAssistantsList } from "@/hooks/useAssistants";
import { apiErrorMessage } from "@/lib/apiError";
import type { Assistant } from "@/types";

export default function AssistantsPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");

  const { assistants, meta, isLoading, isError, error } = useAssistantsList({
    page,
    limit,
    search: search || undefined,
  });

  const { create, remove } = useAssistantMutations();
  const [formOpen, setFormOpen] = useState(false);
  const [viewing, setViewing] = useState<Assistant | null>(null);
  const [deleting, setDeleting] = useState<Assistant | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  function handleCreate(values: AssistantFormValues) {
    create.mutate(values, {
      onSuccess: () => {
        setFormOpen(false);
        create.reset();
        setSuccess("Muvaffaqiyatli qo‘shildi");
      },
    });
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

  return (
    <>
      <PageHeader
        title="Assistentlar"
        breadcrumb={["Foydalanuvchilar", "Assistentlar"]}
        action={
          <Button
            leftIcon={<CirclePlusIcon />}
            className="min-h-12"
            onClick={() => setFormOpen(true)}
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

          {remove.isError && (
            <p className="mb-3 text-sm font-medium text-danger-500">
              O&rsquo;chirib bo&rsquo;lmadi — assistent kursga biriktirilgan
              bo&rsquo;lishi mumkin.
            </p>
          )}

          <AssistantsTable
            assistants={assistants}
            isLoading={isLoading}
            onView={setViewing}
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

      <AssistantViewModal
        assistant={viewing}
        onClose={() => setViewing(null)}
      />

      <AssistantFormModal
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          create.reset();
        }}
        onSubmit={handleCreate}
        isPending={create.isPending}
        error={create.error}
      />
    </>
  );
}
