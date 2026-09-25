"use client";

import { useForgotPassword } from "./hooks/useForgotPassword";

import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export const ForgotPassword = () => {
  const { email, setEmail, isLoading, error, handleSubmit } =
    useForgotPassword();

  return (
    <div>
      <div>Logo</div>
      <div className="font-bold mt-[20px] text-[24px] text-[#202020]">
        Forgot Password
      </div>
      <div className="mt-[8px] mb-[22px] text-[#6F6F6F] text-[14px] font-light">
        Enter your email to continue to password reset.
      </div>
      <form onSubmit={handleSubmit} className="space-y-[12px] w-full">
        {error && (
          <div className="p-[10px] border-[0.8px] border-[#202020] bg-[#E0E0E0] text-[#202020] text-xs w-full">
            {error}
          </div>
        )}
        <Input
          value={email}
          setValue={setEmail}
          isLoading={isLoading}
          placeholder="Work email"
          type="email"
        />
        <Button isLoading={isLoading} text="Continue" />
      </form>
    </div>
  );
};
