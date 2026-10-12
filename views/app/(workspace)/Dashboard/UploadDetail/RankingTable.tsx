import { UploadDetail } from "../types";

interface RankingTableProps {
  detail: UploadDetail;
}

export const RankingTable = ({ detail }: RankingTableProps) => {
  return (
    <>
      <div className="grid grid-cols-[2fr_1fr_1.4fr_1fr] gap-2 border-b border-[var(--gray-400)] bg-[var(--gray-300)] px-[10px] py-[8px] font-extrabold">
        <p>Name</p>
        <p>Status</p>
        <p className="text-center">Updated</p>
        <p className="text-center">Rows</p>
      </div>

      <div className="grid grid-cols-[2fr_1fr_1.4fr_1fr] items-center gap-2 border-b border-[var(--gray-400)] px-[10px] py-2">
        <p className="text-[12px] text-[var(--gray-700)]">{detail.file_name}</p>
        <p className="inline-flex w-fit border border-[var(--gray-700)] bg-[var(--gray-200)] px-2 py-1 text-[11px]">
          {detail.status}
        </p>
        <p className="text-center text-[12px] text-[var(--gray-700)]">
          {detail.uploaded_at?.split("T")[0]}
        </p>
        <p className="text-center text-[12px] text-[var(--gray-700)]">
          {detail.valid_rows}
        </p>
      </div>
    </>
  );
};
