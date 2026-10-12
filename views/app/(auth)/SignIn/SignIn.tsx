"use client";

import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

import { useSignIn } from "./hooks/useSignIn";

export const SignIn = () => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    error,
    handleSubmit,
  } = useSignIn();

  return (
    <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-8 flex items-center justify-center gap-2">
        <Image
          src="/logo.svg"
          alt="RetailLen logo"
          width={34}
          height={34}
          priority
        />
        <span className="text-xl font-bold tracking-tight text-[#222222]">
          RetailLen
        </span>
      </div>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#202020]">
          {error ? "Sign in error" : "Welcome back"}
        </h1>

        <p className="mt-2 text-sm leading-6 text-gray-500">
          {error
            ? "Please check the details below and try again."
            : "Enter your email and password to access your workspace."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-7 w-full space-y-4">
        {error && (
          <div
            className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm leading-5 text-red-700"
            role="alert"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mt-0.5 shrink-0"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4" />
              <path d="M12 16h.01" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-1.5">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Work email
          </label>
          <Input
            value={email}
            setValue={setEmail}
            isLoading={isLoading}
            placeholder="you@company.com"
            type="email"
            name="email"
            autoComplete="email"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <Input
            value={password}
            setValue={setPassword}
            isLoading={isLoading}
            placeholder="Enter your password"
            type="password"
            name="password"
            autoComplete="current-password"
            required
          />
        </div>

        <div className="flex justify-end pt-1">
          <Link
            href="/ForgotPassword"
            className="text-sm font-medium text-gray-500 transition-colors hover:text-[#222222] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300 focus-visible:ring-offset-2"
          >
            Forgot password?
          </Link>
        </div>

        <div className="pt-2">
          <Button
            isLoading={isLoading}
            text={isLoading ? "Logging in..." : "Continue"}
          />
        </div>
      </form>
    </div>
  );
};
