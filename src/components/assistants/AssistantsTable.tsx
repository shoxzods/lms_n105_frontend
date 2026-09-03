"use client";

import { Avatar } from "@/components/ui/Avatar";
import { EditPencilIcon, EyeOffIcon, TrashIcon } from "@/components/ui/icons";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Table, TableEmpty, Td, Th } from "@/components/ui/Table";
import { formatDateTime, ROLE_LABELS } from "@/lib/format";
import type { Assistant } from "@/types";

const COLUMN_COUNT = 8;

interface AssistantsTableProps {
  assistants: Assistant[];
  isLoading?: boolean;
  onView?: (assistant: Assistant) => void;
  onEdit?: (assistant: Assistant) => void;
  onDelete?: (assistant: Assistant) => void;
}

export function AssistantsTable({
  assistants,
  isLoading = false,
  onView,
  onEdit,
  onDelete,
}: AssistantsTableProps) {
  return (
    <Table>
      <thead>
        <tr>
          <Th width={70}>ID</Th>
          <Th width={280} filterable>
            F.I.Sh
          </Th>
          <Th filterable>Biriktirilgan kurs</Th>
          <Th sortable>Telefon raqami</Th>
          <Th sortable>Rol</Th>
          <Th sortable>Yaratilgan vaqt</Th>
          <Th width={120} filterable>
            Holat
          </Th>
          <Th width={150} align="center">
            Amallar
          </Th>
        </tr>
      </thead>

      <tbody>
        {isLoading && (
          <TableEmpty colSpan={COLUMN_COUNT} message="Yuklanmoqda..." />
        )}

        {!isLoading && assistants.length === 0 && (
          <TableEmpty colSpan={COLUMN_COUNT} message="Hech narsa topilmadi" />
        )}

        {!isLoading &&
          assistants.map((assistant) => (
            <tr key={assistant.id}>
              <Td>{assistant.id}</Td>

              <Td>
                <span className="flex items-center gap-2.5">
                  <Avatar fullName={assistant.full_name} file={assistant.file} />
                  <span className="truncate">{assistant.full_name}</span>
                </span>
              </Td>

              <Td>
                {assistant.courses && assistant.courses.length > 0
                  ? assistant.courses.map((c) => c.name).join(", ")
                  : "—"}
              </Td>

              <Td>{assistant.phone}</Td>
              <Td>{ROLE_LABELS[assistant.role]}</Td>
              <Td>{formatDateTime(assistant.create_at)}</Td>

              <Td>
                <StatusBadge status={assistant.status} />
              </Td>

              <Td align="center">
                <span className="flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => onView?.(assistant)}
                    disabled={!onView}
                    className="cursor-pointer rounded-full bg-subtle p-1.5 transition-colors hover:bg-hover disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Ko‘rish"
                  >
                    <EyeOffIcon />
                  </button>

                  <button
                    type="button"
                    onClick={() => onEdit?.(assistant)}
                    disabled={!onEdit}
                    className="cursor-pointer rounded-full bg-subtle p-1.5 transition-colors hover:bg-hover disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Tahrirlash"
                  >
                    <EditPencilIcon />
                  </button>

                  <button
                    type="button"
                    onClick={() => onDelete?.(assistant)}
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
