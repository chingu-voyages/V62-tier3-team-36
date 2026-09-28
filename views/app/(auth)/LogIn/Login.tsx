"use client";

import Link from "next/link";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

import { useLogin } from "./hooks/useLogin";

export const Login = () => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    error,
    handleSubmit,
  } = useLogin();

  return (
    <div>
      <div className="font-bold text-center mb-[20px] text-[24px] text-[#202020]">
        Logo
      </div>
      <div className="font-bold mt-[20px] text-[24px] text-[#202020]">
        {error ? "Login Error" : "Login"}
      </div>
      <div className="mt-[8px] mb-[22px] text-[#6F6F6F] text-[14px] font-light">
        {error
          ? "Please fix the errors before continuing."
          : "Enter your email and password to continue."}
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
        <Input
          value={password}
          setValue={setPassword}
          isLoading={isLoading}
          placeholder="Password"
          type="password"
          name="password"
          autoComplete="current-password"
          required
        />
        <Button
          isLoading={isLoading}
          text={isLoading ? "Logging in..." : "Continue"}
        />
      </form>
      <div className="mt-[16px] text-center">
        <Link
          href="/ForgotPassword"
          className="text-[14px] text-[#6F6F6F] hover:text-[#222222] font-medium"
        >
          Forgot password?
        </Link>
      </div>
    </div>
  );
};
