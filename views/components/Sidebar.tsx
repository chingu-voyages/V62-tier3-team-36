"use client";

import Image from "next/image";
import Link from "next/link";

import { useSidebar } from "./hooks/useSidebar";

export default function Sidebar() {
  const {
    pathname,
    collapsed,
    setCollapsed,
    mobileOpen,
    setMobileOpen,
    user,
    handleLogout,
    width,
    showLabels,
    visibleNavItems,
  } = useSidebar();

  return (
    <>
      {/* Mobile top bar */}
      <div className="flex items-center justify-between border-b border-black/[.08] bg-white px-4 py-3 md:hidden dark:border-white/[.145] dark:bg-black">
        <div className="flex items-center mb-4 justify-center">
          <Image src="/logo.svg" alt="Logo" width={32} height={32} />
          <span className="ml-2 text-lg font-bold">RetailLen</span>
        </div>
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
            {visibleNavItems.map((item) => (
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
              {user?.full_name ?? user?.email ?? "Not signed in"}
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
          {showLabels && (
            <div className="flex items-center justify-center">
              <Image src="/logo.svg" alt="Logo" width={32} height={32} />
              <span className="ml-2 text-lg font-bold">RetailLen</span>
            </div>
          )}
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
            {visibleNavItems.map((item) => (
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
              {user?.full_name ?? user?.email ?? "Not signed in"}
            </p>
          )}
          {user && (
            <button
              type="button"
              onClick={handleLogout}
              className={`rounded-md border border-black/[.08] py-1.5 text-sm dark:border-white/[.145] ${collapsed ? "w-full" : "w-full"}`}
            >
              {collapsed ? "↩" : "Log out"}
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
