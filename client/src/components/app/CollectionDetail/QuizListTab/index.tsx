import { message } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getQuizzes } from '@/actions/quiz';
import QuizListToolbar from '@/components/app/QuizList/QuizListToolbar/QuizListToolbar';
import QuizList from '@/components/app/QuizList/QuizList/QuizList';
import { UNEXPECTED_ERROR_MESSAGE } from '@/constants/message';
import useDispatchAsyncAction from '@/hooks/useDispatchAsyncAction';
import useUpdateUrlQuery from '@/hooks/useUpdateUrlQuery';
import { Quiz } from '@/types/quiz';

const QuizListTab: React.FC = () => {
  const [quizzes, setQuizzes] = useState<Array<Quiz>>([]);
  const [total, setTotal] = useState<number>(0);

  const debounce = useRef<any>();

  const [run, loading] = useDispatchAsyncAction();
  const { currentParams } = useUpdateUrlQuery();
  const { collectionId } = useParams();

  const [messageApi] = message.useMessage();

  useEffect(() => {
    (() => {
      clearTimeout(debounce.current);

      debounce.current = setTimeout(async () => {
        try {
          const params = { ...currentParams };
          params?.timestamp && delete params.timestamp;
          const response = await run(getQuizzes({ createdIn: collectionId, ...params }));
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

export default QuizListTab;
