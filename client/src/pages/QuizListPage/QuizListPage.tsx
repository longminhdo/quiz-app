import { Tabs } from 'antd';
import React, { useState } from 'react';
import MyCard from '@/components/common/MyCard/MyCard';
import './QuizListPage.scss';
import MyQuizzesTab from '@/components/app/admin/QuizList/MyQuizzesTab';
import SharedWithMeTab from '@/components/app/admin/QuizList/SharedWithMeTab';

const QUIZ_LIST_PAGE_TABS = {
  MY_QUIZZES: 'my-quizzes',
  SHARED_WITH_ME: 'shared-with-me',
};

const quizzesTabs: Array<any> = [
  {
    label: 'My quizzes',
    path: QUIZ_LIST_PAGE_TABS.MY_QUIZZES,
  },
  {
    label: 'Shared with me',
    path: QUIZ_LIST_PAGE_TABS.SHARED_WITH_ME,
  },
];

const QuizListPage: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState(QUIZ_LIST_PAGE_TABS.MY_QUIZZES);

  return (
    <div className="quiz-list-page">
      <Tabs
        defaultActiveKey={QUIZ_LIST_PAGE_TABS.MY_QUIZZES}
        onChange={(tab) => setSelectedTab(tab)}
        type="card"
        items={quizzesTabs.map(({ path, label }) => ({
          label,
          key: path,
        }))}
      />

      <MyCard className="card-content">
        {selectedTab === QUIZ_LIST_PAGE_TABS.MY_QUIZZES ? (<MyQuizzesTab />) : null}
        {selectedTab === QUIZ_LIST_PAGE_TABS.SHARED_WITH_ME ? (<SharedWithMeTab />) : null}
      </MyCard>
    </div>
  );
};

export default QuizListPage;
