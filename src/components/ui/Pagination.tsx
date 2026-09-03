"use client";

import { ChevronDownSm } from "@/components/ui/icons";
import { useT } from "@/lib/i18n";

const PAGE_SIZES = [10, 20, 50];

interface PaginationProps {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  /** Jadval ostida ishlatilganda chapdagi "Umumiy Nta" matni chiqmaydi */
  compact?: boolean;
}

/**
 * Sahifa raqamlari ro'yxati: 1 2 3 ... 15
 * Ko'p sahifa bo'lsa o'rtasi "..." bilan qisqartiriladi.
 */
function buildPages(page: number, totalPages: number): (number | "...")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: (number | "...")[] = [1];
  if (page > 3) pages.push("...");

  const start = Math.max(2, page - 1);
  const end = Math.min(totalPages - 1, page + 1);

  for (let i = start; i <= end; i += 1) {
    pages.push(i);
  }

  if (page < totalPages - 2) pages.push("...");
  pages.push(totalPages);

  return pages;
}

/** Figma: jadval ustidagi qator (91:41192) */
export function Pagination({
  page,
  limit,
  total,
  totalPages,
  onPageChange,
  onLimitChange,
  compact = false,
}: PaginationProps) {
  const t = useT();
  const from = total === 0 ? 0 : (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  return (
    <div
      className={
        compact
          ? "flex items-center gap-5"
          : "flex w-full min-w-240 items-center justify-between gap-5 px-6"
      }
    >
      {!compact && (
        <p className="whitespace-nowrap text-sm font-semibold text-page-fg">
          Sahifada {from}-{to} gacha. Umumiy {total}ta
        </p>
      )}

      <div className="flex items-center gap-5">
        {/* Bir sahifada nechta */}
        <label className="relative flex min-h-9 items-center gap-0.5 text-sm font-medium text-page-fg">
          <span className="whitespace-nowrap">{t("Bir sahifada:")}</span>
          <select
            value={limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            className="cursor-pointer appearance-none bg-transparent pr-4 outline-none"
          >
            {PAGE_SIZES.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-0">
            <ChevronDownSm />
          </span>
        </label>

        {/* Sahifa raqamlari */}
        <div className="flex items-center justify-end gap-1">
          <div className="flex items-start gap-0.5">
            {buildPages(page, totalPages).map((item, index) =>
              item === "..." ? (
                <span
                  key={`gap-${index}`}
                  className="flex w-9 items-center justify-center px-5 py-2 text-sm font-medium text-page-fg"
                >
                  ...
                </span>
              ) : (
                <button
                  key={`page-${item}-${index}`}
                  type="button"
                  onClick={() => onPageChange(item)}
                  className={`flex w-9 cursor-pointer items-center justify-center rounded-lg px-5 py-2 text-center text-sm font-medium transition-colors ${
                    item === page
                      ? "border border-line bg-card text-page-fg"
                      : "text-page-fg hover:bg-hover"
                  }`}
                >
                  {item}
                </button>
              ),
            )}
          </div>

          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
            className="cursor-pointer rounded-lg border border-line px-5 py-2 text-sm font-medium text-page-fg transition-colors hover:bg-hover disabled:cursor-not-allowed disabled:opacity-40"
          >
            {t("Keyingi")}
          </button>
        </div>
      </div>
    </div>
  );
}
