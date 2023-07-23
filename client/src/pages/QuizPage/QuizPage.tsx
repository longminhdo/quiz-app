import dayjs from 'dayjs';
import { isEmpty } from 'lodash';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getQuizAttemptById, updateQuizAttempt } from '@/actions/quizAttempt';
import AnswerSection from '@/components/app/student/Quiz/AnswerSection/AnswerSection';
import QuestionSection from '@/components/app/student/Quiz/QuestionSection/QuestionSection';
import QuizFraction from '@/components/app/student/Quiz/QuizFraction/QuizFraction';
import QuizNavigation from '@/components/app/student/Quiz/QuizNavigation/QuizNavigation';
import QuizSettings from '@/components/app/student/Quiz/QuizSettings/QuizSettings';
import QuizTimer from '@/components/app/student/Quiz/QuizTimer/QuizTimer';
import { QuizType } from '@/constants';
import useDispatchAsyncAction from '@/hooks/useDispatchAsyncAction';
import useTypedSelector from '@/hooks/useTypedSelector';
import './QuizPage.scss';

const QuizPage: React.FC = () => {
  const { attemptId } = useParams();
  const [currentQuestion, setCurrentQuestion] = useState<any>();
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

  useEffect(() => {
    if (!currentQuizAttempt) {
      return;
    }

    let flag = 0;
    const shuffledQuestions = currentQuizAttempt?.shuffledQuestions || [];
    for (let i = 0; i < shuffledQuestions.length; i++) {
      if (isEmpty(shuffledQuestions[i]?.response)) {
        flag = i;
        break;
      }
    }

    setCurrentQuestion({ question: shuffledQuestions[flag], index: flag });
  }, [currentQuizAttempt]);

  if (loading) {
    return <div>loading</div>;
  }

  const handleNavigationChange = (index) => {
    setCurrentQuestion({ question: currentQuizAttempt?.shuffledQuestions[index], index });
  };

  return (
    <div className="quiz-page">
      <div className="header">
        <QuizFraction current={currentQuestion?.index} total={currentQuizAttempt?.shuffledQuestions?.length} />
        <QuizTimer initialTime={moment((currentQuizAttempt?.endedAt || 0) * 1000).diff(moment(), 'seconds')} />
      </div>
      <div className="content">
        <QuestionSection currentQuestion={currentQuestion} />
        <AnswerSection question={currentQuestion} />
      </div>
      <div className="footer">
        <div className="footer-left">
          <QuizSettings />
        </div>
        <div className="footer-right">
          <QuizNavigation current={currentQuestion?.index} total={currentQuizAttempt?.shuffledQuestions?.length} onChange={handleNavigationChange} />
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
