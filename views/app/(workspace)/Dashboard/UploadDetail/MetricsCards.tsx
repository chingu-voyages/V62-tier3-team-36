interface MetricsCardsProps {
  hasActiveFilters: boolean;
  revenueFilterMessage: {
    tone: string;
    title: string;
    body: string;
  };
  filteredMetrics: {
    totalRevenue: number | undefined;
    totalOrders: number | undefined;
    averageOrderValue: number | undefined;
  };
  formatRevenue: (value: number) => string;
}

export const MetricsCards = ({
  hasActiveFilters,
  revenueFilterMessage,
  filteredMetrics,
  formatRevenue,
}: MetricsCardsProps) => {
  const revenueNoteClasses =
    revenueFilterMessage.tone === "warning"
      ? "border-amber-200 bg-amber-50 text-amber-800"
      : "border-gray-200 bg-gray-50 text-gray-600";

  const cardClasses =
    "group flex min-w-0 flex-col rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-gray-300 hover:shadow-md";

  return (
    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
      {/* Revenue */}
      <div className={cardClasses}>
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-medium text-gray-500">Revenue</p>

          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 text-gray-600">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path
                d="M12 2v20m5-16H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        <p className="mt-4 break-words text-3xl font-bold tracking-tight text-[#202020]">
          {formatRevenue(filteredMetrics.totalRevenue ?? 0)}
        </p>

        {hasActiveFilters && (
          <div
            className={`mt-4 rounded-xl border p-3 text-xs leading-relaxed ${revenueNoteClasses}`}
          >
            <p className="font-semibold">{revenueFilterMessage.title}</p>
            <p className="mt-1 opacity-90">{revenueFilterMessage.body}</p>
          </div>
        )}

        <div className="mt-5 h-1 w-10 rounded-full bg-gray-200 transition-all duration-200 group-hover:w-16 group-hover:bg-gray-400" />
      </div>

      {/* Transactions */}
      <div className={cardClasses}>
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-medium text-gray-500">Transactions</p>

          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 text-gray-600">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <rect x="4" y="3" width="16" height="18" rx="2" />
              <path
                d="M8 7h8M8 11h2m4 0h2m-8 4h2m4 0h2"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        <p className="mt-4 break-words text-3xl font-bold tracking-tight text-[#202020]">
          {(filteredMetrics.totalOrders ?? 0).toLocaleString()}
        </p>

        <div className="mt-5 h-1 w-10 rounded-full bg-gray-200 transition-all duration-200 group-hover:w-16 group-hover:bg-gray-400" />
      </div>

      {/* Average Order Value */}
      <div className={cardClasses}>
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-medium text-gray-500">Avg. Order Value</p>

          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 text-gray-600">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path
                d="M3 3v18h18M7 14l4-4 4 3 5-7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        <p className="mt-4 break-words text-3xl font-bold tracking-tight text-[#202020]">
          {formatRevenue(filteredMetrics.averageOrderValue ?? 0)}
        </p>

        <div className="mt-5 h-1 w-10 rounded-full bg-gray-200 transition-all duration-200 group-hover:w-16 group-hover:bg-gray-400" />
      </div>
    </div>
  );
};
