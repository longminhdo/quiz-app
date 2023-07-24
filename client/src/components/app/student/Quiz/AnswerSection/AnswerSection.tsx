import React, { useState } from 'react';
import MultipleChoiceAnswer from '@/components/app/student/Quiz/AnswerSection/MultipleChoiceAnswer/MultipleChoiceAnswer';
import TextAnswer from '@/components/app/student/Quiz/AnswerSection/TextAnswer/TextAnswer';
import { QuestionType } from '@/constants';
import { Question } from '@/types/question';
import './AnswerSection.scss';

interface AnswerSectionProps {
  currentQuestion?: {question: Question, index: number}
  currentResponse?: any;
  onChange?: any;
}

const AnswerSection: React.FC<AnswerSectionProps> = ({ currentQuestion, currentResponse, onChange }) => {
  if (currentQuestion?.question?.type === QuestionType.MULTIPLE_CHOICE) {
    return (
      <div className="answer-section">
        <MultipleChoiceAnswer
          currentResponse={currentResponse}
          currentQuestion={currentQuestion?.question}
          onChange={onChange}
        />
      </div>
    );
  }

  return (
    <div className="answer-section">
      <TextAnswer
        currentQuestion={currentQuestion?.question}
      />
    </div>
  );
};

export default AnswerSection;
