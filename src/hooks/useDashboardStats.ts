"use client";

import { useQuery } from "@tanstack/react-query";
import { getDashboardStats } from "@/api/dashboard";
import { useAuthStore } from "@/store/auth";
import type { UserRole } from "@/types";

const ADMIN_ROLES: UserRole[] = ["SUPERADMIN", "ADMIN"];

export function useDashboardStats() {
  const role = useAuthStore((s) => s.user?.role);
  const canRead = role ? ADMIN_ROLES.includes(role) : false;

  const query = useQuery({
    queryKey: ["dashboard-stats"],
    enabled: canRead,
    queryFn: getDashboardStats,
  });

  return { ...query, canRead };
}
