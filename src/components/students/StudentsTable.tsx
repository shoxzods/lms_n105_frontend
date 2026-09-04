"use client";

import { Avatar } from "@/components/ui/Avatar";
import { EditPencilIcon, EyeOffIcon, TrashIcon } from "@/components/ui/icons";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Table, TableEmpty, Td, Th } from "@/components/ui/Table";
import { formatDateTime, ROLE_LABELS } from "@/lib/format";
import type { Student } from "@/types";

const COLUMN_COUNT = 7;

interface StudentsTableProps {
  students: Student[];
  isLoading?: boolean;
  onView?: (student: Student) => void;
  onEdit?: (student: Student) => void;
  onDelete?: (student: Student) => void;
}

export function StudentsTable({
  students,
  isLoading = false,
  onView,
  onEdit,
  onDelete,
}: StudentsTableProps) {
  return (
    <Table>
      <thead>
        <tr>
          <Th width={70}>ID</Th>
          <Th width={320} filterable>
            F.I.Sh
          </Th>
          <Th sortable>Telefon raqami</Th>
          <Th>Rol</Th>
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

        {!isLoading && students.length === 0 && (
          <TableEmpty colSpan={COLUMN_COUNT} message="Hech narsa topilmadi" />
        )}

        {!isLoading &&
          students.map((student) => (
            <tr key={student.id}>
              <Td>{student.id}</Td>

              <Td>
                <span className="flex items-center gap-2.5">
                  <Avatar fullName={student.full_name} file={student.file} />
                  <span className="truncate">{student.full_name}</span>
                </span>
              </Td>

              <Td>{student.phone}</Td>
              <Td>{ROLE_LABELS[student.role]}</Td>
              <Td>{formatDateTime(student.create_at)}</Td>

              <Td>
                <StatusBadge status={student.status} />
              </Td>

              <Td align="center">
                <span className="flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => onView?.(student)}
                    disabled={!onView}
                    className="cursor-pointer rounded-full bg-subtle p-1.5 transition-colors hover:bg-hover disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Ko‘rish"
                  >
                    <EyeOffIcon />
                  </button>

                  {onEdit && (
                    <button
                      type="button"
                      onClick={() => onEdit(student)}
                      className="cursor-pointer rounded-full bg-subtle p-1.5 transition-colors hover:bg-hover"
                      aria-label="Tahrirlash"
                    >
                      <EditPencilIcon />
                    </button>
                  )}

                  {onDelete && (
                    <button
                      type="button"
                      onClick={() => onDelete(student)}
                      className="cursor-pointer rounded-full bg-subtle p-1.5 transition-colors hover:bg-hover"
                      aria-label="O‘chirish"
                    >
                      <TrashIcon />
                    </button>
                  )}
                </span>
              </Td>
            </tr>
          ))}
      </tbody>
    </Table>
  );
}
