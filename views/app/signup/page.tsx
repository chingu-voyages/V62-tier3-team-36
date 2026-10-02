"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:5000";

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [organisationName, setOrganisationName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: fullName,
          organisation_name: organisationName,
          email,
          password,
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setError(data?.error ?? "Sign up failed");
        return;
      }
      router.push("/login");
    } catch {
      setError("Could not reach the backend. Is it running?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex w-full max-w-md flex-col gap-4 px-8 py-16 sm:px-16">
      <h1 className="text-3xl font-semibold tracking-tight">Sign Up</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <label className="flex flex-col gap-1 text-sm">
          Full name
          <input
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="rounded-md border border-black/[.08] bg-transparent px-3 py-2 dark:border-white/[.145]"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Organisation name
          <input
            required
            value={organisationName}
            onChange={(e) => setOrganisationName(e.target.value)}
            className="rounded-md border border-black/[.08] bg-transparent px-3 py-2 dark:border-white/[.145]"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Email
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-md border border-black/[.08] bg-transparent px-3 py-2 dark:border-white/[.145]"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Password (min 8 characters)
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-md border border-black/[.08] bg-transparent px-3 py-2 dark:border-white/[.145]"
          />
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-foreground py-2 text-sm text-background disabled:opacity-50"
        >
          {loading ? "Creating account…" : "Create account"}
        </button>
      </form>
    </main>
  );
}
