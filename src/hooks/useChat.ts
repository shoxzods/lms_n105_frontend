"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getChatSocket } from "@/lib/socket";
import type { ChatMessage } from "@/types/chat";

export function useChat(courseId: number | null) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const courseRef = useRef<number | null>(null);

  useEffect(() => {
    courseRef.current = courseId;

    if (!courseId) return;

    setMessages([]);

    const socket = getChatSocket();

    const onConnect = () => {
      setConnected(true);
      setError(null);
      socket.emit("join", { courseId });
    };

    const onHistory = (rows: ChatMessage[]) => {
      if (rows[0] && rows[0].courseId !== courseRef.current) return;
      setMessages(rows);
    };

    const onMessage = (row: ChatMessage) => {
      if (row.courseId !== courseRef.current) return;
      setMessages((prev) => [...prev, row]);
    };

    const onError = (text: string) => setError(text);
    const onDisconnect = () => setConnected(false);

    socket.on("connect", onConnect);
    socket.on("history", onHistory);
    socket.on("message", onMessage);
    socket.on("error_message", onError);
    socket.on("disconnect", onDisconnect);

    if (socket.connected) onConnect();

    return () => {
      socket.off("connect", onConnect);
      socket.off("history", onHistory);
      socket.off("message", onMessage);
      socket.off("error_message", onError);
      socket.off("disconnect", onDisconnect);
    };
  }, [courseId]);

  const send = useCallback(
    (text: string) => {
      if (!courseId || !text.trim()) return;

      getChatSocket().emit("message", { courseId, text });
    },
    [courseId],
  );

  return { messages, connected, error, send };
}
