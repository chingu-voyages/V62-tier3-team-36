"use client";
import {
  Pie,
  PieChart,
  PieLabelRenderProps,
  PieSectorShapeProps,
  Sector,
  useActiveTooltipDataPoints,
  useIsTooltipActive,
} from 'recharts';

// #region Sample data
const data = [
  { name: 'Electronics', value: 400 },
  { name: 'Cloths', value: 300 },
  { name: 'Jeweleries', value: 300 },
  { name: 'Houses', value: 200 },
];
// #endregion

const RADIAN = Math.PI / 180;
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, payload }: PieLabelRenderProps) => {
  if (cx == null || cy == null || innerRadius == null || outerRadius == null) {
    return null;
  }
  
  // Calculates the midpoint inside the slice radius
  const radius = Number(innerRadius) + (Number(outerRadius) - Number(innerRadius)) * 0.5;
  const ncx = Number(cx);
  const ncy = Number(cy);
  const x = ncx + radius * Math.cos(-(midAngle ?? 0) * RADIAN);
  const y = ncy + radius * Math.sin(-(midAngle ?? 0) * RADIAN);

  const groupName = payload?.name ?? '';

  return (
    <text 
      x={x} 
      y={y} 
      fill="#fff" // Using white text usually looks better on colored slices, change to "black" if preferred
      textAnchor="middle" 
      dominantBaseline="central" 
      fontSize={10} // Adjusted to a readable size
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
  return (
    <Sector
      {...props}
      fill={COLORS[props.index % COLORS.length]}
      stroke="none"
      fillOpacity={fillOpacity}
      style={{ transition: 'fill-opacity 0.3s ease' }}
    />
  );
};

export default function PieChartCustom({ isAnimationActive = true }: { isAnimationActive?: boolean }) {
  return (
    <PieChart style={{ width: '100%', maxWidth: '200px', maxHeight: '60vh', aspectRatio: 1 }}>
      <Pie
        data={data}
        labelLine={false}
        label={renderCustomizedLabel}
        dataKey="value"
        isAnimationActive={isAnimationActive}
        shape={MyCustomPie}
      />
    </PieChart>
  );
}