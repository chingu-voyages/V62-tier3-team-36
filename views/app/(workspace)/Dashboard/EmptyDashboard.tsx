import Link from "next/link";

import { NoDataModal } from "../Modals/NoDataModal";
import { useDashboard } from "./hooks/useDashboard";

export const EmptyDashboard = () => {
  const { isModalOpen, setIsModalOpen } = useDashboard();

  return (
    <div className="relative flex min-h-full flex-1 flex-col px-5 pb-10 pt-5 bg-[var(--white)]">
      <div className="flex w-full items-center justify-between gap-3">
        <div>
          <p className="text-lg font-bold">Upload your CSV</p>
          <p className="text-sm font-medium text-[var(--gray-600)]">
            You can upload your CSV here and start analyzing your data.
          </p>
        </div>

        <Link
          href="/UploadCSV"
          className="flex h-10 items-center justify-center border-[1.6px] border-[var(--gray-700)] bg-[var(--gray-200)] px-4 text-sm font-bold transition hover:bg-[var(--gray-300)]"
        >
          Upload CSV
        </Link>
      </div>

      {isModalOpen && <NoDataModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};
