"use client";

import { useState, type FormEvent } from "react";
import {
  useHomeworkSubmissionMutations,
  useMyHomeworkSubmissions,
} from "@/hooks/useHomeworkSubmissions";
import { fileUrl } from "@/api/public";
import { formatDateTime } from "@/lib/format";
import type { Homework } from "@/types";

function DownloadIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-5 text-page-fg"
      aria-hidden
    >
      <path d="M10 3v10M6 9.5l4 4 4-4M3.5 16.5h13" />
    </svg>
  );
}

function FileRow({ name, href }: { name: string; href: string | null }) {
  return (
    <li className="flex items-center justify-between gap-4 border-b border-line py-2.5 last:border-b-0">
      <span className="flex min-w-0 items-center gap-2">
        <span className="flex size-5 shrink-0 items-center justify-center rounded bg-[#fef3f2] text-[8px] font-bold text-[#b42318]">
          {(name.split(".").pop() ?? "").toUpperCase().slice(0, 3)}
        </span>
        <span className="truncate text-sm text-danger-500">{name}</span>
      </span>

      {href && (
        <a
          href={href}
          download
          target="_blank"
          rel="noreferrer"
          aria-label="Yuklab olish"
        >
          <DownloadIcon />
        </a>
      )}
    </li>
  );
}

interface StudentHomeworkTabProps {
  homeworks: Homework[];
  lessonId: number;
  courseId: number;
}

