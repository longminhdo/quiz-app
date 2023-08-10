import { Spin, message } from 'antd';
import { isEqual } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { getUserQuizzes } from '@/actions/userQuiz';
import ClientQuizList from '@/components/app/student/Home/ClientQuizList/ClientQuizList';
import MyPagination from '@/components/common/MyPagination/MyPagination';
import { QuizStatus } from '@/constants';
import { UNEXPECTED_ERROR_MESSAGE } from '@/constants/message';
import useDispatchAsyncAction from '@/hooks/useDispatchAsyncAction';
import useTypedSelector from '@/hooks/useTypedSelector';
import useUpdateUrlQuery from '@/hooks/useUpdateUrlQuery';
import './ListPage.scss';

const ListStatus = {
  ONGOING: [QuizStatus.DOING],
  ASSIGNED: [QuizStatus.OPEN],
  FINISHED: [QuizStatus.CLOSED, QuizStatus.DONE],
};

const ListPage: React.FC = () => {
  const [list, setList] = useState<any>([]);
  const [total, setTotal] = useState<number>(0);
  const [title, setTitle] = useState<string>('');

  const debounce = useRef<any>();

  const [run, loading] = useDispatchAsyncAction();
  const { currentParams } = useUpdateUrlQuery();
  const { windowWidth } = useTypedSelector(state => state.app);

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
          const limit = windowWidth > 991 ? 8 : 4;
          const params = { limit, ...currentParams };
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
            span={windowWidth > 991 ? 6 : 12}
            total={total}
          />
          <MyPagination
            showTotal={false}
            total={total}
            showSizeChanger={false}
            style={{ justifyContent: 'center' }}
            defaultPageSize={windowWidth > 991 ? 8 : 4}
          />
        </div>
      </div>
    </Spin>
  );
};

export default ListPage;
