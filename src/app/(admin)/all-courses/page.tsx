"use client";

import { useState } from "react";
import { AdminListLayout } from "@/components/layout/AdminListLayout";
import { CoursesTable } from "@/components/content/CoursesTable";
import {
  AssistantAssignModal,
  CourseDetailModal,
  CourseFormModal,
} from "@/components/content/CourseModals";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { SuccessDialog } from "@/components/ui/SuccessDialog";
import { CirclePlusIcon } from "@/components/ui/icons";
import { useCoursesList, useCourseMutations } from "@/hooks/useContent";
import { apiErrorMessage } from "@/lib/apiError";
import { formatPrice } from "@/lib/format";
import type { AdminCourse } from "@/types";

import { useAuthStore } from "@/store/auth";

type Done = { message: string; tone: "success" | "info" };

export default function AllCoursesPage() {
  const userRole = useAuthStore((s) => s.user?.role);
  const isTeacher = userRole === "TEACHER";

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");

  const { courses, meta, isLoading, isError, error } = useCoursesList({
    page,
    limit,
    search: search || undefined,
  });

  const { create, update, remove } = useCourseMutations();

  const [selected, setSelected] = useState<number[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<AdminCourse | null>(null);
  const [details, setDetails] = useState<AdminCourse | null>(null);
  const [assigning, setAssigning] = useState<AdminCourse | null>(null);
  const [deleting, setDeleting] = useState<AdminCourse | null>(null);
  const [done, setDone] = useState<Done | null>(null);

  /**
   * Ro'yxat yangilangach `details` dagi nusxa eskirib qoladi — shuning uchun
   * har safar yangi ma'lumotdan qayta olamiz (masalan assistent biriktirgach).
   */
  const shownDetails = details
    ? (courses.find((c) => c.id === details.id) ?? details)
    : null;

  function handleSubmit(form: FormData) {
    const finish = (result: Done) => () => {
      setFormOpen(false);
      setEditing(null);
      setDone(result);
    };

    if (editing) {
      update.mutate(
        { id: editing.id, form },
        {
          onSuccess: finish({
            message: "Muvaffaqiyatli o‘zgartirildi",
            tone: "info",
          }),
        },
      );
    } else {
      create.mutate(form, {
        onSuccess: finish({
          message: "Muvaffaqiyatli qo‘shildi",
          tone: "success",
        }),
      });
    }
  }

  /** Assistentni biriktirish ham, olib tashlash ham — kursni tahrirlash */
  function saveAssistant(course: AdminCourse, assistantId: string) {
    const form = new FormData();
    form.append("assistantId", assistantId);

    update.mutate(
      { id: course.id, form },
      {
        onSuccess: () => {
          setAssigning(null);
          setDone({
            message: assistantId
              ? "Assistent biriktirildi"
              : "Assistent olib tashlandi",
            tone: "info",
          });
        },
      },
    );
  }

  return (
    <>
      <AdminListLayout
        title="Kurslar"
        breadcrumb={["Kurslar"]}
        action={
          <Button
            leftIcon={<CirclePlusIcon />}
            className="min-h-12"
            onClick={() => {
              setEditing(null);
              setFormOpen(true);
            }}
          >
            Qo&rsquo;shish
          </Button>
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
            ? "Kursni o‘chirib bo‘lmadi — ichida bo‘limlar bo‘lishi mumkin."
            : null
        }
        exportName="kurslar"
        exportRows={courses.map((course) => ({
          ID: course.id,
          "Kurs nomi": course.name,
          Darajasi: course.level,
          Narxi: formatPrice(course.price),
          Kategoriya: course.categories?.name ?? "",
          Mentor: course.mentorProfile?.user.full_name ?? "",
          Holati: course.published ? "Faol" : "Nofaol",
        }))}
      >
        <CoursesTable
          items={courses}
          isLoading={isLoading}
          selected={selected}
          onToggle={(id) =>
            setSelected((prev) =>
              prev.includes(id)
                ? prev.filter((item) => item !== id)
                : [...prev, id],
            )
          }
          onToggleAll={() =>
            setSelected((prev) =>
              prev.length === courses.length ? [] : courses.map((c) => c.id),
            )
          }
          onDetails={setDetails}
          onEdit={(course) => {
            setEditing(course);
            setFormOpen(true);
          }}
          onDelete={isTeacher ? undefined : setDeleting}
        />
      </AdminListLayout>

      <CourseFormModal
        open={formOpen}
        editing={editing}
        isPending={create.isPending || update.isPending}
        errorMessage={
          create.isError
            ? apiErrorMessage(create.error)
            : update.isError
              ? apiErrorMessage(update.error)
              : null
        }
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
          create.reset();
          update.reset();
        }}
        onSubmit={handleSubmit}
      />

      <CourseDetailModal
        course={shownDetails}
        onClose={() => setDetails(null)}
        onEdit={() => {
          setEditing(shownDetails);
          setDetails(null);
          setFormOpen(true);
        }}
        onDelete={
          isTeacher
            ? undefined
            : () => {
                setDeleting(shownDetails);
                setDetails(null);
              }
        }
        onAssignAssistant={() => setAssigning(shownDetails)}
        onRemoveAssistant={() => {
          if (shownDetails) saveAssistant(shownDetails, "");
        }}
        isRemoving={update.isPending}
      />

      <AssistantAssignModal
        open={assigning !== null}
        isPending={update.isPending}
        errorMessage={update.isError ? apiErrorMessage(update.error) : null}
        onClose={() => {
          setAssigning(null);
          update.reset();
        }}
        onSubmit={(assistantId) => {
          if (assigning) saveAssistant(assigning, String(assistantId));
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
              setDone({
                message: "Muvaffaqiyatli o‘chirildi",
                tone: "success",
              });
            },
          });
        }}
        onCancel={() => setDeleting(null)}
      />

      <SuccessDialog
        open={done !== null}
        message={done?.message ?? ""}
        tone={done?.tone ?? "success"}
        onClose={() => setDone(null)}
      />
    </>
  );
}
