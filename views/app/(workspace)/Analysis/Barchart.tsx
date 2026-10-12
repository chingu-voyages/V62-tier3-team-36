"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartCard } from "./ChartCard";

type BarChartProps = {
  title: string;
  description: string;
  data: Record<string, string | number>[];
  dataKey: string;
  barDataKey: string;
  layout?: "horizontal" | "vertical";
};

export const Barchart = ({
  title,
  description,
  data,
  dataKey,
  barDataKey,
  layout = "horizontal",
}: BarChartProps) => {
  const chartData = [...data].sort(
    (a, b) => Number(b[barDataKey] ?? 0) - Number(a[barDataKey] ?? 0),
  );

  const horizontal = layout === "horizontal";

  return (
    <ChartCard title={title} description={description}>
      {chartData.length === 0 ? (
        <div className="flex h-[260px] items-center justify-center text-sm text-gray-400">
          No data available
        </div>
      ) : (
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout={horizontal ? "vertical" : "horizontal"}
              margin={{
                top: 5,
                right: 12,
                bottom: 5,
                left: 4,
              }}
              barCategoryGap="30%"
            >
              <CartesianGrid
                stroke="#F0F0F0"
                strokeDasharray="3 3"
                horizontal={!horizontal}
                vertical={horizontal}
              />

              {horizontal ? (
                <>
                  <XAxis
                    type="number"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#9CA3AF", fontSize: 11 }}
                    tickFormatter={(value) =>
                      Number(value) >= 1000
                        ? `$${Number(value) / 1000}k`
                        : `$${value}`
                    }
                  />

                  <YAxis
                    type="category"
                    dataKey={dataKey}
                    width={100}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#6B7280", fontSize: 11 }}
                  />
                </>
              ) : (
                <>
                  <XAxis
                    dataKey={dataKey}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#6B7280", fontSize: 11 }}
                  />

                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#9CA3AF", fontSize: 11 }}
                  />
                </>
              )}

              <Tooltip
                cursor={{ fill: "#F9FAFB" }}
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid #E5E7EB",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
                  fontSize: 12,
                }}
                formatter={(value) => [
                  `$${Number(value).toLocaleString()}`,
                  "Revenue",
                ]}
              />

              <Bar
                dataKey={barDataKey}
                fill="#A3A3A3"
                radius={horizontal ? [0, 5, 5, 0] : [5, 5, 0, 0]}
                maxBarSize={24}
                activeBar={{ fill: "#525252" }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </ChartCard>
  );
};
