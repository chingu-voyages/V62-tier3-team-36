"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";

import { register } from "@/api/auth/api";

import type { FormEvent } from "react";

type RegisterErrors = {
  email?: string;
  password?: string;
  fullName?: string;
  organisationName?: string;
  confirmPassword?: string;
  server?: string;
};

const registerSchema = z
  .object({
    fullName: z.string().trim().min(1, "Full name is required.").max(120),
    organisationName: z
      .string()
      .trim()
      .min(1, "Organisation name is required.")
      .max(120),
    email: z.email("Please enter a valid email.").trim(),
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

export function useRegister() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [organisationName, setOrganisationName] = useState("");
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  async function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors({});

    const result = registerSchema.safeParse({
      email,
      password,
      confirmPassword,
      fullName,
      organisationName,
    });
    if (!result.success) {
      const fields = z.flattenError(result.error).fieldErrors;
      setErrors({
        email: fields.email?.[0],
        password: fields.password?.[0],
        confirmPassword: fields.confirmPassword?.[0],
        fullName: fields.fullName?.[0],
        organisationName: fields.organisationName?.[0],
      });
      return;
    }

    setIsLoading(true);
    try {
      await register({
        email: result.data.email,
        password: result.data.password,
        full_name: result.data.fullName,
        organisation_name: result.data.organisationName,
      });
      router.push("/LogIn");
    } catch {
      setErrors({ server: "Could not create the account. Please try again." });
    } finally {
      setIsLoading(false);
    }
  }

  return {
    email,
    setEmail,
    password,
    setPassword,
    fullName,
    setFullName,
    organisationName,
    setOrganisationName,
    isLoading,
    errors,
    confirmPassword,
    setConfirmPassword,
    handleRegister,
  };
}
