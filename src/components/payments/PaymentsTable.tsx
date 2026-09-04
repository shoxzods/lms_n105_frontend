"use client";

import { Avatar } from "@/components/ui/Avatar";
import { EditPencilIcon, TrashIcon } from "@/components/ui/icons";
import { Table, TableEmpty, Td, Th } from "@/components/ui/Table";
import { formatDateTime, formatPrice } from "@/lib/format";
import type { Payment } from "@/types";
import { PaymentStatusBadge } from "./PaymentStatusBadge";

const COLUMN_COUNT = 9;

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-3.5"
      aria-hidden
    >
      <path d="M3 8.5l3.5 3.5L13 5" />
    </svg>
  );
}

interface PaymentsTableProps {
  payments: Payment[];
  isLoading?: boolean;
  approvingKey?: string | null;
  onEdit?: (payment: Payment) => void;
  onApprove?: (payment: Payment) => void;
  onDelete?: (payment: Payment) => void;
}

export function PaymentsTable({
  payments,
  isLoading = false,
  approvingKey,
  onEdit,
  onApprove,
  onDelete,
}: PaymentsTableProps) {
  return (
    <Table>
      <thead>
        <tr>
          <Th width={70}>ID</Th>
          <Th width={300} filterable>
            Sotib oluvchi
          </Th>
          <Th filterable>Kurs nomi</Th>
          <Th filterable>Yo&rsquo;nalish</Th>
          <Th sortable>Summa</Th>
          <Th sortable>Sana</Th>
          <Th width={130} filterable>
            Holat
          </Th>
          <Th width={160} align="center">
            Tasdiqlash
          </Th>
          <Th width={120} align="center">
            Amallar
          </Th>
        </tr>
      </thead>

      <tbody>
        {isLoading && (
          <TableEmpty colSpan={COLUMN_COUNT} message="Yuklanmoqda..." />
        )}

        {!isLoading && payments.length === 0 && (
          <TableEmpty colSpan={COLUMN_COUNT} message="Hech narsa topilmadi" />
        )}

        {!isLoading &&
          payments.map((payment, index) => (
            <tr key={`${payment.userId}-${payment.courseId}`}>
              <Td>{index + 1}</Td>

              <Td>
                <span className="flex items-center gap-2.5">
                  <Avatar
                    fullName={payment.user.full_name}
                    file={payment.user.file}
                  />
                  <span className="truncate">{payment.user.full_name}</span>
                </span>
              </Td>

              <Td>{payment.courses.name}</Td>
              <Td>{payment.courses.categories?.name ?? "—"}</Td>
              <Td>{formatPrice(payment.price)}</Td>
              <Td>{formatDateTime(payment.create_at)}</Td>

              <Td>
                <PaymentStatusBadge status={payment.status} />
              </Td>

              <Td align="center">
                {payment.status === "COMPLETED" ? (
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#ecfdf3] px-3 py-2 text-xs font-medium text-[#027a48]">
                    <CheckIcon />
                    Tasdiqlangan
                  </span>
                ) : onApprove ? (
                  <button
                    type="button"
                    onClick={() => onApprove(payment)}
                    disabled={
                      approvingKey === `${payment.userId}-${payment.courseId}`
                    }
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-line px-3 py-2 text-xs font-medium text-page-fg transition-colors hover:border-[#12b76a] hover:text-[#027a48] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <CheckIcon />
                    {approvingKey === `${payment.userId}-${payment.courseId}`
                      ? "..."
                      : "Tasdiqlash"}
                  </button>
                ) : (
                  <span className="text-xs text-ink-500">—</span>
                )}
              </Td>

              <Td align="center">
                <span className="flex items-center justify-center gap-2">
                  {onEdit && (
                    <button
                      type="button"
                      onClick={() => onEdit(payment)}
                      className="cursor-pointer rounded-full bg-subtle p-1.5 transition-colors hover:bg-hover"
                      aria-label="Holatni o‘zgartirish"
                    >
                      <EditPencilIcon />
                    </button>
                  )}

                  {onDelete && (
                    <button
                      type="button"
                      onClick={() => onDelete(payment)}
                      className="cursor-pointer rounded-full bg-subtle p-1.5 transition-colors hover:bg-hover"
                      aria-label="O‘chirish"
                    >
                      <TrashIcon />
                    </button>
                  )}

                  {!onEdit && !onDelete && <span className="text-xs text-ink-500">—</span>}
                </span>
              </Td>
            </tr>
          ))}
      </tbody>
    </Table>
  );
}
