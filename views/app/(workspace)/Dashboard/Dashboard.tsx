"use client";

import Link from "next/link";

import { DashboardSkeleton } from "./DashboardSkeleton";
import { useDashboard } from "./hooks/useDashboard";
import { EmptyDashboard } from "./EmptyDashboard";

const metrics = ["Total revenue", "Transactions", "Avg. order"];

export const Dashboard = () => {
  const { isLoading, uploadedFiles } = useDashboard();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (uploadedFiles.length === 0) {
    return <EmptyDashboard />;
  }

  return (
    <div className="border-t border-[var(--gray-600)] px-5 pb-10 pt-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col">
          <p className="text-lg font-bold">Upload your CSV file</p>

          <p className="text-sm font-light text-[var(--gray-600)]">
            Upload a CSV file to explore, analyze from your data.
          </p>
        </div>

        <Link
          href="/UploadCSV"
          className="flex h-10 w-full items-center justify-center border-[1.6px] border-[var(--gray-700)] bg-[var(--gray-200)] px-4 text-sm font-bold  transition hover:bg-[var(--gray-300)] sm:w-auto"
        >
          Upload CSV
        </Link>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {metrics.map((label) => (
          <div
            key={label}
            className="border border-[var(--gray-400)] bg-[var(--gray-200)] p-3"
          >
            <p className="text-[11px] text-[var(--gray-600)]">{label}</p>

            <p className="mt-1 text-xl font-bold leading-none">
              {label !== "Transactions" ? "$—" : "—"}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-[14px] border-[0.8px] border-[var(--gray-400)] p-[14px]">
        <p className="text-[13px] font-extrabold">Workspace overview</p>

        <div className="mt-3 overflow-x-auto">
          <div className="min-w-[420px] border-[0.8px] border-[var(--gray-400)] bg-[var(--gray-200)]">
            <div className="grid grid-cols-[2fr_1fr_1.4fr_1fr] gap-2 border-b border-[var(--gray-400)] bg-[var(--gray-300)] px-[10px] py-[6px] font-extrabold">
              <p>Name</p>
              <p>Status</p>
              <p className="text-center">Uploaded</p>
              <p className="text-center">Rows</p>
            </div>

            {uploadedFiles.map((file) => (
              <Link
                key={file.upload_id}
                href={`/Dashboard/${file.upload_id}`}
                className="grid cursor-pointer grid-cols-[2fr_1fr_1.4fr_1fr] items-center gap-2 border border-[var(--gray-400)] bg-[var(--white)] px-[10px] py-2 transition hover:border-[var(--gray-600)] hover:bg-[var(--gray-100)]"
              >
                <p className="text-[12px] text-[var(--gray-700)]">
                  {file.file_name}
                </p>

                <p className="inline-flex w-fit border border-[var(--gray-700)] bg-[var(--gray-200)] px-2 py-1 text-[11px]">
                  {file.status}
                </p>

                <p className="text-center text-[12px] text-[var(--gray-700)]">
                  {file.uploaded_at?.split("T")[0]}
                </p>
                <p className="text-center text-[12px] text-[var(--gray-700)]">
                  {file.valid_rows}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
