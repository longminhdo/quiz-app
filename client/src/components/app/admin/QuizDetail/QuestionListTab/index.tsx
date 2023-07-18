import { isEmpty, isEqual } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getQuizById } from '@/actions/quiz';
import useDispatchAsyncAction from '@/hooks/useDispatchAsyncAction';
import useTypedSelector from '@/hooks/useTypedSelector';
import { Quiz } from '@/types/quiz';
import QuestionListToolbar from '@/components/app/admin/QuizDetail/QuestionListTab/QuestionListToolbar/QuestionListToolbar';
import QuestionListFilter from '@/components/app/admin/QuizDetail/QuestionListTab/QuestionListFilter/QuestionListFilter';
import QuestionList from '@/components/app/admin/QuizDetail/QuestionListTab/QuestionList/QuestionList';

const QuestionListTab: React.FC = () => {
  const [quiz, setQuiz] = useState<Quiz>();
  const [filter, setFilter] = useState<{search: string, type: Array<string>, level: Array<string>}>({ search: '', type: [], level: [] });

  const childRef = useRef<any>();
  const filterRef = useRef<any>();
  const quizRef = useRef<any>();

  const { currentQuiz } = useTypedSelector((state) => state.quiz);
  const [run, loading] = useDispatchAsyncAction();
  const { quizId } = useParams();
  const navigate = useNavigate();

  // effect for fetching
  useEffect(() => {
    if (!quizId) {
      return;
    }

    (async () => {
      const res = await run(getQuizById(quizId));
      if (!res?.success) {
        navigate('/');
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizId, run, window.location.href]);

  // effect for locally filtering
  useEffect(() => {
    if (isEmpty(currentQuiz)) {
      return;
    }

    if (isEqual(filterRef.current, filter) && isEqual(currentQuiz, quizRef.current)) {
      return;
    }

    const { level, type, search } = filter;
    const newQuiz = {
      ...currentQuiz,
      questions: currentQuiz?.questions?.filter(
        q => (isEmpty(level) ? true : level.includes(String(q.level)))
             && (isEmpty(type) ? true : type.includes(String(q.type)))
             && (isEmpty(search) ? true : q.title.toLowerCase().includes(search.toLowerCase())),
      ),
    };

    setQuiz(newQuiz);
    filterRef.current = filter;
    quizRef.current = currentQuiz;
  }, [currentQuiz, filter]);

  return (
    <>
      <QuestionListToolbar setFilter={setFilter} filter={filter} />
      <QuestionListFilter setFilter={setFilter} filter={filter} />
      <QuestionList tableLoading={loading} initialQuestions={quiz?.questions || []} ref={childRef} filter={filter} />
    </>
  );
};

export default QuestionListTab;
