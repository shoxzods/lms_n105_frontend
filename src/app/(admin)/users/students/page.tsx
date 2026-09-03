"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { StudentsTable } from "@/components/students/StudentsTable";
import {
  StudentEditModal,
  type StudentEditValues,
} from "@/components/students/StudentEditModal";
import { StudentViewModal } from "@/components/students/StudentViewModal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Pagination } from "@/components/ui/Pagination";
import { SearchBar } from "@/components/ui/SearchBar";
import { SuccessDialog } from "@/components/ui/SuccessDialog";
import { useUserMutations, useUsersList } from "@/hooks/useUsers";
import { apiErrorMessage } from "@/lib/apiError";
import type { Student } from "@/types";

export default function StudentsPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState<Student | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [viewing, setViewing] = useState<Student | null>(null);
  const [editing, setEditing] = useState<Student | null>(null);

  const { users, meta, isLoading, isError, error } = useUsersList({
    page,
    limit,
    search: search || undefined,
    role: "STUDENT",
  });

  const { update, remove } = useUserMutations();

  function handleEdit(values: StudentEditValues) {
    if (!editing) return;

    update.mutate(
      { id: editing.id, ...values },
      {
        onSuccess: () => {
          setEditing(null);
          update.reset();
          setSuccess("Muvaffaqiyatli o‘zgartirildi");
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
        title="Studentlar"
        breadcrumb={["Foydalanuvchilar", "Studentlar"]}
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
              {apiErrorMessage(remove.error)}
            </p>
          )}

          <StudentsTable
            students={users}
            isLoading={isLoading}
            onView={setViewing}
            onEdit={setEditing}
            onDelete={setDeleting}
          />
        </div>
      </div>

      <StudentViewModal student={viewing} onClose={() => setViewing(null)} />

      <StudentEditModal
        student={editing}
        onClose={() => {
          setEditing(null);
          update.reset();
        }}
        onSubmit={handleEdit}
        isPending={update.isPending}
        error={update.error}
      />

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
