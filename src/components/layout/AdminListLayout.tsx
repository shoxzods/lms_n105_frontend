"use client";

import type { ReactNode } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Pagination } from "@/components/ui/Pagination";
import { SearchBar } from "@/components/ui/SearchBar";
import { TableFooter } from "@/components/ui/TableFooter";
import { apiErrorMessage } from "@/lib/apiError";
import type { PaginationMeta } from "@/types";

interface AdminListLayoutProps {
  title: string;
  breadcrumb: string[];
  action?: ReactNode;
  /** Jadval ustidagi filtr maydonlari (masalan "Kurs bo'yicha") */
  filters?: ReactNode;
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  search: string;
  onSearch: (value: string) => void;
  error?: unknown;
  mutationError?: string | null;
  /** Jadval ostidagi .XLS uchun qatorlar */
  exportRows?: Record<string, string | number>[];
  exportName?: string;
  children: ReactNode;
}

/**
 * Admin paneldagi ro'yxat sahifalari bir xil qolipda: sarlavha, sahifalash,
 * qidiruv, xato satri va jadval. Kategoriyalar/Studentlar sahifalaridagi
 * tuzilma shu yerga ko'chirildi.
 */
export function AdminListLayout({
  title,
  breadcrumb,
  action,
  filters,
  meta,
  onPageChange,
  onLimitChange,
  search,
  onSearch,
  error,
  mutationError,
  exportRows,
  exportName = "royxat",
  children,
}: AdminListLayoutProps) {
  return (
    <>
      <PageHeader title={title} breadcrumb={breadcrumb} action={action} />

      <div className="flex w-full max-w-[1600px] flex-col gap-6 pb-8">
        <Pagination
          page={meta.page}
          limit={meta.limit}
          total={meta.total}
          totalPages={meta.totalPages}
          onPageChange={onPageChange}
          onLimitChange={onLimitChange}
        />

        <SearchBar defaultValue={search} onSearch={onSearch} />

        {filters && <div className="px-6">{filters}</div>}

        <div className="px-6">
          {error != null && (
            <p className="mb-3 text-sm font-medium text-danger-500">
              {apiErrorMessage(error)}
            </p>
          )}

          {mutationError && (
            <p className="mb-3 text-sm font-medium text-danger-500">
              {mutationError}
            </p>
          )}

          {children}
        </div>

        {exportRows && (
          <TableFooter
            meta={meta}
            onPageChange={onPageChange}
            onLimitChange={onLimitChange}
            rows={exportRows}
            fileName={exportName}
          />
        )}
      </div>
    </>
  );
}
