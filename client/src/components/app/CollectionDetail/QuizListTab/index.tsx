import React, { useEffect, useRef, useState } from 'react';
import { message } from 'antd';
import QuizListToolbar from '@/components/app/CollectionDetail/QuizListTab/QuizListToolbar/QuizListToolbar';
import CDQuizList from '@/components/app/CollectionDetail/QuizListTab/CDQuizList/CDQuizList';
import { Quiz } from '@/types/quiz';
import useDispatchAsyncAction from '@/hooks/useDispatchAsyncAction';
import useUpdateUrlQuery from '@/hooks/useUpdateUrlQuery';
import { getQuizzes } from '@/actions/quiz';
import { UNEXPECTED_ERROR_MESSAGE } from '@/constants/message';

const QuizListTab: React.FC = () => {
  const [quizzes, setQuizzes] = useState<Array<Quiz>>([]);
  const [total, setTotal] = useState<number>(0);

  const debounce = useRef<any>();

  const [run, loading] = useDispatchAsyncAction();
  const { currentParams } = useUpdateUrlQuery();

  const [messageApi] = message.useMessage();

  useEffect(() => {
    (() => {
      clearTimeout(debounce.current);

      debounce.current = setTimeout(async () => {
        try {
          const params = { ...currentParams };
          params?.timestamp && delete params.timestamp;
          const response = await run(getQuizzes({ ...params }));
          if (response?.statusCode === 200) {
            setQuizzes(response.data.data || []);
            setTotal(response.data.pagination?.total);
          }
        } catch (error) {
          messageApi.error(UNEXPECTED_ERROR_MESSAGE);
        }
      }, 250);
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messageApi, run, window.location.href]);

  return (
    <div className="quiz-list-tab">
      <QuizListToolbar />
      <CDQuizList data={quizzes} total={total} tableLoading={loading} />
    </div>
  );
};

export default QuizListTab;
