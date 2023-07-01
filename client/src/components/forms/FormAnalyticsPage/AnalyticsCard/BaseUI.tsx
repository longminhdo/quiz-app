import React from 'react';
import MyCard from '@/components/common/MyCard/MyCard';
import { ISummaryAnalyticsItem } from '@/constants/dataType';
import './BaseUI.scss';

const BaseUI = ({
  item,
  children,
}: {
  item: ISummaryAnalyticsItem;
  children: any;
}) => (
  <MyCard className="analytics-card">
    <div className="analytics-card-header">
      <div className="question-title">{item?.title}</div>
      <div className="total-answers">
        {`${item?.totalAnswers} ${
          item?.totalAnswers > 1 ? 'responses' : 'response'
        }`}
      </div>
    </div>
    <div className="analytics-card-body">
      {children}
    </div>
  </MyCard>
);

export default BaseUI;
