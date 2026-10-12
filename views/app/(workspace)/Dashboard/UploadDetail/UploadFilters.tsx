import { TopProductItem } from "../types";

interface UploadFiltersProps {
  regionOptions: string[];
  categoryOptions: string[];
  periodOptions: string[];
  products: TopProductItem[];
  productOptions: string[];

  isFiltersOpen: boolean;
  draftFilters: {
    period: string;
    category: string;
    region: string;
    product: string;
  };
  appliedFilters: {
    period: string;
    category: string;
    region: string;
    product: string;
  };
  handleClearFilters: () => void;
  setIsFiltersOpen: (value: boolean) => void;
  updateFilter: (
    filter: "period" | "category" | "region" | "product",
    value: string,
  ) => void;
  setDraftFilters: (filters: {
    period: string;
    category: string;
    region: string;
    product: string;
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
  products,
  productOptions,
}: UploadFiltersProps) => {
  if (!isFiltersOpen) {
    return null;
  }

  const selectClassName =
    "mt-2 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-800 outline-none transition-colors focus:border-gray-400 focus:ring-2 focus:ring-gray-100";

  const labelClassName = "block text-xs font-semibold text-gray-500";

  return (
    <section className="mt-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-base font-semibold text-gray-900">Filters</h3>
          <p className="mt-1 text-sm text-gray-500">
            Refine analytics by period, category, region, and product.
          </p>
        </div>

        <span className="w-fit rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-500">
          Aggregate filtering
        </span>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <label className={labelClassName}>
          Period
          <select
            value={draftFilters.period}
            onChange={(event) => updateFilter("period", event.target.value)}
            className={selectClassName}
          >
            {periodOptions.map((period) => (
              <option key={period} value={period}>
                {period}
              </option>
            ))}
          </select>
        </label>

        <label className={labelClassName}>
          Category
          <select
            value={draftFilters.category}
            onChange={(event) => updateFilter("category", event.target.value)}
            className={selectClassName}
          >
            {categoryOptions.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <label className={labelClassName}>
          Region
          <select
            value={draftFilters.region}
            onChange={(event) => updateFilter("region", event.target.value)}
            className={selectClassName}
          >
            {regionOptions.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
        </label>

        <label className={labelClassName}>
          Product
          <select
            value={draftFilters.product}
            onChange={(event) => updateFilter("product", event.target.value)}
            className={selectClassName}
          >
            {productOptions.map((product) => (
              <option key={product} value={product}>
                {product}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-end gap-3 border-t border-gray-100 pt-4">
        <button
          type="button"
          onClick={handleClearFilters}
          className="rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
        >
          Clear filters
        </button>

        <button
          type="button"
          onClick={() => {
            setDraftFilters(appliedFilters);
            setIsFiltersOpen(false);
          }}
          className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </section>
  );
};
