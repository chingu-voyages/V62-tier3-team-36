import Link from "next/link";

import { NoDataModal } from "../Modals/NoDataModal";
import { useDashboard } from "./hooks/useDashboard";

export const EmptyDashboard = () => {
  const { isModalOpen, setIsModalOpen } = useDashboard();

  return (
    <div className="flex min-h-full flex-1 flex-col border-t border-gray-200 bg-white px-5 pb-10 pt-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-xl font-bold tracking-tight text-gray-900">
            Upload your CSV
          </h1>

          <p className="mt-1 text-sm leading-5 text-gray-500">
            Upload a dataset to start exploring your retail performance.
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

      {/* Empty State */}
      <section className="mt-8 flex flex-1 items-center justify-center">
        <div className="w-full max-w-lg rounded-2xl border border-gray-200/80 bg-white px-6 py-12 text-center shadow-sm sm:px-10">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <path d="M14 2v6h6" />
              <path d="M8 13h8" />
              <path d="M8 17h5" />
            </svg>
          </div>

          <h2 className="mt-5 text-lg font-semibold tracking-tight text-gray-900">
            No datasets yet
          </h2>

          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-500">
            Upload your first CSV file to view your data, track revenue, and
            discover insights about your retail performance.
          </p>

          <Link
            href="/UploadCSV"
            className="mt-6 inline-flex h-10 items-center justify-center rounded-xl bg-[#222222] px-5 text-sm font-medium text-white transition-colors hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2"
          >
            Upload your first CSV
          </Link>
        </div>
      </section>

      {isModalOpen && <NoDataModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};
