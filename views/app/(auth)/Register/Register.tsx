"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/RegisterInput";

import { useRegister } from "./hooks/useRegister";

const Register = () => {
  const {
    handleRegister,
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
  } = useRegister();

  return (
    <div>
      <div>Logo</div>
      <div className="font-bold mt-[20px] text-[24px] text-[#202020]">
        Register
      </div>
      <div className="mt-[8px] mb-[22px] text-[#6F6F6F] text-[14px] font-light">
        Create your workspace account.
      </div>
      <form onSubmit={handleRegister} className="space-y-[12px] w-full">
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
    </div>
  );
};

export default Register;
