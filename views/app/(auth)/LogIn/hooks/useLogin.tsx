"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { login } from "@/api/auth/api";

import type { SubmitEvent } from "react";

export const useLogin = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Email and password are required.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await login({ email, password });

      if (response.status === 200) {
        sessionStorage.setItem("token", response.token);
        router.push("/Dashboard");
        return;
      }

      setError(response.error || "Login failed. Please try again.");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    error,
    handleSubmit,
  };
};
