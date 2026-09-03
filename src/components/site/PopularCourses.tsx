"use client";

import Link from "next/link";
import { useState } from "react";
import { usePublicCategories, usePublicCourses } from "@/hooks/usePublic";
import { Container } from "./Container";
import { CourseCard } from "./CourseCard";
import { useT } from "@/lib/i18n";

/** Figma: "title" (286:210) — sarlavha + kategoriya chiplari + kartalar */
export function PopularCourses() {
  const t = useT();
  const [categoryId, setCategoryId] = useState<number | undefined>();

  const { categories } = usePublicCategories();
  const { courses, isLoading, isError } = usePublicCourses({
    limit: 4,
    categoryId,
  });

  return (
    <section className="bg-muted py-15">
      <Container className="flex flex-col items-center gap-8">
        <h2 className="text-center text-3xl leading-tight font-bold text-page-fg sm:text-4xl lg:text-5xl lg:leading-[60px]">
          {t("Ommabop kurslar")}
        </h2>

        <p className="max-w-[900px] text-center text-lg leading-7 font-medium text-ink-500">
          {t(
            "Kasbga yo’nalitirilgan praktikumlar yordamida eng tez va samarali yo’llar bilan mutaxassislar qatoriga qo’shiling. Har bir praktikum soha mutaxassislari tomonidan eng zamoaviy o’quv reja asosida tayyorlangan",
          )}
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => setCategoryId(undefined)}
            className={`rounded-lg px-6 py-3 text-[15px] font-medium ${
              categoryId === undefined
                ? "bg-brand-500 text-white"
                : "border border-brand-500 bg-card text-brand-500"
            }`}
          >
            {t("Barcha kurslar")}
          </button>

          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => setCategoryId(category.id)}
              className={`rounded-lg px-6 py-3 text-[15px] font-medium ${
                categoryId === category.id
                  ? "bg-brand-500 text-white"
                  : "border border-brand-500 bg-card text-brand-500"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {isLoading && (
          <p className="text-sm font-medium text-ink-500">{t("Yuklanmoqda...")}</p>
        )}

        {isError && (
          <p className="text-sm font-medium text-danger-500">
            {t("Kurslarni yuklab bo‘lmadi. Backend ishlab turibdimi?")}
          </p>
        )}

        {!isLoading && !isError && courses.length === 0 && (
          <p className="text-sm font-medium text-ink-500">
            {t("Bu bo‘limda hozircha kurs yo‘q.")}
          </p>
        )}

        <div className="grid w-full gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>

        <Link
          href="/courses"
          className="rounded-lg bg-brand-500 px-6 py-3 text-[15px] font-medium text-white"
        >
          {t("Barcha kurslarni ko’rish")}
        </Link>
      </Container>
    </section>
  );
}
