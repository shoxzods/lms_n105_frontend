"use client";

import type { Lesson, Section } from "@/types";

function PlayDot() {
  return (
    <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-brand-500">
      <svg viewBox="0 0 8 8" fill="white" className="size-2" aria-hidden>
        <path d="M2 1l5 3-5 3z" />
      </svg>
    </span>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`size-3.5 shrink-0 text-ink-500 transition-transform ${
        open ? "rotate-90" : ""
      }`}
      aria-hidden
    >
      <path d="M6 3l5 5-5 5" />
    </svg>
  );
}

interface LessonSidebarProps {
  courseName: string;
  sections: Section[];
  openSectionId: number | null;
  lessons: Lesson[];
  lessonsLoading: boolean;
  selectedLessonId: number | null;
  onOpenSection: (id: number) => void;
  onSelectLesson: (id: number) => void;
}

/**
 * Figma: chapdagi panel — kurs bo'limlari, ochilgani ichida darslar.
 *
 * Dizaynda har darsning yonida davomiyligi ("10 daqiqa") va ko'rilganini
 * bildiruvchi ✓ belgisi bor. Bazada bunday maydonlar yo'q: `Lessons` da
 * davomiylik ustuni ham, kim qaysi darsni ko'rgani ham saqlanmaydi.
 */
export function LessonSidebar({
  courseName,
  sections,
  openSectionId,
  lessons,
  lessonsLoading,
  selectedLessonId,
  onOpenSection,
  onSelectLesson,
}: LessonSidebarProps) {
  return (
    <aside className="w-full shrink-0 overflow-hidden rounded-xl bg-card lg:w-[260px]">
      <h2 className="border-b border-line px-5 py-4 text-sm font-bold text-page-fg">
        {courseName}
      </h2>

      <div className="flex flex-col">
        {sections.map((section) => {
          const open = openSectionId === section.id;

          return (
            <div key={section.id}>
              <button
                type="button"
                onClick={() => onOpenSection(section.id)}
                className={`flex w-full cursor-pointer items-center justify-between gap-3 px-5 py-3 text-left transition-colors ${
                  open ? "bg-table-head" : "hover:bg-hover"
                }`}
              >
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-bold text-page-fg">
                    {section.name}
                  </span>
                </span>

                <Chevron open={open} />
              </button>

              {open && (
                <ul className="flex flex-col bg-table-head pb-2">
                  {lessonsLoading && (
                    <li className="px-5 py-2 text-xs text-ink-500">
                      Yuklanmoqda...
                    </li>
                  )}

                  {!lessonsLoading && lessons.length === 0 && (
                    <li className="px-5 py-2 text-xs text-ink-500">
                      Dars yo&rsquo;q
                    </li>
                  )}

                  {lessons.map((lesson) => (
                    <li key={lesson.id}>
                      <button
                        type="button"
                        onClick={() => onSelectLesson(lesson.id)}
                        className={`flex w-full cursor-pointer items-start gap-2.5 px-5 py-2 text-left transition-colors hover:bg-hover ${
                          selectedLessonId === lesson.id ? "bg-hover" : ""
                        }`}
                      >
                        <span className="pt-0.5">
                          <PlayDot />
                        </span>

                        <span className="min-w-0 flex-1 truncate text-xs font-medium text-page-fg">
                          {lesson.name}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}
