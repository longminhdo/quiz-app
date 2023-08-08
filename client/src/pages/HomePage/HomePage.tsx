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
  const [finished, setFinished] = useState<any>([]);

  const [run, loading] = useDispatchAsyncAction();

  useEffect(() => {
    (async () => {
      const onGoingParams = { limit: 4, statuses: [QuizStatus.DOING] };
      const assignedParams = { limit: 4, statuses: [QuizStatus.OPEN] };
      const finishedParams = { limit: 4, statuses: [QuizStatus.CLOSED, QuizStatus.DONE] };

      const res = await Promise.all([
        run(getUserQuizzes(onGoingParams)),
        run(getUserQuizzes(assignedParams)),
        run(getUserQuizzes(finishedParams)),
      ]);

      const [onGoingRes, assignedRes, finishedRes] = res;

      if (onGoingRes.success) {
        setOnGoing(onGoingRes.data.data);
      }

      if (assignedRes.success) {
        setAssigned(assignedRes.data.data);
      }

      if (finishedRes.success) {
        setFinished(finishedRes.data.data);
      }
    })();
  }, [run]);

  return (
    <Spin spinning={loading}>
      <div className="home-page">
        <h1 className="page-title">My quizzes</h1>
        <div className="page-content">
          <ClientQuizList
            data={onGoing}
            title="On going"
          />
          <ClientQuizList
            data={assigned}
            title="Assigned"
          />
          <ClientQuizList
            data={finished}
            title="Finished"
          />
        </div>
      </div>
    </Spin>

  );
};

export default HomePage;
