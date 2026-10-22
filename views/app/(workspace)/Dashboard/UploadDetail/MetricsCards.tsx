import type { ReactNode } from "react";

interface MetricsCardsProps {
  hasActiveFilters: boolean;
  revenueFilterMessage: {
    tone: string;
    title: string;
    body: string;
  };
  filteredMetrics: {
    totalRevenue: number | undefined;
    totalUnits: number | undefined;
    averageOrderValue: number | undefined;
    growth: number | undefined;
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

  const { totalUnits, growth } = filteredMetrics;

  const cards: Array<{
    label: string;
    value: string;
    icon: ReactNode;
    valueClasses?: string;
    note?: ReactNode;
  }> = [
    {
      label: "Revenue",
      value: formatRevenue(filteredMetrics.totalRevenue ?? 0),
      icon: (
        <path
          d="M12 2v20m5-16H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ),
      note: hasActiveFilters && (
        <div
          className={`mt-4 rounded-xl border p-3 text-xs leading-relaxed ${revenueNoteClasses}`}
        >
          <p className="font-semibold">{revenueFilterMessage.title}</p>
          <p className="mt-1 opacity-90">{revenueFilterMessage.body}</p>
        </div>
      ),
    },
    {
      label: "Units",
      value: totalUnits === undefined ? "—" : totalUnits.toLocaleString(),
      icon: (
        <path
          d="m3 7 9-4 9 4-9 4-9-4Zm0 0v10l9 4 9-4V7m-9 4v10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ),
    },
    {
      label: "Avg. Order Value",
      value: formatRevenue(filteredMetrics.averageOrderValue ?? 0),
      icon: (
        <path
          d="M3 3v18h18M7 14l4-4 4 3 5-7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ),
    },
    {
      label: "Growth",
      value:
        growth === undefined
          ? "—"
          : `${growth > 0 ? "+" : growth < 0 ? `- ${Math.abs(growth)}` : growth}%`,
      valueClasses:
        growth === undefined || growth === 0
          ? undefined
          : growth > 0
            ? "text-emerald-600"
            : "text-red-600",
      icon: (
        <path
          d="M3 17 9 11l4 4 8-8m0 0h-5m5 0v5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ),
      note: (
        <p className="mt-2 text-xs text-gray-500">
          {growth === undefined
            ? "Not enough history to compare"
            : "Latest month vs. previous month"}
        </p>
      ),
    },
  ];

  return (
    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="group flex min-w-0 flex-col rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-gray-300 hover:shadow-md"
        >
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-medium text-gray-500">{card.label}</p>

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 text-gray-600">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-5 w-5"
                aria-hidden="true"
              >
                {card.icon}
              </svg>
            </div>
          </div>

          <p
            className={`mt-4 break-words text-3xl font-bold tracking-tight ${card.valueClasses ?? "text-[#202020]"}`}
          >
            {card.value}
          </p>

          {card.note}

          <div className="mt-auto pt-5">
            <div className="h-1 w-10 rounded-full bg-gray-200 transition-all duration-200 group-hover:w-16 group-hover:bg-gray-400" />
          </div>
        </div>
      ))}
    </div>
  );
};
