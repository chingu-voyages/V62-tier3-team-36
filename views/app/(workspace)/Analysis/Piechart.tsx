"use client";
import {
  Pie,
  PieChart,
  PieLabelRenderProps,
  PieSectorShapeProps,
  Sector,
  useActiveTooltipDataPoints,
  useIsTooltipActive,
} from "recharts";

const RADIAN = Math.PI / 180;

// Helper function to generate vibrant, distinct colors dynamically based on index
const getRandomColor = (index: number) => {
  const hue = (index * 137.5) % 360;
  return `hsl(${hue}, 65%, 55%)`;
};

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  payload,
}: PieLabelRenderProps) => {
  if (cx == null || cy == null || innerRadius == null || outerRadius == null) {
    return null;
  }

  const radius =
    Number(innerRadius) + (Number(outerRadius) - Number(innerRadius)) * 0.5;
  const ncx = Number(cx);
  const ncy = Number(cy);
  const x = ncx + radius * Math.cos(-(midAngle ?? 0) * RADIAN);
  const y = ncy + radius * Math.sin(-(midAngle ?? 0) * RADIAN);

  const groupName = payload?.name ?? "";

  return (
    <text
      x={x}
      y={y}
      fill="#fff"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={10}
      fontWeight="bold"
    >
      {`${groupName}: ${((percent ?? 1) * 100).toFixed(0)}%`}
    </text>
  );
};

const MyCustomPie = (props: PieSectorShapeProps) => {
  const p = useActiveTooltipDataPoints();
  const isAnyPieActive = useIsTooltipActive();
  const isThisPieActive = isAnyPieActive && props.payload === p?.[0];
  let fillOpacity: number;
  if (isAnyPieActive && !isThisPieActive) {
    fillOpacity = 0.5;
  } else {
    fillOpacity = 1;
  }

  const dynamicColor = getRandomColor(props.index ?? 0);

  return (
    <Sector
      {...props}
      fill={dynamicColor}
      stroke="none"
      fillOpacity={fillOpacity}
      style={{ transition: "fill-opacity 0.3s ease" }}
    />
  );
};

export default function PieChartCustom({
  isAnimationActive = true,
  data = [],
  dataKey,
  nameKey = "name", // Property name for the category label (e.g., 'category' or 'region')
}: {
  data: any[];
  dataKey: string;
  nameKey?: string;
  isAnimationActive?: boolean;
}) {
  return (
    <div className="col-span-1 p-4 border-[1.6px] rounded-xl flex flex-col sm:flex-row items-center justify-center gap-4">
      {/* Pie Chart Section */}
      <div className="w-full max-w-[220px] aspect-square flex items-center justify-center">
        <PieChart
          style={{
            width: "100%",
            height: "100%",
          }}
        >
          <Pie
            data={data}
            labelLine={false}
            label={renderCustomizedLabel}
            dataKey={dataKey}
            nameKey={nameKey}
            isAnimationActive={isAnimationActive}
            shape={MyCustomPie}
          />
        </PieChart>
      </div>

      {/* Side Legend Section */}
      <div className="flex flex-col gap-2 w-full sm:w-auto min-w-[120px]">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
          Categories
        </span>
        {data.map((entry, index) => {
          const color = getRandomColor(index);
          const label = entry[nameKey] ?? entry.category ?? entry.region ?? `Item ${index + 1}`;
          const value = entry[dataKey];

          return (
            <div key={`legend-${index}`} className="flex items-center gap-2 text-sm">
              {/* Color Box */}
              <span
                className="w-3 h-3 rounded-sm flex-shrink-0"
                style={{ backgroundColor: color }}
              />
              {/* Category Name & Value */}
              <div className="flex justify-between items-center w-full gap-4 text-gray-700 dark:text-gray-300">
                <span className="truncate text-gray-500 font-medium">{label}</span>
                <span className="text-xs text-gray-400">({value})</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}