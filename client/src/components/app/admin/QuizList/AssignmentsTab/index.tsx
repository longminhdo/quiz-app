import { message } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { getQuizzes } from '@/actions/quiz';
import QuizList from '@/components/app/admin/QuizList/QuizList/QuizList';
import QuizListToolbar from '@/components/app/admin/QuizList/QuizListToolbar/QuizListToolbar';
import { UNEXPECTED_ERROR_MESSAGE } from '@/constants/message';
import useDispatchAsyncAction from '@/hooks/useDispatchAsyncAction';
import useUpdateUrlQuery from '@/hooks/useUpdateUrlQuery';
import { Quiz } from '@/types/quiz';
import { QuizType } from '@/constants';

const AssignmentsTab: React.FC = () => {
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
          const response = await run(getQuizzes({ ...params, type: QuizType.ASSIGNMENT }));
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
      <QuizListToolbar newBtnTitle="New assignment" />
      <QuizList data={quizzes} total={total} tableLoading={loading} />
    </>
  );
};

export default AssignmentsTab;
