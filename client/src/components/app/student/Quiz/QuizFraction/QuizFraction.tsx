import React from 'react';
import './QuizFraction.scss';

interface QuizFractionProps {
  current?: number | string;
  total?: number | string;
}

const QuizFraction: React.FC<QuizFractionProps> = ({ current, total }) => {
  console.log('quiz fraction');
  return (
    <div className="quiz-fraction">
      {Number(current || 0) + 1}
      /
      {total}
    </div>
  );
};

export default QuizFraction;
