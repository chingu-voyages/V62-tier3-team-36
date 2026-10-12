import type { ReactNode } from "react";

interface ChartCardProps {
  title: string;
  description: string;
  children: ReactNode;
  className?: string;
}

export const ChartCard = ({
  title,
  description,
  children,
  className = "",
}: ChartCardProps) => {
  return (
    <section
      className={`min-w-0 rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm transition-shadow duration-200 hover:shadow-md ${className}`}
    >
      <div className="mb-5">
        <h3 className="text-base font-semibold tracking-tight text-[#202020]">
          {title}
        </h3>

        <p className="mt-1 text-sm leading-5 text-gray-500">{description}</p>
      </div>

      {children}
    </section>
  );
};
