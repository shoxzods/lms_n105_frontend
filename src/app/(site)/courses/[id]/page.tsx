"use client";

import Image from "next/image";
import { use } from "react";
import { Container } from "@/components/site/Container";
import { CoursePurchase } from "@/components/site/CoursePurchase";
import { CourseSections } from "@/components/site/CourseSections";
import { usePublicCourse, usePublicCourses } from "@/hooks/usePublic";
import { fileUrl } from "@/lib/api/public";

const LEVEL_LABELS: Record<string, string> = {
  BEGINNER: "Beginner",
  ELEMENTARY: "Elementary",
  PRE_INTERMEDIATE: "Pre-Intermediate",
  INTERMEDIATE: "Intermediate",
  ADVANCED: "Advanced",
};

function LevelIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      className="size-4"
      aria-hidden
    >
      <path d="M3 12V9M8 12V6M13 12V3" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-4"
      aria-hidden
    >
      <path d="M2.5 3.5h4a2 2 0 0 1 2 2v7a1.6 1.6 0 0 0-1.6-1.6H2.5z" />
      <path d="M13.5 3.5h-4a2 2 0 0 0-2 2v7a1.6 1.6 0 0 1 1.6-1.6h4.4z" />
    </svg>
  );
}

export default function CourseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const courseId = Number(id);

  const { course, isLoading, isError } = usePublicCourse(courseId);

  const { courses: allCourses } = usePublicCourses({ page: 1, limit: 100 });

  if (isLoading) {
    return (
      <Container className="py-20">
        <p className="text-center text-sm font-medium text-ink-500">
          Yuklanmoqda...
        </p>
      </Container>
    );
  }

  if (isError || !course) {
    return (
      <Container className="py-20">
        <p className="text-center text-sm font-medium text-danger-500">
          {isError ? "Kursni yuklab bo‘lmadi" : "Kurs topilmadi"}
        </p>
      </Container>
    );
  }

  const mentor = course.mentorProfile;
  const mentorAvatar = fileUrl("images", mentor?.user.file);

  const lessonCount = course.sections.reduce(
    (sum, section) => sum + section._count.lessons,
    0,
  );

  const mentorCourses = allCourses.filter(
    (item) => item.mentorProfile?.id === mentor?.id,
  ).length;

  return (
    <>
      <section className="bg-brand-500 pt-12 pb-28">
        <Container className="flex flex-col gap-5">
          <h1 className="max-w-[720px] text-3xl leading-tight font-bold text-white sm:text-4xl lg:text-5xl">
            {course.name}
          </h1>

          <p className="max-w-[640px] text-[15px] leading-6 font-medium text-white/90">
            {course.description}
          </p>

          <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-white/90">
            <span className="flex items-center gap-2">
              <BookIcon />
              {course.sections.length} ta bo&rsquo;lim Â· {lessonCount} ta dars
            </span>

            <span className="flex items-center gap-2">
              <LevelIcon />
              Daraja {LEVEL_LABELS[course.level] ?? course.level}
            </span>

            <span className="rounded-full bg-white/15 px-3 py-1">
              {course.categories.name}
            </span>
          </div>
        </Container>
      </section>

      <section className="bg-muted pb-16">
        <Container className="flex flex-col gap-8 lg:flex-row lg:items-start">
          <div className="-mt-16 flex min-w-0 flex-1 flex-col gap-8 pt-16 lg:pt-0">
            <CourseSections sections={course.sections} />
          </div>

          <div className="-mt-20 flex w-full flex-col gap-4 lg:w-[340px]">
            <CoursePurchase course={course} />

            {mentor && (
              <div className="flex flex-col gap-4 rounded-xl bg-card p-5">
                <div className="flex items-center gap-3">
                  <span className="relative size-12 shrink-0 overflow-hidden rounded-full bg-hover">
                    {mentorAvatar && (
                      <Image
                        src={mentorAvatar}
                        alt=""
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    )}
                  </span>

                  <span className="min-w-0">
                    <span className="block truncate text-[15px] font-bold text-page-fg">
                      {mentor.user.full_name}
                    </span>
                    <span className="block truncate text-xs text-ink-500">
                      {mentor.job ?? "Mentor"}
                    </span>
                  </span>
                </div>

                <div className="flex items-center gap-8 border-t border-line pt-4">
                  <span className="flex flex-col">
                    <span className="text-lg font-bold text-page-fg">
                      {mentorCourses}
                    </span>
                    <span className="text-xs text-ink-500">Kurslari</span>
                  </span>

                  <span className="flex flex-col">
                    <span className="text-lg font-bold text-page-fg">
                      {lessonCount}
                    </span>
                    <span className="text-xs text-ink-500">Darslari</span>
                  </span>
                </div>
              </div>
            )}
          </div>
        </Container>
      </section>
    </>
  );
}
