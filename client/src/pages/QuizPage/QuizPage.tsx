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
import { QuizAttempt } from '@/types/quizAttempt';
import { Question } from '@/types/question';

const QuizPage: React.FC = () => {
  const { attemptId } = useParams();
  const [localQuestion, setLocalQuestion] = useState<any>();
  const [loading, setLoading] = useState(true);
  const [localAttempt, setLocalAttempt] = useState<QuizAttempt>();

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

    setLocalAttempt(currentQuizAttempt);
    setLocalQuestion({ question: shuffledQuestions[flag], index: flag });
  }, [currentQuizAttempt]);

  if (loading) {
    return <div>loading</div>;
  }

  const handleNavigationChange = (index) => {
    setLocalQuestion({ question: currentQuizAttempt?.shuffledQuestions[index], index });
  };

  const handleAnswerChange = (value) => {
    setLocalAttempt((prev: any) => {
      const { question } = value;
      const newCompletedQuestions = prev?.completedQuestions || [];
      const foundIndex = newCompletedQuestions.findIndex(item => item.question === question);

      if (foundIndex !== -1) {
        newCompletedQuestions[foundIndex] = value;
      } else {
        newCompletedQuestions.push(value);
      }

      return { ...prev, completedQuestions: newCompletedQuestions };
    });
  };

  return (
    <div className="quiz-page">
      <div className="header">
        <QuizFraction current={localQuestion?.index} total={currentQuizAttempt?.shuffledQuestions?.length} />
        <QuizTimer initialTime={moment((currentQuizAttempt?.endedAt || 0) * 1000).diff(moment(), 'seconds')} />
      </div>
      <div className="content">
        <QuestionSection currentQuestion={localQuestion} />
        <AnswerSection
          currentQuestion={localQuestion}
          currentResponse={localAttempt?.completedQuestions?.find(item => item.question === localQuestion?.question?._id)?.response || []}
          onChange={handleAnswerChange}
        />
      </div>
      <div className="footer">
        <div className="footer-left">
          <QuizSettings />
        </div>
        <div className="footer-right">
          <QuizNavigation
            current={localQuestion?.index}
            total={currentQuizAttempt?.shuffledQuestions?.length}
            onChange={handleNavigationChange}
          />
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
