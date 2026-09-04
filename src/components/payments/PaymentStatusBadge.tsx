import type { PaymentStatus } from "@/types";

const STYLES: Record<PaymentStatus, { label: string; className: string }> = {
  COMPLETED: {
    label: "To‘landi",
    className: "bg-[#ecfdf3] text-[#027a48]",
  },
  PENDING: {
    label: "Kutilmoqda",
    className: "bg-[#fffaeb] text-[#b54708]",
  },
  REJECTED: {
    label: "Rad etilgan",
    className: "bg-[#fef3f2] text-[#b42318]",
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
