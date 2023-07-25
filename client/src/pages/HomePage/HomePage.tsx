import { Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { getQuizAttempts } from '@/actions/quizAttempt';
import ClientQuizList from '@/components/app/student/Home/ClientQuizList/ClientQuizList';
import useDispatchAsyncAction from '@/hooks/useDispatchAsyncAction';
import './HomePage.scss';
import { QuizStatus } from '@/constants';

const HomePage: React.FC = () => {
  const [onGoing, setOnGoing] = useState<any>([]);
  const [assigned, setAssigned] = useState<any>([]);

  const [run, loading] = useDispatchAsyncAction();

  useEffect(() => {
    (async () => {
      const onGoingParams = { limit: 4, submitted: false };

      const res = await Promise.all([run(getQuizAttempts(onGoingParams))]);

      res.forEach(r => {
        if (r.success) {
          setOnGoing(r?.data?.data || []);
        }
      });
    })();
  }, [run]);

  return (
    <Spin spinning={loading}>
      <div className="home-page">
        <h1 className="page-title">My quizzes</h1>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          <ClientQuizList
            data={onGoing}
            title="On going"
            status={QuizStatus.DOING}
          />
          <ClientQuizList
            data={assigned}
            title="Assigned"
            status={QuizStatus.DOING}
          />
        </div>
      </div>
    </Spin>

  );
};

export default HomePage;
