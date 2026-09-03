"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createMentor,
  deleteMentor,
  getMentors,
  updateMentor,
} from "@/lib/api/mentors";
import type { MentorsQuery, PaginationMeta } from "@/types";

export const mentorsQueryKey = (query: MentorsQuery = {}) =>
  ["mentors", query] as const;

/** `GET /mentor` — backendda sahifalash, qidiruv va `meta` bor */
export function useMentorsList(query: MentorsQuery, enabled = true) {
  const { page = 1, limit = 10 } = query;

  const result = useQuery({
    queryKey: mentorsQueryKey(query),
    queryFn: () => getMentors(query),
    enabled,
  });

  const mentors = result.data?.data ?? [];

  const meta: PaginationMeta = result.data?.meta ?? {
    total: mentors.length,
    page,
    limit,
    totalPages: 1,
  };

  return {
    mentors,
    meta,
    isLoading: result.isLoading,
    isError: result.isError,
    error: result.error,
  };
}

export function useMentorMutations() {
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: (form: FormData) => createMentor(form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mentors"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const update = useMutation({
    mutationFn: ({ id, form }: { id: number; form: FormData }) =>
      updateMentor(id, form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mentors"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const remove = useMutation({
    mutationFn: (id: number) => deleteMentor(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mentors"] });
    },
  });

  return { create, update, remove };
}
