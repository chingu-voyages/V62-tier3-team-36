import Link from "next/link";

interface ChangesProps {
  title: string;
  description: string;
  link1: string;
  link2: string;
  button1: string;
}

const Changes = ({
  title,
  description,
  link1,
  link2,
  button1,
}: ChangesProps) => {
  return (
    <div className="flex w-full max-w-md flex-col items-center rounded-2xl border border-gray-200 bg-white px-6 py-8 text-center shadow-sm sm:px-8">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 text-[#222222]">
        <svg
          className="h-8 w-8"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 8v4" />
          <path d="M12 16h.01" />
          <circle cx="12" cy="12" r="9" />
        </svg>
      </div>

      <h1 className="mt-6 text-2xl font-bold tracking-tight text-[#202020]">
        {title}
      </h1>

      <p className="mt-2 max-w-sm text-sm leading-6 text-gray-500">
        {description}
      </p>

      <div className="mt-7 flex w-full flex-col gap-3 sm:flex-row">
        <Link
          href={link1}
          className="inline-flex min-h-11 flex-1 items-center justify-center rounded-lg bg-[#222222] px-4 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2"
        >
          {button1}
        </Link>

        <Link
          href={link2}
          className="inline-flex min-h-11 flex-1 items-center justify-center rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300 focus-visible:ring-offset-2"
        >
          Back
        </Link>
      </div>
    </div>
  );
};

export default Changes;
