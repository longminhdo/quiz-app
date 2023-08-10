import { EditOutlined } from '@ant-design/icons';
import { Button, Card, Col, Row, Space, Spin, Statistic, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import { getQuizAnalytics } from '@/actions/quiz';
import useDispatchAsyncAction from '@/hooks/useDispatchAsyncAction';
import useTypedSelector from '@/hooks/useTypedSelector';
import './AnalyticsTab.scss';


const AnalyticsTab: React.FC = () => {
  const [analytics, setAnalytics] = useState<any>();
  const { currentQuiz } = useTypedSelector((state) => state.quiz);
  const [run, loading] = useDispatchAsyncAction();

  useEffect(() => {
    if (!currentQuiz) {
      return;
    }

    (async () => {
      const quizId = currentQuiz._id;
      const res = await run(getQuizAnalytics(quizId));
      let status = '';

      const currentUnixTime = Math.floor(Date.now() / 1000);

      if (currentUnixTime >= currentQuiz.endTime) {
        status = 'Closed';
      } else {
        status = 'Open';
      }
      if (res?.success) {
        setAnalytics({ entries: res.data, status });
      }
    })();
  }, [currentQuiz, run]);

  const columns = [
    {
      title: 'Name',
      render: (_, record) => record?.owner?.fullName,
    },
    {
      title: 'Grade',
      render: (_, record) => record?.grade,
    },
    {
      title: 'Actions',
      width: 150,
      render: () => (
        <Space>
          <Button
            type="primary"
            ghost
          >
            <EditOutlined />
            Edit
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Spin spinning={loading}>
      { analytics ? (
        <div className="analytics-tab">
          <Row className="overview" gutter={[24, 24]}>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Status"
                  value={analytics?.status}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Entries"
                  value={analytics?.entries?.length}
                />
              </Card>
            </Col>
          </Row>

          <Table
            columns={columns}
            rowKey="_id"
            scroll={{ y: 530, x: 1300 }}
            pagination={false}
            dataSource={analytics?.entries}
          />
        </div>
      ) : null}
    </Spin>

  );
};

export default AnalyticsTab;
