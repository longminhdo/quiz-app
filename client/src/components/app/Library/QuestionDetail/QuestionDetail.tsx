import { Button, Form, Input, Select, message } from 'antd';
import { isEqual } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import OptionDetail from '@/components/app/Library/OptionDetail/OptionDetail';
import { MyUploadImage } from '@/components/common';
import { QuestionLevelEnums, QuestionType, QuestionTypeEnums } from '@/constants/constants';
import { NO_COLLECTION_ID } from '@/constants/message';
import useDispatchAsyncAction from '@/hooks/useDispatchAsyncAction';
import { Question } from '@/types/question';
import { getNewOptionContent } from '@/utilities/helpers';
import { transformSendingQuestion } from '@/utilities/quizHelpers';
import './QuestionDetail.scss';
import { createQuestion, updateQuestion } from '@/actions/question';

const { Item } = Form;

const levelOptions = Object.entries(QuestionLevelEnums)
  .map(([key, value]) => ({ label: value, value: Number(key) }));

const typeOptions = Object.entries(QuestionTypeEnums).map(([key, value]) => ({ label: value, value: key }));

const QuestionDetail = ({ selectedQuestion, onCancel, editType = 'CREATE' }: {editType?: string, selectedQuestion: Question, onCancel?: any}) => {
  const [localQuestion, setLocalQuestion] = useState<Question>();
  const [isSubmitBtnDisabled, setIsSubmitBtnDisabled] = useState<boolean>(false);
  const [run, loading] = useDispatchAsyncAction();
  const selectedQuestionRef = useRef<Question>();
  const { collectionId } = useParams();
  const [messageApi] = message.useMessage();

  useEffect(() => {
    if (!isEqual(selectedQuestionRef.current, selectedQuestion)) {
      const convertedOptions = (selectedQuestion?.options || []).map(item => ({
        ...item,
        isCorrectAnswer: (selectedQuestion?.keys || []).includes(item.content),
        id: item?.id || uuidv4(),
      }));
      const convertedQuestion: Question = { ...selectedQuestion, options: convertedOptions };
      setLocalQuestion(convertedQuestion);

      selectedQuestionRef.current = selectedQuestion;
    }
  }, [selectedQuestion]);

  const handleSubmit = async () => {
    const payload = transformSendingQuestion(localQuestion);

    if (!collectionId) {
      messageApi.error(NO_COLLECTION_ID);
      onCancel && onCancel();
      return;
    }

    if (editType === 'UPDATE') {
      await run(updateQuestion({ newQuestion: payload, collectionId }));
    }

    if (editType === 'CREATE') {
      await run(createQuestion({ newQuestion: payload, collectionId }));
    }

    onCancel && onCancel();
  };

  const handleCancel = () => {
    onCancel && onCancel();
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

  const handleQuestionLevelChange = (v) => {
    setLocalQuestion((prev: any) => ({ ...prev, level: v }));
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

  const handleCorrectAnswerChange = (e) => {
    const value = e.target.value.trim();

    setLocalQuestion((prev: any) => ({ ...prev, keys: [value] }));
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
          onChange={handleQuestionLevelChange}
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
                  disableSubmit={setIsSubmitBtnDisabled}
                />
              ))}

              <Button type="default" onClick={handleAddOption}>Add new option</Button>
            </div>
          </Item>
        ) : null}

      {[QuestionType.TEXT].includes(localQuestion?.type || '')
        ? (
          <Item label="Correct answer">
            <Input placeholder="Correct answer" allowClear onChange={handleCorrectAnswerChange} value={localQuestion?.keys[0] || ''} />
          </Item>
        ) : null}

      <div id="scroll-to-end" style={{ height: 0, width: 0 }} />
      <div className="custom-footer">
        <Button onClick={handleCancel}>
          Cancel
        </Button>

        <Button type="primary" onClick={handleSubmit} disabled={isSubmitBtnDisabled} loading={loading}>
          {editType === 'UPDATE' ? 'Update' : 'Create'}
        </Button>
      </div>
    </Form>
  );
};

export default QuestionDetail;