"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as api from "@/lib/api/content";
import type {
  AdminCourse,
  CoursesQuery,
  Exam,
  ExamsQuery,
  Homework,
  HomeworksQuery,
  Lesson,
  LessonsQuery,
  Material,
  MaterialsQuery,
  PaginationMeta,
  Section,
  SectionsQuery,
} from "@/types";

/**
 * Beshta bo'lim ham bir xil ishlaydi: sahifalangan ro'yxat + uchta amal.
 * Shuning uchun umumiy yordamchi yozib, har biri uni chaqiradi —
 * kod besh marta takrorlanmaydi.
 */
function usePagedList<T, Q extends { page?: number; limit?: number }>(
  key: string,
  query: Q,
  fetcher: (q: Q) => Promise<{ data: T[]; meta?: PaginationMeta }>,
  enabled = true,
) {
  const { page = 1, limit = 10 } = query;

  const result = useQuery({
    queryKey: [key, query],
    queryFn: () => fetcher(query),
    enabled,
  });

  const items = result.data?.data ?? [];

  const meta: PaginationMeta = result.data?.meta ?? {
    total: items.length,
    page,
    limit,
    totalPages: 1,
  };

  return {
    items,
    meta,
    isLoading: result.isLoading,
    isError: result.isError,
    error: result.error,
  };
}

/** Amal tugagach ro'yxatni yangilaydi */
function useCrud<C, U>(
  key: string,
  create: (body: C) => Promise<unknown>,
  update: (args: U) => Promise<unknown>,
  remove: (id: number) => Promise<unknown>,
) {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: [key] });

  return {
    create: useMutation({ mutationFn: create, onSuccess: invalidate }),
    update: useMutation({ mutationFn: update, onSuccess: invalidate }),
    remove: useMutation({ mutationFn: remove, onSuccess: invalidate }),
  };
}

/* ---------- Kurslar ---------- */

export function useCoursesList(query: CoursesQuery) {
  const r = usePagedList<AdminCourse, CoursesQuery>(
    "courses",
    query,
    api.getCourses,
  );
  return { ...r, courses: r.items };
}

export function useCourseMutations() {
  return useCrud(
    "courses",
    (form: FormData) => api.createCourse(form),
    ({ id, form }: { id: number; form: FormData }) => api.updateCourse(id, form),
    api.deleteCourse,
  );
}

/* ---------- Bo'limlar ---------- */

export function useSectionsList(query: SectionsQuery) {
  const r = usePagedList<Section, SectionsQuery>(
    "sections",
    query,
    api.getSections,
  );
  return { ...r, sections: r.items };
}

export function useSectionMutations() {
  return useCrud(
    "sections",
    (body: { name: string; courseId: number }) => api.createSection(body),
    ({ id, ...body }: { id: number; name?: string; courseId?: number }) =>
      api.updateSection(id, body),
    api.deleteSection,
  );
}

/* ---------- Darslar ---------- */

export function useLessonsList(query: LessonsQuery, enabled = true) {
  const r = usePagedList<Lesson, LessonsQuery>(
    "lessons",
    query,
    api.getLessons,
    enabled,
  );
  return { ...r, lessons: r.items };
}

export function useLessonMutations() {
  return useCrud(
    "lessons",
    (form: FormData) => api.createLesson(form),
    ({ id, form }: { id: number; form: FormData }) => api.updateLesson(id, form),
    api.deleteLesson,
  );
}

/* ---------- Dars materiallari ---------- */

export function useMaterialsList(query: MaterialsQuery) {
  const r = usePagedList<Material, MaterialsQuery>(
    "materials",
    query,
    api.getMaterials,
  );
  return { ...r, materials: r.items };
}

export function useMaterialMutations() {
  return useCrud(
    "materials",
    (form: FormData) => api.createMaterial(form),
    ({ id, form }: { id: number; form: FormData }) =>
      api.updateMaterial(id, form),
    api.deleteMaterial,
  );
}

/* ---------- Vazifalar ---------- */

export function useHomeworksList(query: HomeworksQuery) {
  const r = usePagedList<Homework, HomeworksQuery>(
    "homeworks",
    query,
    api.getHomeworks,
  );
  return { ...r, homeworks: r.items };
}

export function useHomeworkMutations() {
  return useCrud(
    "homeworks",
    (form: FormData) => api.createHomework(form),
    ({ id, form }: { id: number; form: FormData }) =>
      api.updateHomework(id, form),
    api.deleteHomework,
  );
}

/* ---------- Testlar ---------- */

export function useExamsList(query: ExamsQuery) {
  const r = usePagedList<Exam, ExamsQuery>("exams", query, api.getExams);
  return { ...r, exams: r.items };
}

export function useExamMutations() {
  return useCrud(
    "exams",
    (body: Omit<Exam, "id" | "create_at">) => api.createExam(body),
    ({ id, ...body }: { id: number } & Partial<Omit<Exam, "id" | "create_at">>) =>
      api.updateExam(id, body),
    api.deleteExam,
  );
}
