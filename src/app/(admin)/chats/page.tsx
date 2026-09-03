"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { ChatPanel } from "@/components/chat/ChatPanel";
import { apiClient } from "@/api/client";
import { fileUrl } from "@/api/public";
import { apiErrorMessage } from "@/lib/apiError";
import type { ChatRoom } from "@/types/chat";

async function getRooms() {
  const { data } = await apiClient.get<{ data: ChatRoom[] }>("/chat/rooms");
  return data.data;
}

export default function ChatsPage() {
  const [active, setActive] = useState<number | null>(null);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["chat", "rooms"],
    queryFn: getRooms,
    refetchInterval: 20000,
  });

  const rooms = data ?? [];

  useEffect(() => {
    if (active === null && rooms.length > 0) setActive(rooms[0].id);
  }, [rooms, active]);

  return (
    <>
      <PageHeader title="Savol-javoblar" breadcrumb={["Savol-javoblar"]} />

      <div className="flex w-full max-w-[1600px] flex-col gap-6 px-6 pb-8 lg:flex-row">
        <aside className="w-full shrink-0 overflow-hidden rounded-xl bg-card lg:w-[300px]">
          <h2 className="border-b border-line px-5 py-4 text-sm font-bold text-page-fg">
            Kurslar
          </h2>

          {isLoading && (
            <p className="px-5 py-4 text-sm text-ink-500">Yuklanmoqda...</p>
          )}

          {isError && (
            <p className="px-5 py-4 text-sm text-danger-500">
              {apiErrorMessage(error)}
            </p>
          )}

          {!isLoading && rooms.length === 0 && (
            <p className="px-5 py-4 text-sm text-ink-500">
              Sizda kurs yo&rsquo;q
            </p>
          )}

          <ul className="flex flex-col">
            {rooms.map((room) => {
              const banner = fileUrl("images", room.banner);

              return (
                <li key={room.id}>
                  <button
                    type="button"
                    onClick={() => setActive(room.id)}
                    className={`flex w-full cursor-pointer items-center gap-3 px-5 py-3 text-left transition-colors hover:bg-hover ${
                      active === room.id ? "bg-hover" : ""
                    }`}
                  >
                    <span className="relative size-10 shrink-0 overflow-hidden rounded-lg bg-hover">
                      {banner && (
                        <Image
                          src={banner}
                          alt=""
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      )}
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-bold text-page-fg">
                        {room.name}
                      </span>
                      <span className="block truncate text-xs text-ink-500">
                        {room.lastMessage
                          ? `${room.lastMessage.sender.full_name}: ${room.lastMessage.text}`
                          : "Hali savol yo‘q"}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>

        <section className="min-w-0 flex-1 rounded-xl bg-card p-6">
          <ChatPanel courseId={active} height={480} />
        </section>
      </div>
    </>
  );
}
