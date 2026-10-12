interface UploadFiltersProps {
  regionOptions: string[];
  categoryOptions: string[];
  periodOptions: string[];
 
  isFiltersOpen: boolean;
  draftFilters: {
    period: string;
    category: string;
    region: string;
    
  };
  appliedFilters: {
    period: string;
    category: string;
    region: string;
  };
  handleClearFilters: () => void;
  setIsFiltersOpen: (value: boolean) => void;
  updateFilter: (
    filter: "period" | "category" | "region",
    value: string,
  ) => void;
  setDraftFilters: (filters: {
    period: string;
    category: string;
    region: string;
  }) => void;
}

export const UploadFilters = ({
  regionOptions,
  categoryOptions,
  periodOptions,
  isFiltersOpen,
 
  draftFilters,
  appliedFilters,
  handleClearFilters,
  setIsFiltersOpen,
  updateFilter,
  setDraftFilters,
}: UploadFiltersProps) => {
  return (
    <>
      {isFiltersOpen && (
        <div className="mt-4 border border-[var(--gray-400)] bg-[var(--gray-200)] p-4">
          <div className="flex items-center justify-between">
            <p className="text-[13px] font-extrabold">Filters</p>
            <p className="text-[11px] text-[var(--gray-600)]">
              Aggregate filtering mode
            </p>
          </div>

          <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
            <label className="text-[11px] font-bold text-[var(--gray-600)]">
              Period
              <select
                value={draftFilters.period}
                onChange={(event) => updateFilter("period", event.target.value)}
                className="mt-1 w-full border border-[var(--gray-500)] bg-[var(--white)] px-2 py-2 text-[12px]"
              >
                {periodOptions.map((period) => (
                  <option key={period} value={period}>
                    {period}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-[11px] font-bold text-[var(--gray-600)]">
              Category
              <select
                value={draftFilters.category}
                onChange={(event) =>
                  updateFilter("category", event.target.value)
                }
                className="mt-1 w-full border border-[var(--gray-500)] bg-[var(--white)] px-2 py-2 text-[12px]"
              >
                {categoryOptions.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-[11px] font-bold text-[var(--gray-600)]">
              Region
              <select
                value={draftFilters.region}
                onChange={(event) => updateFilter("region", event.target.value)}
                className="mt-1 w-full border border-[var(--gray-500)] bg-[var(--white)] px-2 py-2 text-[12px]"
              >
                {regionOptions.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleClearFilters}
              className="border border-[var(--gray-700)] bg-[var(--white)] px-4 py-2 text-[12px] font-bold"
            >
              Clear filters
            </button>
            <button
              type="button"
              onClick={() => {
                setDraftFilters(appliedFilters);
                setIsFiltersOpen(false);
              }}
              className="border border-[var(--gray-500)] bg-[var(--gray-200)] px-4 py-2 text-[12px] font-bold"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
};
