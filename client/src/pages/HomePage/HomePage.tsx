import { Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { getUserQuizzes } from '@/actions/userQuiz';
import ClientQuizList from '@/components/app/student/Home/ClientQuizList/ClientQuizList';
import { QuizStatus } from '@/constants';
import useDispatchAsyncAction from '@/hooks/useDispatchAsyncAction';
import './HomePage.scss';

const HomePage: React.FC = () => {
  const [onGoing, setOnGoing] = useState<any>({ list: [], total: 0 });
  const [assigned, setAssigned] = useState<any>({ list: [], total: 0 });
  const [finished, setFinished] = useState<any>({ list: [], total: 0 });

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
        setOnGoing({ list: onGoingRes.data.data, total: onGoingRes.data.pagination.total });
      }

      if (assignedRes.success) {
        setAssigned({ list: assignedRes.data.data, total: assignedRes.data.pagination.total });
      }

      if (finishedRes.success) {
        setFinished({ list: finishedRes.data.data, total: finishedRes.data.pagination.total });
      }
    })();
  }, [run]);

  return (
    <Spin spinning={loading}>
      <div className="home-page">
        <h1 className="page-title">My quizzes</h1>
        <div className="page-content">
          <ClientQuizList
            data={onGoing.list}
            title="On going"
            statuses={[QuizStatus.DOING]}
            total={onGoing.total}
          />
          <ClientQuizList
            data={assigned.list}
            title="Assigned"
            statuses={[QuizStatus.OPEN]}
            total={assigned.total}
          />
          <ClientQuizList
            data={finished.list}
            title="Finished"
            statuses={[QuizStatus.CLOSED, QuizStatus.DONE]}
            total={finished.total}
          />
        </div>
      </div>
    </Spin>

  );
};

export default HomePage;
