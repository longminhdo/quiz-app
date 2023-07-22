import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { getQuizAttemptById, updateQuizAttempt } from '@/actions/quizAttempt';
import AnswerSection from '@/components/app/student/Quiz/AnswerSection/AnswerSection';
import QuestionSection from '@/components/app/student/Quiz/QuestionSection/QuestionSection';
import QuizNavigation from '@/components/app/student/Quiz/QuizNavigation/QuizNavigation';
import QuizSettings from '@/components/app/student/Quiz/QuizSettings/QuizSettings';
import QuizTimer from '@/components/app/student/Quiz/QuizTimer/QuizTimer';
import useDispatchAsyncAction from '@/hooks/useDispatchAsyncAction';
import useTypedSelector from '@/hooks/useTypedSelector';
import './QuizPage.scss';
import { QuizType } from '@/constants';

const QuizPage: React.FC = () => {
  const { attemptId } = useParams();
  const [currentQuestion, setCurrentQuestion] = useState();
  const [loading, setLoading] = useState(true);

  const [run] = useDispatchAsyncAction();
  const { currentQuizAttempt } = useTypedSelector(state => state.quizAttempt);

  useEffect(() => {
    if (!attemptId) {
      return;
    }

    (async () => {
      setLoading(true);
      const res = await run(getQuizAttemptById(attemptId));

      if (res?.success) {
        const data = res?.data;
        if (data?.quiz?.quizType === QuizType.TEST && !data?.endedAt) {
          const endedAt = dayjs().add(data?.quiz?.duration, 'minutes').unix();
          await run(updateQuizAttempt({ ...data, endedAt }));
        }
      }
      setLoading(false);
    })();
  }, [attemptId, run]);

  if (loading) {
    return <div>loading</div>;
  }

  return (
    <div className="quiz-page">
      <div className="header">
        <QuizTimer initialTime={moment((currentQuizAttempt?.endedAt || 0) * 1000).diff(moment(), 'seconds')} />
      </div>
      <div className="content">
        <QuestionSection />
        <AnswerSection />
      </div>
      <div className="footer">
        <div className="footer-left">
          <QuizSettings />
        </div>
        <div className="footer-right">
          <QuizNavigation />
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
