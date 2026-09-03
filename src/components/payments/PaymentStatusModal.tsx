"use client";

import { Modal } from "@/components/ui/Modal";
import { apiErrorMessage } from "@/lib/apiError";
import { formatPrice } from "@/lib/format";
import type { Payment, PaymentStatus } from "@/types";

/** To'lovni tasdiqlash yoki rad etish */
export function PaymentStatusModal({
  payment,
  onClose,
  onSelect,
  isPending,
  error,
}: {
  payment: Payment | null;
  onClose: () => void;
  onSelect: (status: PaymentStatus) => void;
  isPending?: boolean;
  error?: unknown;
}) {
  if (!payment) return null;

  return (
    <Modal open title="To‘lovni ko‘rib chiqish" onClose={onClose} width={460}>
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2 rounded-lg bg-muted p-4">
          <p className="text-sm font-medium text-ink-500">
            Sotib oluvchi:{" "}
            <span className="font-bold text-page-fg">
              {payment.user.full_name}
            </span>
          </p>
          <p className="text-sm font-medium text-ink-500">
            Kurs:{" "}
            <span className="font-bold text-page-fg">
              {payment.courses.name}
            </span>
          </p>
          <p className="text-sm font-medium text-ink-500">
            Summa:{" "}
            <span className="font-bold text-page-fg">
              {formatPrice(payment.price)} UZS
            </span>
          </p>
        </div>

        {error ? (
          <p className="text-sm font-medium text-danger-500">
            {apiErrorMessage(error)}
          </p>
        ) : null}

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onSelect("COMPLETED")}
            disabled={isPending}
            className="flex-1 cursor-pointer rounded-lg bg-[#26bf56] px-4 py-2.5 text-sm font-medium text-white disabled:opacity-60"
          >
            Tasdiqlash
          </button>

          <button
            type="button"
            onClick={() => onSelect("REJECTED")}
            disabled={isPending}
            className="flex-1 cursor-pointer rounded-lg bg-danger-500 px-4 py-2.5 text-sm font-medium text-white disabled:opacity-60"
          >
            Rad etish
          </button>
        </div>
      </div>
    </Modal>
  );
}
