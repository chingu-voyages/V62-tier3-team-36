"use client";

import { useEffect } from "react";

import { useRouter } from "next/navigation";

import { useAuthStore } from "@/store/authStore";
import { clearAuthSession, getUserData } from "@/utils/authSession";

export const useNavbar = () => {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const logout = useAuthStore((state) => state.logout);

  const router = useRouter();

  useEffect(() => {
    const userData = getUserData();

    if (userData) {
      setUser(userData);
    }
  }, [setUser]);

  const handleLogout = () => {
    clearAuthSession();
    logout();
    router.push("/");
  };

  return {
    user,
    handleLogout,
  };
};
