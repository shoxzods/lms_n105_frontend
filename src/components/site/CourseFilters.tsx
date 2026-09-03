"use client";

import { useState } from "react";
import { usePublicCategories, usePublicCourses } from "@/hooks/usePublic";
import { CourseCard } from "./CourseCard";

export function CourseFilters() {
  const [categoryId, setCategoryId] = useState<number | undefined>();
  const [page, setPage] = useState(1);

  const { categories } = usePublicCategories();
  const { courses, meta, isLoading, isError } = usePublicCourses({
    page,
    limit: 12,
    categoryId,
  });

  function pick(id: number | undefined) {
    setCategoryId(id);
    setPage(1);
  }

  return (
    <>
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => pick(undefined)}
          className={`rounded-lg px-6 py-3 text-[15px] font-medium ${
            categoryId === undefined
              ? "bg-brand-500 text-white"
              : "border border-brand-500 bg-card text-brand-500"
          }`}
        >
          Barcha kurslar
        </button>

        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            onClick={() => pick(category.id)}
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
        <p className="text-sm font-medium text-ink-500">Yuklanmoqda...</p>
      )}

      {isError && (
        <p className="text-sm font-medium text-danger-500">
          Kurslarni yuklab bo‘lmadi. Backend ishlab turibdimi?
        </p>
      )}

      {!isLoading && !isError && courses.length === 0 && (
        <p className="text-sm font-medium text-ink-500">
          Bu bo‘limda hozircha kurs yo‘q.
        </p>
      )}

      <div className="grid w-full gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>

      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="rounded-lg border border-line px-4 py-2 text-sm font-medium text-page-fg disabled:opacity-40"
          >
            Oldingi
          </button>

          <span className="text-sm font-medium text-ink-500">
            {meta.page} / {meta.totalPages}
          </span>

          <button
            type="button"
            disabled={page >= meta.totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-lg border border-line px-4 py-2 text-sm font-medium text-page-fg disabled:opacity-40"
          >
            Keyingi
          </button>
        </div>
      )}
    </>
  );
}
