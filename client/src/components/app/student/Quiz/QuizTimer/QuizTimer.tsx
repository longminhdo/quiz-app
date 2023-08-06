import { Statistic } from 'antd';
import moment from 'moment';
import React, { useMemo } from 'react';
import './QuizTimer.scss';

const { Countdown } = Statistic;

const DEFAULT_TIME_UNIT = 1000;

interface QuizTimerProps {
  endTime?: number | string; // unit is in second
}

const QuizTimer: React.FC<QuizTimerProps> = ({ endTime }) => {
  const initialTime = useMemo(() => moment(Number(endTime) * 1000).diff(moment(), 'seconds'), [endTime]);
  const duration = useMemo(() => (initialTime || 0) * DEFAULT_TIME_UNIT, [initialTime]);

  return (
    <div className="quiz-timer">
      <Countdown className="timer" value={Date.now() + duration} format="mm:ss" />
    </div>
  );
};

export default React.memo(QuizTimer);
