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
    <div className="box-border">
      <div className="mx-auto flex w-full max-w-[980px] flex-row  min-h-[80vh] border-[1.6px] border-[var(--gray-700)]">
        <Sidebar />

        <div className="flex min-w-0 flex-1 flex-col border-t border-[var(--gray-600)] ">
          <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-[var(--gray-600)] border-[0.8px] bg-[var(--white)] px-4 py-5">
            {isLoadingUser ? (
              <>
                <div className="h-4 w-32 animate-pulse rounded bg-[var(--gray-300)]" />
                <div className="h-7 w-7 animate-pulse rounded-full border border-[var(--gray-700)] bg-[var(--gray-400)]" />
              </>
            ) : (
              <>
                <p className="text-sm font-light">{user.full_name}</p>
                <div className="h-7 w-7 rounded-full border border-[var(--gray-700)] bg-[var(--gray-400)]" />
              </>
            )}
          </div>

          <div className="flex min-h-0 flex-1 flex-col overflow-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceLayout;
