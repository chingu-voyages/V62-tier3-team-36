import { Dispatch, SetStateAction } from "react";

import Link from "next/link";

import type { UploadDetail } from "../types";

interface UploadDetailHeaderProps {
  detail: UploadDetail;
  hasActiveFilters: boolean;
  activeFilterChips: string[];
  setIsFiltersOpen: Dispatch<SetStateAction<boolean>>;
}

export const UploadDetailHeader = ({
  detail,
  hasActiveFilters,
  activeFilterChips,
  setIsFiltersOpen,
}: UploadDetailHeaderProps) => {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-lg font-bold">{detail?.file_name}</p>
        <p className="text-sm text-[var(--gray-600)]">
          Upload ID: {detail?.upload_id}
        </p>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setIsFiltersOpen((value) => !value)}
          className="border border-[var(--gray-700)] bg-[var(--gray-200)] px-4 py-2 text-sm font-bold"
        >
          Filters {hasActiveFilters ? `(${activeFilterChips.length})` : ""}
        </button>
        <Link
          href="/Dashboard"
          className="border border-[var(--gray-700)] bg-[var(--gray-200)] px-4 py-2 text-sm font-bold"
        >
          Back
        </Link>
      </div>
    </div>
  );
};
