"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteHomeworkSubmission,
  getHomeworkSubmission,
  getHomeworkSubmissions,
  getMyHomeworkSubmissions,
  gradeHomeworkSubmission,
  submitHomework,
} from "@/api/homeworkSubmissions";
import type { HomeworkSubmissionsQuery } from "@/types";

/**
 * Talabaning o'z topshirgan vazifalari hooki
 */
export function useMyHomeworkSubmissions(lessonId?: number) {
  const q = useQuery({
    queryKey: ["my-homework-submissions", lessonId],
    queryFn: () => getMyHomeworkSubmissions(lessonId),
    enabled: typeof lessonId === "number" || lessonId === undefined,
  });

  return {
    submissions: q.data ?? [],
    latestSubmission: q.data?.[0] ?? null,
    isLoading: q.isLoading,
    isError: q.isError,
    error: q.error,
    refetch: q.refetch,
  };
}

/**
 * O'qituvchi/Admin uchun barcha topshirilgan vazifalar hooki
 */
export function useHomeworkSubmissionsList(query?: HomeworkSubmissionsQuery) {
  const q = useQuery({
    queryKey: ["homework-submissions", query],
    queryFn: () => getHomeworkSubmissions(query),
  });

  return {
    submissions: q.data?.data ?? [],
    meta: q.data?.meta ?? { total: 0, page: 1, limit: 10, totalPages: 1 },
    isLoading: q.isLoading,
    isError: q.isError,
    error: q.error,
    refetch: q.refetch,
  };
}

/**
 * Bitta topshirilgan vazifa ma'lumotlari hooki
 */
export function useHomeworkSubmissionDetail(id?: number) {
  const q = useQuery({
    queryKey: ["homework-submission", id],
    queryFn: () => (id ? getHomeworkSubmission(id) : null),
    enabled: typeof id === "number" && id > 0,
  });

  return {
    submission: q.data ?? null,
    isLoading: q.isLoading,
    isError: q.isError,
    error: q.error,
  };
}

/**
 * Vazifa topshirish va baholash mutatsiyalari
 */
export function useHomeworkSubmissionMutations() {
  const queryClient = useQueryClient();

  const submit = useMutation({
    mutationFn: (formData: FormData) => submitHomework(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["my-homework-submissions"],
      });
      queryClient.invalidateQueries({
        queryKey: ["homework-submissions"],
      });
    },
  });

  const grade = useMutation({
    mutationFn: ({ id, formData }: { id: number; formData: FormData }) =>
      gradeHomeworkSubmission(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["my-homework-submissions"],
      });
      queryClient.invalidateQueries({
        queryKey: ["homework-submissions"],
      });
      queryClient.invalidateQueries({
        queryKey: ["homework-submission"],
      });
    },
  });

  const remove = useMutation({
    mutationFn: (id: number) => deleteHomeworkSubmission(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["my-homework-submissions"],
      });
      queryClient.invalidateQueries({
        queryKey: ["homework-submissions"],
      });
    },
  });

  return { submit, grade, remove };
}
