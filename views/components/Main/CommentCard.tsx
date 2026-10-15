type CommentProps = {
  isblack: boolean;
  comment: string;
  full_name: string;
  start_name: string;
};

const CommentCard = ({
  isblack,
  comment,
  full_name,
  start_name,
}: CommentProps) => {
  return (
    <div
      className={`flex h-full min-h-[220px] flex-col justify-between rounded-2xl border p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md ${
        isblack
          ? "border-[#202020] bg-[#202020]"
          : "border-gray-200 bg-white"
      }`}
    >
      <p
        className={`text-base leading-7 ${
          isblack ? "text-white" : "text-[#202020]"
        }`}
      >
        {`"${comment}"`}
      </p>

      <div className="mt-6 flex items-center gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${
            isblack ? "bg-white text-[#202020]" : "bg-[#202020] text-white"
          }`}
        >
          {start_name}
        </div>

        <p
          className={`text-sm font-semibold ${
            isblack ? "text-white" : "text-[#202020]"
          }`}
        >
          {full_name}
        </p>
      </div>
    </div>
  );
};

export default CommentCard;
