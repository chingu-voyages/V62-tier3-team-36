"use client";

import { useEffect, useState } from "react";

import { usePathname, useRouter } from "next/navigation";

import { useAuthStore } from "@/store/authStore";
import { clearAuthSession, getUserData } from "@/utils/authSession";

export const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/Dashboard", label: "Dashboard" },
  { href: "/UploadCSV", label: "Upload CSV" },
  { href: "/ValidationCSV", label: "Validation" },
  { href: "/SignIn", label: "Sign In" },
  { href: "/SignUp", label: "Sign Up" },
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

    clearAuthSession();
    useAuthStore.getState().logout();
    setMobileOpen(false);
    router.replace("/SignIn");
  }

  const width = collapsed ? "md:w-16" : "md:w-60";
  const showLabels = !collapsed;

  const visibleNavItems = NAV_ITEMS.filter((item) => {
    const publicGuestRoutes = ["/", "/SignIn", "/SignUp"];

    if (!user) {
      return publicGuestRoutes.includes(item.href);
    }

    return item.href !== "/SignIn" && item.href !== "/SignUp";
  });

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
    visibleNavItems,
  };
};
