import { apiClient } from "./client";
import type { ApiResponse, DashboardStats, NotificationCounts } from "@/types";

/** GET /dashboard/stats */
export async function getDashboardStats(): Promise<DashboardStats> {
  const { data } =
    await apiClient.get<ApiResponse<DashboardStats>>("/dashboard/stats");
  return data.data;
}

/** GET /dashboard/notifications */
export async function getNotifications(
  since?: string,
): Promise<NotificationCounts> {
  const { data } = await apiClient.get<ApiResponse<NotificationCounts>>(
    "/dashboard/notifications",
    { params: since ? { since } : undefined },
  );
  return data.data;
}
