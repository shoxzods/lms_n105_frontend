"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getPublicCategories,
  getPublicCourse,
  getPublicCourses,
  getPublicMentors,
} from "@/lib/api/public";
import type { PublicCoursesQuery } from "@/types";

export function usePublicCourses(query: PublicCoursesQuery = {}) {
  const result = useQuery({
    queryKey: ["public-courses", query],
    queryFn: () => getPublicCourses(query),
  });

  return {
    courses: result.data?.data ?? [],
    meta: result.data?.meta,
    isLoading: result.isLoading,
    isError: result.isError,
  };
}

export function usePublicCourse(id: number) {
  const result = useQuery({
    queryKey: ["public-course", id],
    queryFn: () => getPublicCourse(id),
    enabled: Number.isFinite(id),
  });

  return {
    course: result.data?.data ?? null,
    isLoading: result.isLoading,
    isError: result.isError,
  };
}

export function usePublicCategories() {
  const result = useQuery({
    queryKey: ["public-categories"],
    queryFn: getPublicCategories,
  });

  return {
    categories: result.data?.data ?? [],
    isLoading: result.isLoading,
  };
}

export function usePublicMentors() {
  const result = useQuery({
    queryKey: ["public-mentors"],
    queryFn: getPublicMentors,
  });

  return {
    mentors: result.data?.data ?? [],
    isLoading: result.isLoading,
  };
}
