"use client";

import { useState } from "react";
import type { PublicCourseDetail } from "@/types";

function LockIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-4 shrink-0 text-ink-500"
      aria-hidden
    >
      <rect x="3" y="7" width="10" height="7" rx="1.5" />
      <path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" />
    </svg>
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
      className={`size-4 shrink-0 text-ink-500 transition-transform ${
        open ? "rotate-180" : ""
      }`}
      aria-hidden
    >
      <path d="M4 6l4 4 4-4" />
    </svg>
  );
}

export function CourseSections({
  sections,
}: {
  sections: PublicCourseDetail["sections"];
}) {
  const [openId, setOpenId] = useState<number | null>(
    sections[0]?.id ?? null,
  );

  if (sections.length === 0) {
    return (
      <p className="rounded-xl bg-card p-6 text-sm text-ink-500">
        Bu kursda hali bo&rsquo;lim yo&rsquo;q.
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl bg-card">
      {sections.map((section) => {
        const open = openId === section.id;

        return (
          <div key={section.id} className="border-b border-line last:border-b-0">
            <button
              type="button"
              onClick={() => setOpenId(open ? null : section.id)}
              className="flex w-full cursor-pointer items-center justify-between gap-4 px-6 py-4 text-left transition-colors hover:bg-muted"
            >
              <span className="text-sm font-semibold text-page-fg">
                {section.name}
              </span>

              <span className="flex items-center gap-3">
                <span className="text-xs text-ink-500">
                  {section._count.lessons} ta dars
                </span>
                <Chevron open={open} />
              </span>
            </button>

            {open && (
              <ul className="flex flex-col">
                {section.lessons.map((lesson) => (
                  <li
                    key={lesson.id}
                    className="flex items-center gap-3 border-t border-line px-6 py-3"
                  >
                    <LockIcon />
                    <span className="flex-1 text-sm text-ink-500">
                      {lesson.name}
                    </span>
                  </li>
                ))}

                {section.lessons.length === 0 && (
                  <li className="border-t border-line px-6 py-3 text-sm text-ink-500">
                    Dars qo&rsquo;shilmagan
                  </li>
                )}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}
