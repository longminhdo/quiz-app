import { CaretLeftFilled, CaretRightFilled } from '@ant-design/icons';
import { Button } from 'antd';
import React from 'react';
import './QuizNavigation.scss';

const QuizNavigation: React.FC = () => {
  console.log('first');
  return (
    <div className="quiz-navigation">
      <Button className="quiz-nav-btn" type="text"><CaretLeftFilled /></Button>
      <Button className="quiz-nav-btn" type="text"><CaretRightFilled /></Button>
    </div>
  );
};

export default QuizNavigation;
