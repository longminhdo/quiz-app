import { Col, DatePicker, Empty, Form, Radio, Row, Select, Spin, Switch, message } from 'antd';
import dayjs from 'dayjs';
import { isEmpty, isEqual } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { getStudents } from '@/actions/user';
import { BuilderType, DATE_FORMAT, QuizType } from '@/constants';
import { UNEXPECTED_ERROR_MESSAGE } from '@/constants/message';
import useDispatchAsyncAction from '@/hooks/useDispatchAsyncAction';
import { Quiz, QuizConfigs } from '@/types/quiz';
import { formatDate } from '@/utilities/helpers';
import './QuizBuilderConfigurations.scss';

const { RangePicker } = DatePicker;
const { Item } = Form;


const defaultConfigs: QuizConfigs = {
  quizType: QuizType.TEST,
  startTime: undefined,
  endTime: undefined,
  resultVisible: false,
  multipleAttempts: false,
  assignTo: [],
};

interface QuizBuilderConfigurationsProps {
  initialQuiz?: Quiz;
  setQuizConfigs?: any;
  builderType?: string;
  quizType?: string;
}

const QuizBuilderConfigurations: React.FC<QuizBuilderConfigurationsProps> = ({
  initialQuiz,
  setQuizConfigs,
  builderType,
  quizType,
}) => {
  const [configs, setConfigs] = useState<QuizConfigs>(
    () => (quizType === QuizType.TEST ? defaultConfigs : { ...defaultConfigs, quizType: QuizType.ASSIGNMENT }),
  );
  const [assignOptions, setAssignOptions] = useState<any>([]);
  const [userSearch, setUserSearch] = useState<string>();

  const userSearchRef = useRef<any>();

  const [run, loading] = useDispatchAsyncAction();

  useEffect(() => {
    if (isEmpty(initialQuiz)) {
      return;
    }

    setConfigs({
      quizType: initialQuiz.quizType,
      startTime: dayjs.unix(Number(initialQuiz?.startTime || 0)).format(DATE_FORMAT.DATE_TIME),
      endTime: dayjs.unix(Number(initialQuiz?.endTime || 0)).format(DATE_FORMAT.DATE_TIME),
      resultVisible: initialQuiz.resultVisible,
      multipleAttempts: initialQuiz.multipleAttempts,
      assignTo: initialQuiz.assignTo?.map((item: any) => item?._id),
    });

    setAssignOptions(initialQuiz.assignTo?.map((item: any) => ({ ...item, value: item?._id, label: item?.email })));
  }, [initialQuiz]);

  useEffect(() => {
    setQuizConfigs(configs);
  }, [configs, setQuizConfigs]);

  useEffect(() => {
    if (!userSearch) {
      clearTimeout(userSearchRef.current);
      return;
    }
    clearTimeout(userSearchRef.current);

    const timeout = setTimeout(async () => {
      try {
        const res = await run(getStudents({ limit: 10, search: userSearch, forAssigning: true }));

        if (res?.success) {
          const data = res?.data?.data || [];
          const options = data?.map(item => ({ ...item, label: item.email, value: item._id }));

          setAssignOptions(options);
        }
      } catch (error) {
        message.error(UNEXPECTED_ERROR_MESSAGE);
      }
    }, 150);

    userSearchRef.current = timeout;
  }, [run, userSearch]);

  const handleQuizTypeChange = (e) => {
    const value = e.target.value;
    setConfigs((prev: any) => ({ ...prev, quizType: value }));
  };

  const handleAssignChange = (v) => {
    setConfigs((prev: any) => ({ ...prev, assignTo: v }));
  };

  const handleAssignSearch = (search) => {
    setUserSearch(search);
  };

  const handleTimeRangeChange = (_, date) => {
    const [startTime, endTime] = date;
    setConfigs((prev: any) => ({ ...prev, startTime, endTime }));
  };

  const handleResultVisibleChange = (checked) => {
    setConfigs((prev: any) => ({ ...prev, resultVisible: checked }));
  };

  const handleMultipleAttemptsChange = (checked) => {
    setConfigs((prev: any) => ({ ...prev, multipleAttempts: checked }));
  };

  return (
    <div className="quiz-builder-configurations">
      <Row>
        <Col xs={{ span: 24 }} md={{ span: 24 }} lg={{ span: 24 }}>
          <Item label="Quiz type" extra="You can not change this after a quiz is created.">
            <Radio.Group
              onChange={handleQuizTypeChange}
              value={configs.quizType}
              disabled={isEqual(builderType, BuilderType.UPDATE)}
            >
              <Radio value={QuizType.TEST}>Test</Radio>
              <Radio value={QuizType.ASSIGNMENT}>Assignment</Radio>
            </Radio.Group>
          </Item>
        </Col>
      </Row>

      <Row gutter={[24, 0]}>
        <Col xs={{ span: 24 }} md={{ span: 24 }} lg={{ span: 12 }}>
          <Item label="Time range" required>
            <RangePicker
              showTime
              value={[
                formatDate(configs?.startTime, DATE_FORMAT.DATE_TIME),
                formatDate(configs?.endTime, DATE_FORMAT.DATE_TIME),
              ]}
              onChange={handleTimeRangeChange}
            />
          </Item>
        </Col>
      </Row>

      <Row gutter={[24, 0]}>
        <Col xs={{ span: 24 }} md={{ span: 24 }} lg={{ span: 12 }}>
          <Item label="Release grades after submission">
            <Switch checked={configs?.resultVisible} onChange={handleResultVisibleChange} />
          </Item>
        </Col>

        { configs?.quizType === QuizType.ASSIGNMENT ? (
          <Col xs={{ span: 24 }} md={{ span: 24 }} lg={{ span: 12 }}>
            <Item label="Allow multiple attempts">
              <Switch checked={configs?.multipleAttempts} onChange={handleMultipleAttemptsChange} />
            </Item>
          </Col>
        ) : null }
      </Row>

      { configs?.quizType === QuizType.ASSIGNMENT ? (
        <Row>
          <Col span={24}>
            <Item label="Assign to students">
              <Select
                allowClear
                value={configs?.assignTo}
                placeholder="Student ID, Email"
                mode="multiple"
                onChange={handleAssignChange}
                options={assignOptions}
                defaultActiveFirstOption={false}
                filterOption={false}
                onSearch={handleAssignSearch}
                notFoundContent={loading ? (
                  <div style={{ paddingTop: 20, paddingBottom: 20, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Spin
                      spinning
                      tip="Loading"
                    />
                  </div>
                ) : <Empty />}
              />
            </Item>
          </Col>
        </Row>
      ) : null }
    </div>
  );
};

export default QuizBuilderConfigurations;
