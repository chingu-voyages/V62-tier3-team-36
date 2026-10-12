import { UploadDetail } from "../types";

interface ErrorRowProps {
  detail: UploadDetail;
}

export const ErrorRow = ({ detail }: ErrorRowProps) => {
  const errors = detail.row_errors ?? [];

  if (errors.length === 0) {
    return null;
  }

  return (
    <div className="border-t border-red-200 bg-red-50/60 px-4 py-4">
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-bold text-red-900">Row errors</h3>

            <span className="border border-red-200 bg-red-100 px-2 py-0.5 text-[11px] font-bold text-red-700">
              {errors.length} {errors.length === 1 ? "error" : "errors"}
            </span>
          </div>

          <p className="mt-1 text-xs leading-5 text-red-800/80">
            Some rows in this file could not be processed. Review the details
            below.
          </p>

          <ul className="mt-3 space-y-2">
            {errors.map((entry, index) => (
              <li
                key={`${entry.row}-${index}`}
                className="flex items-start gap-3 border border-red-200 bg-white px-3 py-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-[var(--gray-800)]">
                    Row {entry.row}
                  </p>

                  <p className="mt-1 break-words text-xs leading-5 text-[var(--gray-700)]">
                    {entry.error}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
