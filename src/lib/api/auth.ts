import { apiClient } from "./client";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  ResetPasswordRequest,
  VerifyOtpRequest,
  VerifyOtpResponse,
} from "@/types";

/** POST /auth/login */
export async function login(payload: LoginRequest): Promise<LoginResponse> {
  const { data } = await apiClient.post<LoginResponse>("/auth/login", payload);
  return data;
}

/** POST /auth/register — faqat STUDENT yaratadi (rolni backend o'zi qo'yadi) */
export async function register(
  payload: RegisterRequest,
): Promise<RegisterResponse> {
  const { data } = await apiClient.post<RegisterResponse>(
    "/auth/register",
    payload,
  );
  return data;
}

/** POST /auth/verify-otp — Telegram botdan kelgan kodni tasdiqlaydi */
export async function verifyOtp(
  payload: VerifyOtpRequest,
): Promise<VerifyOtpResponse> {
  const { data } = await apiClient.post<VerifyOtpResponse>(
    "/auth/verify-otp",
    payload,
  );
  return data;
}

/** POST /auth/reset-password — kod bilan yangi parol o‘rnatiladi */
export async function resetPassword(
  payload: ResetPasswordRequest,
): Promise<{ success: boolean; message: string }> {
  const { data } = await apiClient.post<{ success: boolean; message: string }>(
    "/auth/reset-password",
    payload,
  );
  return data;
}
