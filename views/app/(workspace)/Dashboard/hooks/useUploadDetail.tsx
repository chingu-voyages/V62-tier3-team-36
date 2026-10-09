"use client";

import { useState, useEffect } from "react";

import { get_upload_csv } from "@/api/analysis";

import type { UploadDetail } from "../types";

export const useUploadDetail = (params: Promise<{ uploadId: string }>) => {
  const [uploadId, setUploadId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [detail, setDetail] = useState<UploadDetail | null>(null);

  useEffect(() => {
    const loadUpload = async () => {
      const resolvedParams = await params;
      setUploadId(resolvedParams.uploadId);

      try {
        const response = await get_upload_csv(resolvedParams.uploadId);
        setDetail(response.data as UploadDetail);
      } catch {
        setError("Could not load upload details.");
      } finally {
        setIsLoading(false);
      }
    };

    loadUpload();
  }, [params]);

  const formatRevenue = (value?: number) => {
    if (value === undefined) return "—";

    return value >= 1000 ? `$${value / 1000}K` : `$${value}`;
  };

  const trend = detail?.analysis?.revenue_trend ?? [];
  const productRanking = detail?.analysis?.top_products ?? [];
  const categoryRanking = detail?.analysis?.revenue_by_category ?? [];
  const trendChartData =
    trend.length > 0
      ? trend.map((item) => ({ name: item.month, revenue: item.revenue }))
      : [
          { name: "-", revenue: 0 },
          { name: "-", revenue: 0 },
          { name: "-", revenue: 0 },
          { name: "-", revenue: 0 },
          { name: "-", revenue: 0 },
          { name: "-", revenue: 0 },
        ];
  return {
    uploadId,
    isLoading,
    error,
    detail,
    formatRevenue,
    trendChartData,
    productRanking,
    categoryRanking,
  };
};
