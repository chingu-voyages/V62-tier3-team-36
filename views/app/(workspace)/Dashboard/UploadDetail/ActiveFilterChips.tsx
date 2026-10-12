interface ActiveFilterChipsProps {
  activeFilterChips: string[];
  handleClearFilters: () => void;
}

export const ActiveFilterChips = ({
  activeFilterChips,
  handleClearFilters,
}: ActiveFilterChipsProps) => {
  if (activeFilterChips.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 flex flex-wrap items-center gap-2">
      <span className="mr-1 text-xs font-medium text-gray-500">
        Active filters:
      </span>

      {activeFilterChips.map((chip) => (
        <span
          key={chip}
          className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-700"
        >
          {chip}
        </span>
      ))}

      <button
        type="button"
        onClick={handleClearFilters}
        className="rounded-lg px-2 py-1.5 text-xs font-semibold text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
      >
        Clear all
      </button>
    </div>
  );
};
