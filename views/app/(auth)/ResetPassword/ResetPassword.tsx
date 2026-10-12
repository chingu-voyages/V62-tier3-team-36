"use client";

import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

import { useResetPassword } from "./hooks/useResetPassword";

interface ResetPasswordProps {
  token: string;
}

export const ResetPassword = ({ token }: ResetPasswordProps) => {
  const {
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    isLoading,
    error,
    handleSubmit,
  } = useResetPassword(token);

  return (
    <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-6 flex items-center justify-center">
        <Image src="/logo.svg" alt="RetailLen logo" width={32} height={32} />
        <span className="ml-2 text-lg font-bold text-gray-900">RetailLen</span>
      </div>

      <h1 className="text-2xl font-bold tracking-tight text-[#202020]">
        Reset password
      </h1>

      <p className="mb-6 mt-2 text-sm leading-6 text-gray-500">
        Enter and confirm your new password to regain access to your account.
      </p>

      <form onSubmit={handleSubmit} className="w-full space-y-4">
        {error && (
          <div
            className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-700"
            role="alert"
          >
            <svg
              className="mt-0.5 h-4 w-4 shrink-0"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM8.28 7.22a.75.75 0 0 0-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 1 0 1.06 1.06L10 11.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L11.06 10l1.72-1.72a.75.75 0 0 0-1.06-1.06L10 8.94 8.28 7.22Z"
                clipRule="evenodd"
              />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <Input
          value={password}
          setValue={setPassword}
          isLoading={isLoading}
          placeholder="New password"
          type="password"
          name="password"
          autoComplete="new-password"
          required
        />

        <Input
          value={confirmPassword}
          setValue={setConfirmPassword}
          isLoading={isLoading}
          placeholder="Confirm new password"
          type="password"
          name="confirm_password"
          autoComplete="new-password"
          required
        />

        <div className="pt-1">
          <Button
            isLoading={isLoading}
            text={isLoading ? "Updating password..." : "Update password"}
          />
        </div>
      </form>

      <div className="border-t border-gray-100 pt-5 text-center">
        <Link
          href="/SignIn"
          className="text-sm font-medium text-gray-500 transition-colors hover:text-[#222222] focus-visible:outline-none focus-visible:underline"
        >
          Back to sign in
        </Link>
      </div>
    </div>
  );
};
