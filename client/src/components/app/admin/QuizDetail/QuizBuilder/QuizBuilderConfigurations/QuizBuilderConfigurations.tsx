import { Col, DatePicker, Empty, Form, Input, Radio, Row, Select, Spin, Switch, message } from 'antd';
import { isEmpty, isEqual } from 'lodash';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { getStudents } from '@/actions/user';
import { BuilderType, DATE_FORMAT, DAY_TO_MINUTE, HOUR_TO_MINUTE, MINUTE_TO_MINUTE, QuizType, TIME_SELECT_AFTER } from '@/constants';
import { UNEXPECTED_ERROR_MESSAGE } from '@/constants/message';
import useDispatchAsyncAction from '@/hooks/useDispatchAsyncAction';
import { Quiz, QuizConfigs } from '@/types/quiz';
import { formatDate } from '@/utilities/helpers';
import './QuizBuilderConfigurations.scss';

const { RangePicker } = DatePicker;
const { Item } = Form;
const { Option } = Select;


const defaultConfigs: QuizConfigs = {
  quizType: QuizType.TEST,
  startTime: undefined,
  endTime: undefined,
  duration: undefined,
  resultVisible: false,
  multipleAttempts: false,
  assignTo: [],
  acceptingResponse: true,
};

interface QuizBuilderConfigurationsProps {
  initialQuiz?: Quiz;
  setQuizConfigs?: any;
  builderType?: string;
}

const QuizBuilderConfigurations: React.FC<QuizBuilderConfigurationsProps> = ({
  initialQuiz,
  setQuizConfigs,
  builderType,
}) => {
  const [configs, setConfigs] = useState<QuizConfigs>(defaultConfigs);
  const [assignOptions, setAssignOptions] = useState<any>([]);
  const [userSearch, setUserSearch] = useState<string>();
  const [timeSelect, setTimeSelect] = useState('minutes');

  const userSearchRef = useRef<any>();

  const [run, loading] = useDispatchAsyncAction();

  useEffect(() => {
    if (isEmpty(initialQuiz)) {
      return;
    }

    setConfigs({
      quizType: initialQuiz.quizType,
      startTime: initialQuiz.startTime,
      endTime: initialQuiz.endTime,
      duration: initialQuiz.duration,
      resultVisible: initialQuiz.resultVisible,
      multipleAttempts: initialQuiz.multipleAttempts,
      assignTo: initialQuiz.assignTo?.map((item: any) => item?._id),
      acceptingResponse: initialQuiz.acceptingResponse,
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

  const handleAcceptResponseChange = (checked) => {
    setConfigs((prev: any) => ({ ...prev, acceptingResponse: checked }));
  };

  const handleTimeRangeChange = (_, date) => {
    const [startTime, endTime] = date;
    setConfigs((prev: any) => ({ ...prev, startTime, endTime }));
  };

  const handleDurationChange = (e) => {
    let unit;
    switch (timeSelect) {
      case TIME_SELECT_AFTER.MINUTES:
        unit = MINUTE_TO_MINUTE;
        break;
      case TIME_SELECT_AFTER.DAYS:
        unit = DAY_TO_MINUTE;
        break;
      case TIME_SELECT_AFTER.HOURS:
        unit = HOUR_TO_MINUTE;
        break;
      default:
        break;
    }

    const value = e.target.value;

    if (!value) {
      setConfigs((prev: any) => ({ ...prev, duration: undefined }));
      return;
    }

    setConfigs((prev: any) => ({ ...prev, duration: value * unit }));
  };

  const handleResultVisibleChange = (checked) => {
    setConfigs((prev: any) => ({ ...prev, resultVisible: checked }));
  };

  const handleMultipleAttemptsChange = (checked) => {
    setConfigs((prev: any) => ({ ...prev, multipleAttempts: checked }));
  };

  const handleTimeSelectChange = (value) => {
    setTimeSelect(value);
  };

  const timeSelectAfter = useMemo(() => (
    <Select value={timeSelect} onChange={handleTimeSelectChange}>
      <Option value={TIME_SELECT_AFTER.MINUTES}>{TIME_SELECT_AFTER.MINUTES}</Option>
      <Option value={TIME_SELECT_AFTER.DAYS}>{TIME_SELECT_AFTER.DAYS}</Option>
      <Option value={TIME_SELECT_AFTER.HOURS}>{TIME_SELECT_AFTER.HOURS}</Option>
    </Select>
  ), [timeSelect]);

  return (
    <div className="quiz-builder-configurations">
      <Row>
        <Col xs={{ span: 24 }} md={{ span: 24 }} lg={{ span: 12 }}>
          <Item label="Accept responses">
            <Switch checked={configs?.acceptingResponse} onChange={handleAcceptResponseChange} />
          </Item>
        </Col>
      </Row>

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

      { configs?.quizType === QuizType.ASSIGNMENT ? (
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
      ) : (
        <Row>
          <Col xs={{ span: 24 }} md={{ span: 24 }} lg={{ span: 10 }}>
            <Item label="Duration" required>
              <Input
                addonAfter={timeSelectAfter}
                placeholder="Please enter duration"
                value={configs?.duration}
                onChange={handleDurationChange}
              />
            </Item>
          </Col>
        </Row>
      )}

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
    </div>
  );
};

export default QuizBuilderConfigurations;
