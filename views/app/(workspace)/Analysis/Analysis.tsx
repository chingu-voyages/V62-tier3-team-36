"use client";

import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import Link from "next/link";

import {
  generate_upload_insights,
  get_upload_csv,
  regenerate_upload_insights,
  type AIInsight,
} from "@/api/analysis";
import type { UploadDetail } from "@/app/(workspace)/Dashboard/types";
import { KPICard } from "./KPICard";
import { Barchart } from "./Barchart";
import { Piechart } from "./Piechart";

interface AnalysisProps {
  uploadId: string;
}

const Analysis = ({ uploadId }: AnalysisProps) => {
  const [upload, setUpload] = useState<UploadDetail | null>(null);
  const [isLoadingUpload, setIsLoadingUpload] = useState(true);
  const [uploadError, setUploadError] = useState("");
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [insightError, setInsightError] = useState("");
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);
  const [hasGeneratedInsights, setHasGeneratedInsights] = useState(false);
  const [insightLoadingMessage, setInsightLoadingMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadUploadAnalysis = async () => {
      setIsLoadingUpload(true);
      setUploadError("");
      setUpload(null);
      setInsights([]);
      setInsightError("");
      setIsLoadingInsights(false);
      setHasGeneratedInsights(false);
      setInsightLoadingMessage("");

      try {
        const response = await get_upload_csv(uploadId);
        if (!cancelled) {
          setUpload(response.data);
        }
      } catch (error: unknown) {
        if (!cancelled) {
          setUploadError(getUploadErrorMessage(error));
        }
      } finally {
        if (!cancelled) {
          setIsLoadingUpload(false);
        }
      }
    };

    loadUploadAnalysis();

    return () => {
      cancelled = true;
    };
  }, [uploadId]);

  const detail = upload?.analysis;

  const generateInsights = async () => {
    setIsLoadingInsights(true);
    setInsightLoadingMessage(
      "Analyzing your data. This may take a few moments...",
    );
    setInsightError("");
    setInsights([]);
    setHasGeneratedInsights(false);

    try {
      const response = hasGeneratedInsights
        ? await regenerate_upload_insights(uploadId)
        : await generate_upload_insights(uploadId);
      setInsights(response.data);
      setHasGeneratedInsights(true);
    } catch (error: unknown) {
      setInsightError(getInsightErrorMessage(error));
    } finally {
      setIsLoadingInsights(false);
      setInsightLoadingMessage("");
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-7xl min-w-0 flex-col gap-6 px-4 py-5 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#202020]">
            Your Data Analysis
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Explore your retail performance and customer insights.
          </p>
        </div>

        <Link
          href={`/Dashboard/${uploadId}`}
          className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          Back
        </Link>
      </div>

      {isLoadingUpload ? (
        <p
          role="status"
          className="rounded-xl bg-white p-4 text-sm text-gray-500"
        >
          Loading analysis...
        </p>
      ) : uploadError ? (
        <p
          role="alert"
          className="rounded-xl bg-red-50 p-4 text-sm text-red-700"
        >
          {uploadError}
        </p>
      ) : !detail ? (
        <p className="rounded-xl bg-white p-4 text-sm text-gray-500">
          No analysis data is available for this upload.
        </p>
      ) : null}

      <section
        aria-labelledby="ai-insights-heading"
        className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3
              id="ai-insights-heading"
              className="text-base font-semibold tracking-tight text-[#202020]"
            >
              AI insights
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Get actionable recommendations based on this upload and your
              analysis history.
            </p>
          </div>
          <button
            type="button"
            onClick={generateInsights}
            disabled={isLoadingInsights || isLoadingUpload || !detail}
            className="inline-flex h-10 shrink-0 items-center justify-center rounded-xl bg-[#222222] px-4 text-sm font-medium text-white transition hover:bg-gray-700 disabled:cursor-wait disabled:opacity-60"
          >
            {isLoadingInsights
              ? insightLoadingMessage || "Loading insights..."
              : hasGeneratedInsights
                ? "Regenerate insights"
                : "Generate AI insights"}
          </button>
        </div>

        {isLoadingInsights ? (
          <p role="status" className="mt-5 text-sm text-gray-500">
            {insightLoadingMessage}
          </p>
        ) : insightError ? (
          <p role="alert" className="mt-5 text-sm text-red-700">
            {insightError}
          </p>
        ) : insights.length > 0 ? (
          <ul className="mt-5 grid gap-4 md:grid-cols-2">
            {insights.map((insight, index) => (
              <li
                key={`${insight.type}-${insight.title}-${index}`}
                className="rounded-xl border border-gray-100 bg-gray-50/70 p-4"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  {insight.type}
                </p>
                <h4 className="mt-1 font-semibold text-[#202020]">
                  {insight.title}
                </h4>
                <p className="mt-2 text-sm leading-6 text-gray-600">
                  {insight.description}
                </p>
                <p className="mt-3 text-sm leading-6 text-gray-700">
                  <span className="font-semibold">Recommendation: </span>
                  {insight.recommendation}
                </p>
              </li>
            ))}
          </ul>
        ) : hasGeneratedInsights ? (
          <p className="mt-5 text-sm text-gray-500">
            No actionable insights were returned for this upload.
          </p>
        ) : (
          <p className="mt-5 text-sm text-gray-500">
            Select &quot;Generate AI insights&quot; to see findings and
            recommendations.
          </p>
        )}
      </section>

      {/* KPI cards */}
      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <KPICard
          name="Total Customers"
          analysis={detail ? (detail.total_customers ?? 0) : "—"}
        />

        <KPICard
          name="Total Units"
          analysis={detail ? (detail.total_units ?? 0) : "—"}
        />

        <KPICard
          name="Profit Margin"
          analysis={
            detail?.profit_margin == null ? "—" : `${detail.profit_margin}%`
          }
        />
      </section>

      {/* Charts */}

      <div className="flex flex-col gap-6">
        <Barchart
          title="Revenue by Category"
          description="Compare revenue across product categories."
          data={detail?.revenue_by_category ?? []}
          dataKey="category"
          barDataKey="revenue"
          layout="horizontal"
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Piechart
            title="Revenue by Customer Segment"
            description="See how each segment contributes to total revenue."
            data={detail?.revenue_by_segment ?? []}
            dataKey="revenue"
            nameKey="customer_segment"
          />

          <Barchart
            title="Revenue by Region"
            description="Identify your strongest-performing regions."
            data={detail?.revenue_by_region ?? []}
            dataKey="region"
            barDataKey="revenue"
            layout="horizontal"
          />
        </div>
        <Barchart
          title="Top Products by Revenue"
          description="Discover your best-performing products."
          data={detail?.top_products ?? []}
          dataKey="product"
          barDataKey="revenue"
          layout="horizontal"
        />

        <Barchart
          title="Top Customers by Revenue"
          description="Rank customers by generated revenue."
          data={detail?.top_customers ?? []}
          dataKey="customer_id"
          barDataKey="revenue"
          layout="horizontal"
        />
      </div>
    </div>
  );
};

export default Analysis;

const getUploadErrorMessage = (error: unknown) => {
  if (error instanceof AxiosError) {
    const responseData: unknown = error.response?.data;
    if (
      typeof responseData === "object" &&
      responseData !== null &&
      "error" in responseData &&
      typeof responseData.error === "string"
    ) {
      return responseData.error;
    }
  }

  return "Could not load analysis data. Please try again.";
};

const getInsightErrorMessage = (error: unknown) => {
  if (error instanceof AxiosError) {
    const responseData: unknown = error.response?.data;
    if (
      typeof responseData === "object" &&
      responseData !== null &&
      "error" in responseData &&
      typeof responseData.error === "string"
    ) {
      return responseData.error;
    }
  }

  return "Could not load AI insights. Please try again.";
};
