"use client";

import { EditPencilIcon, TrashIcon } from "@/components/ui/icons";
import { Table, TableEmpty, Td, Th } from "@/components/ui/Table";
import { formatDateTime } from "@/lib/format";
import type { Category } from "@/types";

const COLUMN_COUNT = 4;

interface CategoriesTableProps {
  categories: Category[];
  isLoading?: boolean;
  onEdit?: (category: Category) => void;
  onDelete?: (category: Category) => void;
}

export function CategoriesTable({
  categories,
  isLoading = false,
  onEdit,
  onDelete,
}: CategoriesTableProps) {
  return (
    <Table>
      <thead>
        <tr>
          <Th width={91}>ID</Th>
          <Th filterable>Nomi</Th>
          <Th sortable>Yaratilgan vaqt</Th>
          <Th width={140} align="center">
            Amallar
          </Th>
        </tr>
      </thead>

      <tbody>
        {isLoading && (
          <TableEmpty colSpan={COLUMN_COUNT} message="Yuklanmoqda..." />
        )}

        {!isLoading && categories.length === 0 && (
          <TableEmpty colSpan={COLUMN_COUNT} message="Hech narsa topilmadi" />
        )}

        {!isLoading &&
          categories.map((category) => (
            <tr key={category.id}>
              <Td>{category.id}</Td>
              <Td>{category.name}</Td>
              <Td>{formatDateTime(category.create_at)}</Td>

              <Td align="center">
                <span className="flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit?.(category)}
                    disabled={!onEdit}
                    className="cursor-pointer rounded-full bg-subtle p-1.5 transition-colors hover:bg-hover disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Tahrirlash"
                  >
                    <EditPencilIcon />
                  </button>

                  <button
                    type="button"
                    onClick={() => onDelete?.(category)}
                    disabled={!onDelete}
                    className="cursor-pointer rounded-full bg-subtle p-1.5 transition-colors hover:bg-hover disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="O‘chirish"
                  >
                    <TrashIcon />
                  </button>
                </span>
              </Td>
            </tr>
          ))}
      </tbody>
    </Table>
  );
}
