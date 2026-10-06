"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import { NoDataModal } from "../Modals/NoDataModal";
import { get_list_csv } from "@/api/analysis";

type UploadedFile = {
  id: string;
  file_name: string;
  status: string;
  uploaded_at: string;
  invalid_rows: number;
};

const DashboardSkeleton = () => (
  <div className="px-5 pb-10 pt-5 bg-[var(--white)]">
    <div className="flex animate-pulse flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-[var(--white)]">
      <div className="space-y-2">
        <div className="h-5 w-44  bg-[var(--gray-500)]" />
        <div className="h-4 w-60  bg-[var(--gray-500)]" />
      </div>
      <div className="h-10 w-full bg-[var(--gray-500)] sm:w-[180px]" />
    </div>

    <div className="mt-6 grid gap-3 sm:grid-cols-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="h-20 animate-pulse  bg-[var(--gray-400)]" />
      ))}
    </div>

    <div className="mt-6 h-52 animate-pulse bg-[var(--gray-400)]" />
  </div>
);

const Page = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const loadFiles = async () => {
      try {
        const response = await get_list_csv();
        const files = response.data.uploads;

        setUploadedFiles(files);
        setIsModalOpen(files.length === 0);
      } catch (error) {
        console.error("Failed to load uploaded files:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFiles();
  }, []);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (uploadedFiles.length === 0) {
    return (
      <div className="relative flex min-h-full flex-1 flex-col px-5 pb-10 pt-5 bg-[var(--white)]">
        <div className="flex w-full items-center justify-between gap-3">
          <div>
            <p className="text-lg font-bold">Upload your CSV</p>
            <p className="text-sm font-medium text-[var(--gray-600)]">
              You can upload your CSV here and start analyzing your data.
            </p>
          </div>

          <Link
            href="/UploadCSV"
            className="flex h-10 items-center justify-center border-[1.6px] border-[var(--gray-700)] bg-[var(--gray-200)] px-4 text-sm font-bold transition hover:bg-[var(--gray-300)]"
          >
            Upload CSV
          </Link>
        </div>

        {isModalOpen && <NoDataModal onClose={() => setIsModalOpen(false)} />}
      </div>
    );
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
        {["Total revenue", "Transactions", "Avg. order"].map((label) => (
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

            {uploadedFiles && uploadedFiles.length > 0 ? (
              uploadedFiles.map((file, index) => (
                <div
                  key={file.id || `${file.file_name}-${index}`}
                  className="grid grid-cols-[2fr_1fr_1.4fr_1fr] items-center gap-2 border border-[var(--gray-400)] px-[10px] py-2"
                >
                  <p className="text-[12px] text-[var(--gray-700)]">
                    {file?.file_name}
                  </p>

                  <p className="inline-flex w-fit border border-[var(--gray-700)] bg-[var(--gray-200)] px-2 py-1 text-[11px]">
                    {file.status}
                  </p>

                  <p className="text-center text-[12px] text-[var(--gray-700)]">
                    {file?.uploaded_at?.split("T")[0]}
                  </p>
                  <p className="text-center text-[12px] text-[var(--gray-700)]">
                    {file.invalid_rows}
                  </p>
                </div>
              ))
            ) : (
              <p className="p-3 text-[12px] text-[var(--gray-700)]">
                No files uploaded
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
