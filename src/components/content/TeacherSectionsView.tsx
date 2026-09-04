"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { SuccessDialog } from "@/components/ui/SuccessDialog";
import { CirclePlusIcon, EditPencilIcon, TrashIcon } from "@/components/ui/icons";
import { Table, TableEmpty, Td, Th } from "@/components/ui/Table";
import { fileUrl } from "@/api/public";
import {
  LessonFormModal,
  MaterialFormModal,
  HomeworkFormModal,
  ExamFormModal,
} from "@/components/content/ContentForms";
import {
  useLessonsList,
  useLessonMutations,
  useMaterialsList,
  useMaterialMutations,
  useHomeworksList,
  useHomeworkMutations,
  useExamsList,
  useExamMutations,
} from "@/hooks/useContent";
import { formatDateTime } from "@/lib/format";
import type { Section, Lesson, Material, Homework, Exam } from "@/types";

function ChevronUpIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-4"
      aria-hidden
    >
      <path d="M4 10l4-4 4 4" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-4"
      aria-hidden
    >
      <path d="M4 6l4 4 4-4" />
    </svg>
  );
}

type TabType = "darslar" | "materiallar" | "homeworks" | "exams";

const ALL = { page: 1, limit: 100 };

interface TeacherSectionAccordionProps {
  section: Section;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}

