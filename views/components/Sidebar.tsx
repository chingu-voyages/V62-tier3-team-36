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
    showLabels,
    visibleNavItems,
  } = useSidebar();

  return (
    <>
      {/* Mobile top bar */}
      <header className="sticky top-0 z-50 flex w-full shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 py-3 dark:border-white/[.145] dark:bg-black md:hidden">
        <Link href="/Dashboard" className="flex items-center gap-2">
          <Image src="/logo.svg" alt="RetailLen" width={32} height={32} />
          <span className="text-lg font-bold">RetailLen</span>
        </Link>

        <button
          type="button"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((value) => !value)}
          className="rounded-xl border border-gray-200 px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-100 dark:border-white/[.145] dark:hover:bg-white/[.08]"
        >
          {mobileOpen ? "Close" : "Menu"}
        </button>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 z-40 bg-black/30 md:hidden"
          />

          <nav
            aria-label="Platform"
            className="fixed inset-x-0 top-[57px] z-50 max-h-[calc(100dvh-57px)] overflow-y-auto border-b border-gray-200 bg-white p-4 shadow-lg dark:border-white/[.145] dark:bg-black md:hidden"
          >
            <ul className="flex flex-col gap-1">
              {visibleNavItems.map((item) => {
                const isActive = pathname === item.href;

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      aria-current={isActive ? "page" : undefined}
                      className={`block rounded-xl px-4 py-3 text-sm transition-colors ${
                        isActive
                          ? "bg-gray-100 font-semibold text-gray-900 dark:bg-white/[.08] dark:text-white"
                          : "text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-white/[.06]"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="mt-4 flex items-center justify-between gap-3 border-t border-gray-200 pt-4 dark:border-white/[.145]">
              <span className="min-w-0 truncate text-xs text-gray-500 dark:text-gray-400">
                {user?.full_name ?? user?.email ?? "Not signed in"}
              </span>

              {user && (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="shrink-0 rounded-xl border border-gray-200 px-3 py-2 text-sm font-medium hover:bg-gray-50 dark:border-white/[.145] dark:hover:bg-white/[.08]"
                >
                  Log out
                </button>
              )}
            </div>
          </nav>
        </>
      )}

      {/* Desktop and tablet sidebar */}
      <aside
        className={`sticky top-0 hidden h-dvh shrink-0 flex-col overflow-y-auto border-r border-gray-200 bg-white dark:border-white/[.145] dark:bg-black md:flex md:w-16 ${
          collapsed ? "lg:w-20" : "lg:w-64"
        }`}
      >
        <div className="flex min-h-[73px] items-center justify-between gap-2 px-2 py-4 lg:px-4">
          {showLabels && (
            <Link
              href="/Dashboard"
              aria-label="RetailLen home"
              className="hidden min-w-0 items-center gap-2 lg:flex"
            >
              <Image src="/logo.svg" alt="" width={32} height={32} />

              <span className="truncate text-lg font-bold">RetailLen</span>
            </Link>
          )}
          <button
            type="button"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-expanded={!collapsed}
            onClick={() => setCollapsed((value) => !value)}
            className="mx-auto rounded-lg border border-gray-200 px-2 py-1.5 text-sm transition-colors hover:bg-gray-100 dark:border-white/[.145] dark:hover:bg-white/[.08] lg:mx-0"
          >
            {collapsed ? "»" : "«"}
          </button>
        </div>

        <nav aria-label="Platform" className="flex-1 px-2">
          <ul className="flex flex-col gap-1">
            {visibleNavItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    title={item.label}
                    aria-label={item.label}
                    aria-current={isActive ? "page" : undefined}
                    className={`flex min-h-10 items-center justify-center rounded-xl px-2 py-2 text-sm transition-colors lg:justify-start lg:px-3 ${
                      isActive
                        ? "bg-gray-100 font-semibold text-gray-900 dark:bg-white/[.08] dark:text-white"
                        : "text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-white/[.06]"
                    }`}
                  >
                    <span className="lg:hidden">{item.label.charAt(0)}</span>

                    <span className="hidden truncate lg:inline">
                      {collapsed ? item.label.charAt(0) : item.label}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-gray-200 p-2 dark:border-white/[.145] lg:p-3">
          {showLabels && !collapsed && (
            <p className="mb-2 hidden truncate text-xs text-gray-500 dark:text-gray-400 lg:block">
              {user?.full_name ?? user?.email ?? "Not signed in"}
            </p>
          )}

          {user && (
            <button
              type="button"
              onClick={handleLogout}
              aria-label="Log out"
              title="Log out"
              className="w-full rounded-xl border border-gray-200 px-2 py-2 text-sm font-medium transition-colors hover:bg-gray-100 dark:border-white/[.145] dark:hover:bg-white/[.08]"
            >
              <span className="lg:hidden">↩</span>
              <span className="hidden lg:inline">
                {collapsed ? "↩" : "Log out"}
              </span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
