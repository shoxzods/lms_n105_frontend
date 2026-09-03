"use client";

import Image from "next/image";
import Link from "next/link";
import { EditPencilIcon, TrashIcon } from "@/components/ui/icons";
import { Table, TableEmpty, Td, Th } from "@/components/ui/Table";
import { fileUrl } from "@/api/public";
import { formatPrice } from "@/lib/format";
import type { AdminCourse } from "@/types";

const COLUMN_COUNT = 8;

const LEVEL_LABELS: Record<string, string> = {
  BEGINNER: "Beginner",
  ELEMENTARY: "Elementary",
  PRE_INTERMEDIATE: "Pre-Intermediate",
  INTERMEDIATE: "Intermediate",
  ADVANCED: "Advanced",
};

/** Figma: "Holati" ustuni — Faol / Nofaol */
function PublishedBadge({ published }: { published: boolean }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
        published
          ? "bg-[#ecfdf3] text-[#027a48] dark:bg-[#053321] dark:text-[#6ce9a6]"
          : "bg-[#fef3f2] text-[#b42318] dark:bg-[#3b1211] dark:text-[#fda29b]"
      }`}
    >
      {published ? "Faol" : "Nofaol"}
    </span>
  );
}

function EyeIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-4"
      aria-hidden
    >
      <path d="M1.5 8s2.4-4 6.5-4 6.5 4 6.5 4-2.4 4-6.5 4S1.5 8 1.5 8z" />
      <circle cx="8" cy="8" r="1.8" />
    </svg>
  );
}

interface CoursesTableProps {
  items: AdminCourse[];
  isLoading?: boolean;
  selected: number[];
  onToggle: (id: number) => void;
  onToggleAll: () => void;
  onDetails: (course: AdminCourse) => void;
  onEdit: (course: AdminCourse) => void;
  onDelete: (course: AdminCourse) => void;
}

export function CoursesTable({
  items,
  isLoading = false,
  selected,
  onToggle,
  onToggleAll,
  onDetails,
  onEdit,
  onDelete,
}: CoursesTableProps) {
  const allChecked = items.length > 0 && selected.length === items.length;

  return (
    <Table>
      <thead>
        <tr>
          <Th width={48} align="center">
            <input
              type="checkbox"
              checked={allChecked}
              onChange={onToggleAll}
              aria-label="Hammasini belgilash"
              className="size-4 cursor-pointer accent-brand-500"
            />
          </Th>
          <Th width={110} filterable>
            Banner
          </Th>
          <Th filterable>Kurs nomi</Th>
          <Th width={130} filterable>
            Darajasi
          </Th>
          <Th width={120} filterable>
            Narxi
          </Th>
          <Th width={170} sortable>
            Kategoriya
          </Th>
          <Th width={110}>Holati</Th>
          <Th width={130} align="center">
            Amallar
          </Th>
        </tr>
      </thead>

      <tbody>
        {isLoading && (
          <TableEmpty colSpan={COLUMN_COUNT} message="Yuklanmoqda..." />
        )}

        {!isLoading && items.length === 0 && (
          <TableEmpty colSpan={COLUMN_COUNT} message="Hech narsa topilmadi" />
        )}

        {!isLoading &&
          items.map((course) => {
            const banner = fileUrl("images", course.banner);

            return (
              <tr key={course.id}>
                <Td align="center">
                  <input
                    type="checkbox"
                    checked={selected.includes(course.id)}
                    onChange={() => onToggle(course.id)}
                    aria-label={`${course.name} ni belgilash`}
                    className="size-4 cursor-pointer accent-brand-500"
                  />
                </Td>

                <Td>
                  {banner ? (
                    <Image
                      src={banner}
                      alt=""
                      width={56}
                      height={32}
                      unoptimized
                      className="h-8 w-14 rounded object-cover"
                    />
                  ) : (
                    <span className="text-ink-500">—</span>
                  )}
                </Td>

                <Td>
                  <Link
                    href={"/sections?courseId=" + course.id}
                    className="font-medium text-brand-600 hover:underline"
                  >
                    {course.name}
                  </Link>
                </Td>

                <Td>{LEVEL_LABELS[course.level] ?? course.level}</Td>
                <Td>{formatPrice(course.price)}</Td>
                <Td>{course.categories?.name ?? "—"}</Td>

                <Td>
                  <PublishedBadge published={course.published} />
                </Td>

                <Td align="center">
                  <span className="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => onDetails(course)}
                      aria-label="Batafsil"
                      className="cursor-pointer rounded-full bg-subtle p-1.5 text-page-fg transition-colors hover:bg-hover"
                    >
                      <EyeIcon />
                    </button>

                    <button
                      type="button"
                      onClick={() => onEdit(course)}
                      aria-label="Tahrirlash"
                      className="cursor-pointer rounded-full bg-subtle p-1.5 transition-colors hover:bg-hover"
                    >
                      <EditPencilIcon />
                    </button>

                    <button
                      type="button"
                      onClick={() => onDelete(course)}
                      aria-label="O'chirish"
                      className="cursor-pointer rounded-full bg-subtle p-1.5 transition-colors hover:bg-hover"
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
