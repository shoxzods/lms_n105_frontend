"use client";

import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/Button";
import { ChatPanel } from "@/components/chat/ChatPanel";
import {
  useExamsList,
  useHomeworksList,
  useMaterialsList,
} from "@/hooks/useContent";
import { checkExam } from "@/api/content";
import { fileUrl } from "@/api/public";
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

    return (
      <div className="flex flex-col gap-3">
        <p className="text-base font-bold text-page-fg">
          Natija: {result?.correct} / {result?.total} ({result?.percent}%)
        </p>
        <p className="text-sm text-ink-500">
          Natija bazaga yozilmadi — imtihon natijalari uchun model yo&rsquo;q.
        </p>
        <span>
          <Button type="button" onClick={() => { check.reset(); setIndex(0); setPicked({}); }}>
            Qaytadan ishlash
          </Button>
        </span>
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
          Javoblarni tekshirib bo&rsquo;lmadi
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
        <div className="flex flex-col gap-4">
          <div>
            <h3 className="text-base font-bold text-page-fg">
              Savol va javoblar
            </h3>
            <p className="text-xs text-ink-500">
              Tushunmagan joyingizni yozing — mentor yoki assistent javob beradi
            </p>
          </div>

          <ChatPanel courseId={courseId} />
        </div>
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
        <div className="flex flex-col gap-4">
          <h3 className="text-base font-bold text-page-fg">Vazifalar</h3>

          {homeworks.length === 0 && (
            <p className="text-sm text-ink-500">Vazifa yo&rsquo;q.</p>
          )}

          <ul className="flex flex-col">
            {homeworks.map((homework) => (
              <FileRow
                key={homework.id}
                name={homework.file ?? homework.description}
                href={fileUrl("files", homework.file)}
              />
            ))}
          </ul>

          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-semibold text-page-fg">
              Vazifa faylini yuklang
            </span>

            {/*
              Student javob faylini yuklashi uchun backendda endpoint yo'q —
              topshirilgan ishlar uchun model mavjud emas.
            */}
            <div className="flex items-stretch overflow-hidden rounded-lg border border-line">
              <span
                title="Vazifa topshirish uchun backendda model yo'q"
                className="flex cursor-not-allowed items-center gap-2 bg-table-head px-4 py-2.5 text-sm font-medium text-ink-500"
              >
                Yuklash
              </span>
              <span className="flex flex-1 items-center px-4 text-sm text-ink-500">
                Fayl yuklanmagan
              </span>
            </div>
          </div>
        </div>
      )}

      {tab === "exams" && <ExamRunner exams={exams} lessonId={lessonId} />}

    </div>
  );
}
