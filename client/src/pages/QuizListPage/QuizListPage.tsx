import { Tabs } from 'antd';
import React, { useState } from 'react';
import AssignmentsTab from '@/components/app/admin/QuizList/AssignmentsTab';
import QuizzesTab from '@/components/app/admin/QuizList/QuizzesTab';
import MyCard from '@/components/common/MyCard/MyCard';
import './QuizListPage.scss';

const QUIZ_LIST_PAGE_TABS = {
  QUIZZES: 'quizzes',
  ASSIGNMENTS: 'assignments',
};

const quizzesTabs: Array<any> = [
  {
    label: 'Quizzes',
    path: QUIZ_LIST_PAGE_TABS.QUIZZES,
  },
  {
    label: 'Assignments',
    path: QUIZ_LIST_PAGE_TABS.ASSIGNMENTS,
  },
];

const QuizListPage: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState(QUIZ_LIST_PAGE_TABS.QUIZZES);

  return (
    <div className="quiz-list-page">
      <Tabs
        defaultActiveKey={QUIZ_LIST_PAGE_TABS.QUIZZES}
        onChange={(tab) => setSelectedTab(tab)}
        type="card"
        items={quizzesTabs.map(({ path, label }) => ({
          label,
          key: path,
        }))}
      />

      <MyCard className="card-content">
        {selectedTab === QUIZ_LIST_PAGE_TABS.QUIZZES ? (<QuizzesTab />) : null}
        {selectedTab === QUIZ_LIST_PAGE_TABS.ASSIGNMENTS ? (<AssignmentsTab />) : null}
      </MyCard>
    </div>
  );
};

export default QuizListPage;
