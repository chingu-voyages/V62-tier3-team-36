export const UploadDetailSkeleton = () => {
  return (
    <div className="px-5 pb-10 pt-5 bg-[var(--white)]">
      <div className="flex animate-pulse flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <div className="h-5 w-44 bg-[var(--gray-400)]" />
          <div className="h-4 w-60 bg-[var(--gray-300)]" />
        </div>
        <div className="h-10 w-40 bg-[var(--gray-300)]" />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="h-[82px] animate-pulse bg-[var(--gray-300)]"
          />
        ))}
      </div>

      <div className="mt-4 h-[280px] animate-pulse border border-[var(--gray-400)] bg-[var(--gray-200)]" />

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="h-[280px] animate-pulse border border-[var(--gray-400)] bg-[var(--gray-200)]" />
        <div className="h-[280px] animate-pulse border border-[var(--gray-400)] bg-[var(--gray-200)]" />
      </div>

      <div className="mt-4 h-[190px] animate-pulse border border-[var(--gray-400)] bg-[var(--gray-200)]" />
    </div>
  );
};
