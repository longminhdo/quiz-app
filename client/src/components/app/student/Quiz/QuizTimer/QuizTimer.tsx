import { Statistic } from 'antd';
import React from 'react';
import './QuizTimer.scss';

const { Countdown } = Statistic;


const QuizTimer: React.FC = () => {
  console.log('timer');
  return (
    <div className="quiz-timer">
      <Countdown className="timer" value={Date.now() + 100000} format="mm:ss" />
    </div>
  );
};

export default QuizTimer;
