"use client";

import { useDeleteCSV } from "./hooks/useDeleteCSV";

interface DeleteCSVModalProps {
  onClose?: () => void;
}

const DeleteCSVModal = ({ onClose }: DeleteCSVModalProps) => {
  const { error, handleDelete } = useDeleteCSV();

  const hasError = Boolean(error);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 px-4 py-8 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <section
        role={hasError ? "alertdialog" : "dialog"}
        aria-modal="true"
        aria-labelledby="delete-csv-title"
        className="relative w-full max-w-lg rounded-2xl border border-gray-200 bg-white px-6 py-10 text-center shadow-xl sm:px-10"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Icon */}
        <div
          className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl ${
            hasError ? "bg-amber-50 text-amber-600" : "bg-red-50 text-red-600"
          }`}
        >
          {hasError ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 9v4" />
              <path d="M12 17h.01" />
              <path d="M10.3 3.9 1.8 18.2A2 2 0 0 0 3.5 21h17a2 2 0 0 0 1.7-2.8L13.7 3.9a2 2 0 0 0-3.4 0Z" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M3 6h18" />
              <path d="M8 6V4h8v2" />
              <path d="m19 6-1 14H6L5 6" />
              <path d="M10 11v5" />
              <path d="M14 11v5" />
            </svg>
          )}
        </div>

        {/* Content */}
        <h2
          id="delete-csv-title"
          className="mt-5 text-xl font-semibold tracking-tight text-gray-900"
        >
          {hasError ? "Admin permission required" : "Delete this dataset?"}
        </h2>

        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-500">
          {hasError
            ? "Ask a workspace admin to delete this dataset."
            : "Analytics generated from this dataset will also be removed. This action cannot be undone."}
        </p>

        {/* Actions */}
        <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
          {!hasError && (
            <button
              onClick={handleDelete}
              type="button"
              className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-5 text-sm font-medium text-white transition hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 sm:w-auto"
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
                aria-hidden="true"
              >
                <path d="M3 6h18" />
                <path d="M8 6V4h8v2" />
                <path d="m19 6-1 14H6L5 6" />
              </svg>
              Delete dataset
            </button>
          )}

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-10 w-full items-center justify-center rounded-lg border border-gray-200 bg-white px-5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300 focus-visible:ring-offset-2 sm:w-auto"
            >
              Back
            </button>
          )}
        </div>
      </section>
    </div>
  );
};

export default DeleteCSVModal;
