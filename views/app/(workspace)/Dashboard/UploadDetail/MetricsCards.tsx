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
      ? "border-amber-400 bg-amber-50 text-amber-900"
      : "border-[var(--gray-400)] bg-[var(--gray-200)] text-[var(--gray-700)]";

  return (
    <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
      <div className="border border-[var(--gray-400)] bg-[var(--gray-200)] p-3">
        <p className="text-[11px] text-[var(--gray-600)]">Revenue</p>
        <p className="mt-1 text-3xl font-bold leading-none">
          {formatRevenue(filteredMetrics?.totalRevenue ?? 0)}
        </p>

        {hasActiveFilters && (
          <div
            className={`mt-2 border px-2 py-1 text-[11px] ${revenueNoteClasses}`}
          >
            <p className="font-bold">{revenueFilterMessage.title}</p>
            <p className="mt-0.5">{revenueFilterMessage.body}</p>
          </div>
        )}
      </div>
      <div className="border border-[var(--gray-400)] bg-[var(--gray-200)] p-3">
        <p className="text-[11px] text-[var(--gray-600)]">Transactions</p>
        <p className="mt-1 text-3xl font-bold leading-none">
          {filteredMetrics?.totalOrders ?? 0}
        </p>
      </div>
      <div className="border border-[var(--gray-400)] bg-[var(--gray-200)] p-3">
        <p className="text-[11px] text-[var(--gray-600)]">Avg. order</p>
        <p className="mt-1 text-3xl font-bold leading-none">
          {formatRevenue(filteredMetrics?.averageOrderValue ?? 0)}
        </p>
      </div>
    </div>
  );
};
