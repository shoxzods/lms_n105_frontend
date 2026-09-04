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
import { useQuestionMutations, useQuestionsList } from "@/hooks/useQuestions";
import { fileUrl } from "@/api/public";
import { formatDateTime } from "@/lib/format";
import type { StudentQuestionItem } from "@/types";

export default function QuestionsPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [status, setStatus] = useState("");
  const [answeringItem, setAnsweringItem] = useState<StudentQuestionItem | null>(null);

  const { questions, meta, isLoading, isError, error } = useQuestionsList({
    page,
    limit,
    search: search || undefined,
    status: status || undefined,
    from: from || undefined,
    to: to || undefined,
  });

  return (
    <>
      <PageHeader title="Savollar" breadcrumb={["Savollar"]} />

      <div className="flex w-full max-w-[1600px] flex-col gap-6 pb-8">
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

        <div className="flex flex-wrap items-end gap-3 px-6">
          <SearchBar
            placeholder="O'quvchining ismi yoki familiyasi"
            defaultValue={search}
            onSearch={(value) => {
              setSearch(value);
              setPage(1);
            }}
          />

          <div className="flex h-[46px] items-center gap-2 rounded-lg border border-line bg-card px-4">
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              aria-label="Boshlanish sanasi"
              className="bg-transparent text-sm text-page-fg outline-none cursor-pointer"
            />
            <span className="text-ink-500">–</span>
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              aria-label="Tugash sanasi"
              className="bg-transparent text-sm text-page-fg outline-none cursor-pointer"
            />
          </div>

          <div className="w-[200px]">
            <Select
              id="question-status"
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
            >
              <option value="">Holatni tanlang</option>
              <option value="ANSWERED">O&rsquo;qilgan</option>
              <option value="PENDING">Javob kutilmoqda</option>
            </Select>
          </div>
        </div>

        <div className="px-6">
          {isError && (
            <div className="mb-4 rounded-lg bg-danger-500/10 p-4 text-sm text-danger-500">
              Ma&lsquo;lumotlarni yuklashda xatolik yuz berdi
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
                <Th filterable>Bo&rsquo;lim</Th>
                <Th sortable>Savol</Th>
                <Th sortable>Javob</Th>
                <Th sortable>Fayllar</Th>
                <Th width={150} sortable align="center">
                  Amallar
                </Th>
              </tr>
            </thead>

            <tbody>
              {isLoading && <TableEmpty colSpan={8} message="Yuklanmoqda..." />}
              {!isLoading && questions.length === 0 && (
                <TableEmpty colSpan={8} message="Savol topilmadi" />
              )}
              {!isLoading &&
                questions.map((item) => {
                  const avatar =
                    fileUrl("images", item.user?.image || item.user?.file) ?? null;
                  const attachedFile = item.file || item.answerFile;
                  const fileHref = attachedFile
                    ? fileUrl("files", attachedFile) ?? undefined
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
                      <Td>{item.section?.name ?? item.lesson?.name ?? "—"}</Td>
                      <Td className="max-w-[280px] truncate">{item.question}</Td>
                      <Td className="max-w-[240px] truncate">
                        {item.answer ? item.answer : "—"}
                      </Td>
                      <Td>
                        {attachedFile && fileHref ? (
                          <a
                            href={fileHref}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 font-medium text-brand-600 hover:underline"
                          >
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              className="size-4"
                            >
                              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                              <polyline points="14 2 14 8 20 8" />
                            </svg>
                            Fayl
                          </a>
                        ) : (
                          "—"
                        )}
                      </Td>
                      <Td align="center">
                        {item.status === "ANSWERED" || item.answer ? (
                          <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-600">
                            O&lsquo;qilgan
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setAnsweringItem(item)}
                            className="cursor-pointer rounded-lg bg-brand-600 px-3.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-brand-700"
                          >
                            Javob berish
                          </button>
                        )}
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
          fileName="savollar"
          rows={questions.map((q) => ({
            ID: q.id,
            Foydalanuvchi: q.user?.full_name ?? "",
            Kurs: q.course?.name ?? "",
            Bo_lim: q.section?.name ?? "",
            Savol: q.question,
            Javob: q.answer ?? "",
            Holat: q.status,
            Sana: formatDateTime(q.create_at),
          }))}
        />
      </div>

      {answeringItem && (
        <AnswerModal
          item={answeringItem}
          open={!!answeringItem}
          onClose={() => setAnsweringItem(null)}
        />
      )}
    </>
  );
}

/* ==================== Javob berish Modali ==================== */

function AnswerModal({
  item,
  open,
  onClose,
}: {
  item: StudentQuestionItem;
  open: boolean;
  onClose: () => void;
}) {
  const [text, setText] = useState(item.answer ?? "");
  const [file, setFile] = useState<File | null>(null);
  const [touched, setTouched] = useState(false);

  const { answer } = useQuestionMutations();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setTouched(true);

    if (!text.trim()) return;

    const formData = new FormData();
    formData.append("answer", text.trim());
    if (file) {
      formData.append("file", file);
    }

    answer.mutate(
      { id: item.id, formData },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  }

  return (
    <Modal open={open} title="Javob berish" onClose={onClose} width={440}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Textarea
          id="answer-text"
          label="Matn"
          rows={5}
          placeholder="Yozing..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          error={touched && !text.trim() ? "Javob matnini yozing" : null}
        />

        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold text-page-fg">
            Fayl yuklash
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
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="hidden"
              />
            </label>
            <span className="truncate text-xs font-medium text-ink-500">
              {file ? file.name : "File not found"}
            </span>
          </div>
        </div>

        <div className="mt-2 flex items-center justify-start">
          <Button
            type="submit"
            disabled={answer.isPending}
            leftIcon={
              <svg className="size-4 stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
            }
          >
            Saqlash
          </Button>
        </div>
      </form>
    </Modal>
  );
}
