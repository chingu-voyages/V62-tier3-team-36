"use client";

import Sidebar from "@/components/Sidebar";
import { useAuthStore } from "@/store/authStore";

interface AuthLayout {
  children: React.ReactNode;
}

const WorkspaceLayout = ({ children }: AuthLayout) => {
  const user = useAuthStore((state) => state.user);
  const isLoadingUser = !user;

  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="sticky top-0 z-10 flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-[0.8px] border-[var(--gray-500)] bg-[var(--white)]/95 px-5 py-4 backdrop-blur">
          {isLoadingUser ? (
            <>
              <div className="h-4 w-36 animate-pulse rounded bg-[var(--gray-300)]" />
              <div className="h-8 w-8 animate-pulse rounded-full border border-[var(--gray-600)] bg-[var(--gray-300)]" />
            </>
          ) : (
            <>
              <p className="text-sm font-medium tracking-[0.01em] text-[var(--gray-700)]">
                {user.full_name}
              </p>
              <div className="h-8 w-8 rounded-full border border-[var(--gray-600)] bg-[var(--gray-300)] shadow-[0_2px_6px_rgba(0,0,0,0.08)]" />
            </>
          )}
        </div>

        <div className="flex min-h-0 flex-1 flex-col overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default WorkspaceLayout;
