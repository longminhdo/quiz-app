import { Statistic } from 'antd';
import moment from 'moment';
import React, { useCallback, useMemo } from 'react';
import './QuizTimer.scss';

const { Countdown } = Statistic;

const DEFAULT_TIME_UNIT = 1000;

interface QuizTimerProps {
  endTime?: number | string; // unit is in second
  onFinish?: any;
}

const QuizTimer: React.FC<QuizTimerProps> = ({ endTime, onFinish }) => {
  const initialTime = useMemo(() => moment(Number(endTime) * 1000).diff(moment(), 'seconds'), [endTime]);
  const duration = useMemo(() => (initialTime || 0) * DEFAULT_TIME_UNIT, [initialTime]);

  const getTimeFormat = () => {
    if (duration > 3600000) {
      return 'HH:mm:ss';
    }

    return 'mm:ss';
  };

  const handleCountdownFinish = useCallback(() => {
    onFinish && onFinish();
  }, [onFinish]);

  return (
    <div className="quiz-timer">
      <Countdown
        className="timer"
        value={Date.now() + duration}
        format={getTimeFormat()}
        onFinish={handleCountdownFinish}
      />
    </div>
  );
};

export default React.memo(QuizTimer);
