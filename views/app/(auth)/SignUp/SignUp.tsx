"use client";

import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/Button";

import { useSignUp } from "./hooks/useSignUp";
import { Input } from "@/components/ui/Input";

const SignUp = () => {
  const {
    handleSignUp,
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
    setConfirmPassword,
    confirmPassword,
  } = useSignUp();

  return (
    <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-6 flex items-center justify-center">
        <Image src="/logo.svg" alt="RetailLen logo" width={32} height={32} />
        <span className="ml-2 text-lg font-bold text-gray-900">RetailLen</span>
      </div>

      <div className="mb-1 text-2xl font-bold tracking-tight text-[#202020]">
        Create an account
      </div>

      <p className="mb-6 text-sm text-gray-500">
        Create your workspace account to get started.
      </p>

      <form onSubmit={handleSignUp} className="w-full space-y-4">
        {errors.server && (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-700"
          >
            <svg
              className="mt-0.5 h-4 w-4 shrink-0"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM8.28 7.22a.75.75 0 0 0-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 1 0 1.06 1.06L10 11.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L11.06 10l1.72-1.72a.75.75 0 0 0-1.06-1.06L10 8.94 8.28 7.22Z"
                clipRule="evenodd"
              />
            </svg>
            <span>{errors.server}</span>
          </div>
        )}

        <Input
          name="full_name"
          type="text"
          value={fullName}
          setValue={setFullName}
          placeholder="Full name"
          error={errors.fullName ?? null}
          isLoading={isLoading}
          autoComplete="name"
          required
        />

        <Input
          name="organisation_name"
          type="text"
          value={organisationName}
          setValue={setOrganisationName}
          placeholder="Organisation name"
          error={errors.organisationName ?? null}
          isLoading={isLoading}
          autoComplete="organization"
          required
        />

        <Input
          name="email"
          type="email"
          value={email}
          setValue={setEmail}
          placeholder="Work email"
          error={errors.email ?? null}
          isLoading={isLoading}
          autoComplete="email"
          required
        />

        <Input
          name="password"
          type="password"
          value={password}
          setValue={setPassword}
          placeholder="Password"
          error={errors.password ?? null}
          isLoading={isLoading}
          autoComplete="new-password"
          required
        />

        <Input
          name="confirm_password"
          type="password"
          value={confirmPassword}
          setValue={setConfirmPassword}
          placeholder="Confirm password"
          error={errors.confirmPassword ?? null}
          isLoading={isLoading}
          autoComplete="new-password"
          required
        />

        <div className="pt-1">
          <Button
            isLoading={isLoading}
            text={isLoading ? "Creating account..." : "Create account"}
          />
        </div>
      </form>

      <div className="border-t border-gray-100 pt-5 text-center">
        <p className="text-sm text-gray-500">
          Already have an account?{" "}
          <Link
            href="/SignIn"
            className="font-medium text-[#222222] transition-colors hover:text-gray-600 focus-visible:outline-none focus-visible:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
