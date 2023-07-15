import { Button, Col, Collapse, Form, Input, Radio, Row, Select, Spin, message } from 'antd';
import { isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getFlushCollectionById, getFlushCollections } from '@/actions/collection';
import { createQuiz } from '@/actions/quiz';
import ManualQuizForm from '@/components/app/QuizDetail/QuizBuilder/ManualQuizForm/ManualQuizForm';
import { BuilderType } from '@/constants';
import { UNEXPECTED_ERROR_MESSAGE } from '@/constants/message';
import { routePaths } from '@/constants/routePaths';
import useDispatchAsyncAction from '@/hooks/useDispatchAsyncAction';
import useUpdateUrlQuery from '@/hooks/useUpdateUrlQuery';
import { Question } from '@/types/question';
import './QuizBuilder.scss';

const QUIZ_CREATE_MODE = {
  MANUAL: 'manual',
  RANDOM: 'random',
};

const modeOptions = [
  { label: 'Manual', value: QUIZ_CREATE_MODE.MANUAL },
  { label: 'Random', value: QUIZ_CREATE_MODE.RANDOM },
];

const { Item } = Form;
const { Panel } = Collapse;

interface QuizBuilderProps {
  setIsOpen?: any;
  quizPool: Array<Question>
  builderType?: string;
}

const QuizBuilder: React.FC<QuizBuilderProps> = ({ setIsOpen, quizPool, builderType = BuilderType.CREATE }) => {
  const [mode, setMode] = useState(QUIZ_CREATE_MODE.MANUAL);
  const [localQuizPool, setLocalQuizPool] = useState<Array<Question>>([]);
  const [quizTitle, setQuizTitle] = useState('');
  const [questions, setQuestions] = useState<Array<Question>>([]);
  const [disabled, setDisabled] = useState<boolean>(true);
  const [collectionLoading, setCollectionLoading] = useState(false);
  const [collectionOptions, setCollectionOptions] = useState<any>([]);
  const [localCollectionId, setLocalCollectionId] = useState<string>('');

  const { collectionId } = useParams();
  const [messageApi] = message.useMessage();

  const { updateQuery } = useUpdateUrlQuery();
  const [run, loading] = useDispatchAsyncAction();

  useEffect(() => {
    if (isEmpty(quizPool)) {
      setLocalQuizPool([]);
      try {
        (async() => {
          setCollectionLoading(true);
          const res = await run(getFlushCollections({ fetchAll: true }));

          if (res?.statusCode === 200) {
            const data = res?.data?.data || [];

            setCollectionOptions(data.map(item => ({ ...item, label: item?.title, value: item?._id })));
          }
          setCollectionLoading(false);
        })();
      } catch (error) {
        messageApi.error(UNEXPECTED_ERROR_MESSAGE);
      }
      return;
    }

    setLocalQuizPool(quizPool);
  }, [messageApi, quizPool, run]);

  useEffect(() => {
    if (isEmpty(questions) || !quizTitle) {
      setDisabled(true);
      return;
    }

    setDisabled(false);
  }, [quizTitle, questions]);

  const handleModeChange = (e) => {
    setMode(e.target.value);
  };

  const handleOk = async () => {
    const payload = {
      title: quizTitle,
      questions: questions?.map(q => q?._id),
      createdIn: collectionId || localCollectionId,
    };

    const res = await run(createQuiz(payload));

    if (res.statusCode === 201) {
      const newQuizId = res.data.data._id;
      setIsOpen && setIsOpen(false);
      updateQuery({ query: { timestamp: Date.now() } });
      setTimeout(() => {
        window.open(routePaths.QUIZ_DETAIL.replace(':quizId', newQuizId));
      }, 100);
    }
  };

  const handleCancel = () => {
    setQuizTitle('');
    setIsOpen && setIsOpen(false);
  };

  const handleCollectionSelectionChange = async (value) => {
    try {
      setCollectionLoading(true);
      setLocalCollectionId(value);
      const res = await run(getFlushCollectionById(value));
      setCollectionLoading(false);
      if (res?.statusCode === 200) {
        const data = res?.data;
        setLocalQuizPool(data?.questions);
      }
    } catch (error) {
      messageApi.error(UNEXPECTED_ERROR_MESSAGE);
    }
  };

  return (
    <Spin spinning={collectionLoading} wrapperClassName="quiz-builder-content-wrapper">
      <Form className="quiz-builder" layout="horizontal" labelAlign="left">
        <div className="quiz-builder-content">
          {isEmpty(quizPool) ? (
            <Row>
              <Col>
                <Item required label="Please select the collection">
                  <Select
                    style={{ minWidth: 300 }}
                    showSearch
                    placeholder="Select a collection"
                    optionFilterProp="children"
                    onChange={handleCollectionSelectionChange}
                    filterOption={(input, option) => (String(option?.label) ?? '').toLowerCase().includes(input.toLowerCase())}
                    options={collectionOptions}
                  />
                </Item>
              </Col>
            </Row>
          ) : null}

          <Row gutter={[16, 16]}>
            <Col>
              <Item required label="Please enter a new name for the new quiz:">
                <Input
                  value={quizTitle}
                  onChange={(e) => setQuizTitle(e.target.value)}
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

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Collapse
              defaultActiveKey={['1']}
            >
              <Panel header="Quiz questions" key="1">
                {mode === QUIZ_CREATE_MODE.MANUAL ? (
                  <ManualQuizForm
                    quizPool={localQuizPool}
                    setQuestions={setQuestions}
                    needCollectionSelect={isEmpty(quizPool)}
                  />
                ) : null}
                {mode === QUIZ_CREATE_MODE.RANDOM ? 'random' : null}
              </Panel>
            </Collapse>

            <Collapse>
              <Panel header="Quiz configurations" key="1">
                configurations
              </Panel>
            </Collapse>
          </div>
        </div>

        <div className="quiz-builder-footer">
          <Button onClick={handleCancel}>Cancel</Button>
          <Button loading={loading} onClick={handleOk} type="primary" disabled={disabled}>
            {builderType === BuilderType.CREATE ? 'Create' : null}
            {builderType === BuilderType.UPDATE ? 'Update' : null}
          </Button>
        </div>
      </Form>
    </Spin>
  );
};

export default QuizBuilder;
