import { Checkbox, Radio } from 'antd';
import React from 'react';
import MyCard from '@/components/common/MyCard/MyCard';
import { Question } from '@/types/question';
import './MultipleChoiceAnswer.scss';

interface MultipleChoiceAnswerProps {
  currentQuestion?: Question;
  currentResponse?: Array<string>;
  onChange?: any;
}

const MultipleChoiceAnswer: React.FC<MultipleChoiceAnswerProps> = ({ currentQuestion, currentResponse, onChange }) => {
  const handleRadioSelect = (value) => {
    // setSelected([value]);
    onChange && onChange([value]);
  };

  const handleCheckboxSelect = (value) => {
    let newResponse: any = currentResponse || [];
    if (newResponse.includes(value)) {
      newResponse = newResponse?.filter(item => item !== value);
    } else {
      newResponse.push(value);
    }

    onChange && onChange({ question: currentQuestion?._id, response: newResponse });
  };

  if ((currentQuestion?.keys || [])?.length > 1) {
    return (
      <Checkbox.Group className="multiple-choice-answer-wrapper" value={currentResponse}>
        {currentQuestion?.options?.map((opt, index) => (
          <MyCard
            className={`answer-section-option length-of-${currentQuestion?.options?.length} ${currentResponse?.includes(opt?.content) ? 'selected' : ''}`}
            key={opt?.content}
            onClick={() => handleCheckboxSelect(opt?.content)}
          >
            <div className={`option-content option-${index + 1}`}>
              <Checkbox value={opt?.content} />
              {opt.content}
            </div>
          </MyCard>
        ))}
      </Checkbox.Group>
    );
  }

  return (
    <Radio.Group className="multiple-choice-answer-wrapper">
      {currentQuestion?.options?.map((opt, index) => (
        <MyCard
          className={`answer-section-option length-of-${currentQuestion?.options?.length} ${currentResponse?.includes(opt?.content) ? 'selected' : ''}`}
          key={opt?.content}
          onClick={() => handleRadioSelect(opt?.content)}
        >
          <div className={`option-content option-${index + 1}`}>
            <Radio value={opt?.content} />
            <p style={{ fontSize: 14 }}>
              {opt?.content}
            </p>
          </div>
        </MyCard>
      ))}
    </Radio.Group>
  );
};

export default MultipleChoiceAnswer;
