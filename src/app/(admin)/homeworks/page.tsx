"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Pagination } from "@/components/ui/Pagination";
import { SearchBar } from "@/components/ui/SearchBar";
import { Select } from "@/components/ui/Select";
import { Table, TableEmpty, Td, Th } from "@/components/ui/Table";
import { TableFooter } from "@/components/ui/TableFooter";
import { Textarea } from "@/components/ui/Textarea";
import { Input } from "@/components/ui/Input";
import { HomeworksTable } from "@/components/content/ContentTables";
import { HomeworkFormModal } from "@/components/content/ContentForms";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { SuccessDialog } from "@/components/ui/SuccessDialog";
import { CirclePlusIcon } from "@/components/ui/icons";
import {
  useHomeworkSubmissionMutations,
  useHomeworkSubmissionsList,
} from "@/hooks/useHomeworkSubmissions";
import { useHomeworkMutations, useHomeworksList } from "@/hooks/useContent";
import { fileUrl } from "@/api/public";
import { formatDateTime } from "@/lib/format";
import type { Homework, HomeworkSubmission } from "@/types";

export default function HomeworksPage() {
  const [activeTab, setActiveTab] = useState<"submissions" | "tasks">(
    "submissions",
  );

  return (
    <>
      <PageHeader
        title="Vazifalar"
        breadcrumb={["Materiallar", "Vazifalar"]}
      />

      <div className="flex w-full max-w-[1600px] flex-col gap-6 pb-8">
        {/* Tab switchers */}
        <div className="flex items-center gap-2 px-6">
          <button
            type="button"
            onClick={() => setActiveTab("submissions")}
            className={`cursor-pointer rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
              activeTab === "submissions"
                ? "bg-brand-600 text-white shadow-sm"
                : "bg-card text-ink-500 hover:bg-hover border border-line"
            }`}
          >
            Topshirilgan vazifalar
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("tasks")}
            className={`cursor-pointer rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
              activeTab === "tasks"
                ? "bg-brand-600 text-white shadow-sm"
                : "bg-card text-ink-500 hover:bg-hover border border-line"
            }`}
          >
            Dars vazifalari (Shablonlar)
          </button>
        </div>

        {activeTab === "submissions" && <SubmissionsSection />}
        {activeTab === "tasks" && <TasksSection />}
      </div>
    </>
  );
}

/* ==================== 1. Topshirilgan vazifalar (Submissions) ==================== */

