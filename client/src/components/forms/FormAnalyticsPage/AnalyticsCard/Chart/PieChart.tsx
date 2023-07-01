import React, { useCallback, useMemo, useState } from 'react';
import {
  Cell,
  Legend,
  Pie,
  PieChart as ReChartPieChart,
  Tooltip,
  Sector,
} from 'recharts';
import { ChartColors } from '@/constants/colors';
import { ISummaryAnalyticsItem } from '@/constants/dataType';
import ChartBaseUI from '../BaseUI';

const RADIAN = Math.PI / 180;

const PieChart = ({
  item,
}: {
  item: ISummaryAnalyticsItem
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const onPieEnter = useCallback(
    (_, index) => {
      setActiveIndex(index);
    },
    [setActiveIndex],
  );

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const renderActiveShape = (props: any) => {
    const RADIAN = Math.PI / 180;
    const {
      cx,
      cy,
      midAngle,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      fill,
      payload,
      percent,
      value,
    } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';

    return (
      <g>
        <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
          {payload.name}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <path
          d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
          stroke={fill}
          fill="none"
        />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          textAnchor={textAnchor}
          fill="#333"
        >
          {`PV ${value}`}

        </text>
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          dy={18}
          textAnchor={textAnchor}
          fill="#999"
        >
          {`(Rate ${(percent * 100).toFixed(2)}%)`}
        </text>
      </g>
    );
  };

  const data = useMemo(
    () => item?.answers?.map((el) => ({ name: el?.answer, Count: el?.count })),
    [item?.answers],
  );

  return (
    <ChartBaseUI item={item}>
      <ReChartPieChart width={600} height={300}>
        <Legend layout="vertical" verticalAlign="middle" align="right" />
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          activeIndex={activeIndex}
          activeShape={renderActiveShape}
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={80}
          dataKey="Count"
          onMouseEnter={onPieEnter}
          onMouseDown={(e) => {

          }}
        >
          <Tooltip />
          {data.map((entry, index) => (
            <Cell
              key={`cell-${entry.name}`}
              fill={ChartColors[index % ChartColors.length]}
            />
          ))}
        </Pie>
      </ReChartPieChart>
    </ChartBaseUI>
  );
};

export default PieChart;
