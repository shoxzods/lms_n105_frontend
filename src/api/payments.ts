import { apiClient } from "./client";
import type {
  ApiResponse,
  PaginatedResponse,
  Payment,
  PaymentStatus,
  PaymentsQuery,
} from "@/types";

/** GET /payments */
export async function getPayments(
  query: PaymentsQuery = {},
): Promise<PaginatedResponse<Payment>> {
  const { data } = await apiClient.get<PaginatedResponse<Payment>>(
    "/payments",
    { params: query },
  );
  return data;
}

/** PATCH /payments/:userId/:courseId */
export async function updatePaymentStatus(
  userId: number,
  courseId: number,
  status: PaymentStatus,
): Promise<ApiResponse<Payment>> {
  const { data } = await apiClient.patch<ApiResponse<Payment>>(
    `/payments/${userId}/${courseId}`,
    { status },
  );
  return data;
}

/**
 * POST /payments
 *
 * DIQQAT: backendda bu endpoint hozir foydalanuvchini tokendan oladi.
 * Admin boshqa student nomidan to'lov qo'shishi uchun `CreatePaymentDto`
 * ga `userId` va `status` qo'shilishi kerak.
 */
export async function createPayment(body: {
  userId: number;
  courseId: number;
  status: PaymentStatus;
}): Promise<ApiResponse<Payment>> {
  const { data } = await apiClient.post<ApiResponse<Payment>>(
    "/payments",
    body,
  );
  return data;
}
