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
    <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex items-center mb-4 justify-center">
        <Image src="/logo.svg" alt="Logo" width={32} height={32} />
        <span className="ml-2 text-lg font-bold">RetailLen</span>
      </div>
      <div className="font-bold mt-[20px] text-[24px] text-[#202020]">
        Forgot Password
      </div>
      <div className="mt-[8px] mb-[22px] text-[#6F6F6F] text-[14px] font-light">
        Enter your email and we will send you a secure reset link.
      </div>
      <form onSubmit={handleSubmit} className="space-y-[12px] w-full">
        {error ? (
          <div
            className="p-[10px] border-[0.8px] border-[#202020] bg-[#E0E0E0] text-[#202020] text-xs w-full"
            role="alert"
          >
            {error}
          </div>
        ) : null}
        {message ? <p role="status">{message}</p> : null}
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
