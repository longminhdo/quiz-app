import React from 'react';
import { Question } from '@/types/question';
import './AnswerSection.scss';

interface AnswerSectionProps {
  question?: Question
}

const AnswerSection: React.FC<AnswerSectionProps> = ({ question }) => {
  console.log('answer');
  return <div className="answer-section">AnswerSection</div>;
};

export default AnswerSection;
