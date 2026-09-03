import type { ReactNode } from "react";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <div className="flex h-screen bg-app">
        <Sidebar />

        <div className="flex flex-1 flex-col gap-6 overflow-y-auto py-0">
          <Topbar />
          {children}
        </div>
      </div>
    </AuthGuard>
  );
}
