"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { EditPencilIcon, TrashIcon } from "@/components/ui/icons";
import { Table, TableEmpty, Td, Th } from "@/components/ui/Table";
import { formatDateTime, formatPrice } from "@/lib/format";
import type {
  AdminCourse,
  Exam,
  Homework,
  Lesson,
  Material,
  Section,
} from "@/types";

const LEVEL_LABELS: Record<string, string> = {
  BEGINNER: "Boshlang'ich",
  ELEMENTARY: "Elementar",
  PRE_INTERMEDIATE: "O'rtadan past",
  INTERMEDIATE: "O'rta",
  ADVANCED: "Yuqori",
};

const ANSWER_LABELS: Record<string, string> = {
  variantA: "A",
  variantB: "B",
  variantC: "C",
  variantD: "D",
};

/** Har jadvalning oxirgi ustuni bir xil â tahrirlash va o'chirish tugmalari */
function Actions<T>({
  item,
  onEdit,
  onDelete,
}: {
  item: T;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
}) {
  return (
    <Td align="center">
      <span className="flex items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => onEdit?.(item)}
          disabled={!onEdit}
          aria-label="Tahrirlash"
          className="cursor-pointer rounded-full bg-subtle p-1.5 transition-colors hover:bg-hover disabled:cursor-not-allowed disabled:opacity-40"
        >
          <EditPencilIcon />
        </button>

        <button
          type="button"
          onClick={() => onDelete?.(item)}
          disabled={!onDelete}
          aria-label="O'chirish"
          className="cursor-pointer rounded-full bg-subtle p-1.5 transition-colors hover:bg-hover disabled:cursor-not-allowed disabled:opacity-40"
        >
          <TrashIcon />
        </button>
      </span>
    </Td>
  );
}

/** Yuklanmoqda / bo'sh holatlarni bir joyda hal qiladi */
function Body({
  isLoading,
  count,
  colSpan,
  children,
}: {
  isLoading: boolean;
  count: number;
  colSpan: number;
  children: ReactNode;
}) {
  if (isLoading) {
    return (
      <tbody>
        <TableEmpty colSpan={colSpan} message="Yuklanmoqda..." />
      </tbody>
    );
  }

  if (count === 0) {
    return (
      <tbody>
        <TableEmpty colSpan={colSpan} message="Hech narsa topilmadi" />
      </tbody>
    );
  }

  return <tbody>{children}</tbody>;
}

interface TableProps<T> {
  items: T[];
  isLoading?: boolean;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  /** Berilsa nom ustuni ichkariga o'tuvchi havolaga aylanadi */
  linkTo?: (item: T) => string;
}

function NameCell<T>({ item, linkTo, children }: { item: T; linkTo?: (item: T) => string; children: ReactNode }) {
  if (!linkTo) return <>{children}</>;

  return (
    <Link
      href={linkTo(item)}
      className="font-medium text-brand-600 hover:underline"
    >
      {children}
    </Link>
  );
}

/* ---------- Kurslar ---------- */

export function CoursesTable({
  items,
  isLoading = false,
  onEdit,
  onDelete,
}: TableProps<AdminCourse>) {
  return (
    <Table>
      <thead>
        <tr>
          <Th width={70}>ID</Th>
          <Th filterable>Kurs nomi</Th>
          <Th>Kategoriya</Th>
          <Th>Mentor</Th>
          <Th>Daraja</Th>
          <Th sortable>Narxi</Th>
          <Th width={140} align="center">
            Amallar
          </Th>
        </tr>
      </thead>

      <Body isLoading={isLoading} count={items.length} colSpan={7}>
        {items.map((course) => (
          <tr key={course.id}>
            <Td>{course.id}</Td>
            <Td>{course.name}</Td>
            <Td>{course.categories?.name ?? "â"}</Td>
            <Td>{course.mentorProfile?.user.full_name ?? "â"}</Td>
            <Td>{LEVEL_LABELS[course.level] ?? course.level}</Td>
            <Td>{formatPrice(course.price)} so&rsquo;m</Td>
            <Actions item={course} onEdit={onEdit} onDelete={onDelete} />
          </tr>
        ))}
      </Body>
    </Table>
  );
}

/* ---------- Bo'limlar ---------- */

export function SectionsTable({
  items,
  isLoading = false,
  onEdit,
  onDelete,
  linkTo,
}: TableProps<Section>) {
  return (
    <Table>
      <thead>
        <tr>
          <Th width={70}>ID</Th>
          <Th filterable>Bo&rsquo;lim nomi</Th>
          <Th>Kurs</Th>
          <Th sortable>Yaratilgan vaqt</Th>
          <Th width={140} align="center">
            Amallar
          </Th>
        </tr>
      </thead>

      <Body isLoading={isLoading} count={items.length} colSpan={5}>
        {items.map((section) => (
          <tr key={section.id}>
            <Td>{section.id}</Td>
            <Td>
              <NameCell item={section} linkTo={linkTo}>
                {section.name}
              </NameCell>
            </Td>
            <Td>{section.courses?.name ?? `#${section.courseId}`}</Td>
            <Td>{formatDateTime(section.create_at)}</Td>
            <Actions item={section} onEdit={onEdit} onDelete={onDelete} />
          </tr>
        ))}
      </Body>
    </Table>
  );
}

