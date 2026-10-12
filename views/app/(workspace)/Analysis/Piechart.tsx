"use client";

import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { ChartCard } from "./ChartCard";

interface PiechartProps {
  title: string;
  description: string;
  data: Record<string, string | number>[];
  dataKey: string;
  nameKey: string;
}

const SEGMENT_COLORS = ["#404040", "#737373", "#A3A3A3", "#D4D4D4", "#E5E7EB"];

export const Piechart = ({
  title,
  description,
  data,
  dataKey,
  nameKey,
}: PiechartProps) => {
  return (
    <ChartCard title={title} description={description}>
      {data.length === 0 ? (
        <div className="flex h-[280px] items-center justify-center text-sm text-gray-400">
          No data available
        </div>
      ) : (
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey={dataKey}
                nameKey={nameKey}
                cx="50%"
                cy="46%"
                innerRadius={65}
                outerRadius={95}
                paddingAngle={3}
                stroke="white"
                strokeWidth={3}
              >
                {data.map((_, index) => (
                  <Cell
                    key={`segment-${index}`}
                    fill={SEGMENT_COLORS[index % SEGMENT_COLORS.length]}
                  />
                ))}
              </Pie>

              <Tooltip
                formatter={(value) => [
                  `$${Number(value).toLocaleString()}`,
                  "Revenue",
                ]}
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid #E5E7EB",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
                  fontSize: 12,
                }}
              />

              <Legend
                verticalAlign="bottom"
                align="center"
                iconType="circle"
                iconSize={8}
                wrapperStyle={{
                  fontSize: 11,
                  color: "#6B7280",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </ChartCard>
  );
};
