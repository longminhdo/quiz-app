import { Col, DatePicker, Form, Input, Radio, Row, Select, Switch } from 'antd';
import { isEmpty, isEqual } from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';
import { BuilderType, DATE_FORMAT, DAY_TO_MINUTE, HOUR_TO_MINUTE, MINUTE_TO_MINUTE, QuizType, TIME_SELECT_AFTER } from '@/constants';
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
  const [assignOptions, setAssignOptions] = useState([]);
  const [timeSelect, setTimeSelect] = useState('minutes');

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
      assignTo: initialQuiz.assignTo,
      acceptingResponse: initialQuiz.acceptingResponse,
    });
  }, [initialQuiz]);

  useEffect(() => {
    setQuizConfigs(configs);
  }, [configs, setQuizConfigs]);

  const handleQuizTypeChange = (e) => {
    const value = e.target.value;
    setConfigs((prev: any) => ({ ...prev, quizType: value }));
  };

  const handleAssignChange = (e) => {
    console.log(e.target.value);
  };

  const handleAssignSearch = (search) => {
    console.log(search);
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
              value={configs?.assignTo}
              placeholder="Student ID, Email"
              mode="multiple"
              onChange={handleAssignChange}
              options={assignOptions}
              onSearch={handleAssignSearch}
            />
          </Item>
        </Col>
      </Row>
    </div>
  );
};

export default QuizBuilderConfigurations;