/* ---------- Darslar ---------- */

export function LessonsTable({
  items,
  isLoading = false,
  onEdit,
  onDelete,
  linkTo,
}: TableProps<Lesson>) {
  return (
    <Table>
      <thead>
        <tr>
          <Th width={70}>ID</Th>
          <Th filterable>Dars nomi</Th>
          <Th>Bo&rsquo;lim</Th>
          <Th>Tavsif</Th>
          <Th sortable>Yaratilgan vaqt</Th>
          <Th width={140} align="center">
            Amallar
          </Th>
        </tr>
      </thead>

      <Body isLoading={isLoading} count={items.length} colSpan={6}>
        {items.map((lesson) => (
          <tr key={lesson.id}>
            <Td>{lesson.id}</Td>
            <Td>
              <NameCell item={lesson} linkTo={linkTo}>
                {lesson.name}
              </NameCell>
            </Td>
            <Td>{lesson.sections?.name ?? `#${lesson.sectionId}`}</Td>
            <Td className="max-w-100 truncate">{lesson.description}</Td>
            <Td>{formatDateTime(lesson.create_at)}</Td>
            <Actions item={lesson} onEdit={onEdit} onDelete={onDelete} />
          </tr>
        ))}
      </Body>
    </Table>
  );
}

/* ---------- Dars materiallari ---------- */

export function MaterialsTable({
  items,
  isLoading = false,
  onEdit,
  onDelete,
}: TableProps<Material>) {
  return (
    <Table>
      <thead>
        <tr>
          <Th width={70}>ID</Th>
          <Th filterable>Tavsif</Th>
          <Th>Dars</Th>
          <Th width={110} align="center">
            Fayllar
          </Th>
          <Th sortable>Yaratilgan vaqt</Th>
          <Th width={140} align="center">
            Amallar
          </Th>
        </tr>
      </thead>

      <Body isLoading={isLoading} count={items.length} colSpan={6}>
        {items.map((material) => (
          <tr key={material.id}>
            <Td>{material.id}</Td>
            <Td className="max-w-100 truncate">{material.description}</Td>
            <Td>{material.lessons?.name ?? `#${material.lessonId}`}</Td>
            <Td align="center">{material.materialFiles?.length ?? 0}</Td>
            <Td>{formatDateTime(material.create_at)}</Td>
            <Actions item={material} onEdit={onEdit} onDelete={onDelete} />
          </tr>
        ))}
      </Body>
    </Table>
  );
}

/* ---------- Vazifalar ---------- */

export function HomeworksTable({
  items,
  isLoading = false,
  onEdit,
  onDelete,
}: TableProps<Homework>) {
  return (
    <Table>
      <thead>
        <tr>
          <Th width={70}>ID</Th>
          <Th filterable>Vazifa</Th>
          <Th>Dars</Th>
          <Th width={110} align="center">
            Fayl
          </Th>
          <Th sortable>Yaratilgan vaqt</Th>
          <Th width={140} align="center">
            Amallar
          </Th>
        </tr>
      </thead>

      <Body isLoading={isLoading} count={items.length} colSpan={6}>
        {items.map((homework) => (
          <tr key={homework.id}>
            <Td>{homework.id}</Td>
            <Td className="max-w-100 truncate">{homework.description}</Td>
            <Td>{homework.lessons?.name ?? `#${homework.lessonId}`}</Td>
            <Td align="center">{homework.file ? "bor" : "yo'q"}</Td>
            <Td>{formatDateTime(homework.create_at)}</Td>
            <Actions item={homework} onEdit={onEdit} onDelete={onDelete} />
          </tr>
        ))}
      </Body>
    </Table>
  );
}

/* ---------- Testlar ---------- */

export function ExamsTable({
  items,
  isLoading = false,
  onEdit,
  onDelete,
}: TableProps<Exam>) {
  return (
    <Table>
      <thead>
        <tr>
          <Th width={70}>ID</Th>
          <Th filterable>Savol</Th>
          <Th>Dars</Th>
          <Th width={110} align="center">
            To&rsquo;g&rsquo;ri javob
          </Th>
          <Th sortable>Yaratilgan vaqt</Th>
          <Th width={140} align="center">
            Amallar
          </Th>
        </tr>
      </thead>

      <Body isLoading={isLoading} count={items.length} colSpan={6}>
        {items.map((exam) => (
          <tr key={exam.id}>
            <Td>{exam.id}</Td>
            <Td className="max-w-100 truncate">{exam.question}</Td>
            <Td>{exam.lessons?.name ?? `#${exam.lessonId}`}</Td>
            <Td align="center">{exam.answer ? (ANSWER_LABELS[exam.answer] ?? exam.answer) : "—"}</Td>
            <Td>{formatDateTime(exam.create_at)}</Td>
            <Actions item={exam} onEdit={onEdit} onDelete={onDelete} />
          </tr>
        ))}
      </Body>
    </Table>
  );
}
