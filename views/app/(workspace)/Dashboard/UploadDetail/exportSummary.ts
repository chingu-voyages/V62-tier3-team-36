type Cell = string | number | undefined;
type Ranked = { revenue: number; units: number };

interface ExportSummaryInput {
  fileName: string;
  uploadedAt: string;
  filters: string[];
  metrics: {
    totalRevenue: number | undefined;
    totalUnits: number | undefined;
    averageOrderValue: number | undefined;
    growth: number | undefined;
  };
  categories: Array<Ranked & { category: string }>;
  regions: Array<Ranked & { region: string }>;
  products: Array<Ranked & { product: string }>;
  trend: Array<{ name: string; revenue: number }>;
}

const toCell = (value: Cell) => {
  if (typeof value !== "string") return String(value ?? "");
  // A leading = + - @ would run as a formula when the file is opened in a spreadsheet.
  const text = /^[=+\-@]/.test(value) ? `'${value}` : value;
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

const section = (title: string, headers: string[], rows: Cell[][]) =>
  rows.length ? [[], [title], headers, ...rows] : [];

/** Downloads the analytics currently shown on the dashboard as a CSV file. */
export const exportSummary = ({
  fileName,
  uploadedAt,
  filters,
  metrics,
  categories,
  regions,
  products,
  trend,
}: ExportSummaryInput) => {
  const rows: Cell[][] = [
    ["Metric", "Value"],
    ["File", fileName],
    ["Uploaded at", uploadedAt],
    ["Filters", filters.join("; ") || "None"],
    ["Revenue", metrics.totalRevenue],
    ["Units", metrics.totalUnits],
    ["Average order value", metrics.averageOrderValue],
    ["Growth (%)", metrics.growth],
    ...section(
      "Revenue by category",
      ["Category", "Revenue", "Units"],
      categories.map((item) => [item.category, item.revenue, item.units]),
    ),
    ...section(
      "Revenue by region",
      ["Region", "Revenue", "Units"],
      regions.map((item) => [item.region, item.revenue, item.units]),
    ),
    ...section(
      "Top products",
      ["Product", "Revenue", "Units"],
      products.map((item) => [item.product, item.revenue, item.units]),
    ),
    ...section(
      "Revenue trend",
      ["Month", "Revenue"],
      trend.map((item) => [item.name, item.revenue]),
    ),
  ];

  const csv = rows.map((row) => row.map(toCell).join(",")).join("\r\n");
  // The BOM makes Excel read non-ASCII product and region names as UTF-8.
  const url = URL.createObjectURL(
    new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = `${fileName.replace(/\.csv$/i, "")}-summary.csv`;
  link.click();
  // Revoking in the same tick can cancel the download in Safari and Firefox.
  setTimeout(() => URL.revokeObjectURL(url), 0);
};
