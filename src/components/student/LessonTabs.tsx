"use client";

import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/Button";
import { StudentQAView } from "@/components/student/StudentQAView";
import { StudentHomeworkTab } from "@/components/student/StudentHomeworkTab";
import {
  useExamsList,
  useHomeworksList,
  useMaterialsList,
} from "@/hooks/useContent";
import { checkExam } from "@/api/content";
import { fileUrl } from "@/api/public";
import { apiErrorMessage } from "@/lib/apiError";
import type { Exam } from "@/types";

type Tab = "qa" | "materials" | "homeworks" | "exams";

const TABS: [Tab, string][] = [
  ["qa", "Q&A"],
  ["materials", "Materiallar"],
  ["homeworks", "Vazifalar"],
  ["exams", "Imtihonlar"],
];

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

function FileRow({
  name,
  href,
}: {
  name: string;
  href: string | null;
}) {
  return (
    <li className="flex items-center justify-between gap-4 border-b border-line py-2.5 last:border-b-0">
      <span className="flex min-w-0 items-center gap-2">
        <span className="flex size-5 shrink-0 items-center justify-center rounded bg-[#fef3f2] text-[8px] font-bold text-[#b42318]">
          {(name.split(".").pop() ?? "").toUpperCase().slice(0, 3)}
        </span>
        <span className="truncate text-sm text-danger-500">{name}</span>
      </span>

      {href && (
        <a href={href} download target="_blank" rel="noreferrer" aria-label="Yuklab olish">
          <DownloadIcon />
        </a>
      )}
    </li>
  );
}

/* ==================== Imtihon (test ishlash) ==================== */

