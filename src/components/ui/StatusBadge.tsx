import type { UserStatus } from "@/types";

const STYLES: Record<UserStatus, { label: string; className: string }> = {
  ACTIVE: {
    label: "Faol",
    className: "bg-[#ecfdf3] text-[#027a48]",
  },
  INACTIVE: {
    label: "Faol emas",
    className: "bg-[#fef3f2] text-[#b42318]",
  },
  PENDING: {
    label: "Kutilmoqda",
    className: "bg-[#fffaeb] text-[#b54708]",
  },
};

/** Figma: jadvaldagi "Holat" ustuni — yumaloq rangli yorliq */
export function StatusBadge({ status }: { status?: UserStatus }) {
  if (!status) return <span className="text-ink-500">—</span>;

  const { label, className } = STYLES[status];

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`}
    >
      {label}
    </span>
  );
}
