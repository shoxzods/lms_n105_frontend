"use client";

import { Pagination } from "@/components/ui/Pagination";
import { useT } from "@/lib/i18n";
import type { PaginationMeta } from "@/types";

/** Figma dagi yashil Excel ikonkasi */
function ExcelIcon() {
  return (
    <svg viewBox="0 0 16 16" className="size-4 shrink-0" aria-hidden>
      <rect width="16" height="16" rx="2" fill="#1D6F42" />
      <path
        d="M4.6 4.6l2.2 3.4-2.2 3.4h1.6l1.4-2.3 1.4 2.3h1.6L8.4 8l2.2-3.4H9L7.6 6.9 6.2 4.6H4.6z"
        fill="#fff"
      />
    </svg>
  );
}

interface TableFooterProps {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  /** Yuklab olinadigan qatorlar — sarlavha nomlari bilan */
  rows: Record<string, string | number>[];
  fileName: string;
}

/**
 * Figma: jadval ostidagi qator — nechtadan nechtagacha, .XLS yuklab olish
 * va yana bir marta sahifalash.
 *
 * Fayl brauzerning o'zida yasaladi: Excel HTML jadvalni ham `.xls` sifatida
 * ochadi, shuning uchun qo'shimcha kutubxona kerak emas.
 */
export function TableFooter({
  meta,
  onPageChange,
  onLimitChange,
  rows,
  fileName,
}: TableFooterProps) {
  const t = useT();

  function download() {
    if (rows.length === 0) return;

    const headers = Object.keys(rows[0]);

    const escape = (value: string | number) =>
      String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;");

    const html = `<html xmlns:x="urn:schemas-microsoft-com:office:excel"><head><meta charset="utf-8" /></head><body><table border="1"><thead><tr>${headers
      .map((h) => `<th>${escape(h)}</th>`)
      .join("")}</tr></thead><tbody>${rows
      .map(
        (row) =>
          `<tr>${headers.map((h) => `<td>${escape(row[h] ?? "")}</td>`).join("")}</tr>`,
      )
      .join("")}</tbody></table></body></html>`;

    /* ﻿ — BOM, busiz Excel kirill va o'zbek harflarini buzib ko'rsatadi */
    const blob = new Blob(["﻿", html], {
      type: "application/vnd.ms-excel;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `${fileName}.xls`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  const from = meta.total === 0 ? 0 : (meta.page - 1) * meta.limit + 1;
  const to = Math.min(meta.page * meta.limit, meta.total);

  return (
    <div className="flex w-full min-w-240 flex-wrap items-center justify-between gap-5 px-6 pt-1">
      <div className="flex items-center gap-6">
        <p className="whitespace-nowrap text-sm font-semibold text-page-fg">
          Sahifada {from}-{to} gacha. Umumiy {meta.total}ta
        </p>

        <button
          type="button"
          onClick={download}
          disabled={rows.length === 0}
          className="flex cursor-pointer items-center gap-2 text-sm font-medium text-page-fg transition-colors hover:text-brand-600 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ExcelIcon />
          <span>
            ({rows.length}) {t("Yuklab olish")} .XLS
          </span>
        </button>
      </div>

      <Pagination
        page={meta.page}
        limit={meta.limit}
        total={meta.total}
        totalPages={meta.totalPages}
        onPageChange={onPageChange}
        onLimitChange={onLimitChange}
        compact
      />
    </div>
  );
}
