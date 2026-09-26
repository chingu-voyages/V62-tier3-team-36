"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { z } from "zod";

import { reset_password } from "@/api/auth/api";

import type { FormEvent } from "react";

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .max(128, "Password must be no more than 128 characters."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export const useResetPassword = (token: string) => {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!token) {
      router.replace("/ExpireResetLink");
      return;
    }

    const result = resetPasswordSchema.safeParse({
      password,
      confirmPassword,
    });
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    setIsLoading(true);
    try {
      await reset_password({ token, password: result.data.password });
      router.replace("/PasswordResetSuccess");
    } catch (requestError: unknown) {
      if (axios.isAxiosError(requestError) && requestError.response?.status === 400) {
        router.replace("/ExpireResetLink");
      } else {
        setError("Could not reset your password. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    isLoading,
    error,
    handleSubmit,
  };
};
