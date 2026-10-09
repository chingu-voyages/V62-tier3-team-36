"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";

import { useUploadDetail } from "./hooks/useUploadDetail";
import { CustomTooltip } from "./CustomTooltip";
import { UploadDetailPageProps } from "./[uploadId]/page";
import { UploadDetailSkeleton } from "./UploadDetailSkeleton";
import { ErrorCSCModal } from "../Modals/ErrorCSCModal";

export const UploadDetailPage = ({ params }: UploadDetailPageProps) => {
  const router = useRouter();
  const {
    isLoading,
    error,
    detail,
    formatRevenue,
    trendChartData,
    productRanking,
    categoryRanking,
  } = useUploadDetail(params);

  if (isLoading) {
    return <UploadDetailSkeleton />;
  }

  if (error || !detail) {
    return <ErrorCSCModal onClose={() => router.push("/Dashboard")} />;
  }

  return (
    <div className="px-5 pb-10 pt-5 bg-[var(--white)]">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-lg font-bold">{detail.file_name}</p>
          <p className="text-sm text-[var(--gray-600)]">
            Upload ID: {detail.upload_id}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            className="border border-[var(--gray-700)] bg-[var(--gray-200)] px-4 py-2 text-sm font-bold"
          >
            Filters
          </button>
          <Link
            href="/Dashboard"
            className="border border-[var(--gray-700)] bg-[var(--gray-200)] px-4 py-2 text-sm font-bold"
          >
            Back
          </Link>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="border border-[var(--gray-400)] bg-[var(--gray-200)] p-3">
          <p className="text-[11px] text-[var(--gray-600)]">Revenue</p>
          <p className="mt-1 text-3xl font-bold leading-none">
            {formatRevenue(detail.analysis?.total_revenue)}
          </p>
        </div>
        <div className="border border-[var(--gray-400)] bg-[var(--gray-200)] p-3">
          <p className="text-[11px] text-[var(--gray-600)]">Transactions</p>
          <p className="mt-1 text-3xl font-bold leading-none">
            {detail.analysis?.total_orders}
          </p>
        </div>
        <div className="border border-[var(--gray-400)] bg-[var(--gray-200)] p-3">
          <p className="text-[11px] text-[var(--gray-600)]">Avg. order</p>
          <p className="mt-1 text-3xl font-bold leading-none">
            {formatRevenue(detail.analysis?.aov)}
          </p>
        </div>
      </div>

      <div className="mt-4 border border-[var(--gray-400)] bg-[var(--gray-200)] p-[14px]">
        <p className="text-[13px] font-extrabold">Revenue trend</p>

        <div className="mt-3 border border-[var(--gray-400)] bg-[var(--white)] p-3">
          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={trendChartData}
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

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="border border-[var(--gray-400)] bg-[var(--gray-200)] p-[14px]">
          <p className="text-[13px] font-extrabold">Top products by revenue</p>

          {productRanking.length > 0 ? (
            <div className="mt-3">
              <div className="min-w-[360px] border border-[var(--gray-400)] bg-[var(--white)]">
                <div className="grid grid-cols-[1fr_90px_90px] gap-2 border-b border-[var(--gray-400)] bg-[var(--gray-300)] px-3 py-2 text-[12px] font-extrabold">
                  <p>Product</p>
                  <p className="text-right">Revenue</p>
                  <p className="text-right">Units</p>
                </div>

                {productRanking.slice(0, 10).map((item) => (
                  <div
                    key={item.product}
                    className="grid grid-cols-[1fr_90px_90px] gap-2 border-b border-[var(--gray-400)] px-3 py-2 text-[12px]"
                  >
                    <p className="text-[var(--gray-700)]">{item.product}</p>
                    <p className="text-right text-[var(--gray-700)]">
                      {formatRevenue(item.revenue)}
                    </p>
                    <p className="text-right text-[var(--gray-700)]">
                      {item.units}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="mt-3 text-[12px] text-[var(--gray-600)]">
              No product ranking available.
            </p>
          )}
        </div>

        <div className="border border-[var(--gray-400)] bg-[var(--gray-200)] p-[14px]">
          <p className="text-[13px] font-extrabold">
            Top categories by revenue
          </p>

          {categoryRanking.length > 0 ? (
            <div className="mt-3 overflow-x-auto">
              <div className="min-w-[360px] border border-[var(--gray-400)] bg-[var(--white)]">
                <div className="grid grid-cols-[1fr_90px_90px] gap-2 border-b border-[var(--gray-400)] bg-[var(--gray-300)] px-3 py-2 text-[12px] font-extrabold">
                  <p>Category</p>
                  <p className="text-right">Revenue</p>
                  <p className="text-right">Units</p>
                </div>

                {categoryRanking.map((item) => (
                  <div
                    key={item.category}
                    className="grid grid-cols-[1fr_90px_90px] gap-2 border-b border-[var(--gray-400)] px-3 py-2 text-[12px]"
                  >
                    <p className="text-[var(--gray-700)]">{item.category}</p>
                    <p className="text-right text-[var(--gray-700)]">
                      {formatRevenue(item.revenue)}
                    </p>
                    <p className="text-right text-[var(--gray-700)]">
                      {item.units}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="mt-3 text-[12px] text-[var(--gray-600)]">
              No category ranking available.
            </p>
          )}
        </div>
      </div>

      <div className="mt-4 border border-[var(--gray-400)] bg-[var(--gray-200)]">
        <div className="grid grid-cols-[2fr_1fr_1.4fr_1fr] gap-2 border-b border-[var(--gray-400)] bg-[var(--gray-300)] px-[10px] py-[8px] font-extrabold">
          <p>Name</p>
          <p>Status</p>
          <p className="text-center">Updated</p>
          <p className="text-center">Rows</p>
        </div>

        <div className="grid grid-cols-[2fr_1fr_1.4fr_1fr] items-center gap-2 border-b border-[var(--gray-400)] px-[10px] py-2">
          <p className="text-[12px] text-[var(--gray-700)]">
            {detail.file_name}
          </p>
          <p className="inline-flex w-fit border border-[var(--gray-700)] bg-[var(--gray-200)] px-2 py-1 text-[11px]">
            {detail.status}
          </p>
          <p className="text-center text-[12px] text-[var(--gray-700)]">
            {detail.uploaded_at?.split("T")[0]}
          </p>
          <p className="text-center text-[12px] text-[var(--gray-700)]">
            {detail.valid_rows}
          </p>
        </div>

        {detail.row_errors?.length > 0 && (
          <div className="px-[10px] py-3">
            <p className="text-[12px] font-bold">Row errors</p>
            <ul className="mt-2 space-y-1 text-[12px] text-[var(--gray-700)]">
              {detail.row_errors.map((entry, index) => (
                <li key={`${entry.row}-${index}`}>
                  Row {entry.row}: {entry.error}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
