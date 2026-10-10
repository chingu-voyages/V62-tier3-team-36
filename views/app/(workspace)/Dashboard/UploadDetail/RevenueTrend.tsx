import { RevenueByCategoryItem, RevenueByRegionItem,RevenueByProductItem } from "../types";

interface RevenueTrendProps {
  title: string;
  label: string;
  filteredRanking: RevenueByCategoryItem[] |  RevenueByProductItem[]  ;
  formatRevenue: (value?: number) => string;
}

export const RevenueTrend = ({
  title,
  label,
  filteredRanking,
  formatRevenue,
}: RevenueTrendProps) => {
  return (
    <div className="border border-[var(--gray-400)] bg-[var(--gray-200)] p-[14px]">
      <p className="text-[13px] font-extrabold">{title}</p>

      {filteredRanking.length > 0 ? (
        <div className="mt-3 overflow-x-auto">
          <div className="min-w-[360px] border border-[var(--gray-400)] bg-[var(--white)]">
            <div className="grid grid-cols-[1fr_90px_90px] gap-2 border-b border-[var(--gray-400)] bg-[var(--gray-300)] px-3 py-2 text-[12px] font-extrabold">
              <p>{label}</p>
              <p className="text-right">Revenue</p>
              <p className="text-right">Units</p>
            </div>

            {filteredRanking.map((item) =>
              (() => {
                const itemLabel =
                  "category" in item ? item.category : item.product;

                return (
                  <div
                    key={itemLabel}
                    className="grid grid-cols-[1fr_90px_90px] gap-2 border-b border-[var(--gray-400)] px-3 py-2 text-[12px]"
                  >
                    <p className="text-[var(--gray-700)]">{itemLabel}</p>
                    <p className="text-right text-[var(--gray-700)]">
                      {formatRevenue(item.revenue)}
                    </p>
                    <p className="text-right text-[var(--gray-700)]">
                      {item.units}
                    </p>
                  </div>
                );
              })(),
            )}
          </div>
        </div>
      ) : (
        <p className="mt-3 text-[12px] text-[var(--gray-600)]">
          No ranking data available.
        </p>
      )}
    </div>
  );
};
