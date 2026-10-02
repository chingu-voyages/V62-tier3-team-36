import Link from "next/link";

export default function DashboardPage() {
  return (
    <main className="flex w-full max-w-3xl flex-col gap-4 px-8 py-16 sm:px-16">
      <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
      <p className="text-lg text-zinc-600 dark:text-zinc-400">
        You are signed in to the platform. More dashboard content is coming soon.
      </p>
      <div className="flex gap-4 text-sm">
        <Link href="/profile" className="underline">
          View profile
        </Link>
        <Link href="/" className="underline">
          Home
        </Link>
      </div>
    </main>
  );
}
