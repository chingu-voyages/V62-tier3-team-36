"use client";

import { useEffect, useState } from "react";

import { AxiosError } from "axios";

import { add_member, get_members } from "@/api/auth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

import type { FormEvent } from "react";
import type { AuthUser } from "@/utils/authSession";

export const Team = () => {
  const [members, setMembers] = useState<AuthUser[]>([]);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    get_members()
      .then((response) => setMembers(response.data.members))
      .catch(() => setError("Only the workspace Admin can manage the team."));
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await add_member({
        full_name: fullName.trim(),
        email: email.trim(),
        password,
      });

      setMembers((current) => [...current, response.data.user]);
      setFullName("");
      setEmail("");
      setPassword("");
    } catch (error) {
      setError(
        (error instanceof AxiosError && error.response?.data?.error) ||
          "Could not add the member.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="px-5 pb-10 pt-5">
      <h2 className="text-xl font-bold tracking-tight text-[#202020]">Team</h2>
      <p className="mt-1 text-sm text-gray-500">
        Viewers can see this workspace&apos;s analytics but cannot upload data
        or manage the team.
      </p>

      <ul className="mt-5 divide-y divide-gray-200 rounded-2xl border border-gray-200/80 bg-white shadow-sm">
        {members.map((member) => (
          <li
            key={member.id}
            className="flex items-center justify-between gap-3 px-5 py-3"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-[#202020]">
                {member.full_name}
              </p>
              <p className="truncate text-sm text-gray-500">{member.email}</p>
            </div>

            <span className="shrink-0 rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
              {member.role === "ADMIN" ? "Admin" : "Viewer"}
            </span>
          </li>
        ))}
      </ul>

      <form
        onSubmit={handleSubmit}
        className="mt-6 max-w-md rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm"
      >
        <h3 className="mb-4 text-base font-semibold tracking-tight text-[#202020]">
          Add a viewer
        </h3>

        <Input
          name="full_name"
          placeholder="Full name"
          value={fullName}
          setValue={setFullName}
          isLoading={isLoading}
          required
        />
        <Input
          name="email"
          type="email"
          placeholder="Email"
          value={email}
          setValue={setEmail}
          isLoading={isLoading}
          autoComplete="off"
          required
        />
        <Input
          name="password"
          type="password"
          placeholder="Password (at least 8 characters)"
          value={password}
          setValue={setPassword}
          isLoading={isLoading}
          autoComplete="new-password"
          required
        />

        {error && (
          <p role="alert" className="mb-4 text-sm text-red-600">
            {error}
          </p>
        )}

        <Button isLoading={isLoading} text="Add viewer" />
      </form>
    </div>
  );
};
