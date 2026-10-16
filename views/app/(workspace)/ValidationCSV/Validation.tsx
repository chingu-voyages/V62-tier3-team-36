"use client";

import Link from "next/link";

import useValidationCSV from "./hooks/useValidationCSV";
import Status from "./State";

const Validation = () => {
  const { isLoading, upload_id, isValid, error, fileName } = useValidationCSV();

  return (
    <div className="min-h-full border-t border-gray-200 px-4 pb-10 pt-5 sm:px-6 sm:pt-6 lg:px-8">
      <div className="mx-auto w-full max-w-5xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[#202020]">
              Validating retail dataset
            </h1>

            <p className="mt-1 text-sm leading-5 text-gray-500">
              {fileName ? fileName : "Couldn't find file name"}
            </p>
          </div>

          {!isLoading && (
            <Link
              href={isValid ? `/Dashboard/${upload_id}` : "/UploadCSV"}
              className="inline-flex h-10 items-center justify-center rounded-xl border border-[#222222] bg-[#222222] px-4 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-gray-700 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2"
            >
              {isValid ? "Continue" : "Fix"}
            </Link>
          )}
        </div>

        <section className="mt-6 rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm sm:p-6">
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-semibold text-[#202020]">
                Validation status
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Validation protects analytics quality before processing begins.
              </p>
            </div>

            <span
              className={`inline-flex w-fit items-center rounded-full border px-2.5 py-1 text-xs font-medium ${
                isValid
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "border-amber-200 bg-amber-50 text-amber-700"
              }`}
            >
              {isValid ? "Ready to continue" : "Needs attention"}
            </span>
          </div>

          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-gray-50">
            {error ? (
              <div className="divide-y divide-gray-200">
                {error?.error ? (
                  <Status validation_type={error?.error} />
                ) : null}
                {Array.isArray(error?.row_errors) &&
                  error?.row_errors.map((errors: any) => (
                    <Status
                      key={`${errors.row}-${errors.error}`}
                      validation_type={`${errors.error} in row ${errors.row}`}
                    />
                  ))}
                {error.invalid_rows ? (
                  <Status
                    validation_type={`Invalid rows: ${error.invalid_rows}`}
                  />
                ) : null}
                {error.valid_rows ? (
                  <Status validation_type={`Valid rows: ${error.valid_rows}`} />
                ) : null}
              </div>
            ) : (
              <div className="flex min-h-32 items-center justify-center px-6 py-10 text-center">
                <p className="text-sm text-gray-500">
                  No validation issues have been reported.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Validation;
