import { Button, Form, Input, Select, message } from 'antd';
import { isEqual } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { updateQuestion } from '@/actions/question';
import OptionDetail from '@/components/app/CollectionDetail/QuestionListTab/OptionDetail/OptionDetail';
import { MyUploadImage } from '@/components/common';
import { QuestionLevelEnums, QuestionType, QuestionTypeEnums } from '@/constants/constants';
import { NO_QUIZ_ID } from '@/constants/message';
import useDispatchAsyncAction from '@/hooks/useDispatchAsyncAction';
import useTypedSelector from '@/hooks/useTypedSelector';
import { Question } from '@/types/question';
import { getNewOptionContent } from '@/utilities/helpers';
import { transformSendingQuestion } from '@/utilities/quizHelpers';
import './EditQuestionForm.scss';
import { flushCollection } from '@/actions/collection';
import useUpdateUrlQuery from '@/hooks/useUpdateUrlQuery';

const { Item } = Form;

const levelOptions = Object.entries(QuestionLevelEnums)
  .map(([key, value]) => ({ label: value, value: Number(key) }));

const typeOptions = Object.entries(QuestionTypeEnums).map(([key, value]) => ({ label: value, value: key }));

interface EditQuestionFormProps {
  selectedQuestion: Question;
  onCancel?: any
}

const EditQuestionForm : React.FC<EditQuestionFormProps> = ({ selectedQuestion, onCancel }) => {
  const [localQuestion, setLocalQuestion] = useState<Question>();
  const [isSubmitBtnDisabled, setIsSubmitBtnDisabled] = useState<boolean>(false);

  const selectedQuestionRef = useRef<Question>();

  const [messageApi] = message.useMessage();

  const [run, loading] = useDispatchAsyncAction();
  const { currentQuiz } = useTypedSelector((state) => state.quiz);
  const { updateQuery } = useUpdateUrlQuery();

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

    if (!currentQuiz?.createdIn) {
      messageApi.error(NO_QUIZ_ID);
      onCancel && onCancel();
      return;
    }

    await run(updateQuestion({ newQuestion: payload, collectionId: currentQuiz?.createdIn }));
    run(flushCollection());
    updateQuery({ query: { timestamp: Date.now() } });
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
    const value = e.target.value;

    setLocalQuestion((prev: any) => ({ ...prev, keys: [value] }));
  };

  return (
    <Form
      className="edit-question-form"
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
          Update
        </Button>
      </div>
    </Form>
  );
};

export default EditQuestionForm;
