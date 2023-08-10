import { Card, Col, Row, Spin, Statistic } from 'antd';
import React, { useEffect, useState } from 'react';
import { countAll } from '@/actions/analytics';
import useDispatchAsyncAction from '@/hooks/useDispatchAsyncAction';
import './ReportsPage.scss';

const ReportsPage: React.FC = () => {
  const [count, setCount] = useState<any>();
  const [run, loading] = useDispatchAsyncAction();

  useEffect(() => {
    (async () => {
      const res = await run(countAll());

      if (res?.success) {
        setCount(res?.data);
      }
    })();
  }, [run]);

  return (
    <Spin spinning={loading}>
      <div className="reports-page">
        <Row gutter={[12, 12]}>
          <Col span={6}>
            <Card>
              <Statistic
                title="Collections"
                value={count?.collectionCount}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Quizzes (Test)"
                value={count?.testCount}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Assignments"
                value={count?.assignmentCount}
              />
            </Card>
          </Col>
        </Row>
      </div>
    </Spin>
  );
};

export default ReportsPage;
