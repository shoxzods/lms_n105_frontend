"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { PaymentsTable } from "@/components/payments/PaymentsTable";
import { PaymentStatusModal } from "@/components/payments/PaymentStatusModal";
import {
  PaymentCreateModal,
  type PaymentCreateBody,
} from "@/components/payments/PaymentCreateModal";
import { Button } from "@/components/ui/Button";
import { CirclePlusIcon } from "@/components/ui/icons";
import { Pagination } from "@/components/ui/Pagination";
import { SuccessDialog } from "@/components/ui/SuccessDialog";
import { TableFooter } from "@/components/ui/TableFooter";
import { usePaymentMutations, usePaymentsList } from "@/hooks/usePayments";
import { apiErrorMessage } from "@/lib/apiError";
import { formatDateTime, formatPrice } from "@/lib/format";
import type { Payment, PaymentStatus } from "@/types";

export default function PaymentsPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [editing, setEditing] = useState<Payment | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const { payments, meta, isLoading, isError, error } = usePaymentsList({
    page,
    limit,
  });

  const { update, create } = usePaymentMutations();

  function handleCreate(body: PaymentCreateBody) {
    create.mutate(body, {
      onSuccess: () => {
        setCreating(false);
        create.reset();
        setSuccess("To‘lov qo‘shildi");
      },
    });
  }

  const [approvingKey, setApprovingKey] = useState<string | null>(null);

  function handleApprove(payment: Payment) {
    setApprovingKey(`${payment.userId}-${payment.courseId}`);

    update.mutate(
      {
        userId: payment.userId,
        courseId: payment.courseId,
        status: "COMPLETED",
      },
      {
        onSuccess: () => {
          update.reset();
          setSuccess("To‘lov tasdiqlandi");
        },
        onSettled: () => setApprovingKey(null),
      },
    );
  }

  function handleStatus(status: PaymentStatus) {
    if (!editing) return;

    update.mutate(
      { userId: editing.userId, courseId: editing.courseId, status },
      {
        onSuccess: () => {
          setEditing(null);
          update.reset();
          setSuccess(
            status === "COMPLETED"
              ? "To‘lov tasdiqlandi"
              : "To‘lov rad etildi",
          );
        },
      },
    );
  }

  return (
    <>
      <PageHeader
        title="To‘lovlar"
        breadcrumb={["Foydalanuvchilar", "To‘lovlar"]}
        action={
          <Button
            leftIcon={<CirclePlusIcon />}
            className="min-h-12"
            onClick={() => setCreating(true)}
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

        <div className="px-6">
          {isError && (
            <p className="mb-3 text-sm font-medium text-danger-500">
              {apiErrorMessage(error)}
            </p>
          )}

          <PaymentsTable
            payments={payments}
            isLoading={isLoading}
            approvingKey={approvingKey}
            onApprove={handleApprove}
            onEdit={setEditing}
          />
        </div>

        <TableFooter
          meta={meta}
          onPageChange={setPage}
          onLimitChange={(next) => {
            setLimit(next);
            setPage(1);
          }}
          fileName="tolovlar"
          rows={payments.map((payment) => ({
            ID: payment.userId,
            "Sotib oluvchi": payment.user.full_name,
            "Kurs nomi": payment.courses.name,
            "Yo’nalish": payment.courses.categories?.name ?? "",
            Summa: formatPrice(payment.price),
            Sana: formatDateTime(payment.create_at),
            Holat: payment.status,
          }))}
        />
      </div>

      <SuccessDialog
        open={success !== null}
        message={success ?? ""}
        onClose={() => setSuccess(null)}
      />

      <PaymentCreateModal
        open={creating}
        isPending={create.isPending}
        errorMessage={
          create.isError ? apiErrorMessage(create.error) : null
        }
        onClose={() => {
          setCreating(false);
          create.reset();
        }}
        onSubmit={handleCreate}
      />

      <PaymentStatusModal
        payment={editing}
        onClose={() => {
          setEditing(null);
          update.reset();
        }}
        onSelect={handleStatus}
        isPending={update.isPending}
        error={update.error}
      />
    </>
  );
}
