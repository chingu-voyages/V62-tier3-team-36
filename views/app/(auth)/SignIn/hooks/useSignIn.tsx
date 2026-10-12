"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { AxiosError } from "axios";

import { login } from "@/api/auth";
import { setAuthSession } from "../../../../utils/authSession";
import { useAuthStore } from "@/store/authStore";

import type { FormEvent } from "react";

export const useSignIn = () => {
  const router = useRouter();

  const setUser = useAuthStore((state) => state.setUser);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Email and password are required.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await login({
        email: email.trim(),
        password,
      });

      const { access_token, refresh_token, user } = response.data;

      setAuthSession({
        accessToken: access_token,
        refreshToken: refresh_token,
        user,
      });

      setUser(user);

      router.push("/Dashboard");
    } catch (error) {
      if (error instanceof AxiosError) {
        setError(
          error.response?.data?.error ?? "Email or password is incorrect.",
        );
      } else {
        setError("Email or password is incorrect.");
      }
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
