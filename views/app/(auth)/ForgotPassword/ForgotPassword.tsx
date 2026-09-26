"use client";

import { FormEvent, useState } from "react";

import { forgot_password } from "../../../api/auth/api";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setError("");

    if (!email.trim()) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await forgot_password({ email: email.trim() });
      if (response.status === 202) {
        setMessage(response.data.message);
      }
    } catch {
      setError("Could not send the reset email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <div>Logo</div>
      <div className="font-bold mt-[20px] text-[24px] text-[#202020]">
        Forgot Password
      </div>
      <div className="mt-[8px] mb-[22px] text-[#6F6F6F] text-[14px] font-light">
        Enter your email and we will send you a secure reset link.
      </div>
      <form onSubmit={handleSubmit} className="space-y-[12px] w-full">
        {error ? <p role="alert">{error}</p> : null}
        {message ? <p role="status">{message}</p> : null}
        <input
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="p-[13px] bg-[#FAFAFA] border-1 border-[#202020] w-full h-[46px]"
          type="email"
          name="email"
          autoComplete="email"
          placeholder="Work email"
          disabled={isLoading}
          required
        />
        <button
          className="p-[13px] border-2 border-[#202020] cursor-pointer hover:bg-gray-400 flex items-center justify-center bg-[#D7D7D7] font-bold text-[#202020] w-full h-[46px]"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Sending..." : "Continue"}
        </button>
      </form>
    </div>
  );
};

export default ForgetPassword;
