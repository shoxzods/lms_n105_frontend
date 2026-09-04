"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as api from "@/api/results";
import type {
  ExamResultsQuery,
  PaginationMeta,
} from "@/types";

export const EXAM_RESULTS_KEY = "exam-results";
export const MY_EXAM_RESULTS_KEY = "my-exam-results";
export const EXAM_STATS_KEY = "exam-stats";

export function useExamResults(query: ExamResultsQuery = {}) {
  const { page = 1, limit = 10 } = query;

  const result = useQuery({
    queryKey: [EXAM_RESULTS_KEY, query],
    queryFn: () => api.getExamResults(query),
  });

  const results = result.data?.data ?? [];
  const meta: PaginationMeta & { passedCount?: number; failedCount?: number } =
    result.data?.meta ?? {
      total: results.length,
      page,
      limit,
      totalPages: 1,
      passedCount: 0,
      failedCount: 0,
    };

  return {
    results,
    meta,
    isLoading: result.isLoading,
    isFetching: result.isFetching,
    isError: result.isError,
    error: result.error,
    refetch: result.refetch,
  };
}

export function useMyExamResults(query: ExamResultsQuery = {}) {
  const { page = 1, limit = 10 } = query;

  const result = useQuery({
    queryKey: [MY_EXAM_RESULTS_KEY, query],
    queryFn: () => api.getMyExamResults(query),
  });

  const results = result.data?.data ?? [];
  const meta: PaginationMeta = result.data?.meta ?? {
    total: results.length,
    page,
    limit,
    totalPages: 1,
  };

  return {
    results,
    meta,
    isLoading: result.isLoading,
    isFetching: result.isFetching,
    isError: result.isError,
    error: result.error,
    refetch: result.refetch,
  };
}

export function useExamResultStats() {
  const result = useQuery({
    queryKey: [EXAM_STATS_KEY],
    queryFn: () => api.getExamResultStats(),
  });

  return {
    stats: result.data?.data ?? {
      totalAttempts: 0,
      passedAttempts: 0,
      failedAttempts: 0,
      passRate: 0,
    },
    isLoading: result.isLoading,
    isError: result.isError,
    error: result.error,
  };
}

export function useExamResultDetail(id: number | null) {
  return useQuery({
    queryKey: [EXAM_RESULTS_KEY, id],
    queryFn: () => (id ? api.getExamResultById(id) : null),
    enabled: !!id,
  });
}

export function useDeleteExamResult() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => api.deleteExamResult(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EXAM_RESULTS_KEY] });
      queryClient.invalidateQueries({ queryKey: [EXAM_STATS_KEY] });
    },
  });
}
