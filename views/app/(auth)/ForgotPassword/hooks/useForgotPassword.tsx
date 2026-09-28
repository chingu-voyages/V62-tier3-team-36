"use client";

import { useState } from "react";
import { z } from "zod";

import { forgot_password } from "@/api/auth/api";

import type { FormEvent } from "react";

const forgotPasswordSchema = z.object({
  email: z.email("Please enter a valid email.").trim(),
});

export const useForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setMessage("");

    const result = forgotPasswordSchema.safeParse({ email });
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    setIsLoading(true);
    try {
      const response = await forgot_password({ email: result.data.email });
      if (response.status === 202) {
        setMessage(response.data.message);
      }
    } catch {
      setError("Could not send the reset email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    setEmail,
    isLoading,
    error,
    message,
    handleSubmit,
  };
};
