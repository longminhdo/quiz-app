import React, { useMemo } from 'react';
import { ISummaryAnalyticsItem } from '@/constants/dataType';
import ChartBaseUI from '../BaseUI';

const TextsContainer = ({
  item,
}: {
  item: ISummaryAnalyticsItem
}) => {
  const texts = useMemo(
    () => item?.answers?.map((el) => ({ name: el?.answer, Count: el?.count })),
    [item?.answers],
  );

  return (
    <ChartBaseUI item={item}>
      <div className="texts-container">
        {texts?.map((el) => (
          <div key={el?.name} className="text">
            {el?.name}
          </div>
        ))}
      </div>
    </ChartBaseUI>
  );
};

export default TextsContainer;
