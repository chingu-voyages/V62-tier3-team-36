interface KPICardProps {
  name: string;
  analysis: number | string;
}

export const KPICard = ({ name, analysis }: KPICardProps) => {
  return (
    <div className="group flex min-w-0 flex-col justify-between gap-3 rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-gray-300 hover:shadow-md">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium text-gray-500">{name}</p>

        <div className="h-2 w-2 shrink-0 rounded-full bg-gray-300 transition-colors group-hover:bg-gray-500" />
      </div>

      <p className="break-words text-2xl font-bold tracking-tight text-[#202020] sm:text-3xl">
        {analysis}
      </p>

      <div className="h-1 w-10 rounded-full bg-gray-200 transition-all duration-200 group-hover:w-16 group-hover:bg-gray-400" />
    </div>
  );
};
