"use client";

import { useDeleteCSV } from "./hooks/useDeleteCSV";

interface DeleteCSVModalProps {
  onClose?: () => void;
}

const DeleteCSVModal = ({ onClose }: DeleteCSVModalProps) => {
  const { error, handleDelete } = useDeleteCSV();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--gray-600)]/50 px-4 py-8">
      <section className="relative w-full max-w-[560px] border-[1.6px] border-[var(--gray-700)] bg-[var(--white)] px-6 py-10 text-center shadow-[0_16px_50px_rgba(0,0,0,0.12)]">
        <div className="mx-auto h-[74px] w-[74px] rounded-full border-[2.4px] border-[var(--gray-700)] bg-[var(--gray-300)]" />

        <h1 className="mt-5 text-2xl font-bold">
          {error ? "Admin permission required" : "Delete this dataset?"}
        </h1>

        <p className="mx-auto mt-2 max-w-[360px] text-sm text-[var(--gray-600)]">
          {error
            ? "Ask a workspace admin to delete this dataset."
            : "Analytics generated from this dataset will also be removed."}
        </p>

        <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
          {!error ? (
            <button
              onClick={handleDelete}
              type="button"
              className="h-9 border border-[var(--gray-700)] bg-[var(--gray-200)] px-4 text-sm font-bold transition hover:bg-[var(--gray-300)]"
            >
              Delete dataset
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="flex h-9 items-center justify-center border-[0.8px] border-[var(--gray-700)] bg-[var(--gray-200)] px-6 text-sm font-bold transition hover:bg-[var(--gray-300)]"
            >
              Back
            </button>
          )}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="flex h-9 items-center justify-center border-[0.8px] border-[var(--gray-700)] bg-[var(--gray-200)] px-6 text-sm font-bold transition hover:bg-[var(--gray-300)]"
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
