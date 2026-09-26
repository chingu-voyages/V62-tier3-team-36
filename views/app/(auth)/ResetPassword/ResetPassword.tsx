"use client";

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
    <div>
      <div>Logo</div>
      <div className="font-bold mt-[20px] text-[24px] text-[#202020]">
        Reset Password
      </div>
      <div className="mt-[8px] mb-[22px] text-[#6F6F6F] text-[14px] font-light">
        Enter and confirm your new password.
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
        <Button
          isLoading={isLoading}
          text={isLoading ? "Updating..." : "Continue"}
        />
      </form>
    </div>
  );
};
