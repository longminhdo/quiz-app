import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getQuizById } from '@/actions/quiz';
import AnswerSection from '@/components/app/student/Quiz/AnswerSection/AnswerSection';
import QuestionSection from '@/components/app/student/Quiz/QuestionSection/QuestionSection';
import QuizNavigation from '@/components/app/student/Quiz/QuizNavigation/QuizNavigation';
import QuizSettings from '@/components/app/student/Quiz/QuizSettings/QuizSettings';
import QuizTimer from '@/components/app/student/Quiz/QuizTimer/QuizTimer';
import useDispatchAsyncAction from '@/hooks/useDispatchAsyncAction';
import './QuizPage.scss';

const QuizPage: React.FC = () => {
  const { quizId } = useParams();
  const [currentQuestion, setCurrentQuestion] = useState();
  const [run] = useDispatchAsyncAction();

  useEffect(() => {
    if (!quizId) {
      return;
    }

    (async() => {
      run(getQuizById(quizId));
    })();
  }, [quizId, run]);

  return (
    <div className="quiz-page">
      <div className="header">
        <QuizTimer />
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
