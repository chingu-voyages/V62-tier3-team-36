const SkeletonBlock = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse rounded-lg bg-gray-200 ${className}`} />
);

const SkeletonCard = ({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => (
  <div
    className={`rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm ${className}`}
  >
    {children}
  </div>
);

const ChartSkeleton = ({ height = "h-[240px]" }: { height?: string }) => (
  <div
    className={`relative ${height} overflow-hidden rounded-xl border border-gray-100 bg-gray-50/70 p-4`}
  >
    <div className="flex h-full flex-col justify-between">
      <div className="flex flex-1 flex-col justify-between">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-px w-full bg-gray-200/80" />
        ))}
      </div>

      <div className="flex h-[65%] items-end justify-around gap-3 px-2">
        {[42, 68, 52, 85, 60, 76, 38, 65].map((index) => (
          <SkeletonBlock
            key={index}
            className="w-full max-w-10 rounded-t-md rounded-b-none"
          />
        ))}
      </div>

      <div className="mt-3 flex justify-around gap-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <SkeletonBlock key={index} className="h-2 w-8" />
        ))}
      </div>
    </div>
  </div>
);

export const UploadDetailSkeleton = () => {
  return (
    <div className="bg-white px-5 pb-10 pt-5">
      <div className="animate-pulse">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 flex-1 space-y-2">
            <SkeletonBlock className="h-6 w-56" />
            <SkeletonBlock className="h-4 w-64 max-w-full" />
          </div>

          <div className="flex flex-wrap gap-2">
            <SkeletonBlock className="h-10 w-28 rounded-xl" />
            <SkeletonBlock className="h-10 w-20 rounded-xl" />
            <SkeletonBlock className="h-10 w-44 rounded-xl" />
          </div>
        </div>

        {/* Active filter chips */}
        <div className="mt-4 flex flex-wrap gap-2">
          <SkeletonBlock className="h-7 w-28 rounded-full" />
          <SkeletonBlock className="h-7 w-24 rounded-full" />
          <SkeletonBlock className="h-7 w-32 rounded-full" />
        </div>

        {/* KPI cards */}
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <SkeletonCard key={index} className="min-h-[132px]">
              <div className="flex items-start justify-between">
                <div className="space-y-3">
                  <SkeletonBlock className="h-4 w-28" />
                  <SkeletonBlock className="h-8 w-36 max-w-full" />
                </div>

                <SkeletonBlock className="h-10 w-10 rounded-xl" />
              </div>

              <SkeletonBlock className="mt-4 h-1 w-20" />
            </SkeletonCard>
          ))}
        </div>

        {/* Ranking table */}
        <div className="mt-4 overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-5 py-4">
            <SkeletonBlock className="h-4 w-36" />
          </div>

          <div className="overflow-hidden">
            <div className="grid grid-cols-[2fr_1fr_1.4fr_0.7fr] gap-3 border-b border-gray-200 bg-gray-50 px-5 py-3">
              {["w-12", "w-14", "w-16", "w-10"].map((width, index) => (
                <SkeletonBlock key={index} className={`h-3 ${width}`} />
              ))}
            </div>

            {Array.from({ length: 2 }).map((_, index) => (
              <div
                key={index}
                className="grid grid-cols-[2fr_1fr_1.4fr_0.7fr] items-center gap-3 border-b border-gray-100 px-5 py-4 last:border-b-0"
              >
                <SkeletonBlock className="h-4 w-4/5" />
                <SkeletonBlock className="h-6 w-20 rounded-full" />
                <SkeletonBlock className="mx-auto h-4 w-20 max-w-full" />
                <SkeletonBlock className="ml-auto h-4 w-8" />
              </div>
            ))}
          </div>
        </div>

        {/* Revenue trend */}
        <SkeletonCard className="mt-4">
          <div className="flex items-center justify-between gap-3">
            <div className="space-y-2">
              <SkeletonBlock className="h-5 w-32" />
              <SkeletonBlock className="h-3 w-52 max-w-full" />
            </div>

            <SkeletonBlock className="h-7 w-20 rounded-lg" />
          </div>

          <div className="mt-5">
            <ChartSkeleton />
          </div>
        </SkeletonCard>

        {/* Region pie chart */}
        <SkeletonCard className="mt-4">
          <div className="space-y-2">
            <SkeletonBlock className="h-5 w-48" />
            <SkeletonBlock className="h-3 w-64 max-w-full" />
          </div>

          <div className="mt-5 grid grid-cols-1 items-center gap-6 sm:grid-cols-2">
            <div className="flex items-center justify-center py-4">
              <div className="relative h-44 w-44 rounded-full border-[26px] border-gray-200">
                <div className="absolute inset-[-26px] rounded-full border-[26px] border-transparent border-t-gray-300 border-r-gray-300" />
              </div>
            </div>

            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="flex items-center gap-3">
                  <SkeletonBlock className="h-3 w-3 shrink-0 rounded-sm" />
                  <SkeletonBlock className="h-3 w-28 max-w-full" />
                  <SkeletonBlock className="ml-auto h-3 w-14" />
                </div>
              ))}
            </div>
          </div>
        </SkeletonCard>

        {/* Ranking tables */}
        <div className="mt-4 grid grid-cols-1 gap-4">
          {["Top categories by revenue", "Top products by revenue"].map(
            (title) => (
              <SkeletonCard key={title}>
                <div className="flex items-center justify-between gap-3">
                  <div className="space-y-2">
                    <SkeletonBlock className="h-5 w-48 max-w-full" />
                    <SkeletonBlock className="h-3 w-28" />
                  </div>

                  <SkeletonBlock className="h-7 w-20 rounded-lg" />
                </div>

                <div className="mt-5">
                  <div className="grid grid-cols-[1fr_90px_70px] gap-3 border-b border-gray-200 pb-3">
                    <SkeletonBlock className="h-3 w-20" />
                    <SkeletonBlock className="ml-auto h-3 w-14" />
                    <SkeletonBlock className="ml-auto h-3 w-10" />
                  </div>

                  {Array.from({ length: 4 }).map((_, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-[1fr_90px_70px] items-center gap-3 border-b border-gray-100 py-4 last:border-b-0"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <SkeletonBlock className="h-7 w-7 shrink-0 rounded-lg" />
                        <SkeletonBlock
                          className={`h-4 max-w-full ${index % 2 === 0 ? "w-3/4" : "w-1/2"}`}
                        />
                      </div>

                      <SkeletonBlock className="ml-auto h-4 w-16 max-w-full" />
                      <SkeletonBlock className="ml-auto h-4 w-10" />
                    </div>
                  ))}
                </div>
              </SkeletonCard>
            ),
          )}
        </div>
      </div>
    </div>
  );
};
