"use client";

import Image from "next/image";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { fileUrl } from "@/api/public";
import { apiErrorMessage } from "@/lib/apiError";
import { useMyCourses, type MyCourse } from "@/hooks/useMyCourses";

/** Figma: student panelidagi kurs kartasi */
function MyCourseCard({ course }: { course: MyCourse }) {
  const banner = fileUrl("images", course.banner);
  const avatar = fileUrl("images", course.mentorFile);

  /*
    "Ko'rildi" foizi bazada saqlanmaydi — qaysi darsni kim ko'rgani
    uchun model yo'q. Shu sabab 0% dan boshlanadi.
  */
  const progress = 0;

  return (
    <article className="flex w-full max-w-[280px] flex-col overflow-hidden rounded-lg bg-card shadow-sm">
      <div className="relative h-[155px] bg-hover dark:bg-ink-800">
        {banner && (
          <Image
            src={banner}
            alt=""
            fill
            sizes="280px"
            className="object-cover"
          />
        )}

        <span className="absolute top-3 left-3 rounded-full bg-[#12b76a] px-3 py-1 text-xs font-medium text-white">
          {course.categoryName}
        </span>
      </div>

      <div className="flex flex-col gap-3 p-4">
        <div className="flex items-center gap-2">
          <span className="relative size-6 shrink-0 overflow-hidden rounded-full bg-ink-200 dark:bg-ink-800">
            {avatar && (
              <Image src={avatar} alt="" fill sizes="24px" className="object-cover" />
            )}
          </span>

          <p className="flex-1 truncate text-xs font-bold text-page-fg">
            {course.mentorName}
          </p>

          {/* Sevimlilar modeli yo'q — bezak sifatida turadi */}
          <Image
            src="/icons/heart.svg"
            alt=""
            width={16}
            height={14}
            style={{ width: "auto", height: "auto" }}
          />
        </div>

        <h3 className="truncate text-base font-bold text-page-fg">
          {course.name}
        </h3>

        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium text-ink-500">Ko&rsquo;rildi:</span>

          <div className="flex items-center gap-2">
            <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-hover">
              <span
                className="block h-full rounded-full bg-brand-500"
                style={{ width: `${progress}%` }}
              />
            </span>
            <span className="text-xs font-medium text-ink-500">
              {progress}%
            </span>
          </div>
        </div>

        {course.unlocked ? (
          <Link
            href={`/my-courses/${course.id}`}
            className="flex h-10 items-center justify-center rounded-lg bg-brand-500 text-sm font-medium text-white transition-colors hover:bg-brand-600"
          >
            Ko&rsquo;rishni boshlash
          </Link>
        ) : (
          <span
            title="To'lov admin tomonidan tasdiqlanishi kerak"
            className="flex h-10 cursor-not-allowed items-center justify-center rounded-lg bg-hover text-sm font-medium text-ink-500"
          >
            {course.status === "PENDING"
              ? "To'lov tasdiqlanmoqda"
              : "To'lov rad etilgan"}
          </span>
        )}
      </div>
    </article>
  );
}

export default function MyCoursesPage() {
  const { courses, isLoading, isError, error } = useMyCourses();

  return (
    <>
      <PageHeader title="Mening kurslarim" breadcrumb={[]} />

      <div className="w-full max-w-[1600px] px-6 pb-8">
        {isLoading && (
          <p className="text-sm font-medium text-ink-500">Yuklanmoqda...</p>
        )}

        {isError && (
          <p className="text-sm font-medium text-danger-500">
            {apiErrorMessage(error)}
          </p>
        )}

        {!isLoading && !isError && courses.length === 0 && (
          <p className="text-sm font-medium text-ink-500">
            Sizda hali kurs yo&rsquo;q. Saytdan kurs tanlab, to&rsquo;lov
            qilganingizdan keyin bu yerda ko&rsquo;rinadi.
          </p>
        )}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {courses.map((course) => (
            <MyCourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </>
  );
}
