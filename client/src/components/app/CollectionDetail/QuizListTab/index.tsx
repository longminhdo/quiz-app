import React, { useEffect, useRef, useState } from 'react';
import { message } from 'antd';
import { useParams } from 'react-router-dom';
import CDQuizListToolbar from '@/components/app/CollectionDetail/QuizListTab/CDQuizListToolbar/CDQuizListToolbar';
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
    <div className="quiz-list-tab">
      <CDQuizListToolbar />
      <CDQuizList data={quizzes} total={total} tableLoading={loading} />
    </div>
  );
};

export default QuizListTab;
