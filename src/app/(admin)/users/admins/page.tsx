"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { SuccessDialog } from "@/components/ui/SuccessDialog";
import { CirclePlusIcon } from "@/components/ui/icons";
import { Pagination } from "@/components/ui/Pagination";
import { SearchBar } from "@/components/ui/SearchBar";
import { AdminFormModal } from "@/components/users/AdminFormModal";
import { UsersTable } from "@/components/users/UsersTable";
import { useUserMutations, useUsersList } from "@/hooks/useUsers";
import { apiErrorMessage } from "@/lib/apiError";
import type { CreateAdminRequest, UpdateAdminRequest, User } from "@/types";

export default function AdminsPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");

  const { users, meta, clientSideFallback, isLoading, isError, error } =
    useUsersList({
      page,
      limit,
      search: search || undefined,
      role: "ADMIN",
    });

  const { create, update, remove } = useUserMutations();

  // Create modal
  const [formOpen, setFormOpen] = useState(false);

  // Edit modal
  const [editing, setEditing] = useState<User | null>(null);

  // Delete confirm
  const [deleting, setDeleting] = useState<User | null>(null);

  // Success message
  const [success, setSuccess] = useState<string | null>(null);

  function handleCreate(values: CreateAdminRequest) {
    create.mutate(values, {
      onSuccess: () => {
        setFormOpen(false);
        create.reset();
        setSuccess("Administrator muvaffaqiyatli qo'shildi");
      },
    });
  }

  function handleUpdate(values: UpdateAdminRequest) {
    if (!editing) return;
    update.mutate(
      { id: editing.id, ...values },
      {
        onSuccess: () => {
          setEditing(null);
          update.reset();
          setSuccess("Administrator muvaffaqiyatli yangilandi");
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
        title="Administratorlar"
        breadcrumb={["Foydalanuvchilar", "Administratorlar"]}
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
              {apiErrorMessage(remove.error)}
            </p>
          )}

          {clientSideFallback && !isError && (
            <p className="mb-3 text-xs font-medium text-ink-500">
              Eslatma: sahifalash va filtr hozircha brauzerda bajarilmoqda —
              backendda <code>page</code>, <code>limit</code>,{" "}
              <code>search</code>, <code>role</code> parametrlari hali
              qo&rsquo;shilmagan.
            </p>
          )}

          <UsersTable
            users={users}
            isLoading={isLoading}
            onEdit={setEditing}
            onDelete={setDeleting}
          />
        </div>
      </div>

      {/* Create modal */}
      <AdminFormModal
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          create.reset();
        }}
        onSubmit={handleCreate}
        isPending={create.isPending}
        error={create.error}
      />

      {/* Edit modal */}
      <AdminFormModal
        mode="edit"
        open={editing !== null}
        initialValues={
          editing
            ? {
                full_name: editing.full_name,
                phone: editing.phone,
                email: editing.email,
              }
            : { full_name: "", phone: "", email: null }
        }
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
