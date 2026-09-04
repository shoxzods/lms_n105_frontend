import { apiClient } from "./client";
import type {
  PaginationMeta,
  StudentQuestionItem,
  StudentQuestionsQuery,
} from "@/types";

export interface QuestionsResponse {
  data: StudentQuestionItem[];
  meta: PaginationMeta;
}

export async function getQuestions(params?: StudentQuestionsQuery): Promise<QuestionsResponse> {
  const { data } = await apiClient.get<QuestionsResponse>("/questions", {
    params,
  });
  return data;
}

export async function getQuestion(id: number): Promise<StudentQuestionItem> {
  const { data } = await apiClient.get<{ data: StudentQuestionItem }>(`/questions/${id}`);
  return data.data;
}

export async function createQuestion(formData: FormData): Promise<StudentQuestionItem> {
  const { data } = await apiClient.post<{ data: StudentQuestionItem }>(
    "/questions",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );
  return data.data;
}

export async function answerQuestion(
  id: number,
  formData: FormData,
): Promise<StudentQuestionItem> {
  const { data } = await apiClient.post<{ data: StudentQuestionItem }>(
    `/questions/${id}/answer`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );
  return data.data;
}

export async function deleteQuestion(id: number): Promise<void> {
  await apiClient.delete(`/questions/${id}`);
}
