"use client";

import { useEffect, useState } from "react";

import { get_upload_csv } from "@/api/analysis";

import type { UploadDetail } from "../types";

const ALL_PERIODS = "All periods";
const ALL_CATEGORIES = "All categories";
const ALL_REGIONS = "All regions";

type FilterState = {
  period: string;
  category: string;
  region: string;
};

const DEFAULT_FILTERS: FilterState = {
  period: ALL_PERIODS,
  category: ALL_CATEGORIES,
  region: ALL_REGIONS,
};

export const useUploadDetail = (params: Promise<{ uploadId: string }>) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [detail, setDetail] = useState<UploadDetail | null>(null);

  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [draftFilters, setDraftFilters] =
    useState<FilterState>(DEFAULT_FILTERS);
  const [appliedFilters, setAppliedFilters] =
    useState<FilterState>(DEFAULT_FILTERS);

  useEffect(() => {
    let cancelled = false;

    const loadUpload = async () => {
      try {
        const { uploadId } = await params;
        const response = await get_upload_csv(uploadId);

        if (!cancelled) {
          setDetail(response.data as UploadDetail);
        }
      } catch {
        if (!cancelled) {
          setError("Could not load upload details.");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    loadUpload();

    return () => {
      cancelled = true;
    };
  }, [params]);

  const analysis = detail?.analysis;

  const trend = analysis?.revenue_trend ?? [];
  const categoryRanking = analysis?.revenue_by_category ?? [];
  const regionRanking = analysis?.revenue_by_region ?? [];

  const trendChartData = trend.map((item) => ({
    name: item.month,
    revenue: item.revenue,
  }));

  const categoryOptions = [
    ALL_CATEGORIES,
    ...categoryRanking.map((item) => item.category),
  ];

  const regionOptions = [
    ALL_REGIONS,
    ...regionRanking.map((item) => item.region),
  ];

  const periodOptions = [ALL_PERIODS, ...trend.map((item) => item.month)];

  const updateFilter = (field: keyof FilterState, value: string) => {
    setDraftFilters((prev) => ({ ...prev, [field]: value }));
    setAppliedFilters((prev) => ({ ...prev, [field]: value }));
  };

  const activeFilterChips = [
    ...(appliedFilters.period !== ALL_PERIODS
      ? [`Period: ${appliedFilters.period}`]
      : []),
    ...(appliedFilters.category !== ALL_CATEGORIES
      ? [`Category: ${appliedFilters.category}`]
      : []),
    ...(appliedFilters.region !== ALL_REGIONS
      ? [`Region: ${appliedFilters.region}`]
      : []),
  ];

  const hasActiveFilters = activeFilterChips.length > 0;

  const revenueFromCategory =
    appliedFilters.category !== ALL_CATEGORIES
      ? categoryRanking.find(
          (item) => item.category === appliedFilters.category,
        )?.revenue
      : undefined;

  const revenueFromRegion =
    appliedFilters.region !== ALL_REGIONS
      ? regionRanking.find((item) => item.region === appliedFilters.region)
          ?.revenue
      : undefined;

  const revenueFromPeriod =
    appliedFilters.period !== ALL_PERIODS
      ? trendChartData.find((item) => item.name === appliedFilters.period)
          ?.revenue
      : undefined;

  const filteredMetrics = {
    totalRevenue:
      revenueFromCategory ??
      revenueFromRegion ??
      revenueFromPeriod ??
      analysis?.total_revenue,
    totalOrders: analysis?.total_orders,
    averageOrderValue: analysis?.aov,
  };

  const filteredTrendData =
    appliedFilters.period === ALL_PERIODS
      ? trendChartData
      : trendChartData.filter((item) => item.name === appliedFilters.period);

  const filteredCategoryRanking =
    appliedFilters.category === ALL_CATEGORIES
      ? categoryRanking
      : categoryRanking.filter(
          (item) => item.category === appliedFilters.category,
        );

  const filteredRegionRanking =
    appliedFilters.region === ALL_REGIONS
      ? regionRanking
      : regionRanking.filter((item) => item.region === appliedFilters.region);

  const revenueFilterMessage = !hasActiveFilters
    ? {
        tone: "neutral",
        title: "Revenue without filters",
        body: "Revenue shows total value for the entire upload.",
      }
    : {
        tone: "warning",
        title: "Limited filter mode",
        body: "Revenue is based on available aggregates for selected filters and may not represent an exact intersection.",
      };

  const formatRevenue = (value?: number) => {
    if (value === undefined) return "—";
    return value >= 1000 ? `$${value / 1000}K` : `$${value}`;
  };

  const handleClearFilters = () => {
    setDraftFilters(DEFAULT_FILTERS);
    setAppliedFilters(DEFAULT_FILTERS);
  };

  return {
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
  };
};