function ExamRunner({
  exams,
  lessonId,
}: {
  exams: Exam[];
  lessonId: number;
}) {
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<Record<number, Exam["answer"]>>({});

  const check = useMutation({
    mutationFn: () =>
      checkExam(
        lessonId,
        Object.entries(picked).map(([examId, answer]) => ({
          examId: Number(examId),
          answer: answer as string,
        })),
      ),
  });

  useEffect(() => {
    setIndex(0);
    setPicked({});
    check.reset();
  }, [exams.length, lessonId]);

  if (exams.length === 0) {
    return (
      <p className="text-sm text-ink-500">Bu darsda imtihon savoli yo&rsquo;q.</p>
    );
  }

  const exam = exams[index];
  const options: [NonNullable<Exam["answer"]>, string][] = [
    ["variantA", exam.variantA],
    ["variantB", exam.variantB],
    ["variantC", exam.variantC],
    ["variantD", exam.variantD],
  ];

  if (check.isSuccess) {
    const result = check.data.data;
    const passed = (result?.percent ?? 0) >= 70;

    return (
      <div className="flex flex-col gap-5 rounded-xl border border-line bg-card p-6">
        <div className="flex items-center gap-3">
          <div
            className={`flex size-12 items-center justify-center rounded-full text-xl font-bold ${
              passed ? "bg-[#ecfdf3] text-[#027a48]" : "bg-[#fef3f2] text-[#b42318]"
            }`}
          >
            {passed ? "✓" : "✕"}
          </div>
          <div>
            <h4 className="text-base font-bold text-page-fg">
              {passed ? "Tabriklaymiz, testdan o'tdingiz!" : "Afsuski, testdan o'ta olmadingiz"}
            </h4>
            <p className="text-xs text-ink-500">
              Natijangiz tizimda saqlandi va profilingizda qayd etildi.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="flex flex-col rounded-lg bg-page-bg p-3">
            <span className="text-xs text-ink-500">Jami savollar</span>
            <span className="text-lg font-bold text-page-fg">{result?.total ?? exams.length}</span>
          </div>
          <div className="flex flex-col rounded-lg bg-page-bg p-3">
            <span className="text-xs text-[#027a48]">To&rsquo;g&rsquo;ri</span>
            <span className="text-lg font-bold text-[#027a48]">{result?.correct ?? 0}</span>
          </div>
          <div className="flex flex-col rounded-lg bg-page-bg p-3">
            <span className="text-xs text-[#b42318]">Noto&rsquo;g&rsquo;ri</span>
            <span className="text-lg font-bold text-[#b42318]">{result?.wrong ?? 0}</span>
          </div>
          <div className="flex flex-col rounded-lg bg-page-bg p-3">
            <span className="text-xs text-ink-500">Natija foizi</span>
            <span className={`text-lg font-bold ${passed ? "text-[#027a48]" : "text-[#b42318]"}`}>
              {result?.percent ?? 0}%
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              check.reset();
              setIndex(0);
              setPicked({});
            }}
          >
            Qaytadan ishlash
          </Button>

          <a
            href="/results"
            className="inline-flex items-center text-sm font-medium text-brand-500 hover:underline"
          >
            Barcha natijalarimni ko&rsquo;rish &rarr;
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm font-medium text-page-fg">
        Savol: {index + 1}/{exams.length}
      </p>

      <span className="flex gap-1.5">
        {exams.map((item, i) => (
          <span
            key={item.id}
            className={`h-1 flex-1 rounded-full ${
              i <= index ? "bg-brand-500" : "bg-hover"
            }`}
          />
        ))}
      </span>

      <p className="text-base font-bold text-page-fg">
        {index + 1}. {exam.question}
      </p>

      <div className="flex flex-col gap-2">
        {options.map(([key, label], i) => (
          <button
            key={key}
            type="button"
            onClick={() => setPicked((prev) => ({ ...prev, [exam.id]: key }))}
            className={`flex cursor-pointer items-center justify-between gap-3 rounded-lg border px-4 py-3 text-left text-sm transition-colors ${
              picked[exam.id] === key
                ? "border-brand-500 bg-brand-50"
                : "border-line hover:border-brand-500"
            }`}
          >
            <span className="text-page-fg">
              {String.fromCharCode(65 + i)}) {label}
            </span>

            <span
              className={`size-3.5 shrink-0 rounded-full border-2 ${
                picked[exam.id] === key
                  ? "border-brand-500 bg-brand-500"
                  : "border-line"
              }`}
            />
          </button>
        ))}
      </div>

      {check.isError && (
        <p className="text-sm font-medium text-danger-500">
          {apiErrorMessage(check.error)}
        </p>
      )}

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="secondary"
          disabled={index === 0}
          onClick={() => setIndex((v) => v - 1)}
        >
          Oldingi
        </Button>

        <Button
          type="button"
          disabled={check.isPending}
          onClick={() =>
            index === exams.length - 1
              ? check.mutate()
              : setIndex((v) => v + 1)
          }
        >
          {index === exams.length - 1
            ? check.isPending
              ? "Tekshirilmoqda..."
              : "Yakunlash"
            : "Keyingi"}
        </Button>
      </div>
    </div>
  );
}

/* ==================== Tablar ==================== */

export function LessonTabs({
  lessonId,
  courseId,
}: {
  lessonId: number;
  courseId: number;
}) {
  const [tab, setTab] = useState<Tab>("qa");

  const query = { page: 1, limit: 100, lessonId };
  const { materials } = useMaterialsList(query);
  const { homeworks } = useHomeworksList(query);
  const { exams } = useExamsList(query);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-1">
        {TABS.map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`cursor-pointer rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
              tab === key
                ? "bg-brand-500 text-white"
                : "text-ink-500 hover:bg-hover"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "qa" && (
        <StudentQAView courseId={courseId} lessonId={lessonId} />
      )}

      {tab === "materials" && (
        <div className="flex flex-col gap-2">
          <h3 className="text-base font-bold text-page-fg">Materiallar</h3>

          {materials.length === 0 && (
            <p className="text-sm text-ink-500">Material yo&rsquo;q.</p>
          )}

          <ul className="flex flex-col">
            {materials.flatMap((material) =>
              (material.materialFiles ?? []).map((item) => (
                <FileRow
                  key={item.id}
                  name={item.file}
                  href={fileUrl("files", item.file)}
                />
              )),
            )}
          </ul>
        </div>
      )}

      {tab === "homeworks" && (
        <StudentHomeworkTab
          homeworks={homeworks}
          lessonId={lessonId}
          courseId={courseId}
        />
      )}

      {tab === "exams" && <ExamRunner exams={exams} lessonId={lessonId} />}

    </div>
  );
}
