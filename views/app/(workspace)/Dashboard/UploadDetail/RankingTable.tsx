import type { UploadDetail } from "../types";

interface RankingTableProps {
  detail: UploadDetail;
}

export const RankingTable = ({ detail }: RankingTableProps) => {
  const status = detail.status?.toLowerCase();

  const statusClasses =
    status === "completed" || status === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : status === "failed" || status === "error"
        ? "border-red-200 bg-red-50 text-red-700"
        : status === "processing" || status === "pending"
          ? "border-amber-200 bg-amber-50 text-amber-700"
          : "border-gray-200 bg-gray-100 text-gray-600";

  const columns = [
    { label: "Name", className: "text-left" },
    { label: "Status", className: "text-left" },
    { label: "Updated", className: "text-center" },
    { label: "Rows", className: "text-right" },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <div className="min-w-[540px]">
          <div className="grid grid-cols-[2fr_1fr_1.4fr_0.7fr] gap-3 border-b border-gray-200 bg-gray-50 px-4 py-3">
            {columns.map((column) => (
              <p
                key={column.label}
                className={`text-xs font-semibold uppercase tracking-wide text-gray-500 ${column.className}`}
              >
                {column.label}
              </p>
            ))}
          </div>

          <div className="grid grid-cols-[2fr_1fr_1.4fr_0.7fr] items-center gap-3 px-4 py-4 transition-colors duration-150 hover:bg-gray-50">
            <p
              title={detail.file_name}
              className="truncate text-sm font-medium text-[#202020]"
            >
              {detail.file_name}
            </p>

            <div>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${statusClasses}`}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                {detail.status}
              </span>
            </div>

            <p className="text-center text-sm tabular-nums text-gray-500">
              {detail.uploaded_at?.split("T")[0] ?? "—"}
            </p>

            <p className="text-right text-sm font-semibold tabular-nums text-[#202020]">
              {detail.valid_rows ?? "—"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
