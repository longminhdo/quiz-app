import { message } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { getQuizzes } from '@/actions/quiz';
import { UNEXPECTED_ERROR_MESSAGE } from '@/constants/message';
import useDispatchAsyncAction from '@/hooks/useDispatchAsyncAction';
import useUpdateUrlQuery from '@/hooks/useUpdateUrlQuery';
import { Quiz } from '@/types/quiz';
import QuizListToolbar from '@/components/app/QuizList/QuizListToolbar/QuizListToolbar';
import QuizList from '@/components/app/QuizList/QuizList/QuizList';

const MyQuizzesTab: React.FC = () => {
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
    <>
      <QuizListToolbar />
      <QuizList data={quizzes} total={total} tableLoading={loading} />
    </>
  );
};

export default MyQuizzesTab;
