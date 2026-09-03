"use client";

import { Avatar } from "@/components/ui/Avatar";
import { EditPencilIcon, TrashIcon } from "@/components/ui/icons";
import { Table, TableEmpty, Td, Th } from "@/components/ui/Table";
import { formatDateTime, ROLE_LABELS } from "@/lib/format";
import type { User } from "@/types";

const COLUMN_COUNT = 6;

interface UsersTableProps {
  users: User[];
  isLoading?: boolean;
  onEdit?: (user: User) => void;
  /** Backendda DELETE hali yo'q — berilmasa tugma o'chirilgan holatda chiziladi */
  onDelete?: (user: User) => void;
}

export function UsersTable({
  users,
  isLoading = false,
  onEdit,
  onDelete,
}: UsersTableProps) {
  return (
    <Table>
      <thead>
        <tr>
          <Th width={91}>ID</Th>
          <Th width={324} filterable>
            F.I.Sh
          </Th>
          <Th sortable>Telefon raqam</Th>
          <Th sortable>Yaratilgan vaqt</Th>
          <Th sortable>Rol</Th>
          <Th width={140} align="center">
            Amallar
          </Th>
        </tr>
      </thead>

      <tbody>
        {isLoading && (
          <TableEmpty colSpan={COLUMN_COUNT} message="Yuklanmoqda..." />
        )}

        {!isLoading && users.length === 0 && (
          <TableEmpty colSpan={COLUMN_COUNT} message="Hech narsa topilmadi" />
        )}

        {!isLoading &&
          users.map((user) => (
            <tr key={user.id}>
              <Td>{user.id}</Td>

              <Td>
                <span className="flex items-center gap-2.5">
                  <Avatar fullName={user.full_name} file={user.file} />
                  <span className="truncate">{user.full_name}</span>
                </span>
              </Td>

              <Td>{user.phone}</Td>
              <Td>{formatDateTime(user.create_at)}</Td>
              <Td>{ROLE_LABELS[user.role]}</Td>

              <Td align="center">
                <span className="flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit?.(user)}
                    disabled={!onEdit}
                    className="cursor-pointer rounded-full bg-subtle p-1.5 transition-colors hover:bg-hover disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Tahrirlash"
                  >
                    <EditPencilIcon />
                  </button>

                  <button
                    type="button"
                    onClick={() => onDelete?.(user)}
                    disabled={!onDelete}
                    title={onDelete ? "O‘chirish" : "Backendda DELETE hali yo‘q"}
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
