import React from 'react';
import { Question } from '@/types/question';
import './QuestionSection.scss';

interface QuestionSectionProps {
  question?: Question
}

const QuestionSection: React.FC<QuestionSectionProps> = ({ question }) => {
  console.log('first');
  return <div className="question-section">QuestionSection</div>;
};

export default QuestionSection;
