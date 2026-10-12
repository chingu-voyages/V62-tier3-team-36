interface ActiveFilterChipsProps {
  activeFilterChips: string[];
  handleClearFilters: () => void;
}

export const ActiveFilterChips = ({
  activeFilterChips,
  handleClearFilters,
}: ActiveFilterChipsProps) => {
  return (
    <>
      {activeFilterChips.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {activeFilterChips.map((chip) => (
            <span
              key={chip}
              className="border border-[var(--gray-500)] bg-[var(--gray-200)] px-2 py-1 text-[11px] font-semibold text-[var(--gray-700)]"
            >
              {chip}
            </span>
          ))}
          <button
            type="button"
            onClick={handleClearFilters}
            className="text-[11px] font-bold underline underline-offset-2"
          >
            Clear all
          </button>
        </div>
      )}
    </>
  );
};
