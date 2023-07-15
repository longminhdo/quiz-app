import { Tabs } from 'antd';
import React, { useState } from 'react';
import MyQuizzesTab from '@/components/app/Quizzes/MyQuizzesTab';
import SharedWithMeTab from '@/components/app/Quizzes/SharedWithMeTab';
import MyCard from '@/components/common/MyCard/MyCard';
import './QuizListPage.scss';

const QUIZZES_TAB_PATHS = {
  MY_QUIZZES: 'my-quizzes',
  SHARED_WITH_ME: 'shared-with-me',
};

const quizzesTabs: Array<any> = [
  {
    label: 'My quizzes',
    path: QUIZZES_TAB_PATHS.MY_QUIZZES,
  },
  {
    label: 'Shared with me',
    path: QUIZZES_TAB_PATHS.SHARED_WITH_ME,
  },
];

const QuizListPage: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState(QUIZZES_TAB_PATHS.MY_QUIZZES);

  return (
    <div className="quiz-list-page">
      <Tabs
        defaultActiveKey={QUIZZES_TAB_PATHS.MY_QUIZZES}
        onChange={(tab) => setSelectedTab(tab)}
        type="card"
        items={quizzesTabs.map(({ path, label }) => ({
          label,
          key: path,
        }))}
      />

      <MyCard className="card-content">
        {selectedTab === QUIZZES_TAB_PATHS.MY_QUIZZES ? (<MyQuizzesTab />) : null}
        {selectedTab === QUIZZES_TAB_PATHS.SHARED_WITH_ME ? (<SharedWithMeTab />) : null}
      </MyCard>
    </div>
  );
};

export default QuizListPage;
