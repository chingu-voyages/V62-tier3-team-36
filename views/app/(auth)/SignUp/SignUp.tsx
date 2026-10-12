"use client";

import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/RegisterInput";

import { useSignUp } from "./hooks/useSignUp";

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
    <div>
      <div className="flex items-center mb-4 justify-center">
        <Image src="/logo.svg" alt="Logo" width={32} height={32} />
        <span className="ml-2 text-lg font-bold">RetailLen</span>
      </div>
      <div className="font-bold mt-[20px] text-[24px] text-[#202020]">
        Sign Up
      </div>
      <div className="mt-[8px] mb-[22px] text-[#6F6F6F] text-[14px] font-light">
        Create your workspace account.
      </div>
      <form onSubmit={handleSignUp} className="space-y-[12px] w-full">
        {errors.server ? <p role="alert">{errors.server}</p> : null}
        <Input
          name="full_name"
          type="text"
          value={fullName}
          setValue={setFullName}
          placeholder={errors.fullName ?? "Your full name"}
          error={errors.fullName ?? null}
          isLoading={isLoading}
        />
        <Input
          name="organisation_name"
          type="text"
          value={organisationName}
          setValue={setOrganisationName}
          placeholder={errors.organisationName ?? "Organisation name"}
          error={errors.organisationName ?? null}
          isLoading={isLoading}
        />
        <Input
          name="email"
          type="email"
          value={email}
          setValue={setEmail}
          placeholder={errors.email ?? "Work email"}
          error={errors.email ?? null}
          isLoading={isLoading}
        />
        <Input
          name="password"
          type="password"
          value={password}
          setValue={setPassword}
          placeholder={errors.password ?? "Password"}
          error={errors.password ?? null}
          isLoading={isLoading}
        />
        <Input
          name="confirm_password"
          type="password"
          value={confirmPassword}
          setValue={setConfirmPassword}
          placeholder={errors.confirmPassword ?? "Confirm password"}
          error={errors.confirmPassword ?? null}
          isLoading={isLoading}
        />
        <Button
          isLoading={isLoading}
          text={isLoading ? "Creating..." : "Continue"}
        />
      </form>
      <div className="mt-[16px] text-center">
        <Link
          href="/SignIn"
          className="text-[14px] text-[#6F6F6F] hover:text-[#222222] font-medium"
        >
          Already have an account? Sign In.
        </Link>
      </div>
    </div>
  );
};

export default SignUp;
