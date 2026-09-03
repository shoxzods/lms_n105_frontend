"use client";

import type { ReactNode } from "react";
import { CaretSortIcon, FilterIcon } from "@/components/ui/icons";
import { Spinner } from "@/components/ui/Spinner";
import { useT } from "@/lib/i18n";

/**
 * Figma "Table" (91:4378) uslubidagi jadval qismlari.
 * Chegara rangi #EAECF0, sarlavha foni #F7F7F8.
 */

export function Table({ children }: { children: ReactNode }) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-240 border-collapse bg-card text-left">
        {children}
      </table>
    </div>
  );
}

export function Th({
  children,
  width,
  align = "left",
  sortable = false,
  filterable = false,
}: {
  children: ReactNode;
  width?: number;
  align?: "left" | "center";
  sortable?: boolean;
  filterable?: boolean;
}) {
  return (
    <th
      style={width ? { width } : undefined}
      className={`h-10 border-l border-line bg-table-head px-5 py-3 text-xs font-semibold leading-none text-page-fg ${
        align === "center" ? "text-center" : "text-left"
      }`}
    >
      <span
        className={`flex items-center gap-2 ${
          align === "center" ? "justify-center" : "justify-between"
        }`}
      >
        <span className="flex-1">{children}</span>
        {filterable && <FilterIcon />}
        {sortable && <CaretSortIcon />}
      </span>
    </th>
  );
}

export function Td({
  children,
  align = "left",
  className = "",
}: {
  children: ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <td
      className={`h-16 border-b border-l border-line px-5 py-5 text-sm font-medium text-page-fg ${
        align === "center" ? "text-center" : "text-left"
      } ${className}`}
    >
      {children}
    </td>
  );
}

export function TableEmpty({
  colSpan,
  message,
}: {
  colSpan: number;
  message: string;
}) {
  const t = useT();
  const isLoading =
    message === "Yuklanmoqda..." || message.toLowerCase().includes("yuklan");

  return (
    <tr>
      <td
        colSpan={colSpan}
        className="border-b border-l border-line px-5 py-12 text-center"
      >
        {isLoading ? (
          <Spinner size="md" label={t("Yuklanmoqda...")} />
        ) : (
          <p className="text-sm font-medium text-ink-500">{t(message)}</p>
        )}
      </td>
    </tr>
  );
}
