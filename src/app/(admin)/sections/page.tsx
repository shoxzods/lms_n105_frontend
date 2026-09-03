"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AdminListLayout } from "@/components/layout/AdminListLayout";
import { SectionsTable } from "@/components/content/ContentTables";
import { SectionFormModal } from "@/components/content/ContentForms";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Select } from "@/components/ui/Select";
import { SuccessDialog } from "@/components/ui/SuccessDialog";
import { CirclePlusIcon } from "@/components/ui/icons";
import {
  useCoursesList,
  useSectionMutations,
  useSectionsList,
} from "@/hooks/useContent";
import { formatDateTime } from "@/lib/format";
import type { Section } from "@/types";

const ALL = { page: 1, limit: 100 };

function SectionsPageInner() {
  const params = useSearchParams();
  const fromUrl = params.get("courseId");

  const [courseId, setCourseId] = useState(fromUrl ?? "");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");

  const { courses } = useCoursesList(ALL);
  const course = courses.find((item) => String(item.id) === courseId);

  const { sections, meta, isLoading, isError, error } = useSectionsList({
    page,
    limit,
    search: search || undefined,
    courseId: courseId ? Number(courseId) : undefined,
  });

  const { create, update, remove } = useSectionMutations();

  const [form, setForm] = useState<Section | null | false>(false);
  const [deleting, setDeleting] = useState<Section | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  return (
    <>
      <AdminListLayout
        title="Bo&rsquo;limlar"
        breadcrumb={
          course
            ? ["Kurslar", course.name, "Bo‘limlar"]
            : ["Kurslar", "Bo‘limlar"]
        }
        action={
          <Button
            leftIcon={<CirclePlusIcon />}
            className="min-h-12"
            onClick={() => setForm(null)}
          >
            Qo&rsquo;shish
          </Button>
        }
        filters={
          <div className="max-w-xs">
            <Select
              id="filter-course"
              label="Kurs"
              value={courseId}
              onChange={(e) => {
                setCourseId(e.target.value);
                setPage(1);
              }}
            >
              <option value="">Barcha kurslar</option>
              {courses.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </Select>
          </div>
        }
        meta={meta}
        onPageChange={setPage}
        onLimitChange={(next) => {
          setLimit(next);
          setPage(1);
        }}
        search={search}
        onSearch={(value) => {
          setSearch(value);
          setPage(1);
        }}
        error={isError ? error : null}
        mutationError={
          remove.isError
            ? "Bo‘limni o‘chirib bo‘lmadi — ichida darslar bo‘lishi mumkin."
            : null
        }
        exportName="bolimlar"
        exportRows={sections.map((section) => ({
          ID: section.id,
          Nomi: section.name,
          Kurs: section.courses?.name ?? "",
          Sana: formatDateTime(section.create_at),
        }))}
      >
        <SectionsTable
          items={sections}
          isLoading={isLoading}
          linkTo={(section) => `/lessons?sectionId=${section.id}`}
          onEdit={setForm}
          onDelete={setDeleting}
        />
      </AdminListLayout>

      <SectionFormModal
        open={form !== false}
        editing={form || null}
        lockedCourseId={form ? undefined : (courseId ? Number(courseId) : undefined)}
        isPending={create.isPending || update.isPending}
        onClose={() => setForm(false)}
        onSubmit={(body) => {
          const editing = form;

          const done = () => {
            setForm(false);
            setSuccess(
              editing ? "Muvaffaqiyatli o‘zgartirildi" : "Muvaffaqiyatli qo‘shildi",
            );
          };

          if (editing) {
            update.mutate({ id: editing.id, ...body }, { onSuccess: done });
          } else {
            create.mutate(body, { onSuccess: done });
          }
        }}
      />

      <ConfirmDialog
        open={deleting !== null}
        isPending={remove.isPending}
        onConfirm={() => {
          if (!deleting) return;

          remove.mutate(deleting.id, {
            onSuccess: () => {
              setDeleting(null);
              setSuccess("Muvaffaqiyatli o‘chirildi");
            },
          });
        }}
        onCancel={() => setDeleting(null)}
      />

      <SuccessDialog
        open={success !== null}
        message={success ?? ""}
        onClose={() => setSuccess(null)}
      />
    </>
  );
}

export default function SectionsPage() {
  return (
    <Suspense fallback={null}>
      <SectionsPageInner />
    </Suspense>
  );
}
