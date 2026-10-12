"use client";

import Link from "next/link";

import { DashboardSkeleton } from "./DashboardSkeleton";
import { useDashboard } from "./hooks/useDashboard";
import { EmptyDashboard } from "./EmptyDashboard";
import { NoDataModal } from "../Modals/NoDataModal";

const getStatusClasses = (status: string) => {
  const normalizedStatus = status.toLowerCase();

  if (["completed", "success"].includes(normalizedStatus)) {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (["failed", "error"].includes(normalizedStatus)) {
    return "border-red-200 bg-red-50 text-red-700";
  }

  if (["processing", "pending"].includes(normalizedStatus)) {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }

  return "border-gray-200 bg-gray-100 text-gray-600";
};

export const Dashboard = () => {
  const { isLoading, uploadedFiles } = useDashboard();

  if (isLoading) {
    return <DashboardSkeleton />;
  }
  if (uploadedFiles.length === 0) {
    return (
      <>
        <EmptyDashboard /> <NoDataModal />
      </>
    );
  }

  return (
    <div className="border-t border-gray-200 px-5 pb-10 pt-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-xl font-bold tracking-tight">Your workspace</h1>

          <p className="mt-1 text-sm leading-5 text-gray-500">
            Upload and manage your datasets to explore your retail performance.
          </p>
        </div>

        <Link
          href="/UploadCSV"
          className="inline-flex h-10 w-full shrink-0 items-center justify-center gap-2 rounded-xl border border-[#222222] bg-[#222222] px-4 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-gray-700 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 sm:w-auto"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <path d="m17 8-5-5-5 5" />
            <path d="M12 3v12" />
          </svg>
          Upload CSV
        </Link>
      </div>

      {/* Workspace Overview */}
      <section className="mt-6 overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm">
        <div className="flex flex-col gap-1 border-b border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-semibold tracking-tight text-[#202020]">
              Workspace overview
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              View and manage your uploaded datasets.
            </p>
          </div>

          <span className="mt-2 w-fit rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600 sm:mt-0">
            {uploadedFiles.length}{" "}
            {uploadedFiles.length === 1 ? "dataset" : "datasets"}
          </span>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[540px]">
            {/* Table Header */}
            <div className="grid grid-cols-[2fr_1fr_1.4fr_0.7fr] gap-3 border-b border-gray-200 bg-gray-50 px-5 py-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Name
              </p>

              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Status
              </p>

              <p className="text-center text-xs font-semibold uppercase tracking-wide text-gray-500">
                Uploaded
              </p>

              <p className="text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                Rows
              </p>
            </div>

            {/* Uploaded Files */}
            <div className="divide-y divide-gray-100">
              {uploadedFiles.map((file) => (
                <Link
                  key={file.upload_id}
                  href={`/Dashboard/${file.upload_id}`}
                  className="group grid grid-cols-[2fr_1fr_1.4fr_0.7fr] items-center gap-3 px-5 py-4 transition-colors duration-150 hover:bg-gray-50 focus-visible:bg-gray-50 focus-visible:outline-none"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-500 transition-colors group-hover:bg-gray-200">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <path d="M14 2v6h6" />
                        <path d="M8 13h8" />
                        <path d="M8 17h8" />
                      </svg>
                    </div>

                    <p
                      title={file.file_name}
                      className="truncate text-sm font-medium text-gray-700"
                    >
                      {file.file_name}
                    </p>
                  </div>

                  <div>
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${getStatusClasses(file.status)}`}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      {file.status}
                    </span>
                  </div>

                  <p className="text-center text-sm tabular-nums text-gray-500">
                    {file.uploaded_at?.split("T")[0] ?? "—"}
                  </p>

                  <p className="text-right text-sm font-semibold tabular-nums text-[#202020]">
                    {file.valid_rows ?? "—"}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
