"use client";

import Image from "next/image";
import Link from "next/link";
import { fileUrl } from "@/lib/api/public";
import { formatPrice } from "@/lib/format";
import type { PublicCourse } from "@/types";
import { Stars } from "./Stars";
import { useT } from "@/lib/i18n";

/** Figma: "Course card" (1699:6142) — 405x515 */
export function CourseCard({ course }: { course: PublicCourse }) {
  const t = useT();
  const banner = fileUrl("images", course.banner);
  const mentor = course.mentorProfile;
  const avatar = fileUrl("images", mentor?.user.file);

  return (
    <article className="flex flex-col overflow-hidden rounded bg-card">
      <div className="relative flex h-[262px] items-center justify-center overflow-hidden bg-ink-100 dark:bg-ink-800">
        {banner && (
          <Image
            src={banner}
            alt=""
            fill
            sizes="405px"
            className="object-cover"
          />
        )}

        <span className="absolute top-4 left-4 rounded-full bg-brand-500 px-5 py-2 text-sm font-medium text-white">
          {course.categories.name}
        </span>
      </div>

      <div className="flex flex-col gap-4 p-5">
        <div className="flex items-center gap-2">
          <span className="relative size-8 shrink-0 overflow-hidden rounded-full bg-ink-200 dark:bg-ink-800">
            {avatar && (
              <Image src={avatar} alt="" fill sizes="32px" className="object-cover" />
            )}
          </span>
          <p className="flex-1 truncate text-sm leading-5 font-bold text-page-fg">
            {mentor?.user.full_name ?? "—"}
          </p>
          <Image src="/icons/heart.svg" alt="" width={20} height={18} />
        </div>

        <div className="flex flex-col gap-[9px]">
          <h3 className="truncate text-xl font-bold text-page-fg">
            {course.name}
          </h3>
          <p className="line-clamp-2 text-sm leading-5 font-medium text-ink-500">
            {course.description}
          </p>
          <Stars rating={4.5} />
        </div>

        <div className="flex flex-col gap-[3px]">
          <p className="text-sm leading-5 font-medium text-[#6b7690]">
            {t("Kurs narxi:")}
          </p>
          <p className="font-bold text-page-fg">
            <span className="text-xl">{formatPrice(course.price)} </span>
            <span className="text-sm">UZS</span>
          </p>
        </div>

        <Link
          href={`/courses/${course.id}`}
          className="flex h-11 items-center justify-center rounded-lg bg-brand-500 text-[15px] font-medium text-white transition-colors hover:bg-brand-600"
        >
          {t("Kursni ko’rish")}
        </Link>
      </div>
    </article>
  );
}
