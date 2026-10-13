"use client";

import { useRouter } from "next/navigation";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";

import { useUploadDetail } from "../hooks/useUploadDetail";
import { CustomTooltip } from "../CustomTooltip";
import { UploadDetailPageProps } from "../[uploadId]/page";
import { UploadDetailSkeleton } from "./UploadDetailSkeleton";
import { ErrorCSCModal } from "../../Modals/ErrorCSCModal";
import { UploadDetailHeader } from "./UploadDetailHeader";
import { UploadFilters } from "./UploadFilters";
import { MetricsCards } from "./MetricsCards";
import { RevenueTrend } from "./RevenueTrend";
import { ActiveFilterChips } from "./ActiveFilterChips";
import { RankingTable } from "./RankingTable";
import { ErrorRow } from "./ErrorRow";
import { Piechart } from "../../Analysis/Piechart";

export const UploadDetailPage = ({ params }: UploadDetailPageProps) => {
  const router = useRouter();
  const {
    isLoading,
    error,
    detail,
    hasActiveFilters,
    activeFilterChips,
    revenueFilterMessage,
    regionOptions,
    categoryOptions,
    products,
    productOptions,
    periodOptions,
    isFiltersOpen,
    draftFilters,
    appliedFilters,
    filteredRegionRanking,
    filteredCategoryRanking,
    filteredTrendData,
    filteredMetrics,
    formatRevenue,
    handleClearFilters,
    setIsFiltersOpen,
    updateFilter,
    setDraftFilters,
  } = useUploadDetail(params);

  if (isLoading) {
    return <UploadDetailSkeleton />;
  }

  if (error || !detail) {
    return <ErrorCSCModal onClose={() => router.push("/Dashboard")} />;
  }

  return (
    <div className="px-5 pb-10 pt-5 bg-[var(--white)]">
      <UploadDetailHeader
        detail={detail}
        hasActiveFilters={hasActiveFilters}
        activeFilterChips={activeFilterChips}
        setIsFiltersOpen={setIsFiltersOpen}
      />
      <ActiveFilterChips
        activeFilterChips={activeFilterChips}
        handleClearFilters={handleClearFilters}
      />
      <UploadFilters
        regionOptions={regionOptions}
        categoryOptions={categoryOptions}
        periodOptions={periodOptions}
        isFiltersOpen={isFiltersOpen}
        draftFilters={draftFilters}
        appliedFilters={appliedFilters}
        handleClearFilters={handleClearFilters}
        setIsFiltersOpen={setIsFiltersOpen}
        updateFilter={updateFilter}
        setDraftFilters={setDraftFilters}
        products={products}
        productOptions={productOptions}
      />

      {detail.analysis ? (
        <MetricsCards
          hasActiveFilters={hasActiveFilters}
          revenueFilterMessage={revenueFilterMessage}
          filteredMetrics={filteredMetrics}
          formatRevenue={formatRevenue}
        />
      ) : (
        <p className="mt-4 rounded-2xl border border-gray-200/80 bg-white p-5 text-sm text-gray-500 shadow-sm">
          No analytics are available for this upload yet.
        </p>
      )}

      <div className="mt-4">
        <RankingTable detail={detail} />
        <ErrorRow detail={detail} />
      </div>
      <div className="my-4 rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm transition-shadow duration-200 hover:shadow-md">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold tracking-tight text-[#202020]">
              Revenue trend
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Revenue across the selected period
            </p>
          </div>

          <span className="shrink-0 rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-500">
            {filteredTrendData.length} periods
          </span>
        </div>

        <div className="mt-5 rounded-xl border border-gray-100 bg-gray-50/50 p-3 sm:p-4">
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={filteredTrendData}
                margin={{ top: 12, right: 8, left: 8, bottom: 4 }}
                barCategoryGap="25%"
              >
                <CartesianGrid
                  stroke="#E5E7EB"
                  strokeDasharray="4 4"
                  vertical={false}
                />

                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#6B7280", fontSize: 12 }}
                  tickMargin={12}
                />

                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: "#F3F4F6" }}
                />

                <Bar
                  dataKey="revenue"
                  name="Revenue"
                  fill="#6B7280"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={48}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {filteredRegionRanking.length > 0 ? (
        <Piechart
          data={filteredRegionRanking}
          dataKey="revenue"
          nameKey="region"
          title="Pie Chart Group By Region"
          description="See how each region contributes to the total revenue."
        />
      ) : null}
      <div className="mt-4 flex flex-col gap-4">
        <RevenueTrend
          label="Category"
          title=" Top categories by revenue"
          filteredRanking={filteredCategoryRanking}
          formatRevenue={formatRevenue}
        />
        {products ? (
          <RevenueTrend
            label="Product"
            title="Top Product by revenue"
            filteredRanking={products}
            formatRevenue={formatRevenue}
          />
        ) : null}
      </div>
    </div>
  );
};
