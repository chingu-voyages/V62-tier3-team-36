import Link from "next/link";

interface NoDataModalProps {
  onClose?: () => void;
}

export const NoDataModal = ({ onClose }: NoDataModalProps) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 px-4 py-8 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="no-data-title"
        className="relative w-full max-w-lg rounded-2xl border border-gray-200 bg-white px-6 py-10 text-center shadow-xl sm:px-10"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Icon */}
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
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

        {/* Content */}
        <h2
          id="no-data-title"
          className="mt-5 text-xl font-semibold tracking-tight text-gray-900"
        >
          No datasets yet
        </h2>

        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-500">
          Upload your first sales CSV to start generating analytics and
          exploring your retail performance.
        </p>

        {/* Actions */}
        <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/UploadCSV"
            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#222222] px-5 text-sm font-medium text-white transition hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 sm:w-auto"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 3v12" />
              <path d="m7 10 5 5 5-5" />
              <path d="M5 17v4h14v-4" />
            </svg>
            Upload CSV
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

export default NoDataModal;