function SubmissionsSection() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [gradingItem, setGradingItem] = useState<HomeworkSubmission | null>(
    null,
  );

  const { submissions, meta, isLoading, isError } = useHomeworkSubmissionsList(
    {
      page,
      limit,
      search: search || undefined,
      status: status || undefined,
    },
  );

  return (
    <div className="flex flex-col gap-6">
      <Pagination
        page={meta.page}
        limit={meta.limit}
        total={meta.total}
        totalPages={meta.totalPages}
        onPageChange={setPage}
        onLimitChange={(next) => {
          setLimit(next);
          setPage(1);
        }}
      />

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 px-6">
        <SearchBar
          placeholder="O'quvchi ismi yoki dars nomi bo'yicha qidiruv"
          defaultValue={search}
          onSearch={(val) => {
            setSearch(val);
            setPage(1);
          }}
        />

        <div className="w-[200px]">
          <Select
            id="submission-status"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
          >
            <option value="">Barcha holatlar</option>
            <option value="PENDING">Kutilmoqda (Tekshirilmagan)</option>
            <option value="GRADED">Baholangan</option>
            <option value="REJECTED">Qaytarilgan</option>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="px-6">
        {isError && (
          <div className="mb-4 rounded-lg bg-danger-500/10 p-4 text-sm text-danger-500">
            Topshirilgan vazifalarni yuklashda xatolik yuz berdi
          </div>
        )}

        <Table>
          <thead>
            <tr>
              <Th width={48} align="center">
                <input
                  type="checkbox"
                  disabled
                  aria-label="Hammasini belgilash"
                  className="size-4 accent-brand-500"
                />
              </Th>
              <Th filterable>F.I.Sh</Th>
              <Th filterable>Kurs</Th>
              <Th filterable>Dars</Th>
              <Th sortable>Topshirilgan fayl</Th>
              <Th sortable>Sana</Th>
              <Th sortable align="center">
                Baho / Ball
              </Th>
              <Th sortable align="center">
                Holat
              </Th>
              <Th width={140} align="center">
                Amallar
              </Th>
            </tr>
          </thead>

          <tbody>
            {isLoading && <TableEmpty colSpan={9} message="Yuklanmoqda..." />}
            {!isLoading && submissions.length === 0 && (
              <TableEmpty
                colSpan={9}
                message="Hozircha topshirilgan vazifa yo'q"
              />
            )}
            {!isLoading &&
              submissions.map((item) => {
                const avatar =
                  fileUrl(
                    "images",
                    item.user?.image || item.user?.file,
                  ) ?? null;
                const fileHref = item.file
                  ? fileUrl("files", item.file) ?? undefined
                  : undefined;

                return (
                  <tr key={item.id}>
                    <Td align="center">
                      <input
                        type="checkbox"
                        aria-label={`Belgilash ${item.id}`}
                        className="size-4 accent-brand-500"
                      />
                    </Td>
                    <Td>
                      <div className="flex items-center gap-3">
                        <span className="relative size-9 shrink-0 overflow-hidden rounded-full bg-subtle">
                          {avatar ? (
                            <Image
                              src={avatar}
                              alt=""
                              fill
                              sizes="36px"
                              className="object-cover"
                            />
                          ) : (
                            <span className="flex size-full items-center justify-center text-xs font-bold text-ink-600">
                              {item.user?.full_name?.charAt(0) ?? "U"}
                            </span>
                          )}
                        </span>
                        <span className="font-semibold text-page-fg">
                          {item.user?.full_name ?? "Noma'lum"}
                        </span>
                      </div>
                    </Td>
                    <Td>{item.course?.name ?? "—"}</Td>
                    <Td className="max-w-[200px] truncate">
                      {item.lesson?.name ?? "—"}
                    </Td>
                    <Td>
                      {item.file && fileHref ? (
                        <a
                          href={fileHref}
                          target="_blank"
                          rel="noreferrer"
                          download
                          className="inline-flex items-center gap-1.5 font-medium text-brand-600 hover:underline"
                        >
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="size-4 text-brand-600"
                          >
                            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                            <polyline points="14 2 14 8 20 8" />
                          </svg>
                          <span className="max-w-[150px] truncate">
                            {item.file}
                          </span>
                        </a>
                      ) : (
                        item.text ? (
                          <span className="max-w-[180px] truncate text-xs text-ink-500">
                            {item.text}
                          </span>
                        ) : (
                          "—"
                        )
                      )}
                    </Td>
                    <Td className="text-xs text-ink-500">
                      {formatDateTime(item.create_at)}
                    </Td>
                    <Td align="center">
                      {item.score !== null && item.score !== undefined ? (
                        <span className="rounded-md bg-brand-500/10 px-2.5 py-1 text-xs font-bold text-brand-600">
                          {item.score} / 100
                        </span>
                      ) : (
                        "—"
                      )}
                    </Td>
                    <Td align="center">
                      {item.status === "GRADED" && (
                        <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-600">
                          Baholangan
                        </span>
                      )}
                      {item.status === "PENDING" && (
                        <span className="inline-flex items-center rounded-full bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-600">
                          Kutilmoqda
                        </span>
                      )}
                      {item.status === "REJECTED" && (
                        <span className="inline-flex items-center rounded-full bg-rose-500/10 px-3 py-1 text-xs font-bold text-rose-600">
                          Qaytarilgan
                        </span>
                      )}
                    </Td>
                    <Td align="center">
                      <button
                        type="button"
                        onClick={() => setGradingItem(item)}
                        className="cursor-pointer rounded-lg bg-brand-600 px-3.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-brand-700"
                      >
                        {item.status === "GRADED" ? "Tahrirlash" : "Baholash"}
                      </button>
                    </Td>
                  </tr>
                );
              })}
          </tbody>
        </Table>
      </div>

      <TableFooter
        meta={meta}
        onPageChange={setPage}
        onLimitChange={(next) => {
          setLimit(next);
          setPage(1);
        }}
        fileName="topshirilgan-vazifalar"
        rows={submissions.map((s) => ({
          ID: s.id,
          Talaba: s.user?.full_name ?? "",
          Kurs: s.course?.name ?? "",
          Dars: s.lesson?.name ?? "",
          Fayl: s.file ?? "",
          Baho: s.score ?? "",
          Holat: s.status,
          Sana: formatDateTime(s.create_at),
        }))}
      />

      {gradingItem && (
        <GradeModal
          item={gradingItem}
          open={!!gradingItem}
          onClose={() => setGradingItem(null)}
        />
      )}
    </div>
  );
}

