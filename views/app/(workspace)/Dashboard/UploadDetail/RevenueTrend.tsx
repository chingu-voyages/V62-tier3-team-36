import type { RevenueByCategoryItem, RevenueByProductItem } from "../types";

interface RevenueTrendProps {
  title: string;
  label: string;
  filteredRanking: RevenueByCategoryItem[] | RevenueByProductItem[];
  formatRevenue: (value?: number) => string;
}

export const RevenueTrend = ({
  title,
  label,
  filteredRanking,
  formatRevenue,
}: RevenueTrendProps) => {
  return (
    <div className="min-w-0 rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm transition-shadow duration-200 hover:shadow-md">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-base font-semibold tracking-tight text-[#202020]">
          {title}
        </h3>

        <span className="shrink-0 rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-500">
          {filteredRanking.length} items
        </span>
      </div>

      {filteredRanking.length > 0 ? (
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[360px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th
                  scope="col"
                  className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
                >
                  {label}
                </th>
                <th
                  scope="col"
                  className="px-3 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500"
                >
                  Revenue
                </th>
                <th
                  scope="col"
                  className="px-3 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500"
                >
                  Units
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredRanking.map((item, index) => {
                const itemLabel =
                  "category" in item ? item.category : item.product;

                return (
                  <tr
                    key={itemLabel}
                    className="transition-colors duration-150 hover:bg-gray-50"
                  >
                    <td className="px-3 py-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-xs font-semibold text-gray-500">
                          {index + 1}
                        </span>

                        <span className="truncate font-medium text-gray-700">
                          {itemLabel}
                        </span>
                      </div>
                    </td>

                    <td className="whitespace-nowrap px-3 py-3 text-right font-semibold tabular-nums text-[#202020]">
                      {formatRevenue(item.revenue)}
                    </td>

                    <td className="whitespace-nowrap px-3 py-3 text-right tabular-nums text-gray-500">
                      {item.units}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="mt-5 flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-10 text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mb-3 text-gray-400"
            aria-hidden="true"
          >
            <path d="M3 3v18h18" />
            <path d="m19 9-5 5-4-4-3 3" />
          </svg>

          <p className="text-sm font-medium text-gray-600">
            No ranking data available
          </p>

          <p className="mt-1 text-xs text-gray-400">
            Try changing your filters or upload another dataset.
          </p>
        </div>
      )}
    </div>
  );
};
