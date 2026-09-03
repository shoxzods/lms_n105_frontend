"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useAuthStore } from "@/store/auth";

/**
 * Token localStorage da bo'lgani uchun tekshiruv faqat brauzerda bo'ladi.
 * Token yo'q/muddati tugagan bo'lsa — /login ga qaytaradi.
 */
export function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const isLoading = useAuthStore((s) => s.isLoading);
  const loadFromStorage = useAuthStore((s) => s.loadFromStorage);

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [isLoading, user, router]);

  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm font-medium text-ink-500">Yuklanmoqda...</p>
      </div>
    );
  }

  return <>{children}</>;
}
