"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { MentorFormModal } from "@/components/mentors/MentorFormModal";
import { MentorsTable } from "@/components/mentors/MentorsTable";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { SuccessDialog } from "@/components/ui/SuccessDialog";
import { CirclePlusIcon } from "@/components/ui/icons";
import { Pagination } from "@/components/ui/Pagination";
import { SearchBar } from "@/components/ui/SearchBar";
import { apiErrorMessage } from "@/lib/apiError";
import { useMentorMutations, useMentorsList } from "@/hooks/useMentors";
import type { Mentor } from "@/types";

export default function MentorsPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");

  const { mentors, meta, isLoading, isError, error } = useMentorsList({
    page,
    limit,
    search: search || undefined,
  });

  const { create, update, remove } = useMentorMutations();
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<Mentor | null>(null);
  const [deleting, setDeleting] = useState<Mentor | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

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
        title="Mentorlar"
        breadcrumb={["Foydalanuvchilar", "Mentorlar"]}
        action={
          <Button
            leftIcon={<CirclePlusIcon />}
            className="min-h-12"
            onClick={() => setAdding(true)}
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
              O&rsquo;chirib bo&rsquo;lmadi — mentorda kurslar bor
              bo&rsquo;lishi mumkin.
            </p>
          )}

          <MentorsTable
            mentors={mentors}
            isLoading={isLoading}
            onEdit={setEditing}
            onDelete={setDeleting}
          />
        </div>
      </div>
      <SuccessDialog
        open={success !== null}
        message={success ?? ""}
        onClose={() => setSuccess(null)}
      />

      <MentorFormModal
        open={adding}
        isPending={create.isPending}
        errorMessage={create.isError ? apiErrorMessage(create.error) : null}
        onClose={() => {
          setAdding(false);
          create.reset();
        }}
        onSubmit={(form) =>
          create.mutate(form, {
            onSuccess: () => {
              setAdding(false);
              setSuccess("Muvaffaqiyatli qo‘shildi");
            },
          })
        }
      />

      <MentorFormModal
        open={editing !== null}
        mentor={editing}
        isPending={update.isPending}
        errorMessage={update.isError ? apiErrorMessage(update.error) : null}
        onClose={() => {
          setEditing(null);
          update.reset();
        }}
        onSubmit={(form) => {
          if (!editing) return;

          update.mutate(
            { id: editing.id, form },
            {
              onSuccess: () => {
                setEditing(null);
                setSuccess("Muvaffaqiyatli saqlandi");
              },
            },
          );
        }}
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
