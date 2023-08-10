import { Spin, message } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { isEqual } from 'lodash';
import { getUserQuizzes } from '@/actions/userQuiz';
import ClientQuizList from '@/components/app/student/Home/ClientQuizList/ClientQuizList';
import MyPagination from '@/components/common/MyPagination/MyPagination';
import { QuizStatus } from '@/constants';
import { UNEXPECTED_ERROR_MESSAGE } from '@/constants/message';
import useDispatchAsyncAction from '@/hooks/useDispatchAsyncAction';
import useUpdateUrlQuery from '@/hooks/useUpdateUrlQuery';
import './ListPage.scss';

const ListStatus = {
  ONGOING: [QuizStatus.DOING],
  ASSIGNED: [QuizStatus.OPEN],
  FINISHED: [QuizStatus.CLOSED, QuizStatus.DONE],
};

const ListPage: React.FC = () => {
  const [list, setList] = useState<any>([]);
  const [run, loading] = useDispatchAsyncAction();
  const [total, setTotal] = useState<number>(0);
  const { currentParams } = useUpdateUrlQuery();
  const debounce = useRef<any>();
  const [title, setTitle] = useState<string>('');

  const [messageApi] = message.useMessage();

  useEffect(() => {
    (async () => {
      const statusesParam = (currentParams?.statuses || '').split(',');
      if (isEqual(statusesParam, ListStatus.ASSIGNED)) {
        setTitle('Assigned');
      }

      if (isEqual(statusesParam, ListStatus.FINISHED)) {
        setTitle('Finished');
      }

      if (isEqual(statusesParam, ListStatus.ONGOING)) {
        setTitle('On going');
      }

      clearTimeout(debounce.current);

      debounce.current = setTimeout(async () => {
        try {
          const params = { limit: 8, ...currentParams };
          params?.timestamp && delete params.timestamp;
          const response = await run(getUserQuizzes({ ...params }));
          if (response?.statusCode === 200) {
            setList(response.data.data || []);
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
    <Spin spinning={loading}>
      <div className="list-page">
        <h1 className="page-title">My quizzes</h1>
        <div className="page-content">
          <ClientQuizList
            data={list}
            title={title}
            showSeeMore={false}
            span={6}
            total={total}
          />
          <MyPagination
            showTotal={false}
            total={total}
            showSizeChanger={false}
            style={{ justifyContent: 'center' }}
            defaultPageSize={8}
          />
        </div>
      </div>
    </Spin>
  );
};

export default ListPage;
