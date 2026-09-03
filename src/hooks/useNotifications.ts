"use client";

import { useCallback, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getNotifications } from "@/api/dashboard";
import { useAuthStore } from "@/store/auth";

const POLL_MS = 30000;

type Seen = { userId: number; at: string };

function storageKey(userId: number) {
  return `lms:chat-seen:${userId}`;
}

function loadSeen(userId: number | undefined) {
  if (typeof window === "undefined" || !userId) return undefined;

  try {
    const saved = window.localStorage.getItem(storageKey(userId));

    if (saved) return saved;

    const now = new Date().toISOString();
    window.localStorage.setItem(storageKey(userId), now);

    return now;
  } catch {
    return undefined;
  }
}

export function useNotifications() {
  const userId = useAuthStore((s) => s.user?.id);
  const queryClient = useQueryClient();
  const [seen, setSeen] = useState<Seen | null>(null);

  const stored = useMemo(() => loadSeen(userId), [userId]);
  const since = seen && seen.userId === userId ? seen.at : stored;

  const query = useQuery({
    queryKey: ["notifications", userId, since],
    enabled: Boolean(userId) && Boolean(since),
    queryFn: () => getNotifications(since),
    refetchInterval: POLL_MS,
  });

  const markMessagesSeen = useCallback(() => {
    if (!userId) return;

    const at = new Date().toISOString();

    try {
      window.localStorage.setItem(storageKey(userId), at);
    } catch {}

    setSeen({ userId, at });
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
  }, [userId, queryClient]);

  return {
    payments: query.data?.payments ?? 0,
    messages: query.data?.messages ?? 0,
    total: query.data?.total ?? 0,
    isLoading: query.isLoading,
    markMessagesSeen,
  };
}
