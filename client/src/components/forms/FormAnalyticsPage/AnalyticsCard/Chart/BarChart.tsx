import React, { useMemo } from 'react';
import {
  Bar,
  BarChart as ReChartBarChart,
  Tooltip,
  XAxis,
  YAxis,
  LabelList,
} from 'recharts';
import { ISummaryAnalyticsItem } from '@/constants/dataType';
import ChartBaseUI from '../BaseUI';

const BarChart = ({
  item,
}: {
  item: ISummaryAnalyticsItem
}) => {
  const data = useMemo(
    () => item.answers.map((el) => {
      const percentage = el.count / item.totalAnswers * 100;

      return ({
        name: el.answer,
        count: el.count,
        percentage: percentage ? `${(percentage).toFixed(2)} %` : null,
      });
    }),
    [item.answers, item.totalAnswers],
  );

  return (
    <ChartBaseUI item={item}>
      <ReChartBarChart
        layout="vertical"
        width={500}
        height={400}
        data={data}
        barSize={40}
      >
        <XAxis type="number" />
        <YAxis type="category" dataKey="name" />
        <Tooltip cursor={{ fill: '#fff' }} />
        <Bar dataKey="count" fill="#413ea0">
          <LabelList fill="#ffffff" dataKey="percentage" position="center" />
        </Bar>
      </ReChartBarChart>
    </ChartBaseUI>
  );
};

export default BarChart;