function TeacherSectionAccordion({
  section,
  index,
  isExpanded,
  onToggle,
}: TeacherSectionAccordionProps) {
  const [activeTab, setActiveTab] = useState<TabType>("darslar");

  // Fetch items for this section
  const { lessons, isLoading: lessonsLoading } = useLessonsList({
    sectionId: section.id,
    limit: 100,
  });

  const lessonIds = lessons.map((l) => l.id);

  const { materials, isLoading: materialsLoading } = useMaterialsList(ALL);
  const sectionMaterials = materials.filter((m) => lessonIds.includes(m.lessonId));

  const { homeworks, isLoading: homeworksLoading } = useHomeworksList(ALL);
  const sectionHomeworks = homeworks.filter((h) => lessonIds.includes(h.lessonId));

  const { exams, isLoading: examsLoading } = useExamsList(ALL);
  const sectionExams = exams.filter((e) => lessonIds.includes(e.lessonId));

  // Mutations
  const lessonMut = useLessonMutations();
  const materialMut = useMaterialMutations();
  const homeworkMut = useHomeworkMutations();
  const examMut = useExamMutations();

  // Modals state
  const [addModal, setAddModal] = useState<TabType | null>(null);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [editingHomework, setEditingHomework] = useState<Homework | null>(null);
  const [editingExam, setEditingExam] = useState<Exam | null>(null);

  const [deletingItem, setDeletingItem] = useState<{
    type: TabType;
    id: number;
  } | null>(null);

  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  function handleConfirmDelete() {
    if (!deletingItem) return;
    const { type, id } = deletingItem;

    const done = () => {
      setDeletingItem(null);
      setSuccessMsg("Muvaffaqiyatli o‘chirildi");
    };

    if (type === "darslar") lessonMut.remove.mutate(id, { onSuccess: done });
    else if (type === "materiallar") materialMut.remove.mutate(id, { onSuccess: done });
    else if (type === "homeworks") homeworkMut.remove.mutate(id, { onSuccess: done });
    else if (type === "exams") examMut.remove.mutate(id, { onSuccess: done });
  }

  return (
    <div className="flex flex-col rounded-xl border border-line bg-page-bg transition-all">
      {/* Accordion Header */}
      <div
        onClick={onToggle}
        className="flex cursor-pointer items-center justify-between px-6 py-5 font-semibold text-page-fg"
      >
        <div className="flex items-center gap-3">
          <span className="text-lg">Bo&lsquo;lim {index + 1}: {section.name}</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="cursor-pointer rounded-full bg-subtle p-2 transition-colors hover:bg-hover"
          >
            {isExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
          </button>
        </div>
      </div>

      {/* Accordion Body */}
      {isExpanded && (
        <div className="flex flex-col gap-6 border-t border-line p-6">
          {/* Top Actions: Tabs + Add Button */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Tabs */}
            <div className="inline-flex rounded-lg border border-line p-1 bg-subtle/50">
              <button
                type="button"
                onClick={() => setActiveTab("darslar")}
                className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === "darslar"
                    ? "bg-page-bg text-brand-600 shadow-sm"
                    : "text-ink-600 hover:text-ink-900"
                }`}
              >
                Darslar
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("materiallar")}
                className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === "materiallar"
                    ? "bg-page-bg text-brand-600 shadow-sm"
                    : "text-ink-600 hover:text-ink-900"
                }`}
              >
                Materiallar
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("homeworks")}
                className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === "homeworks"
                    ? "bg-page-bg text-brand-600 shadow-sm"
                    : "text-ink-600 hover:text-ink-900"
                }`}
              >
                Uyga vazifalar
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("exams")}
                className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === "exams"
                    ? "bg-page-bg text-brand-600 shadow-sm"
                    : "text-ink-600 hover:text-ink-900"
                }`}
              >
                Imtihonlar
              </button>
            </div>

            {/* Add Button for active tab */}
            <Button
              leftIcon={<CirclePlusIcon />}
              onClick={() => setAddModal(activeTab)}
              className="min-h-10"
            >
              Qo&rsquo;shish
            </Button>
          </div>

          {/* Subheader & Content Table */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-bold text-page-fg capitalize">
              {activeTab === "darslar" && "Darslar:"}
              {activeTab === "materiallar" && "Materiallar:"}
              {activeTab === "homeworks" && "Uyga vazifalar:"}
              {activeTab === "exams" && "Imtihonlar:"}
            </h4>

            {/* TAB: DARSLAR */}
            {activeTab === "darslar" && (
              <Table>
                <thead>
                  <tr>
                    <Th filterable>Dars nomi</Th>
                    <Th filterable>Dars haqida</Th>
                    <Th sortable>Video</Th>
                    <Th sortable>Yaratilgan vaqt</Th>
                    <Th width={120} align="center">
                      Amallar
                    </Th>
                  </tr>
                </thead>
                <tbody>
                  {lessonsLoading && <TableEmpty colSpan={5} message="Yuklanmoqda..." />}
                  {!lessonsLoading && lessons.length === 0 && (
                    <TableEmpty colSpan={5} message="Hech narsa topilmadi" />
                  )}
                  {!lessonsLoading &&
                    lessons.map((lesson) => (
                      <tr key={lesson.id}>
                        <Td>{lesson.name}</Td>
                        <Td>{lesson.description}</Td>
                        <Td>
                          {lesson.file ? (
                            <a
                              href={fileUrl("videos", lesson.file) ?? undefined}
                              target="_blank"
                              rel="noreferrer"
                              className="font-medium text-brand-600 hover:underline"
                            >
                              Video.mp4
                            </a>
                          ) : (
                            "—"
                          )}
                        </Td>
                        <Td>{formatDateTime(lesson.create_at)}</Td>
                        <Td align="center">
                          <span className="flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={() => setEditingLesson(lesson)}
                              className="cursor-pointer rounded-full bg-subtle p-1.5 transition-colors hover:bg-hover"
                              aria-label="Tahrirlash"
                            >
                              <EditPencilIcon />
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setDeletingItem({ type: "darslar", id: lesson.id })
                              }
                              className="cursor-pointer rounded-full bg-subtle p-1.5 transition-colors hover:bg-hover"
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
            )}

            {/* TAB: MATERIALLAR */}
            {activeTab === "materiallar" && (
              <Table>
                <thead>
                  <tr>
                    <Th filterable>Material haqida</Th>
                    <Th>Fayllar</Th>
                    <Th sortable>Yaratilgan vaqt</Th>
                    <Th width={120} align="center">
                      Amallar
                    </Th>
                  </tr>
                </thead>
                <tbody>
                  {materialsLoading && <TableEmpty colSpan={4} message="Yuklanmoqda..." />}
                  {!materialsLoading && sectionMaterials.length === 0 && (
                    <TableEmpty colSpan={4} message="Hech narsa topilmadi" />
                  )}
                  {!materialsLoading &&
                    sectionMaterials.map((mat) => (
                      <tr key={mat.id}>
                        <Td>{mat.description}</Td>
                        <Td>
                          {mat.materialFiles && mat.materialFiles.length > 0
                            ? mat.materialFiles.map((f, i) => (
                                <a
                                  key={f.id}
                                  href={fileUrl("files", f.file) ?? undefined}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="mr-2 inline-block font-medium text-brand-600 hover:underline"
                                >
                                  Fayl_{i + 1}
                                </a>
                              ))
                            : "—"}
                        </Td>
                        <Td>{formatDateTime(mat.create_at)}</Td>
                        <Td align="center">
                          <span className="flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={() => setEditingMaterial(mat)}
                              className="cursor-pointer rounded-full bg-subtle p-1.5 transition-colors hover:bg-hover"
                              aria-label="Tahrirlash"
                            >
                              <EditPencilIcon />
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setDeletingItem({ type: "materiallar", id: mat.id })
                              }
                              className="cursor-pointer rounded-full bg-subtle p-1.5 transition-colors hover:bg-hover"
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
            )}

            {/* TAB: UYGA VAZIFALAR */}
            {activeTab === "homeworks" && (
              <Table>
                <thead>
                  <tr>
                    <Th filterable>Vazifa haqida</Th>
                    <Th>Fayl</Th>
                    <Th sortable>Yaratilgan vaqt</Th>
                    <Th width={120} align="center">
                      Amallar
                    </Th>
                  </tr>
                </thead>
                <tbody>
                  {homeworksLoading && <TableEmpty colSpan={4} message="Yuklanmoqda..." />}
                  {!homeworksLoading && sectionHomeworks.length === 0 && (
                    <TableEmpty colSpan={4} message="Hech narsa topilmadi" />
                  )}
                  {!homeworksLoading &&
                    sectionHomeworks.map((hw) => (
                      <tr key={hw.id}>
                        <Td>{hw.description}</Td>
                        <Td>
                          {hw.file ? (
                            <a
                              href={fileUrl("files", hw.file) ?? undefined}
                              target="_blank"
                              rel="noreferrer"
                              className="font-medium text-brand-600 hover:underline"
                            >
                              Fayl
                            </a>
                          ) : (
                            "—"
                          )}
                        </Td>
                        <Td>{formatDateTime(hw.create_at)}</Td>
                        <Td align="center">
                          <span className="flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={() => setEditingHomework(hw)}
                              className="cursor-pointer rounded-full bg-subtle p-1.5 transition-colors hover:bg-hover"
                              aria-label="Tahrirlash"
                            >
                              <EditPencilIcon />
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setDeletingItem({ type: "homeworks", id: hw.id })
                              }
                              className="cursor-pointer rounded-full bg-subtle p-1.5 transition-colors hover:bg-hover"
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
            )}

            {/* TAB: IMTIHONLAR */}
            {activeTab === "exams" && (
              <Table>
                <thead>
                  <tr>
                    <Th filterable>Savol</Th>
                    <Th>Variant A</Th>
                    <Th>Variant B</Th>
                    <Th>Variant C</Th>
                    <Th>Variant D</Th>
                    <Th width={110}>To&lsquo;g&lsquo;ri javob</Th>
                    <Th width={120} align="center">
                      Amallar
                    </Th>
                  </tr>
                </thead>
                <tbody>
                  {examsLoading && <TableEmpty colSpan={7} message="Yuklanmoqda..." />}
                  {!examsLoading && sectionExams.length === 0 && (
                    <TableEmpty colSpan={7} message="Hech narsa topilmadi" />
                  )}
                  {!examsLoading &&
                    sectionExams.map((ex) => (
                      <tr key={ex.id}>
                        <Td>{ex.question}</Td>
                        <Td>{ex.variantA}</Td>
                        <Td>{ex.variantB}</Td>
                        <Td>{ex.variantC}</Td>
                        <Td>{ex.variantD}</Td>
                        <Td>
                          <span className="font-semibold text-brand-600">
                            {ex.answer ? ex.answer.replace("variant", "") : "—"}
                          </span>
                        </Td>
                        <Td align="center">
                          <span className="flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={() => setEditingExam(ex)}
                              className="cursor-pointer rounded-full bg-subtle p-1.5 transition-colors hover:bg-hover"
                              aria-label="Tahrirlash"
                            >
                              <EditPencilIcon />
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setDeletingItem({ type: "exams", id: ex.id })
                              }
                              className="cursor-pointer rounded-full bg-subtle p-1.5 transition-colors hover:bg-hover"
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
            )}
          </div>
        </div>
      )}

      {/* Modals for creating content under this section */}
      <LessonFormModal
        open={addModal === "darslar" || editingLesson !== null}
        editing={editingLesson}
        defaultSectionId={section.id}
        isPending={lessonMut.create.isPending || lessonMut.update.isPending}
        onClose={() => {
          setAddModal(null);
          setEditingLesson(null);
        }}
        onSubmit={(form) => {
          const isEdit = editingLesson !== null;
          const done = () => {
            setAddModal(null);
            setEditingLesson(null);
            setSuccessMsg(isEdit ? "Dars tahrirlandi" : "Dars qo‘shildi");
          };

          if (isEdit) {
            lessonMut.update.mutate({ id: editingLesson.id, form }, { onSuccess: done });
          } else {
            lessonMut.create.mutate(form, { onSuccess: done });
          }
        }}
      />

      <MaterialFormModal
        open={addModal === "materiallar" || editingMaterial !== null}
        editing={editingMaterial}
        isPending={materialMut.create.isPending || materialMut.update.isPending}
        onClose={() => {
          setAddModal(null);
          setEditingMaterial(null);
        }}
        onSubmit={(form) => {
          const isEdit = editingMaterial !== null;
          const done = () => {
            setAddModal(null);
            setEditingMaterial(null);
            setSuccessMsg(isEdit ? "Material tahrirlandi" : "Material qo‘shildi");
          };

          if (isEdit) {
            materialMut.update.mutate({ id: editingMaterial.id, form }, { onSuccess: done });
          } else {
            materialMut.create.mutate(form, { onSuccess: done });
          }
        }}
      />

      <HomeworkFormModal
        open={addModal === "homeworks" || editingHomework !== null}
        editing={editingHomework}
        isPending={homeworkMut.create.isPending || homeworkMut.update.isPending}
        onClose={() => {
          setAddModal(null);
          setEditingHomework(null);
        }}
        onSubmit={(form) => {
          const isEdit = editingHomework !== null;
          const done = () => {
            setAddModal(null);
            setEditingHomework(null);
            setSuccessMsg(isEdit ? "Vazifa tahrirlandi" : "Vazifa qo‘shildi");
          };

          if (isEdit) {
            homeworkMut.update.mutate({ id: editingHomework.id, form }, { onSuccess: done });
          } else {
            homeworkMut.create.mutate(form, { onSuccess: done });
          }
        }}
      />

      <ExamFormModal
        open={addModal === "exams" || editingExam !== null}
        editing={editingExam}
        isPending={examMut.create.isPending || examMut.update.isPending}
        onClose={() => {
          setAddModal(null);
          setEditingExam(null);
        }}
        onSubmit={(body) => {
          const isEdit = editingExam !== null;
          const done = () => {
            setAddModal(null);
            setEditingExam(null);
            setSuccessMsg(isEdit ? "Test tahrirlandi" : "Test qo‘shildi");
          };

          if (isEdit) {
            examMut.update.mutate({ id: editingExam.id, ...body }, { onSuccess: done });
          } else {
            examMut.create.mutate(body, { onSuccess: done });
          }
        }}
      />

      <ConfirmDialog
        open={deletingItem !== null}
        isPending={
          lessonMut.remove.isPending ||
          materialMut.remove.isPending ||
          homeworkMut.remove.isPending ||
          examMut.remove.isPending
        }
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingItem(null)}
      />

      <SuccessDialog
        open={successMsg !== null}
        message={successMsg ?? ""}
        onClose={() => setSuccessMsg(null)}
      />
    </div>
  );
}

interface TeacherSectionsViewProps {
  sections: Section[];
  isLoading: boolean;
}

export function TeacherSectionsView({
  sections,
  isLoading,
}: TeacherSectionsViewProps) {
  // First section expanded by default
  const [expandedId, setExpandedId] = useState<number | null>(
    sections[0]?.id ?? null,
  );

  function toggleSection(id: number) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  if (isLoading) {
    return (
      <div className="flex w-full items-center justify-center p-12 text-sm text-ink-500">
        Yuklanmoqda...
      </div>
    );
  }

  if (sections.length === 0) {
    return (
      <div className="flex w-full items-center justify-center rounded-xl border border-line p-12 text-sm text-ink-500 bg-page-bg">
        Hech narsa topilmadi
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {sections.map((section, index) => (
        <TeacherSectionAccordion
          key={section.id}
          section={section}
          index={index}
          isExpanded={expandedId === section.id || (expandedId === null && index === 0)}
          onToggle={() => toggleSection(section.id)}
        />
      ))}
    </div>
  );
}
