import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  answerQuestion,
  createQuestion,
  deleteQuestion,
  getQuestions,
} from "@/api/questions";
import type { StudentQuestionsQuery } from "@/types";

export function useQuestionsList(query?: StudentQuestionsQuery) {
  const q = useQuery({
    queryKey: ["questions", query],
    queryFn: () => getQuestions(query),
  });

  return {
    questions: q.data?.data ?? [],
    meta: q.data?.meta ?? { total: 0, page: 1, limit: 10, totalPages: 1 },
    isLoading: q.isLoading,
    isError: q.isError,
    error: q.error,
    refetch: q.refetch,
  };
}

export function useQuestionMutations() {
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: (formData: FormData) => createQuestion(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] });
    },
  });

  const answer = useMutation({
    mutationFn: ({ id, formData }: { id: number; formData: FormData }) =>
      answerQuestion(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] });
    },
  });

  const remove = useMutation({
    mutationFn: (id: number) => deleteQuestion(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] });
    },
  });

  return { create, answer, remove };
}
