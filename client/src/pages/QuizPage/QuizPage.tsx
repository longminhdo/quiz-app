import { cloneDeep, isEmpty, isEqual } from 'lodash';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { submitQuizAttempt } from '@/actions/quizAttempt';
import { getUserQuizById, updateAttempt } from '@/actions/userQuiz';
import AnswerSection from '@/components/app/student/Quiz/AnswerSection/AnswerSection';
import QuestionSection from '@/components/app/student/Quiz/QuestionSection/QuestionSection';
import QuizFraction from '@/components/app/student/Quiz/QuizFraction/QuizFraction';
import QuizNavigation from '@/components/app/student/Quiz/QuizNavigation/QuizNavigation';
import QuizTimer from '@/components/app/student/Quiz/QuizTimer/QuizTimer';
import SubmitConfirmation from '@/components/app/student/Quiz/SubmitConfirmation/SubmitConfirmation';
import LoadingScreen from '@/components/others/LoadingScreen/LoadingScreen';
import MuteButton from '@/components/others/MuteButton/MuteButton';
import PlayButton from '@/components/others/PlayButton/PlayButton';
import SettingsButton from '@/components/others/SettingsButton/SettingsButton';
import { routePaths } from '@/constants/routePaths';
import { AudioContext } from '@/contexts/AudioContext';
import useDispatchAsyncAction from '@/hooks/useDispatchAsyncAction';
import useTypedSelector from '@/hooks/useTypedSelector';
import { setLoading } from '@/modules/redux/slices/appReducer';
import { UserQuiz } from '@/types/userQuiz';
import './QuizPage.scss';

const QuizPage: React.FC = () => {
  const { userQuizId } = useParams();
  const [currentQuestion, setCurrentQuestion] = useState<any>();
  const [localLoading, setLocalLoading] = useState(true);
  const [localUserQuiz, setLocalUserQuiz] = useState<UserQuiz>();
  const [isFirstRender, setIsFirstRender] = useState(true);
  const [willSubmit, setWillSubmit] = useState(false);

  const debounceRef = useRef<any>();
  const userQuizRef = useRef<UserQuiz>();

  const navigate = useNavigate();

  const [run] = useDispatchAsyncAction();
  const { currentUserQuiz } = useTypedSelector(state => state.userQuiz);

  const { handleToggleMute, handleTogglePlay, muted, isPlaying } = useContext(AudioContext);

  useEffect(() => {
    if (!userQuizId) {
      return;
    }

    (async () => {
      setLocalLoading(true);
      try {
        const res = await run(getUserQuizById(userQuizId));

        if (!res?.success) {
          navigate(routePaths.JOIN);
        }
      } catch (error) {
        navigate(routePaths.JOIN);
      }
      setLocalLoading(false);
      setIsFirstRender(false);
    })();
  }, [userQuizId, navigate, run]);

  useEffect(() => {
    if (!currentUserQuiz) {
      return;
    }

    const currentAttempt = cloneDeep(currentUserQuiz.attempts[currentUserQuiz.attempts.length - 1]);
    const currentCompletedQuestions = currentAttempt?.completedQuestions || [];
    let flag = 0;
    const shuffledQuestions = currentUserQuiz?.shuffledQuestions || [];
    for (let i = 0; i < shuffledQuestions.length; i++) {
      const tmp = shuffledQuestions[i];
      if (!currentCompletedQuestions?.find(item => item?.question === tmp._id)) {
        flag = i;
        break;
      }
    }

    setLocalUserQuiz({ ...currentUserQuiz, currentAttempt });
    setCurrentQuestion({ question: shuffledQuestions[flag], index: flag });
    if (isFirstRender) {
      userQuizRef.current = cloneDeep({ ...currentUserQuiz, currentAttempt });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUserQuiz]);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    if (isFirstRender || isEqual(localUserQuiz, userQuizRef.current) || isEmpty(localUserQuiz)) {
      clearTimeout(debounceRef.current);
      return;
    }

    const debounce = setTimeout(() => {
      localUserQuiz?.currentAttempt && run(updateAttempt(localUserQuiz.currentAttempt));
    }, 300);

    userQuizRef.current = cloneDeep(localUserQuiz);
    debounceRef.current = debounce;
  }, [isFirstRender, localUserQuiz, run]);

  const handleNavigationChange = (index) => {
    if (index >= currentUserQuiz?.shuffledQuestions?.length) {
      setWillSubmit(true);
      return;
    }

    setWillSubmit(false);
    setCurrentQuestion({ question: currentUserQuiz?.shuffledQuestions[index], index });
  };

  const handleAnswerChange = (value) => {
    setLocalUserQuiz((prev: any) => {
      const { question } = value;
      const newCompletedQuestions = prev?.currentAttempt?.completedQuestions || [];
      const foundIndex = newCompletedQuestions.findIndex(item => item.question === question);

      if (foundIndex !== -1) {
        newCompletedQuestions[foundIndex] = value;
      } else {
        newCompletedQuestions.push(value);
      }

      return { ...prev, currentAttempt: { ...prev.currentAttempt, completedQuestions: newCompletedQuestions } };
    });
  };

  // TODO: handle submit new
  const handleSubmit = async () => {
    run(setLoading(true));

    try {
      const res = await run(submitQuizAttempt(localUserQuiz));

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

  const renderContent = () => {
    if (localLoading) {
      return <LoadingScreen />;
    }

    if (willSubmit) {
      return <SubmitConfirmation onSubmit={handleSubmit} />;
    }

    return (
      <>
        <QuestionSection currentQuestion={currentQuestion} />
        <AnswerSection
          currentQuestion={currentQuestion}
          currentResponse={localUserQuiz?.currentAttempt?.completedQuestions?.find(item => item.question === currentQuestion?.question?._id)?.response || []}
          onChange={handleAnswerChange}
        />
      </>
    );
  };

  return (
    <div className="quiz-page">
      <div className="header">
        { currentQuestion && <QuizFraction current={currentQuestion?.index} total={currentUserQuiz?.shuffledQuestions?.length} />}
        <QuizTimer endTime={localUserQuiz?.quiz.endTime || 0} />
      </div>
      <div className="content">
        {renderContent()}
      </div>
      <div className="footer">
        <div className="footer-left">
          <SettingsButton />
          <PlayButton onClick={handleTogglePlay} isPlaying={isPlaying} />
          <MuteButton onClick={handleToggleMute} muted={muted} />
        </div>
        <div className="footer-right">
          <QuizNavigation
            current={willSubmit ? currentUserQuiz?.shuffledQuestions?.length : currentQuestion?.index}
            total={currentUserQuiz?.shuffledQuestions?.length}
            onChange={handleNavigationChange}
          />
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
