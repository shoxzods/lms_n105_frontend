"use client";

import { Avatar } from "@/components/ui/Avatar";
import { EditPencilIcon, TrashIcon } from "@/components/ui/icons";
import { Table, TableEmpty, Td, Th } from "@/components/ui/Table";
import { formatDateTime } from "@/lib/format";
import { mentorProfileOf } from "@/api/mentors";
import type { Mentor } from "@/types";

const COLUMN_COUNT = 7;

interface MentorsTableProps {
  mentors: Mentor[];
  isLoading?: boolean;
  onEdit?: (mentor: Mentor) => void;
  onDelete?: (mentor: Mentor) => void;
}

export function MentorsTable({
  mentors,
  isLoading = false,
  onEdit,
  onDelete,
}: MentorsTableProps) {
  return (
    <Table>
      <thead>
        <tr>
          <Th width={91}>ID</Th>
          <Th width={280} filterable>
            F.I.Sh
          </Th>
          <Th sortable>Telefon raqam</Th>
          <Th>Kasbi</Th>
          <Th width={110}>Tajriba</Th>
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

        {!isLoading && mentors.length === 0 && (
          <TableEmpty colSpan={COLUMN_COUNT} message="Hech narsa topilmadi" />
        )}

        {!isLoading &&
          mentors.map((mentor) => {
            const profile = mentorProfileOf(mentor);

            return (
              <tr key={mentor.id}>
                <Td>{mentor.id}</Td>

                <Td>
                  <span className="flex items-center gap-2.5">
                    <Avatar fullName={mentor.full_name} file={mentor.file} />
                    <span className="truncate">{mentor.full_name}</span>
                  </span>
                </Td>

                <Td>{mentor.phone}</Td>

                {/* Profil to'ldirilmagan bo'lishi mumkin — mentor uni keyin o'zi to'ldiradi */}
                <Td>{profile?.job ?? "—"}</Td>
                <Td>
                  {profile?.experience != null
                    ? `${profile.experience} yil`
                    : "—"}
                </Td>

                <Td>{formatDateTime(mentor.create_at)}</Td>

                <Td align="center">
                  <span className="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit?.(mentor)}
                      disabled={!onEdit}
                      className="cursor-pointer rounded-full bg-subtle p-1.5 transition-colors hover:bg-hover disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label="Tahrirlash"
                    >
                      <EditPencilIcon />
                    </button>

                    <button
                      type="button"
                      onClick={() => onDelete?.(mentor)}
                      disabled={!onDelete}
                      className="cursor-pointer rounded-full bg-subtle p-1.5 transition-colors hover:bg-hover disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label="O‘chirish"
                    >
                      <TrashIcon />
                    </button>
                  </span>
                </Td>
              </tr>
            );
          })}
      </tbody>
    </Table>
  );
}
