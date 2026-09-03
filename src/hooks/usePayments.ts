"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createPayment,
  getPayments,
  updatePaymentStatus,
} from "@/lib/api/payments";
import type { PaginationMeta, PaymentStatus, PaymentsQuery } from "@/types";

export function usePaymentsList(query: PaymentsQuery) {
  const { page = 1, limit = 10 } = query;

  const result = useQuery({
    queryKey: ["payments", query],
    queryFn: () => getPayments(query),
  });

  const payments = result.data?.data ?? [];

  const meta: PaginationMeta = result.data?.meta ?? {
    total: payments.length,
    page,
    limit,
    totalPages: 1,
  };

  return {
    payments,
    meta,
    isLoading: result.isLoading,
    isError: result.isError,
    error: result.error,
  };
}

export function usePaymentMutations() {
  const queryClient = useQueryClient();

  const update = useMutation({
    mutationFn: ({
      userId,
      courseId,
      status,
    }: {
      userId: number;
      courseId: number;
      status: PaymentStatus;
    }) => updatePaymentStatus(userId, courseId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
    },
  });

  const create = useMutation({
    mutationFn: createPayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
    },
  });

  return { update, create };
}
