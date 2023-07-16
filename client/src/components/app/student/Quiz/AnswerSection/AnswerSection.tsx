import React from 'react';
import { Question } from '@/types/question';
import './AnswerSection.scss';

interface AnswerSectionProps {
  questions?: Question
}

const AnswerSection: React.FC<AnswerSectionProps> = ({ questions }) => {
  console.log('answer');
  return <div className="answer-section">AnswerSection</div>;
};

export default AnswerSection;
