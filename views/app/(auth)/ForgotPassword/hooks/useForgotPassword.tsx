import { useState } from "react";
import { useRouter } from "next/navigation";

import { z } from "zod";

import { forgot_password } from "@/api/auth/api";

import type { SubmitEvent } from "react";

const forgotPasswordSchema = z.object({
  email: z
    .email("Please enter a valid email.")
    .trim()
    .min(1, "Email is required."),
});

export const useForgotPassword = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = forgotPasswordSchema.safeParse({ email });

    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await forgot_password({
        email: result.data.email,
      });

      if (response.status === 200) {
        router.push("/ResetPassword");
        return;
      }

      setError("Failed to send reset email.");
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    setEmail,
    isLoading,
    error,
    handleSubmit,
  };
};
