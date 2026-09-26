"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

import { reset_password } from "@/api/auth/api";

interface ResetPasswordProps {
  token: string;
}

const ResetPassword = ({ token }: ResetPasswordProps) => {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!token) {
      router.replace("/ExpireResetLink");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password.length > 128) {
      setError("Password must be no more than 128 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await reset_password({ token, password });
      if (response.status === 200) {
        router.replace("/PasswordResetSuccess");
      }
    } catch (requestError: unknown) {
      if (axios.isAxiosError(requestError) && requestError.response?.status === 400) {
        router.replace("/ExpireResetLink");
      } else {
        setError("Could not reset your password. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }

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
        {error ? <p role="alert">{error}</p> : null}
        <input
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="p-[13px] bg-[#FAFAFA] border-1 border-[#202020] w-full h-[46px]"
          type="password"
          name="password"
          autoComplete="new-password"
          placeholder="New password"
          disabled={isLoading}
          required
        />
        <input
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          className="p-[13px] border-1 border-[#202020] bg-[#FAFAFA] w-full h-[46px]"
          type="password"
          name="confirm_password"
          autoComplete="new-password"
          placeholder="Confirm password"
          disabled={isLoading}
          required
        />
        <button
          className="p-[13px] border-2 border-[#202020] flex items-center justify-center bg-[#D7D7D7] cursor-pointer font-bold text-[#202020] w-full h-[46px]"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Updating..." : "Continue"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
