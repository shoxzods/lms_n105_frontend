import type { UserRole } from "@/types";

export interface ChatSender {
  id: number;
  full_name: string;
  role: UserRole;
  file: string | null;
}

export interface ChatMessage {
  id: number;
  courseId: number;
  senderId: number;
  text: string;
  create_at: string;
  sender: ChatSender;
}

export interface ChatRoom {
  id: number;
  name: string;
  banner: string;
  lastMessage: ChatMessage | null;
}
