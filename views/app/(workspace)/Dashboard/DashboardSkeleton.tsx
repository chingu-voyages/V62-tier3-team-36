export const DashboardSkeleton = () => (
  <div className="px-5 pb-10 pt-5 bg-[var(--white)]">
    <div className="flex animate-pulse flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-[var(--white)]">
      <div className="space-y-2">
        <div className="h-5 w-44  bg-[var(--gray-500)]" />
        <div className="h-4 w-60  bg-[var(--gray-500)]" />
      </div>
      <div className="h-10 w-full bg-[var(--gray-500)] sm:w-[180px]" />
    </div>

    <div className="mt-6 grid gap-3 sm:grid-cols-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="h-20 animate-pulse  bg-[var(--gray-400)]" />
      ))}
    </div>

    <div className="mt-6 h-52 animate-pulse bg-[var(--gray-400)]" />
  </div>
);
