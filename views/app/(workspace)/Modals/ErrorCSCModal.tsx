import Link from "next/link";

interface ErrorCSCModalProps {
  onClose?: () => void;
}

export const ErrorCSCModal = ({ onClose }: ErrorCSCModalProps) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 px-4 py-8 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <section
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="error-modal-title"
        className="relative w-full max-w-lg rounded-2xl border border-gray-200 bg-white px-6 py-10 text-center shadow-xl sm:px-10"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Icon */}
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
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
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4" />
            <path d="M12 16h.01" />
          </svg>
        </div>

        {/* Content */}
        <h2
          id="error-modal-title"
          className="mt-5 text-xl font-semibold tracking-tight text-gray-900"
        >
          Could not load datasets
        </h2>

        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-500">
          Check your internet connection and try again. If the problem persists,
          please try again later.
        </p>

        {/* Actions */}
        <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/Dashboard"
            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#222222] px-5 text-sm font-medium text-white transition hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 sm:w-auto"
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
              <path d="M20 7v5h-5" />
              <path d="M4 17a8 8 0 0 0 13.6 2.4L20 17" />
              <path d="M4 12a8 8 0 0 1 13.6-5.4L20 9" />
            </svg>
            Retry
          </Link>

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

export default ErrorCSCModal;
