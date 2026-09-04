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
import { useAuthStore } from "@/store/auth";
import type { Assistant } from "@/types";

export default function AssistantsPage() {
  const userRole = useAuthStore((s) => s.user?.role);
  const isTeacher = userRole === "TEACHER";

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");

  const { assistants, meta, isLoading, isError, error } = useAssistantsList({
    page,
    limit,
    search: search || undefined,
  });

  const { create, update, remove } = useAssistantMutations();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Assistant | null>(null);
  const [viewing, setViewing] = useState<Assistant | null>(null);
  const [deleting, setDeleting] = useState<Assistant | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  function handleCreate(values: AssistantFormValues) {
    create.mutate(
      {
        full_name: values.full_name,
        phone: values.phone,
        password: values.password ?? "",
        courseId: values.courseId,
      },
      {
        onSuccess: () => {
          setFormOpen(false);
          create.reset();
          setSuccess("Muvaffaqiyatli qo‘shildi");
        },
      },
    );
  }

  function handleUpdate(values: AssistantFormValues) {
    if (!editing) return;

    update.mutate(
      {
        id: editing.id,
        payload: {
          full_name: values.full_name,
          phone: values.phone,
          courseId: values.courseId,
          ...(values.email ? { email: values.email } : {}),
        },
      },
      {
        onSuccess: () => {
          setEditing(null);
          update.reset();
          setSuccess("Muvaffaqiyatli tahrirlandi");
        },
      },
    );
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
            onEdit={setEditing}
            onDelete={isTeacher ? undefined : setDeleting}
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

      {/* Qo'shish modali */}
      <AssistantFormModal
        open={formOpen}
        mode="create"
        onClose={() => {
          setFormOpen(false);
          create.reset();
        }}
        onSubmit={handleCreate}
        isPending={create.isPending}
        error={create.error}
      />

      {/* Tahrirlash modali */}
      <AssistantFormModal
        open={editing !== null}
        mode="edit"
        initialValues={editing}
        onClose={() => {
          setEditing(null);
          update.reset();
        }}
        onSubmit={handleUpdate}
        isPending={update.isPending}
        error={update.error}
      />
    </>
  );
}
