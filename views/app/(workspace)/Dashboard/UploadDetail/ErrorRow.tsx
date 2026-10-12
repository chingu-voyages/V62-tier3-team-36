import type { UploadDetail } from "../types";

interface ErrorRowProps {
  detail: UploadDetail;
}

export const ErrorRow = ({ detail }: ErrorRowProps) => {
  const errors = detail.row_errors ?? [];

  if (errors.length === 0) {
    return null;
  }

  return (
    <div className="border-t border-red-100 bg-red-50/40 p-5 rounded-xl">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center  bg-red-100 text-red-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="19"
            height="19"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4" />
            <path d="M12 16h.01" />
          </svg>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-semibold text-red-900">Row errors</h3>

            <span className="rounded-full border border-red-200 bg-white px-2.5 py-1 text-xs font-semibold text-red-700">
              {errors.length} {errors.length === 1 ? "error" : "errors"}
            </span>
          </div>

          <p className="mt-1 text-sm leading-5 text-red-800/75">
            Some rows in this file could not be processed. Review the details
            below.
          </p>

          <ul className="mt-4 space-y-2">
            {errors.map((entry, index) => (
              <li
                key={`${entry.row}-${index}`}
                className="flex items-start gap-3 rounded-xl border border-red-100 bg-white p-4 transition-colors duration-150 hover:border-red-200"
              >
                <span className="inline-flex shrink-0 items-center justify-center rounded-lg bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700">
                  Row {entry.row}
                </span>

                <p className="min-w-0 flex-1 break-words text-sm leading-5 text-gray-600">
                  {entry.error}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
