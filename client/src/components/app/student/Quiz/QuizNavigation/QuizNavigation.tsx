import { CaretLeftFilled, CaretRightFilled } from '@ant-design/icons';
import { Button } from 'antd';
import React, { useMemo } from 'react';
import './QuizNavigation.scss';

interface QuizNavigationProps{
  current?: number;
  total?: number;
  onChange?: any;
}

const QuizNavigation: React.FC<QuizNavigationProps> = ({ current, total, onChange }) => {
  const currentIndex = useMemo(() => Number(current || 0), [current]);
  const totalIndexes = useMemo(() => Number(total || 0), [total]);
  const handleNext = () => {
    onChange && onChange(currentIndex + 1);
  };

  const handleBack = () => {
    onChange && onChange(currentIndex - 1);
  };

  return (
    <div className="quiz-navigation">
      <Button className="quiz-nav-btn" onClick={handleBack} type="text" disabled={currentIndex === 0}><CaretLeftFilled /></Button>
      <Button className="quiz-nav-btn" onClick={handleNext} type="text" disabled={current === totalIndexes - 1}><CaretRightFilled /></Button>
    </div>
  );
};

export default QuizNavigation;
