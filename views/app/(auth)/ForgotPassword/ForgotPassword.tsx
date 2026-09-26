"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

import { useForgotPassword } from "./hooks/useForgotPassword";

export const ForgotPassword = () => {
  const { email, setEmail, isLoading, error, message, handleSubmit } =
    useForgotPassword();

  return (
    <div>
      <div>Logo</div>
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
    </div>
  );
};
