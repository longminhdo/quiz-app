import { Input } from 'antd';
import React from 'react';
import { Question } from '@/types/question';
import './TextAnswer.scss';

interface TextAnswerProps {
  currentQuestion?: Question;
  currentResponse?: Array<string>;
  onChange?: any;
}

const TextAnswer: React.FC<TextAnswerProps> = ({ currentQuestion, currentResponse, onChange }) => {
  const handleTextChange = (e) => {
    const newResponse = [e.target.value];
    onChange && onChange({ question: currentQuestion?._id, response: newResponse });
  };

  return (
    <div className="text-answer">
      <h2 className="text-answer-label">Answer:</h2>
      <Input.TextArea
        allowClear
        className="text-answer-input"
        placeholder="Enter your answer"
        onChange={handleTextChange}
        size="large"
        value={currentResponse?.[0]}
        autoSize={{ minRows: 1, maxRows: 10 }}
      />
    </div>
  );
};

export default TextAnswer;
