import { io, type Socket } from "socket.io-client";
import { TOKEN_KEY } from "@/lib/api/client";

const WS_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api/v1"
).replace(/\/api\/v1$/, "");

let socket: Socket | null = null;

export function getChatSocket(): Socket {
  if (socket?.connected) return socket;

  socket?.disconnect();

  socket = io(`${WS_URL}/chat`, {
    auth: { token: localStorage.getItem(TOKEN_KEY) ?? "" },
    transports: ["websocket"],
    autoConnect: true,
  });

  return socket;
}

export function closeChatSocket() {
  socket?.disconnect();
  socket = null;
}
