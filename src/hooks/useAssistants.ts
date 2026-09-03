"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createAssistant,
  deleteAssistant,
  getAssistants,
} from "@/api/assistants";
import type { AssistantsQuery, PaginationMeta } from "@/types";

export function useAssistantsList(query: AssistantsQuery) {
  const { page = 1, limit = 10 } = query;

  const result = useQuery({
    queryKey: ["assistants", query],
    queryFn: () => getAssistants(query),
  });

  const assistants = result.data?.data ?? [];

  const meta: PaginationMeta = result.data?.meta ?? {
    total: assistants.length,
    page,
    limit,
    totalPages: 1,
  };

  return {
    assistants,
    meta,
    isLoading: result.isLoading,
    isError: result.isError,
    error: result.error,
  };
}

export function useAssistantMutations() {
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: createAssistant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assistants"] });
    },
  });

  const remove = useMutation({
    mutationFn: (id: number) => deleteAssistant(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assistants"] });
    },
  });

  return { create, remove };
}