export function StudentHomeworkTab({
  homeworks,
  lessonId,
  courseId,
}: StudentHomeworkTabProps) {
  const [file, setFile] = useState<File | null>(null);
  const [notes, setNotes] = useState("");
  const [isResubmitting, setIsResubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { submissions, latestSubmission, isLoading, refetch } =
    useMyHomeworkSubmissions(lessonId);
  const { submit } = useHomeworkSubmissionMutations();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErrorMessage(null);

    if (!file && !notes.trim()) {
      setErrorMessage("Iltimos, vazifa faylini tanlang yoki izoh yozing");
      return;
    }

    const formData = new FormData();
    formData.append("lessonId", String(lessonId));
    formData.append("courseId", String(courseId));
    if (homeworks[0]?.id) {
      formData.append("homeworkId", String(homeworks[0].id));
    }
    if (notes.trim()) {
      formData.append("text", notes.trim());
    }
    if (file) {
      formData.append("file", file);
    }

    submit.mutate(formData, {
      onSuccess: () => {
        setFile(null);
        setNotes("");
        setIsResubmitting(false);
        refetch();
      },
      onError: () => {
        setErrorMessage("Vazifani yuborishda xatolik yuz berdi");
      },
    });
  }

  return (
    <div className="flex flex-col gap-6">
      {/* 1. Darsdagi vazifalar ro'yxati (Ustoz bergan) */}
      <div className="flex flex-col gap-3">
        <h3 className="text-base font-bold text-page-fg">Vazifalar</h3>

        {homeworks.length === 0 && (
          <p className="text-sm text-ink-500">Bu darsda vazifa yo&rsquo;q.</p>
        )}

        {homeworks.length > 0 && (
          <ul className="flex flex-col">
            {homeworks.map((homework) => (
              <FileRow
                key={homework.id}
                name={homework.file ?? homework.description}
                href={fileUrl("files", homework.file)}
              />
            ))}
          </ul>
        )}
      </div>

      {/* 2. Topshirilgan vazifa (agar mavjud bo'lsa) */}
      {latestSubmission && !isResubmitting && (
        <div className="flex flex-col gap-4 rounded-xl border border-line bg-card p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h4 className="text-sm font-bold text-page-fg">
              Topshirilgan vazifangiz
            </h4>
            <span className="text-xs text-ink-400">
              {formatDateTime(latestSubmission.create_at)}
            </span>
          </div>

          {/* Talaba topshirgan fayl */}
          {latestSubmission.file && (
            <div className="flex items-center justify-between rounded-lg border border-line bg-subtle p-3">
              <span className="flex items-center gap-2 text-sm font-medium text-page-fg">
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
                {latestSubmission.file}
              </span>
              <a
                href={fileUrl("files", latestSubmission.file) ?? "#"}
                target="_blank"
                rel="noreferrer"
                download
                className="text-xs font-semibold text-brand-600 hover:underline"
              >
                Yuklab olish
              </a>
            </div>
          )}

          {latestSubmission.text && (
            <p className="text-sm leading-relaxed text-page-fg">
              {latestSubmission.text}
            </p>
          )}

          {/* Baholash natijasi va Holat */}
          <div className="mt-2 flex flex-col gap-3 rounded-lg border border-line bg-subtle/50 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-ink-500">Holat:</span>
                {latestSubmission.status === "PENDING" && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-bold text-amber-600">
                    <span className="size-1.5 rounded-full bg-amber-500" />
                    Kutilmoqda (Tekshirilmoqda)
                  </span>
                )}
                {latestSubmission.status === "GRADED" && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-600">
                    <span className="size-1.5 rounded-full bg-emerald-500" />
                    Baholandi
                  </span>
                )}
                {latestSubmission.status === "REJECTED" && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 px-2.5 py-0.5 text-xs font-bold text-rose-600">
                    <span className="size-1.5 rounded-full bg-rose-500" />
                    Qaytarildi
                  </span>
                )}
              </div>

              {latestSubmission.score !== null &&
                latestSubmission.score !== undefined && (
                  <div className="flex items-center gap-1 text-sm font-bold text-brand-600">
                    <span>Baho:</span>
                    <span className="rounded-md bg-brand-500/10 px-2 py-0.5 text-base text-brand-600">
                      {latestSubmission.score} / 100
                    </span>
                  </div>
                )}
            </div>

            {/* Ustoz fikri / Izoh */}
            {latestSubmission.feedback && (
              <div className="mt-2 border-t border-line/60 pt-3">
                <span className="text-xs font-bold text-page-fg">
                  Ustoz izohi:
                </span>
                <p className="mt-1 text-sm leading-relaxed text-page-fg/90">
                  {latestSubmission.feedback}
                </p>
              </div>
            )}

            {latestSubmission.feedbackFile && (
              <div className="mt-1">
                <a
                  href={fileUrl("files", latestSubmission.feedbackFile) ?? "#"}
                  target="_blank"
                  rel="noreferrer"
                  download
                  className="inline-flex items-center gap-1.5 rounded-md bg-card px-3 py-1.5 text-xs font-semibold text-brand-600 hover:underline"
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
                  Ustoz biriktirgan fayl ({latestSubmission.feedbackFile})
                </a>
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setIsResubmitting(true)}
              className="cursor-pointer text-xs font-semibold text-brand-600 hover:underline"
            >
              Qayta topshirish
            </button>
          </div>
        </div>
      )}

      {/* 3. Vazifa topshirish formasi */}
      {(!latestSubmission || isResubmitting) && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-semibold text-page-fg">
              Vazifa faylini yuklang
            </span>

            <div className="flex items-center justify-between rounded-lg border border-line bg-card p-2.5">
              <label className="flex cursor-pointer items-center gap-2 rounded-md bg-subtle px-4 py-2 text-xs font-semibold text-page-fg transition-colors hover:bg-hover">
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
                {file ? file.name : "Fayl yuklanmagan"}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-page-fg">
              Izoh yoki javob matni (ixtiyoriy)
            </span>
            <textarea
              rows={2}
              placeholder="Vazifa bo'yicha izohingizni yozing..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="rounded-lg border border-line bg-card p-2.5 text-xs text-page-fg outline-none focus:border-brand-500"
            />
          </div>

          {errorMessage && (
            <p className="text-xs font-medium text-danger-500">{errorMessage}</p>
          )}

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={submit.isPending}
              className="cursor-pointer rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700 disabled:opacity-50"
            >
              {submit.isPending ? "Yuborilmoqda..." : "Topshirish"}
            </button>

            {isResubmitting && (
              <button
                type="button"
                onClick={() => setIsResubmitting(false)}
                className="cursor-pointer text-xs font-semibold text-ink-500 hover:text-page-fg"
              >
                Bekor qilish
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
}
