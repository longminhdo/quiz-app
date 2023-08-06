import { DeleteOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Empty, Form, Radio, Row, Select, Space, Spin, Switch, Table, Tooltip, message } from 'antd';
import dayjs from 'dayjs';
import { cloneDeep, isEmpty } from 'lodash';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { assign, getQuizById, removeAssign } from '@/actions/quiz';
import { getStudents } from '@/actions/user';
import { DATE_FORMAT, QuizType } from '@/constants';
import { UNEXPECTED_ERROR_MESSAGE } from '@/constants/message';
import useDispatchAsyncAction from '@/hooks/useDispatchAsyncAction';
import useTypedSelector from '@/hooks/useTypedSelector';
import { QuizConfigs } from '@/types/quiz';
import { formatDate } from '@/utilities/helpers';

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

const ConfigurationTab: React.FC = () => {
  const [configs, setConfigs] = useState<QuizConfigs>(defaultConfigs);
  const [assignOptions, setAssignOptions] = useState<any>([]);
  const [userSearch, setUserSearch] = useState<string>();
  const [assigns, setAssigns] = useState<any>([]);
  const [localLoading, setLocalLoading] = useState(true);
  const [removing, setRemoving] = useState<Array<string>>([]);

  const userSearchRef = useRef<any>();

  const { currentQuiz } = useTypedSelector((state) => state.quiz);
  const [run, loading] = useDispatchAsyncAction();
  const { quizId } = useParams();

  useEffect(() => {
    if (!quizId) {
      return;
    }

    setLocalLoading(true);
    try {
      (async () => {
        const res = await run(getQuizById(quizId));
        if (!res?.success) {
          const url = window.location.href;
          const parts = url.split('/');
          const newUrl = parts.slice(0, -1).join('/');

          window.location.replace(newUrl);
        }
        setLocalLoading(false);
      })();
    } catch (error) {
      setLocalLoading(false);
      message.error(UNEXPECTED_ERROR_MESSAGE);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizId, run, window.location.href]);

  useEffect(() => {
    if (isEmpty(currentQuiz)) {
      return;
    }

    const fetchedConfigs = {
      quizType: currentQuiz.quizType,
      startTime: dayjs.unix(Number(currentQuiz?.startTime || 0)).format(DATE_FORMAT.DATE_TIME),
      endTime: dayjs.unix(Number(currentQuiz?.endTime || 0)).format(DATE_FORMAT.DATE_TIME),
      resultVisible: currentQuiz.resultVisible,
      multipleAttempts: currentQuiz.multipleAttempts,
      assignTo: currentQuiz.assignTo,
    };

    setConfigs(fetchedConfigs);
  }, [currentQuiz]);

  useEffect(() => {
    if (!userSearch) {
      clearTimeout(userSearchRef.current);
      return;
    }
    clearTimeout(userSearchRef.current);

    const timeout = setTimeout(async () => {
      try {
        const res = await run(getStudents({ limit: 10, search: userSearch, forAssigning: true, skipList: configs.assignTo }));

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
  }, [configs.assignTo, run, userSearch]);

  const handleAssignSearch = (search) => {
    setUserSearch(search);
  };

  const handleAssignChange = (v) => {
    setAssigns(v);
  };

  const handleTimeRangeChange = (_, date) => {
    const [startTime, endTime] = date;
    setConfigs((prev: any) => ({ ...prev, startTime, endTime }));
  };

  const handleMultipleAttemptsChange = (checked) => {
    setConfigs((prev: any) => ({ ...prev, multipleAttempts: checked }));
  };

  const handleAssign = async () => {
    setLocalLoading(true);
    await run(assign({ quizId: quizId || '', assignTo: assigns }));
    setAssigns([]);
    setLocalLoading(false);
  };

  const handleRemoveAssign = useCallback(async (userId) => {
    setRemoving(prev => {
      const tmp = cloneDeep(prev);
      tmp.push(userId);
      return tmp;
    });

    await run(removeAssign({ userId, quizId: quizId || '' }));

    setRemoving(prev => {
      const tmp = cloneDeep(prev);
      return tmp.filter(item => item !== userId);
    });
  }, [quizId, run]);

  const columns: any = useMemo(() => [
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      ellipsis: true,
      render: (v) => (
        <Tooltip destroyTooltipOnHide title={v} placement="topLeft">
          <b>{v}</b>
        </Tooltip>
      ),
    },
    {
      title: 'Student ID',
      dataIndex: 'studentId',
      width: 240,
      key: 'studentId',
    },
    {
      title: 'Action',
      key: 'action',
      width: 180,
      render: (v) => (
        <Space size="middle">
          <Button
            danger
            loading={removing.includes(v?._id)}
            onClick={() => { handleRemoveAssign(v?._id); }}
          >
            <DeleteOutlined />
            Remove
          </Button>
        </Space>
      ),
    },
  ], [handleRemoveAssign, removing]);

  return (
    <Spin spinning={localLoading}>
      <div className="configuration-tab">
        <Row>
          <Col xs={{ span: 24 }} md={{ span: 24 }} lg={{ span: 24 }}>
            <Item label="Quiz type" extra="You can not change this after a quiz is created.">
              <Radio.Group
                value={configs.quizType}
                disabled
              >
                <Radio value={QuizType.TEST}>Test</Radio>
                <Radio value={QuizType.ASSIGNMENT}>Assignment</Radio>
              </Radio.Group>
            </Item>
          </Col>
        </Row>

        <Row gutter={[24, 0]}>
          <Col xs={{ span: 24 }} md={{ span: 24 }} lg={{ span: 14 }}>
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
          <Col xs={{ span: 24 }} md={{ span: 24 }} lg={{ span: 10 }} xl={{ span: 8 }}>
            <Item label="Release grades after submission">
              <Switch
                checked
              />
            </Item>
          </Col>

          { configs?.quizType === QuizType.ASSIGNMENT ? (
            <Col xs={{ span: 24 }} md={{ span: 24 }} lg={{ span: 8 }}>
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
                <div style={{ display: 'flex', gap: 8 }}>
                  <Select
                    allowClear
                    value={assigns}
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
                  <Button onClick={handleAssign} type="primary">Assign</Button>
                </div>
              </Item>
            </Col>
            <Col span={24}>
              <Table
                columns={columns}
                dataSource={configs.assignTo as any}
                rowKey="_id"
                scroll={{ y: 530, x: 1300 }}
                pagination={false}
              />
            </Col>
          </Row>
        ) : null }

      </div>
    </Spin>
  );
};

export default ConfigurationTab;
