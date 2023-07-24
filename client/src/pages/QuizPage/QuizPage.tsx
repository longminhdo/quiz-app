import dayjs from 'dayjs';
import { cloneDeep, isEmpty, isEqual } from 'lodash';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getQuizAttemptById, submitQuizAttempt, updateFlushQuizAttempt, updateQuizAttempt } from '@/actions/quizAttempt';
import AnswerSection from '@/components/app/student/Quiz/AnswerSection/AnswerSection';
import QuestionSection from '@/components/app/student/Quiz/QuestionSection/QuestionSection';
import QuizFraction from '@/components/app/student/Quiz/QuizFraction/QuizFraction';
import QuizNavigation from '@/components/app/student/Quiz/QuizNavigation/QuizNavigation';
import QuizSettings from '@/components/app/student/Quiz/QuizSettings/QuizSettings';
import QuizTimer from '@/components/app/student/Quiz/QuizTimer/QuizTimer';
import SubmitConfirmation from '@/components/app/student/Quiz/SubmitConfirmation/SubmitConfirmation';
import { QuizType } from '@/constants';
import useDispatchAsyncAction from '@/hooks/useDispatchAsyncAction';
import useTypedSelector from '@/hooks/useTypedSelector';
import { QuizAttempt } from '@/types/quizAttempt';
import './QuizPage.scss';
import { setLoading } from '@/modules/redux/slices/appReducer';
import { routePaths } from '@/constants/routePaths';

const QuizPage: React.FC = () => {
  const { attemptId } = useParams();
  const [localQuestion, setLocalQuestion] = useState<any>();
  const [localLoading, setLocalLoading] = useState(true);
  const [localAttempt, setLocalAttempt] = useState<QuizAttempt>();
  const [isFirstRender, setIsFirstRender] = useState(true);
  const [willSubmit, setWillSubmit] = useState(false);

  const debounceRef = useRef<any>();
  const attemptRef = useRef<QuizAttempt>();

  const navigate = useNavigate();

  const [run] = useDispatchAsyncAction();
  const { currentQuizAttempt } = useTypedSelector(state => state.quizAttempt);

  useEffect(() => {
    if (!attemptId) {
      return;
    }

    (async () => {
      setLocalLoading(true);
      try {
        const res = await run(getQuizAttemptById(attemptId));

        if (res?.success) {
          const data = res?.data;
          if (data?.quiz?.quizType === QuizType.TEST && !data?.endedAt) {
            const endedAt = dayjs().add(data?.quiz?.duration, 'minutes').unix();
            await run(updateQuizAttempt({ ...data, endedAt }));
          }
        } else {
          navigate(routePaths.JOIN);
        }
      } catch (error) {
        navigate(routePaths.JOIN);
      }
      setLocalLoading(false);
      setIsFirstRender(false);
    })();
  }, [attemptId, navigate, run]);

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
    if (isFirstRender) {
      attemptRef.current = cloneDeep(currentQuizAttempt);
    }
  }, [currentQuizAttempt, isFirstRender]);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    if (isFirstRender || isEqual(localAttempt, attemptRef.current) || isEmpty(localAttempt)) {
      return;
    }

    const debounce = setTimeout(() => {
      run(updateFlushQuizAttempt(localAttempt));
    }, 300);

    attemptRef.current = cloneDeep(localAttempt);
    debounceRef.current = debounce;
  }, [isFirstRender, localAttempt, run]);

  const handleNavigationChange = (index) => {
    if (index >= currentQuizAttempt?.shuffledQuestions?.length) {
      setWillSubmit(true);
      return;
    }

    setWillSubmit(false);
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

  const handleSubmit = async () => {
    run(setLoading(true));

    try {
      const res = await run(submitQuizAttempt(localAttempt));

      if (res?.success) {
        const quiz = res?.data?.quiz;
        if (!quiz?.resultVisible) {
          navigate(routePaths.HOME);
          run(setLoading(false));
          return;
        }
      }
    } catch (error) {
      navigate(routePaths.HOME);
      run(setLoading(false));
    }

    run(setLoading(false));
  };

  if (localLoading) {
    return <div>loading</div>;
  }

  return (
    <div className="quiz-page">
      <div className="header">
        <QuizFraction current={localQuestion?.index} total={currentQuizAttempt?.shuffledQuestions?.length} />
        <QuizTimer initialTime={moment((currentQuizAttempt?.endedAt || 0) * 1000).diff(moment(), 'seconds')} />
      </div>
      <div className="content">
        {willSubmit
          ? (
            <SubmitConfirmation onSubmit={handleSubmit} />
          )
          : (
            <>
              <QuestionSection currentQuestion={localQuestion} />
              <AnswerSection
                currentQuestion={localQuestion}
                currentResponse={localAttempt?.completedQuestions?.find(item => item.question === localQuestion?.question?._id)?.response || []}
                onChange={handleAnswerChange}
              />
            </>
          )}
      </div>
      <div className="footer">
        <div className="footer-left">
          <QuizSettings />
        </div>
        <div className="footer-right">
          <QuizNavigation
            current={willSubmit ? currentQuizAttempt?.shuffledQuestions?.length : localQuestion?.index}
            total={currentQuizAttempt?.shuffledQuestions?.length}
            onChange={handleNavigationChange}
          />
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
