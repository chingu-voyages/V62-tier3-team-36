"use client";

import { useEffect, useState } from "react";

import { usePathname, useRouter } from "next/navigation";

import { useAuthStore } from "@/store/authStore";
import { getUserData } from "@/utils/authSession";

export const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/Dashboard", label: "Dashboard" },
  { href: "/UploadCSV", label: "Upload CSV" },
  { href: "/ValidationCSV", label: "Validation" },
  { href: "/LogIn", label: "Login" },
  { href: "/Register", label: "Sign Up" },
];

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ??
  "https://v62-tier3-team-36.onrender.com";

export const useSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    if (user) {
      return;
    }

    const storedUser = getUserData();
    if (storedUser) {
      setUser(storedUser);
    }
  }, [setUser, user]);

  async function handleLogout() {
    const token = localStorage.getItem("access_token");
    if (token) {
      await fetch(`${BACKEND_URL}/api/logout`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {});
    }
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    useAuthStore.getState().setUser(null);
    setMobileOpen(false);
    router.push("/LogIn");
  }

  const width = collapsed ? "md:w-16" : "md:w-60";
  const showLabels = !collapsed;

  return {
    pathname,
    router,
    collapsed,
    setCollapsed,
    mobileOpen,
    setMobileOpen,
    user,
    setUser,
    handleLogout,
    width,
    showLabels,
  };
};
