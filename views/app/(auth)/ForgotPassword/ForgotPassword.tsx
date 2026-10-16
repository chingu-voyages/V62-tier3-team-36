"use client";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

import { useForgotPassword } from "./hooks/useForgotPassword";

export const ForgotPassword = () => {
  const { email, setEmail, isLoading, error, message, handleSubmit } =
    useForgotPassword();

  return (
    <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8">
      <div className="mb-6 flex items-center justify-center">
        <Image src="/logo.svg" alt="RetailLens logo" width={32} height={32} />
        <span className="ml-2 text-lg font-bold tracking-tight text-[#202020]">
          RetailLens
        </span>
      </div>

      <h1 className="text-2xl font-bold tracking-tight text-[#202020]">
        Forgot password?
      </h1>
      <p className="mb-6 mt-2 text-sm leading-6 text-gray-500">
        Enter your email and we will send you a secure reset link.
      </p>

      <form onSubmit={handleSubmit} className="w-full space-y-4">
        {error && (
          <div
            className="w-full rounded-xl border border-red-200 bg-red-50 p-3 text-sm leading-5 text-red-700"
            role="alert"
          >
            {error}
          </div>
        )}
        {message && (
          <p
            role="status"
            className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm leading-5 text-emerald-700"
          >
            {message}
          </p>
        )}
        <Input
          value={email}
          setValue={setEmail}
          isLoading={isLoading}
          placeholder="Work email"
          type="email"
          name="email"
          autoComplete="email"
          required
        />
        <Button
          isLoading={isLoading}
          text={isLoading ? "Sending..." : "Continue"}
        />
      </form>
      <div className="mt-6 border-t border-gray-100 pt-5 text-center">
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
