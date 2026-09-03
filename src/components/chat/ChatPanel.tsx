"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { useChat } from "@/hooks/useChat";
import { useAuthStore } from "@/store/auth";

function timeOf(iso: string) {
  return new Date(iso).toLocaleTimeString("uz-UZ", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ChatPanel({
  courseId,
  height = 360,
}: {
  courseId: number | null;
  height?: number;
}) {
  const me = useAuthStore((s) => s.user);
  const { messages, connected, error, send } = useChat(courseId);

  const [text, setText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    send(text);
    setText("");
  }

  if (!courseId) {
    return <p className="text-sm text-ink-500">Kursni tanlang</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <span
          className={`size-2 rounded-full ${
            connected ? "bg-[#12b76a]" : "bg-ink-200"
          }`}
        />
        <span className="text-xs font-medium text-ink-500">
          {connected ? "Jonli aloqa" : "Ulanmoqda..."}
        </span>
      </div>

      {error && (
        <p className="rounded-lg bg-[#fef3f2] px-4 py-2 text-sm font-medium text-danger-500">
          {error}
        </p>
      )}

      <div
        style={{ height }}
        className="flex flex-col gap-3 overflow-y-auto rounded-lg border border-line p-4"
      >
        {messages.length === 0 && (
          <p className="m-auto text-sm text-ink-500">
            Hali xabar yo&rsquo;q. Birinchi bo&rsquo;lib yozing.
          </p>
        )}

        {messages.map((message) => {
          const mine = message.senderId === me?.id;

          return (
            <div
              key={message.id}
              className={`flex max-w-[85%] gap-2 ${
                mine ? "ml-auto flex-row-reverse" : ""
              }`}
            >
              <Avatar
                fullName={message.sender.full_name}
                file={message.sender.file}
              />

              <div
                className={`flex flex-col gap-1 rounded-xl px-3.5 py-2.5 ${
                  mine ? "bg-brand-500 text-white" : "bg-table-head text-page-fg"
                }`}
              >
                {!mine && (
                  <span className="text-xs font-bold">
                    {message.sender.full_name}
                  </span>
                )}

                <span className="text-sm leading-5 whitespace-pre-wrap">
                  {message.text}
                </span>

                <span
                  className={`self-end text-[10px] ${
                    mine ? "text-white/70" : "text-ink-500"
                  }`}
                >
                  {timeOf(message.create_at)}
                </span>
              </div>
            </div>
          );
        })}

        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Xabar yozing..."
          className="h-11 flex-1 rounded-lg border border-line bg-card px-4 text-sm text-page-fg outline-none focus:border-brand-500"
        />

        <Button type="submit" disabled={!connected || !text.trim()}>
          Yuborish
        </Button>
      </form>
    </div>
  );
}
