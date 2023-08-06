import { Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { getUserQuizzes } from '@/actions/userQuiz';
import ClientQuizList from '@/components/app/student/Home/ClientQuizList/ClientQuizList';
import { QuizStatus } from '@/constants';
import useDispatchAsyncAction from '@/hooks/useDispatchAsyncAction';
import './HomePage.scss';

const HomePage: React.FC = () => {
  const [onGoing, setOnGoing] = useState<any>([]);
  const [assigned, setAssigned] = useState<any>([]);

  const [run, loading] = useDispatchAsyncAction();

  useEffect(() => {
    (async () => {
      const onGoingParams = { limit: 4, status: QuizStatus.DOING };
      const assignedParams = { limit: 4, status: QuizStatus.OPEN };

      const res = await Promise.all([
        run(getUserQuizzes(onGoingParams)),
        run(getUserQuizzes(assignedParams)),
      ]);


      const [onGoingRes, assignedRes] = res;

      console.log(res, assignedRes);

      if (onGoingRes.success) {
        setOnGoing(onGoingRes.data.data);
      }

      if (assignedRes.success) {
        setAssigned(assignedRes.data.data);
      }
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
          />
          <ClientQuizList
            data={assigned}
            title="Assigned"
          />
        </div>
      </div>
    </Spin>

  );
};

export default HomePage;
