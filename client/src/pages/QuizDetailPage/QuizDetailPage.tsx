import { BookOutlined, PieChartOutlined, SettingOutlined } from '@ant-design/icons';
import { Tabs } from 'antd';
import React, { useEffect, useState } from 'react';
import { flushQuiz } from '@/actions/quiz';
import ConfigurationTab from '@/components/app/admin/QuizDetail/ConfigurationTab';
import QuestionListTab from '@/components/app/admin/QuizDetail/QuestionListTab';
import MyCard from '@/components/common/MyCard/MyCard';
import useDispatchAsyncAction from '@/hooks/useDispatchAsyncAction';
import useUpdateUrlQuery from '@/hooks/useUpdateUrlQuery';
import './QuizDetailPage.scss';
import AnalyticsTab from '@/components/app/admin/QuizDetail/AnalyticsTab/AnalyticsTab';

const QUIZ_TAB_PATHS = {
  QUESTIONS: 'questions',
  CONFIGURATIONS: 'configurations',
  ANALYTICS: 'analytics',
};

const QuestionsTabItem = () => (
  <div>
    <BookOutlined />
    Questions
  </div>
);

const AnalyticsTabItem = () => (
  <div>
    <PieChartOutlined />
    Analytics
  </div>
);

const ConfigurationTabItem = () => (
  <div>
    <SettingOutlined />
    Configurations
  </div>
);

const collectionTabs: Array<any> = [
  {
    label: <QuestionsTabItem />,
    path: QUIZ_TAB_PATHS.QUESTIONS,
  },
  {
    label: <ConfigurationTabItem />,
    path: QUIZ_TAB_PATHS.CONFIGURATIONS,
  },
  {
    label: <AnalyticsTabItem />,
    path: QUIZ_TAB_PATHS.ANALYTICS,
  },

];

const QuizDetailPage: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState(QUIZ_TAB_PATHS.QUESTIONS);

  const [run] = useDispatchAsyncAction();
  const { clearParams } = useUpdateUrlQuery();

  useEffect(() => () => {
    run(flushQuiz());
    return undefined;
  }, [run]);

  return (
    <div className="quiz-detail-page">
      <Tabs
        defaultActiveKey={QUIZ_TAB_PATHS.QUESTIONS}
        onChange={(tab) => {
          clearParams();
          setSelectedTab(tab);
        }}
        type="card"
        items={collectionTabs.map(({ path, label }) => ({
          label,
          key: path,
        }))}
      />

      <MyCard className="card-content">
        {selectedTab === QUIZ_TAB_PATHS.QUESTIONS ? (<QuestionListTab />) : null}
        {selectedTab === QUIZ_TAB_PATHS.ANALYTICS ? (<AnalyticsTab />) : null}
        {selectedTab === QUIZ_TAB_PATHS.CONFIGURATIONS ? (<ConfigurationTab />) : null}
      </MyCard>

    </div>
  );
};

export default QuizDetailPage;
