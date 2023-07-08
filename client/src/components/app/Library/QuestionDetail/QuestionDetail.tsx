import { Button, Form, Input, Select } from 'antd';
import { isEqual } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import OptionDetail from '@/components/app/Library/OptionDetail/OptionDetail';
import { MyUploadImage } from '@/components/common';
import { QuestionLevelEnums, QuestionType, QuestionTypeEnums } from '@/constants/constants';
import { Question } from '@/types/question';
import './QuestionDetail.scss';
import { getNewOptionContent } from '@/utilities/helpers';

const { Item } = Form;

const levelOptions = Object.entries(QuestionLevelEnums)
  .map(([key, value]) => ({ label: value, value: Number(key) }));

const typeOptions = Object.entries(QuestionTypeEnums).map(([key, value]) => ({ label: value, value: key }));

const QuestionDetail = ({ selectedQuestion }: {selectedQuestion: Question}) => {
  const selectedQuestionRef = useRef<Question>();
  const [localQuestion, setLocalQuestion] = useState<Question>();

  useEffect(() => {
    if (!isEqual(selectedQuestionRef.current, selectedQuestion)) {
      const convertedOptions = (selectedQuestion?.options || []).map(item => ({ ...item, id: item?.id || uuidv4() }));
      const convertedQuestion: Question = { ...selectedQuestion, options: convertedOptions };
      setLocalQuestion(convertedQuestion);

      selectedQuestionRef.current = selectedQuestion;
    }
  }, [selectedQuestion]);

  const handleSubmit = () => {
    console.log('Success:', localQuestion);
  };

  const handleReset = () => {
    setLocalQuestion(undefined);
  };

  const handleTitleChange = (e) => {
    const value = e.target.value;

    setLocalQuestion((prev: any) => ({ ...prev, title: value }));
  };

  const handleQuestionMediaChange = (newMedia) => {
    setLocalQuestion((prev:any) => ({ ...prev, questionMedia: newMedia }));
  };

  const handleQuestionTypeChange = (v) => {
    setLocalQuestion((prev: any) => ({ ...prev, type: v }));
  };

  const scrollToEnd = () => {
    const element = document.getElementById('scroll-to-end');
    element?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  };

  const handleAddOption = () => {
    setLocalQuestion((prev: any) => {
      const newOptionContent = getNewOptionContent(prev?.options);

      return { ...prev, options: [...prev.options, { content: newOptionContent, id: uuidv4() }] };
    });

    setTimeout(() => {
      scrollToEnd();
    }, 20);
  };

  return (
    <Form
      className="question-detail"
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 20 }}
      labelAlign="left"
    >
      <Item
        label="Question"
      >
        <Input.TextArea placeholder="Question" value={localQuestion?.title} onChange={handleTitleChange} />
      </Item>

      <Item
        label="Level"
      >
        <Select
          allowClear
          style={{ width: '100%' }}
          placeholder="Please select"
          options={levelOptions}
          value={localQuestion?.level}
        />
      </Item>

      <Item
        label="Image"
      >
        <MyUploadImage value={localQuestion?.questionMedia} onChange={handleQuestionMediaChange} />
      </Item>

      <Item
        label="Type"
      >
        <Select
          allowClear
          style={{ width: '100%' }}
          placeholder="Please select"
          options={typeOptions}
          value={localQuestion?.type}
          onChange={handleQuestionTypeChange}
        />
      </Item>

      {[QuestionType.MULTIPLE_CHOICE].includes(localQuestion?.type || '')
        ? (
          <Item label="Options">
            <div className="options-container">
              {(localQuestion?.options || []).map((opt, index) => (
                <OptionDetail
                  index={index}
                  option={opt}
                  key={opt.id}
                  setQuestion={setLocalQuestion}
                  options={localQuestion?.options || []}
                />
              ))}

              <Button type="default" onClick={handleAddOption}>Add new option</Button>
            </div>
          </Item>
        ) : null}

      <div id="scroll-to-end" style={{ height: 0, width: 0 }} />
      <div className="custom-footer">
        <Button onClick={handleReset}>
          Clear
        </Button>

        <Button type="primary" onClick={handleSubmit}>
          Submit
        </Button>
      </div>
    </Form>
  );
};

export default QuestionDetail;