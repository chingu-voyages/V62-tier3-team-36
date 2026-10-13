import { Dispatch, SetStateAction } from "react";

import Link from "next/link";

import type { UploadDetail } from "../types";

interface UploadDetailHeaderProps {
  detail: UploadDetail;
  hasActiveFilters: boolean;
  activeFilterChips: string[];
  setIsFiltersOpen: Dispatch<SetStateAction<boolean>>;
  onExport: () => void;
}

const buttonBaseClasses =
  "inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-xl border px-4 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2";

export const UploadDetailHeader = ({
  detail,
  hasActiveFilters,
  activeFilterChips,
  setIsFiltersOpen,
  onExport,
}: UploadDetailHeaderProps) => {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="truncate text-lg font-bold tracking-tight text-[#202020]">
          {detail.file_name}
        </p>

        <p className="mt-1 text-sm text-gray-500">
          Upload ID: {detail.upload_id}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setIsFiltersOpen((value) => !value)}
          className={`${buttonBaseClasses} border-gray-200 bg-white text-gray-700 shadow-sm hover:border-gray-300 hover:bg-gray-50`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 7h16M7 12h10m-7 5h4" />
          </svg>
          Filters
          {hasActiveFilters && (
            <span className="inline-flex min-w-5 items-center justify-center rounded-md bg-gray-100 px-1.5 py-0.5 text-xs font-semibold text-gray-700">
              {activeFilterChips.length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={onExport}
          disabled={!detail.analysis}
          className={`${buttonBaseClasses} border-gray-200 bg-white text-gray-700 shadow-sm hover:border-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 4v11m0 0-4-4m4 4 4-4M5 20h14" />
          </svg>
          Export
        </button>

        <Link
          href="/Dashboard"
          className={`${buttonBaseClasses} border-gray-200 bg-white text-gray-700 shadow-sm hover:border-gray-300 hover:bg-gray-50`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
          Back
        </Link>

        <Link
          href={`/Analysis/${detail.upload_id}`}
          className={`${buttonBaseClasses} border-[#222222] bg-[#222222] text-white shadow-sm hover:-translate-y-0.5 hover:bg-gray-700 hover:shadow-md`}
        >
          Go to detailed Analysis
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M7 17 17 7M7 7h10v10" />
          </svg>
        </Link>
      </div>
    </div>
  );
};
