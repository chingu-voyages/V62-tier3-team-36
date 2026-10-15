const SkeletonBlock = ({ className = "" }: { className?: string }) => (
  <div
    className={`animate-pulse rounded-lg bg-gray-200 ${className}`}
    aria-hidden="true"
  />
);

export const DashboardSkeleton = () => (
  <div className="mx-auto w-full max-w-7xl border-t border-gray-200 px-4 pb-10 pt-5 sm:px-6 sm:pt-6 lg:px-8">
    {/* Header */}
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 flex-1 space-y-2">
        <SkeletonBlock className="h-6 w-44" />
        <SkeletonBlock className="h-4 w-full max-w-md" />
      </div>

      <SkeletonBlock className="h-10 w-full rounded-xl sm:w-36" />
    </div>

    {/* Workspace Overview */}
    <section className="mt-6 overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm">
      {/* Section Header */}
      <div className="flex flex-col gap-3 border-b border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <SkeletonBlock className="h-5 w-40" />
          <SkeletonBlock className="h-4 w-56 max-w-full" />
        </div>

        <SkeletonBlock className="h-6 w-24 rounded-lg" />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <div className="min-w-[540px]">
          {/* Table Header */}
          <div className="grid grid-cols-[2fr_1fr_1.4fr_0.7fr] gap-3 border-b border-gray-200 bg-gray-50 px-5 py-3">
            <SkeletonBlock className="h-3 w-12" />
            <SkeletonBlock className="h-3 w-12" />
            <SkeletonBlock className="mx-auto h-3 w-16" />
            <SkeletonBlock className="ml-auto h-3 w-8" />
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-gray-100">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="grid grid-cols-[2fr_1fr_1.4fr_0.7fr] items-center gap-3 px-5 py-4"
              >
                {/* File Name */}
                <div className="flex min-w-0 items-center gap-3">
                  <SkeletonBlock className="h-9 w-9 shrink-0 rounded-xl" />
                  <SkeletonBlock
                    className={`h-4 max-w-full ${
                      index % 2 === 0 ? "w-36" : "w-28"
                    }`}
                  />
                </div>

                {/* Status */}
                <SkeletonBlock className="h-6 w-20 rounded-full" />

                {/* Uploaded Date */}
                <SkeletonBlock className="mx-auto h-4 w-20" />

                {/* Rows Count */}
                <SkeletonBlock className="ml-auto h-4 w-10" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  </div>
);
