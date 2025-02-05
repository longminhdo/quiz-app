import { Button, Col, Collapse, Form, Input, Radio, Row, Select, Spin, message } from 'antd';
import dayjs from 'dayjs';
import { isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getFlushCollectionById, getFlushCollections } from '@/actions/collection';
import { createQuiz, updateQuiz } from '@/actions/quiz';
import ManualQuizForm from '@/components/app/admin/QuizDetail/QuizBuilder/ManualQuizForm/ManualQuizForm';
import QuizBuilderConfigurations from '@/components/app/admin/QuizDetail/QuizBuilder/QuizBuilderConfigurations/QuizBuilderConfigurations';
import { BuilderType, QUIZ_CREATE_MODE, QuizType } from '@/constants';
import { UNEXPECTED_ERROR_MESSAGE } from '@/constants/message';
import { routePaths } from '@/constants/routePaths';
import useDispatchAsyncAction from '@/hooks/useDispatchAsyncAction';
import useUpdateUrlQuery from '@/hooks/useUpdateUrlQuery';
import { Question } from '@/types/question';
import { Quiz } from '@/types/quiz';
import { removeEmptyKeys } from '@/utilities/helpers';
import './QuizBuilder.scss';

const modeOptions = [
  { label: 'Manual', value: QUIZ_CREATE_MODE.MANUAL },
  { label: 'Random', value: QUIZ_CREATE_MODE.RANDOM },
];

const { Item } = Form;
const { Panel } = Collapse;

interface QuizBuilderProps {
  setIsOpen?: any;
  quizPool?: Array<Question>
  builderType?: string;
  initialQuiz?: Quiz;
  quizType?: string;
}

const QuizBuilder: React.FC<QuizBuilderProps> = ({
  initialQuiz,
  setIsOpen,
  quizPool,
  builderType = BuilderType.CREATE,
  quizType = QuizType.TEST,
}) => {
  const [mode, setMode] = useState(QUIZ_CREATE_MODE.MANUAL);
  const [localQuizPool, setLocalQuizPool] = useState<Array<Question>>([]);
  const [disabled, setDisabled] = useState<boolean>(true);
  const [collectionLoading, setCollectionLoading] = useState(false);
  const [collectionOptions, setCollectionOptions] = useState<any>([]);
  const [localQuiz, setLocalQuiz] = useState<Quiz>();

  const { collectionId } = useParams();
  const [messageApi] = message.useMessage();

  const { updateQuery } = useUpdateUrlQuery();
  const [run, loading] = useDispatchAsyncAction();

  useEffect(() => {
    if (isEmpty(initialQuiz)) {
      setLocalQuiz(undefined);
      return;
    }

    setLocalQuiz(initialQuiz);
  }, [initialQuiz]);


  useEffect(() => {
    if (isEmpty(quizPool) && builderType === BuilderType.CREATE) {
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

    if (builderType === BuilderType.UPDATE && localQuiz?.createdIn) {
      try {
        (async () => {
          setCollectionLoading(true);
          const res = await run(getFlushCollectionById(localQuiz.createdIn));
          setCollectionLoading(false);
          if (res?.statusCode === 200) {
            const data = res?.data;
            setLocalQuizPool(data?.questions);
          }
        })();
      } catch (error) {
        messageApi.error(UNEXPECTED_ERROR_MESSAGE);
      }
    }

    setLocalQuizPool(quizPool || []);
  }, [builderType, localQuiz?.createdIn, messageApi, quizPool, run]);

  useEffect(() => {
    const disableCondition1 = isEmpty(localQuiz?.questions) || !localQuiz?.title;
    const disableCondition2 = !(localQuiz?.startTime && localQuiz?.endTime);
    const disableCondition3 = localQuiz?.quizType === QuizType.ASSIGNMENT && isEmpty(localQuiz?.assignTo);

    const willDisable = disableCondition1 || disableCondition3 || disableCondition2;

    if (willDisable) {
      setDisabled(true);
      return;
    }

    setDisabled(false);
  }, [localQuiz?.title, localQuiz?.questions, localQuiz?.startTime, localQuiz?.endTime, localQuiz?.quizType, localQuiz?.assignTo]);

  const handleModeChange = (e) => {
    setMode(e.target.value);
  };

  const handleOk = async () => {
    let payload = {
      ...localQuiz,
      title: localQuiz?.title || '',
      questions: localQuiz?.questions?.map(q => q?._id),
      createdIn: collectionId || localQuiz?.createdIn,
      startTime: dayjs(localQuiz?.startTime).unix(),
      endTime: dayjs(localQuiz?.endTime).unix(),
    };

    if (payload?.quizType === QuizType.TEST) {
      payload = { ...payload, multipleAttempts: false };
    }

    try {
      if (builderType === BuilderType.CREATE) {
        const res = await run(createQuiz(removeEmptyKeys(payload)));

        if (res.statusCode === 201) {
          const newQuizId = res.data.data._id;
          setIsOpen && setIsOpen(false);
          updateQuery({ query: { timestamp: Date.now() } });
          setTimeout(() => {
            window.open(routePaths.QUIZ_DETAIL.replace(':quizId', newQuizId));
          }, 100);
        }
      }

      if (builderType === BuilderType.UPDATE) {
        const res = await run(updateQuiz({ _id: localQuiz?._id, ...payload }));

        if (res.statusCode === 200) {
          setIsOpen && setIsOpen(false);
          updateQuery({ query: { timestamp: Date.now() } });
        }
      }
    } catch (error) {
      messageApi.error(UNEXPECTED_ERROR_MESSAGE);
    }
  };

  const handleCancel = () => {
    setLocalQuiz(undefined);
    setIsOpen && setIsOpen(false);
  };

  const handleCollectionSelectionChange = async (value) => {
    try {
      setCollectionLoading(true);
      setLocalQuiz((prev: any) => ({ ...prev, createdIn: value }));
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
          {isEmpty(quizPool) && builderType === BuilderType.CREATE ? (
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
                  value={localQuiz?.title}
                  onChange={(e) => setLocalQuiz((prev: any) => ({ ...prev, title: e.target.value }))}
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
                    initialQuiz={initialQuiz}
                    quizPool={localQuizPool}
                    setQuestions={(newQuestions) => setLocalQuiz((prev: any) => ({ ...prev, questions: newQuestions }))}
                    needCollectionSelect={isEmpty(quizPool)}
                  />
                ) : null}
                {mode === QUIZ_CREATE_MODE.RANDOM ? 'random' : null}
              </Panel>
            </Collapse>

            <Collapse>
              <Panel header="Quiz configurations" key="1" forceRender>
                <QuizBuilderConfigurations
                  initialQuiz={initialQuiz}
                  builderType={builderType}
                  setQuizConfigs={(configs) => setLocalQuiz((prev: any) => ({ ...prev, ...configs }))}
                  quizType={quizType}
                />
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
