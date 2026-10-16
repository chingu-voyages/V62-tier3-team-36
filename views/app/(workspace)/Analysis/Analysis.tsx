"use client";

import Link from "next/link";

import { KPICard } from "./KPICard";
import { Barchart } from "./Barchart";
import { Piechart } from "./Piechart";

import { useUploadDetailStore } from "@/store/uploadDetailStore";

const Analysis = () => {
  const detail = useUploadDetailStore((state) => state.detail?.analysis);
  const uploadId = useUploadDetailStore((state) => state.detail?.upload_id);

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

      {/* KPI cards */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KPICard
          name="Total Customers"
          analysis={detail?.total_customers ?? 0}
        />

        <KPICard name="Total Units" analysis={detail?.total_units ?? 0} />

        <KPICard
          name="Profit Margin"
          analysis={`${detail?.profit_margin ?? 0}%`}
        />

        <KPICard
          name="Growth"
          analysis={`${
            detail?.growth != null && detail.growth < 0 ? "- " : ""
          }${Math.abs(detail?.growth ?? 0)}%`}
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