/* ==================== Baholash Modali (Grading Modal) ==================== */

function GradeModal({
  item,
  open,
  onClose,
}: {
  item: HomeworkSubmission;
  open: boolean;
  onClose: () => void;
}) {
  const [score, setScore] = useState<string>(
    item.score !== null && item.score !== undefined ? String(item.score) : "",
  );
  const [feedback, setFeedback] = useState<string>(item.feedback ?? "");
  const [feedbackFile, setFeedbackFile] = useState<File | null>(null);
  const [touched, setTouched] = useState(false);

  const { grade } = useHomeworkSubmissionMutations();

  const fileHref = item.file
    ? fileUrl("files", item.file) ?? undefined
    : undefined;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setTouched(true);

    const scoreNum = Number(score);
    if (isNaN(scoreNum) || scoreNum < 0 || scoreNum > 100) return;

    const formData = new FormData();
    formData.append("score", String(scoreNum));
    if (feedback.trim()) {
      formData.append("feedback", feedback.trim());
    }
    if (feedbackFile) {
      formData.append("file", feedbackFile);
    }
    formData.append("status", "GRADED");

    grade.mutate(
      { id: item.id, formData },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  }

  const scoreInvalid =
    touched &&
    (!score.trim() ||
      isNaN(Number(score)) ||
      Number(score) < 0 ||
      Number(score) > 100);

  return (
    <Modal
      open={open}
      title="Vazifani tekshirish va Baholash"
      onClose={onClose}
      width={480}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Talaba topshirgan ish ma'lumoti */}
        <div className="flex flex-col gap-2 rounded-lg border border-line bg-subtle p-3.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-page-fg">
              {item.user?.full_name}
            </span>
            <span className="text-ink-400">
              {item.course?.name} &bull; {item.lesson?.name}
            </span>
          </div>

          {item.file && fileHref && (
            <div className="mt-1 flex items-center justify-between rounded-md bg-card p-2 text-xs">
              <span className="truncate font-medium text-page-fg">
                {item.file}
              </span>
              <a
                href={fileHref}
                target="_blank"
                rel="noreferrer"
                download
                className="font-bold text-brand-600 hover:underline"
              >
                Yuklab olish
              </a>
            </div>
          )}

          {item.text && (
            <p className="mt-1 text-xs text-ink-600">
              <strong className="text-page-fg">Talaba izohi:</strong> {item.text}
            </p>
          )}
        </div>

        {/* Baho (0-100) */}
        <Input
          id="grade-score"
          label="Baho / Ball (0 dan 100 gacha)"
          requiredMark
          type="number"
          min={0}
          max={100}
          placeholder="Masalan: 95"
          value={score}
          onChange={(e) => setScore(e.target.value)}
          error={
            scoreInvalid
              ? "0 dan 100 gacha bo'lgan ball kiriting"
              : null
          }
        />

        {/* Ustoz izohi */}
        <Textarea
          id="grade-feedback"
          label="Ustoz fikri va izohi"
          rows={4}
          placeholder="Vazifa bo'yicha fikringizni yozing..."
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
        />

        {/* Ustoz fayli (ixtiyoriy) */}
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-page-fg">
            Tahrirlangan yoki yechim faylini biriktirish (ixtiyoriy)
          </span>

          <div className="flex items-center justify-between rounded-lg border border-line bg-card p-2.5">
            <label className="flex cursor-pointer items-center gap-2 rounded-md bg-subtle px-3 py-1.5 text-xs font-semibold text-page-fg transition-colors hover:bg-hover">
              <svg
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                className="size-4"
                aria-hidden
              >
                <path d="M6.5 9.5l3-3M5 11a2.5 2.5 0 0 1 0-3.5l2.5-2.5M11 5a2.5 2.5 0 0 1 0 3.5L8.5 11" />
              </svg>
              Yuklash
              <input
                type="file"
                onChange={(e) =>
                  setFeedbackFile(e.target.files?.[0] ?? null)
                }
                className="hidden"
              />
            </label>
            <span className="truncate text-xs font-medium text-ink-500">
              {feedbackFile ? feedbackFile.name : "Fayl tanlanmagan"}
            </span>
          </div>
        </div>

        {/* Submit button */}
        <div className="mt-2 flex items-center justify-start">
          <Button
            type="submit"
            disabled={grade.isPending}
            leftIcon={
              <svg
                className="size-4 stroke-[2.5]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m4.5 12.75 6 6 9-13.5"
                />
              </svg>
            }
          >
            {grade.isPending ? "Saqlanmoqda..." : "Saqlash va Baholash"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

/* ==================== 2. Berilgan vazifalar (Tasks CRUD) ==================== */

function TasksSection() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");

  const { homeworks, meta, isLoading, isError, error } = useHomeworksList({
    page,
    limit,
    search: search || undefined,
  });

  const { create, update, remove } = useHomeworkMutations();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Homework | null>(null);
  const [deleting, setDeleting] = useState<Homework | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  function handleSubmit(body: FormData) {
    const done = (message: string) => () => {
      setFormOpen(false);
      setEditing(null);
      setSuccess(message);
    };

    if (editing) {
      update.mutate(
        { id: editing.id, form: body },
        { onSuccess: done("Muvaffaqiyatli o‘zgartirildi") },
      );
    } else {
      create.mutate(body, { onSuccess: done("Muvaffaqiyatli qo‘shildi") });
    }
  }

  return (
    <>
      <div className="flex flex-col gap-6">
        <Pagination
          page={meta.page}
          limit={meta.limit}
          total={meta.total}
          totalPages={meta.totalPages}
          onPageChange={setPage}
          onLimitChange={(next) => {
            setLimit(next);
            setPage(1);
          }}
        />

        <div className="flex flex-wrap items-center justify-between gap-3 px-6">
          <SearchBar
            placeholder="Vazifa nomi bo'yicha qidiruv"
            defaultValue={search}
            onSearch={(val) => {
              setSearch(val);
              setPage(1);
            }}
          />

          <Button
            leftIcon={<CirclePlusIcon />}
            className="min-h-11"
            onClick={() => {
              setEditing(null);
              setFormOpen(true);
            }}
          >
            Vazifa qo&rsquo;shish
          </Button>
        </div>

        <div className="px-6">
          <HomeworksTable
            items={homeworks}
            isLoading={isLoading}
            onEdit={(item) => {
              setEditing(item);
              setFormOpen(true);
            }}
            onDelete={setDeleting}
          />
        </div>

        <TableFooter
          meta={meta}
          onPageChange={setPage}
          onLimitChange={(next) => {
            setLimit(next);
            setPage(1);
          }}
          fileName="dars-vazifalari"
          rows={homeworks.map((h) => ({
            ID: h.id,
            Vazifa: h.description,
            Dars: h.lessons?.name ?? "",
            Fayl: h.file ? "bor" : "yo‘q",
            Sana: formatDateTime(h.create_at),
          }))}
        />
      </div>

      <HomeworkFormModal
        open={formOpen}
        editing={editing}
        isPending={create.isPending || update.isPending}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
        onSubmit={handleSubmit}
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
