"use client";

import { useResetPassword } from "./hooks/useResetPassword";

import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export const ResetPassword = () => {
  const {
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    isLoading,
    error,
    handleSubmit,
  } = useResetPassword();

  return (
    <div>
      <div>Logo</div>

      <div className="font-bold mt-[20px] text-[24px] text-[#202020]">
        Reset Password
      </div>

      <div className="mt-[8px] mb-[22px] text-[#6F6F6F] text-[14px] font-light">
        Enter and confirm your new password.
      </div>

      <form onSubmit={handleSubmit} className="space-y-[12px] w-full">
        {error && (
          <div className="p-[10px] border-[0.8px] border-[#202020] bg-[#E0E0E0] text-[#202020] text-xs w-full">
            {error}
          </div>
        )}

        <Input
          value={password}
          setValue={setPassword}
          isLoading={isLoading}
          placeholder="New password"
          type="password"
        />

        <Input
          value={confirmPassword}
          setValue={setConfirmPassword}
          isLoading={isLoading}
          placeholder="Confirm new password"
          type="password"
        />

        <Button isLoading={isLoading} text="Continue" />
      </form>
    </div>
  );
};
