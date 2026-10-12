"use client";

import Link from "next/link";

import { useUploadCSV } from "./hooks/useUploadCSV";
import { ErrorUploadFileModal } from "../Modals/UploadFileErrorModal";

export const UploadCSVPage = () => {
  const {
    isModalOpen,
    setIsModalOpen,
    handleChooseFile,
    handleFileChange,
    fileInputRef,
    csvFile,
    fileSize,
    fileName,
    error,
    isUploading,
  } = useUploadCSV();

  return (
    <div className="min-h-full border-t border-gray-200 px-5 pb-10 pt-6">
      <div className="mx-auto w-full max-w-5xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[#202020]">
              Upload your CSV file
            </h1>

            <p className="mt-1 text-sm leading-5 text-gray-500">
              Upload your dataset to explore and analyze your retail
              performance.
            </p>
          </div>

          <Link
            href="/Dashboard"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 shadow-sm transition-all duration-200 hover:border-gray-300 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2"
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
              <path d="M3 3v18h18" />
              <path d="m19 9-5 5-4-4-3 3" />
            </svg>
            Upload history
          </Link>
        </div>

        {/* Upload Card */}
        <section className="mt-6 rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm sm:p-6">
          <div className="mb-5">
            <h2 className="text-base font-semibold text-[#202020]">
              Import your dataset
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Select a CSV file from your device to get started.
            </p>
          </div>

          {isModalOpen && (
            <ErrorUploadFileModal
              error={error}
              onClose={() => setIsModalOpen(false)}
            />
          )}

          <div className="relative rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50/70 px-4 py-10 transition-colors duration-200 hover:border-gray-400 hover:bg-gray-50 sm:px-8 sm:py-14">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-gray-200 bg-white text-gray-600 shadow-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="30"
                  height="30"
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

              <h3 className="text-lg font-semibold tracking-tight text-[#202020]">
                Click or drop your CSV here
              </h3>

              <p className="mt-2 max-w-md text-sm leading-6 text-gray-500">
                Choose a file from your device to upload it and start exploring
                your data.
              </p>

              <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                <span className="rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-gray-600">
                  CSV format
                </span>

                <span className="rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-gray-600">
                  Max. 25 MB
                </span>
              </div>

              <label className="mt-6 inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-100 focus-within:ring-2 focus-within:ring-gray-400 focus-within:ring-offset-2">
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
                  aria-hidden="true"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <path d="m17 8-5-5-5 5" />
                  <path d="M12 3v12" />
                </svg>
                Browse files
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,text/csv"
                  className="sr-only"
                  onChange={handleFileChange}
                  disabled={isUploading}
                />
              </label>
            </div>
          </div>

          {csvFile && (
            <div className="mt-4 flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="21"
                    height="21"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
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

                <div className="min-w-0">
                  <p
                    title={fileName}
                    className="truncate text-sm font-semibold text-[#202020]"
                  >
                    {fileName}
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    {fileSize} · CSV file
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleChooseFile}
                disabled={isUploading}
                className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-[#222222] bg-[#222222] px-5 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-gray-700 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isUploading ? (
                  <>
                    <svg
                      className="animate-spin"
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="9"
                        stroke="currentColor"
                        strokeWidth="3"
                        className="opacity-25"
                      />
                      <path
                        d="M21 12a9 9 0 0 0-9-9"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        className="opacity-90"
                      />
                    </svg>
                    Uploading...
                  </>
                ) : (
                  "Upload file"
                )}
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
