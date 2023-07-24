import { Image } from 'antd';
import React from 'react';
import { Question } from '@/types/question';
import './QuestionSection.scss';

interface QuestionSectionProps {
  currentQuestion?: {question: Question, index: number}
}

const QuestionSection: React.FC<QuestionSectionProps> = ({ currentQuestion }) => {
  const title = currentQuestion?.question?.title;
  const image = currentQuestion?.question?.questionMedia?.url;

  return (
    <div className="question-section">
      {image ? (
        <div className="question-section-media">
          <Image src={image} className="media-image" />
        </div>
      ) : null}
      <h1 className="question-section-content">{title}</h1>
    </div>
  );
};

export default QuestionSection;
