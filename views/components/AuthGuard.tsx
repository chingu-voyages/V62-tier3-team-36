"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuthStore } from "@/store/authStore";
import { clearAuthSession, getUserData } from "@/utils/authSession";

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const user = getUserData();
    const hasToken =
      Boolean(localStorage.getItem("access_token")) ||
      Boolean(localStorage.getItem("refresh_token"));

    if (!user || !hasToken) {
      clearAuthSession();
      useAuthStore.getState().logout();
      router.replace("/SignIn");
      return;
    }

    setUser(user);
    queueMicrotask(() => {
      if (!cancelled) {
        setIsAuthorized(true);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [router, setUser]);

  if (!isAuthorized) {
    return (
      <main
        role="status"
        className="flex min-h-dvh items-center justify-center bg-gray-50 text-sm text-gray-500"
      >
        Checking your session...
      </main>
    );
  }

  return children;
}
