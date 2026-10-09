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
      />

      <MetricsCards
        hasActiveFilters={hasActiveFilters}
        revenueFilterMessage={revenueFilterMessage}
        filteredMetrics={filteredMetrics}
        formatRevenue={formatRevenue}
      />

      <div className="mt-4 border border-[var(--gray-400)] bg-[var(--gray-200)] p-[14px]">
        <p className="text-[13px] font-extrabold">Revenue trend</p>

        <div className="mt-3 border border-[var(--gray-400)] bg-[var(--white)] p-3">
          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={filteredTrendData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="revenue"
                  name="Revenue"
                  fill="var(--gray-500)"
                  radius={[2, 2, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-4">
        <RevenueTrend
          label="Category"
          title=" Top categories by revenue"
          filteredRanking={filteredCategoryRanking}
          formatRevenue={formatRevenue}
        />
        <RevenueTrend
          label="Region"
          title="Top regions by revenue"
          filteredRanking={filteredRegionRanking}
          formatRevenue={formatRevenue}
        />
      </div>

      <div className="mt-4 border border-[var(--gray-400)] bg-[var(--gray-200)]">
        <RankingTable detail={detail} />
        <ErrorRow detail={detail} />
      </div>
    </div>
  );
};
