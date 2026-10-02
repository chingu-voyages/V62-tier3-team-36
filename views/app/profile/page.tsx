"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:5000";

type Profile = {
  id: string;
  full_name: string;
  organisation_name: string;
  email: string;
  role: string;
};

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.replace("/login");
      return;
    }
    let cancelled = false;
    fetch(`${BACKEND_URL}/api/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (res.status === 401 || res.status === 403) {
          router.replace("/login");
          return null;
        }
        if (!res.ok) throw new Error("Failed to load profile");
        return res.json();
      })
      .then((data) => {
        if (!cancelled && data) setProfile(data);
      })
      .catch(() => {
        if (!cancelled) setError("Could not load profile.");
      });
    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <main className="flex w-full max-w-md flex-col gap-4 px-8 py-16 sm:px-16">
      <h1 className="text-3xl font-semibold tracking-tight">Profile</h1>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {!profile && !error && <p className="text-sm">Loading…</p>}
      {profile && (
        <dl className="flex flex-col gap-2 text-sm">
          <div>
            <dt className="text-zinc-600 dark:text-zinc-400">Full name</dt>
            <dd>{profile.full_name}</dd>
          </div>
          <div>
            <dt className="text-zinc-600 dark:text-zinc-400">Organisation</dt>
            <dd>{profile.organisation_name}</dd>
          </div>
          <div>
            <dt className="text-zinc-600 dark:text-zinc-400">Email</dt>
            <dd>{profile.email}</dd>
          </div>
          <div>
            <dt className="text-zinc-600 dark:text-zinc-400">Role</dt>
            <dd>{profile.role}</dd>
          </div>
        </dl>
      )}
    </main>
  );
}
