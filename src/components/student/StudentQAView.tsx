"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import { Modal } from "@/components/ui/Modal";
import { Textarea } from "@/components/ui/Textarea";
import { useQuestionMutations, useQuestionsList } from "@/hooks/useQuestions";
import { fileUrl } from "@/api/public";
import { formatDateTime } from "@/lib/format";

interface StudentQAViewProps {
  courseId: number;
  lessonId?: number;
  sectionId?: number;
}

export function StudentQAView({
  courseId,
  lessonId,
  sectionId,
}: StudentQAViewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [questionText, setQuestionText] = useState("");
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [touched, setTouched] = useState(false);

  const { questions, isLoading, isError } = useQuestionsList({
    courseId,
    limit: 50,
  });

  const { create } = useQuestionMutations();

  const totalQuestions = questions.length;
  const totalAnswers = questions.filter((q) => !!q.answer).length;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setTouched(true);

    if (!questionText.trim()) return;

    const formData = new FormData();
    formData.append("courseId", String(courseId));
    if (lessonId) formData.append("lessonId", String(lessonId));
    if (sectionId) formData.append("sectionId", String(sectionId));
    formData.append("question", questionText.trim());
    if (attachedFile) {
      formData.append("file", attachedFile);
    }

    create.mutate(formData, {
      onSuccess: () => {
        setIsModalOpen(false);
        setQuestionText("");
        setAttachedFile(null);
        setTouched(false);
      },
    });
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-page-fg">Savol va javoblar</h3>
          <p className="text-xs text-ink-500">
            Savollar: {totalQuestions} ta &nbsp; Javoblar: {totalAnswers} ta
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="cursor-pointer rounded-lg bg-brand-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700"
        >
          Savol so&rsquo;rash
        </button>
      </div>

      {/* Questions list */}
      <div className="flex flex-col gap-4">
        <h4 className="text-sm font-bold text-page-fg">Barcha savollar</h4>

        {isLoading && (
          <div className="py-8 text-center text-sm text-ink-500">
            Savollar yuklanmoqda...
          </div>
        )}

        {isError && (
          <div className="rounded-lg bg-danger-500/10 p-4 text-sm text-danger-500">
            Savollarni yuklashda xatolik yuz berdi.
          </div>
        )}

        {!isLoading && !isError && questions.length === 0 && (
          <div className="rounded-xl border border-line bg-card/50 py-10 text-center">
            <p className="text-sm font-medium text-page-fg">
              Hozircha hech qanday savol yo&rsquo;q
            </p>
            <p className="mt-1 text-xs text-ink-500">
              Birinchi bo&rsquo;lib savol bering va ustozingizdan javob oling!
            </p>
          </div>
        )}

        {!isLoading &&
          questions.map((item) => {
            const avatar =
              fileUrl("images", item.user?.image || item.user?.file) ?? null;
            const fileDownload = item.file
              ? fileUrl("files", item.file) ?? null
              : null;
            const answerFileDownload = item.answerFile
              ? fileUrl("files", item.answerFile) ?? null
              : null;

            return (
              <div
                key={item.id}
                className="flex flex-col gap-3 rounded-xl border border-line bg-card p-4 transition-all hover:border-brand-500/30"
              >
                {/* Student Question */}
                <div className="flex items-start gap-3">
                  <div className="relative size-10 shrink-0 overflow-hidden rounded-full bg-subtle">
                    {avatar ? (
                      <Image
                        src={avatar}
                        alt=""
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    ) : (
                      <span className="flex size-full items-center justify-center text-xs font-bold text-ink-600">
                        {item.user?.full_name?.charAt(0) ?? "U"}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-sm font-semibold text-page-fg">
                        {item.user?.full_name ?? "Talaba"}
                      </span>
                      <span className="text-xs text-ink-400">
                        {formatDateTime(item.create_at)}
                      </span>
                    </div>

                    <p className="mt-1.5 text-sm leading-relaxed text-page-fg">
                      {item.question}
                    </p>

                    {fileDownload && (
                      <div className="mt-2">
                        <a
                          href={fileDownload}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-md bg-subtle px-2.5 py-1 text-xs font-medium text-brand-600 hover:underline"
                        >
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="size-3.5"
                          >
                            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                            <polyline points="14 2 14 8 20 8" />
                          </svg>
                          Biriktirilgan fayl ({item.file})
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Teacher Answer (if available) */}
                {item.answer ? (
                  <div className="ml-6 mt-1 flex flex-col gap-2 rounded-xl border border-line bg-subtle/50 p-3.5 sm:ml-12">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 rounded-full bg-brand-500/10 px-2.5 py-0.5 text-xs font-bold text-brand-600">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          className="size-3.5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m4.5 12.75 6 6 9-13.5"
                          />
                        </svg>
                        Ustoz javobi
                      </span>
                    </div>

                    <p className="text-sm leading-relaxed text-page-fg">
                      {item.answer}
                    </p>

                    {answerFileDownload && (
                      <div className="mt-1">
                        <a
                          href={answerFileDownload}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-md bg-card px-2.5 py-1 text-xs font-medium text-brand-600 hover:underline"
                        >
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="size-3.5"
                          >
                            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                            <polyline points="14 2 14 8 20 8" />
                          </svg>
                          Ustoz fayli ({item.answerFile})
                        </a>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="ml-6 flex items-center gap-2 sm:ml-12">
                    <span className="inline-flex items-center gap-1.5 rounded-md bg-subtle px-2.5 py-1 text-xs font-medium text-ink-500">
                      <span className="size-1.5 rounded-full bg-amber-500" />
                      Javob kutilmoqda...
                    </span>
                  </div>
                )}
              </div>
            );
          })}
      </div>

      {/* Ask Question Modal */}
      {isModalOpen && (
        <Modal
          open={isModalOpen}
          title="Savol so'rash"
          onClose={() => setIsModalOpen(false)}
          width={520}
        >
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Textarea
              id="student-question-text"
              label="Savol matni"
              rows={5}
              placeholder="Kiriting"
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              error={
                touched && !questionText.trim()
                  ? "Savol matnini kiritishingiz shart"
                  : null
              }
            />

            <div className="flex flex-col gap-1.5">
              <span className="text-sm font-semibold text-page-fg">
                Fayl biriktirish (ixtiyoriy)
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
                      setAttachedFile(e.target.files?.[0] ?? null)
                    }
                    className="hidden"
                  />
                </label>
                <span className="truncate text-xs font-medium text-ink-500">
                  {attachedFile ? attachedFile.name : "Fayl tanlanmagan"}
                </span>
              </div>
            </div>

            <div className="mt-2 flex items-center justify-start">
              <button
                type="submit"
                disabled={create.isPending}
                className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700 disabled:opacity-50"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="size-4"
                >
                  <path d="m22 2-7 20-4-9-9-4Z" />
                  <path d="M22 2 11 13" />
                </svg>
                {create.isPending ? "Yuborilmoqda..." : "Yuborish"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
