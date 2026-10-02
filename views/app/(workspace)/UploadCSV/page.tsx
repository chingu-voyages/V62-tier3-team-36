"use client";

import Link from "next/dist/client/link";

import { useUploadCSV } from "./hooks/useUploadCSV";

const UploadCSVPage = () => {
  const { fileInputRef, handleChooseFile, handleFileChange } = useUploadCSV();

  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-[1200px]">
        <div className="flex gap-5 p-5">
          <div className="flex-1">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col">
                <p className="text-lg font-bold">Upload your CSV file</p>

                <p className="text-sm font-light text-[var(--medium-gray)]">
                  Upload a CSV file to explore, analyze from your data.
                </p>
              </div>

              <Link
                href="/Dashboard"
                className="flex h-10 items-center justify-center border-[1.6px] border-[var(--gray-700)] bg-[var(--gray-200)] px-[14px] text-sm font-bold w-auto"
              >
                Upload history
              </Link>
            </div>

            <div className="border-[1.6px] border-dashed border-[var(--gray-700)] bg-[var(--gray-100)] my-[18px] px-6">
              <div className="flex min-h-[272px] flex-col items-center justify-center">
                <div className="mb-4 h-[61px] w-[62px] border-[1.6px] border-[var(--gray-700)] bg-[var(--gray-300)]" />

                <p className="text-lg font-bold">Drop your CSV here</p>

                <p className="mt-2 text-[13px] text-[var(--dark-gray)]">
                  Maximum 25 MB · Required columns shown below
                </p>

                <>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    className="hidden"
                    onChange={handleFileChange}
                  />

                  <button
                    type="button"
                    onClick={handleChooseFile}
                    className="mt-[18px] w-full max-w-[760px] h-[38px] cursor-pointer border-[1.6px] border-[var(--gray-700)] bg-[var(--gray-400)] text-sm font-bold transition hover:bg-[var(--gray-300)]"
                  >
                    Choose file
                  </button>
                </>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadCSVPage;
