import { Button, Col, Form, Input, Radio, Row } from 'antd';
import { isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { createQuiz } from '@/actions/quiz';
import ManualQuizForm from '@/components/app/Quizzes/ManualQuizForm/ManualQuizForm';
import useDispatchAsyncAction from '@/hooks/useDispatchAsyncAction';
import { Question } from '@/types/question';
import './QuizBuilder.scss';
import useUpdateUrlQuery from '@/hooks/useUpdateUrlQuery';

const QUIZ_CREATE_MODE = {
  MANUAL: 'manual',
  RANDOM: 'random',
};

const modeOptions = [
  { label: 'Manual', value: QUIZ_CREATE_MODE.MANUAL },
  { label: 'Random', value: QUIZ_CREATE_MODE.RANDOM },
];

const { Item } = Form;

interface QuizBuilderProps {
  setIsOpen?: any;
  quizPool: Array<Question>
}

const QuizBuilder: React.FC<QuizBuilderProps> = ({ setIsOpen, quizPool }) => {
  const [mode, setMode] = useState(QUIZ_CREATE_MODE.MANUAL);
  const [newQuizTitle, setNewQuizTitle] = useState('');
  const [questions, setQuestions] = useState<Array<Question>>([]);
  const [disabled, setDisabled] = useState<boolean>(true);

  const { collectionId } = useParams();

  const [run, loading] = useDispatchAsyncAction();
  const { updateQuery } = useUpdateUrlQuery();

  useEffect(() => {
    if (isEmpty(questions) || !newQuizTitle) {
      setDisabled(true);
      return;
    }

    setDisabled(false);
  }, [newQuizTitle, questions]);

  const handleModeChange = (e) => {
    setMode(e.target.value);
  };

  const handleOk = async () => {
    const payload = {
      title: newQuizTitle,
      questions: questions?.map(q => q?._id),
      createdIn: collectionId,
    };
    const res = await run(createQuiz(payload));
    if (res.statusCode === 201) {
      const newCollectionId = res.data.data._id;
      console.log(newCollectionId);
      updateQuery({ query: { timestamp: Date.now() } });
    }
    setIsOpen && setIsOpen(false);
  };

  const handleCancel = () => {
    setNewQuizTitle('');
    setIsOpen && setIsOpen(false);
  };

  return (
    <Form className="quiz-builder" layout="horizontal" labelAlign="left">
      <Row gutter={[16, 16]}>
        <Col>
          <Item required label="Please enter a new name for the new quiz:">
            <Input
              value={newQuizTitle}
              onChange={(e) => setNewQuizTitle(e.target.value)}
            />
          </Item>
        </Col>
        <Col>
          <Item label="Create mode">
            <Radio.Group
              options={modeOptions}
              onChange={handleModeChange}
              value={mode}
              optionType="button"
            />
          </Item>
        </Col>
      </Row>

      {mode === QUIZ_CREATE_MODE.MANUAL ? <ManualQuizForm quizPool={quizPool} setQuestions={setQuestions} /> : null}
      {mode === QUIZ_CREATE_MODE.RANDOM ? 'random' : null}

      <div className="quiz-builder-footer">
        <Button onClick={handleCancel}>Cancel</Button>
        <Button loading={loading} onClick={handleOk} type="primary" disabled={disabled}>Create</Button>
      </div>
    </Form>
  );
};

export default QuizBuilder;
