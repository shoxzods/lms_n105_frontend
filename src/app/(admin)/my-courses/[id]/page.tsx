"use client";

import { use, useEffect, useState } from "react";
import { LessonSidebar } from "@/components/student/LessonSidebar";
import { LessonTabs } from "@/components/student/LessonTabs";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { useLessonsList, useSectionsList } from "@/hooks/useContent";
import { fileUrl } from "@/api/public";
import { apiErrorMessage } from "@/lib/apiError";

const ALL = { page: 1, limit: 100 };

/**
 * Figma: student dars ko'rish sahifasi.
 *
 * Chapda kurs bo'limlari, o'ngda video va tablar.
 *
 * Bazada yo'q narsalar (dizaynda bor):
 *   - dars davomiyligi ("10 daqiqa")
 *   - ko'rilgan darslar belgisi (✓) va foiz
 *   - darsni baholash (yulduzchalar)
 *   - savol-javob
 *   - vazifa topshirish
 *   - imtihon natijasini saqlash
 */
export default function LessonPlayerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const courseId = Number(id);

  const [openSectionId, setOpenSectionId] = useState<number | null>(null);
  const [selectedLessonId, setSelectedLessonId] = useState<number | null>(null);

  const {
    sections,
    isLoading: sectionsLoading,
    isError,
    error,
  } = useSectionsList({ ...ALL, courseId });

  /* Birinchi bo'lim o'zi ochiladi */
  useEffect(() => {
    if (openSectionId === null && sections.length > 0) {
      setOpenSectionId(sections[0].id);
    }
  }, [sections, openSectionId]);

  const { lessons, isLoading: lessonsLoading } = useLessonsList({
    ...ALL,
    sectionId: openSectionId ?? undefined,
  });

  /* Bo'lim ochilganda birinchi darsi tanlanadi */
  useEffect(() => {
    if (lessons.length === 0) return;

    const inList = lessons.some((lesson) => lesson.id === selectedLessonId);
    if (!inList) setSelectedLessonId(lessons[0].id);
  }, [lessons, selectedLessonId]);

  const lesson = lessons.find((item) => item.id === selectedLessonId) ?? null;
  const video = fileUrl("videos", lesson?.file);
  const courseName = sections[0]?.courses?.name ?? "Kurs";

  const currentIndex = lessons.findIndex((item) => item.id === selectedLessonId);
  const nextLesson =
    currentIndex >= 0 && currentIndex < lessons.length - 1
      ? lessons[currentIndex + 1]
      : null;

  return (
    <div className="flex w-full max-w-[1600px] flex-col gap-6 px-6 pb-8 lg:flex-row">

      {isError ? (
        <p className="text-sm font-medium text-danger-500">
          {apiErrorMessage(error)}
        </p>
      ) : sectionsLoading ? (
        <div className="flex w-full items-center justify-center py-20">
          <Spinner size="lg" label="Yuklanmoqda..." />
        </div>
      ) : (
        <>
          <LessonSidebar
            courseName={courseName}
            sections={sections}
            openSectionId={openSectionId}
            lessons={lessons}
            lessonsLoading={lessonsLoading}
            selectedLessonId={selectedLessonId}
            onOpenSection={(sectionId) =>
              setOpenSectionId((prev) => (prev === sectionId ? prev : sectionId))
            }
            onSelectLesson={setSelectedLessonId}
          />

          <section className="flex min-w-0 flex-1 flex-col gap-5 rounded-xl bg-card p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h1 className="text-lg font-bold text-page-fg">
                {lesson?.name ?? "Dars tanlanmagan"}
              </h1>

              <Button
                type="button"
                disabled={!nextLesson}
                onClick={() => nextLesson && setSelectedLessonId(nextLesson.id)}
              >
                Keyingi dars
              </Button>
            </div>

            <div className="overflow-hidden rounded-lg bg-black">
              {video ? (
                <video
                  key={video}
                  src={video}
                  controls
                  controlsList="nodownload"
                  className="aspect-video w-full"
                />
              ) : (
                <div className="flex aspect-video w-full items-center justify-center text-sm text-white/70">
                  Video yo&rsquo;q
                </div>
              )}
            </div>

            {/*
              Dizaynda "Darsni baholashni istaysizmi?" yulduzchalari bor,
              lekin baholash uchun model yo'q — bosilmaydigan qilib qo'ydim,
              soxta baho saqlanmasin.
            */}
            <div
              title="Darsni baholash uchun bazada model yo'q"
              className="flex flex-col items-center gap-1"
            >
              <p className="text-sm font-medium text-page-fg">
                Darsni baholashni istaysizmi?
              </p>
              <span className="flex gap-1 opacity-40">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    viewBox="0 0 20 20"
                    fill="#f5a623"
                    className="size-4"
                    aria-hidden
                  >
                    <path d="M10 1l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.4 4.8 17.1l1-5.8L1.5 7.2l5.9-.9z" />
                  </svg>
                ))}
              </span>
            </div>

            {lesson && <LessonTabs lessonId={lesson.id} courseId={courseId} />}

            {lesson?.description && (
              <p className="text-sm leading-6 text-ink-500">
                {lesson.description}
              </p>
            )}
          </section>
        </>
      )}
    </div>
  );
}
