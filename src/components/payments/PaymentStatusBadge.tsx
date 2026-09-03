import type { PaymentStatus } from "@/types";

const STYLES: Record<PaymentStatus, { label: string; className: string }> = {
  COMPLETED: {
    label: "To‘landi",
    className:
      "bg-[#ecfdf3] text-[#027a48] dark:bg-[#053321] dark:text-[#6ce9a6]",
  },
  PENDING: {
    label: "Kutilmoqda",
    className:
      "bg-[#fffaeb] text-[#b54708] dark:bg-[#3b2708] dark:text-[#fec84b]",
  },
  REJECTED: {
    label: "Rad etilgan",
    className:
      "bg-[#fef3f2] text-[#b42318] dark:bg-[#3b1211] dark:text-[#fda29b]",
  },
};

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  const { label, className } = STYLES[status];

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`}
    >
      {label}
    </span>
  );
}
