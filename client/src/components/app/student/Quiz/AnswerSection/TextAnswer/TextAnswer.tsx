import { Input } from 'antd';
import React from 'react';
import { Question } from '@/types/question';
import './TextAnswer.scss';

interface TextAnswerProps {
  currentQuestion?: Question
}

const TextAnswer: React.FC<TextAnswerProps> = ({ currentQuestion }) => {
  const handleTextChange = (e) => {
    console.log(e.target.value);
  };

  return (
    <div className="text-answer">
      <Input placeholder="Enter your answer" onChange={handleTextChange} />
    </div>
  );
};

export default TextAnswer;
