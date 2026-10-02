"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/login", label: "Login" },
  { href: "/signup", label: "Sign Up" },
  { href: "/profile", label: "Profile" },
];

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:5000";

type SessionUser = {
  full_name?: string;
  email?: string;
};

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<SessionUser | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      return;
    }
    let cancelled = false;
    fetch(`${BACKEND_URL}/api/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled) setUser(data ?? null);
      })
      .catch(() => {
        if (!cancelled) setUser(null);
      });
    return () => {
      cancelled = true;
    };
  }, [pathname]);

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
    setUser(null);
    setMobileOpen(false);
    router.push("/login");
  }

  const width = collapsed ? "md:w-16" : "md:w-60";
  const showLabels = !collapsed;

  return (
    <>
      {/* Mobile top bar */}
      <div className="flex items-center justify-between border-b border-black/[.08] bg-white px-4 py-3 md:hidden dark:border-white/[.145] dark:bg-black">
        <span className="text-base font-semibold">Platform</span>
        <button
          type="button"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
          className="rounded-md border border-black/[.08] px-3 py-1.5 text-sm dark:border-white/[.145]"
        >
          {mobileOpen ? "Close" : "Menu"}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <nav
          aria-label="Platform"
          className="border-b border-black/[.08] bg-white px-4 py-2 md:hidden dark:border-white/[.145] dark:bg-black"
        >
          <ul className="flex flex-col">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  aria-current={pathname === item.href ? "page" : undefined}
                  className={`block rounded-md px-3 py-2 text-sm ${
                    pathname === item.href
                      ? "bg-black/[.06] font-semibold dark:bg-white/[.08]"
                      : "hover:bg-black/[.04] dark:hover:bg-white/[.06]"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex items-center justify-between py-2">
            <span className="truncate text-xs text-zinc-600 dark:text-zinc-400">
              {user?.email ?? user?.full_name ?? "Not signed in"}
            </span>
            {user && (
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-md border border-black/[.08] px-3 py-1.5 text-sm dark:border-white/[.145]"
              >
                Log out
              </button>
            )}
          </div>
        </nav>
      )}

      {/* Desktop sidebar */}
      <aside
        className={`hidden min-h-screen flex-col border-r border-black/[.08] bg-white md:flex dark:border-white/[.145] dark:bg-black ${width}`}
      >
        <div className="flex items-center justify-between px-4 py-4">
          {showLabels && <span className="text-base font-semibold">Platform</span>}
          <button
            type="button"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-expanded={!collapsed}
            onClick={() => setCollapsed((v) => !v)}
            className="rounded-md border border-black/[.08] px-2 py-1 text-sm dark:border-white/[.145]"
          >
            {collapsed ? "»" : "«"}
          </button>
        </div>

        <nav aria-label="Platform" className="flex-1 px-2">
          <ul className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={pathname === item.href ? "page" : undefined}
                  title={item.label}
                  className={`block rounded-md px-3 py-2 text-sm ${
                    pathname === item.href
                      ? "bg-black/[.06] font-semibold dark:bg-white/[.08]"
                      : "hover:bg-black/[.04] dark:hover:bg-white/[.06]"
                  } ${collapsed ? "text-center" : ""}`}
                >
                  {collapsed ? item.label.charAt(0) : item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="border-t border-black/[.08] p-3 dark:border-white/[.145]">
          {showLabels && (
            <p className="mb-2 truncate text-xs text-zinc-600 dark:text-zinc-400">
              {user?.email ?? user?.full_name ?? "Not signed in"}
            </p>
          )}
          {user ? (
            <button
              type="button"
              onClick={handleLogout}
              className={`rounded-md border border-black/[.08] py-1.5 text-sm dark:border-white/[.145] ${collapsed ? "w-full" : "w-full"}`}
            >
              {collapsed ? "↩" : "Log out"}
            </button>
          ) : (
            showLabels && (
              <Link
                href="/login"
                className="block rounded-md bg-foreground py-1.5 text-center text-sm text-background"
              >
                Sign in
              </Link>
            )
          )}
        </div>
      </aside>
    </>
  );
}
