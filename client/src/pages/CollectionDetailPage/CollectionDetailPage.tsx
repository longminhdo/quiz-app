import { BookOutlined, FolderOpenOutlined, PieChartOutlined, SettingOutlined } from '@ant-design/icons';
import { Tabs } from 'antd';
import React, { useState } from 'react';
import AnalyticsTab from '@/components/app/CollectionDetail/AnalyticsTab';
import QuestionListTab from '@/components/app/CollectionDetail/QuestionListTab';
import QuizzesTab from '@/components/app/CollectionDetail/QuizzesTab';
import SettingsTab from '@/components/app/CollectionDetail/SettingsTab';
import MyCard from '@/components/common/MyCard/MyCard';
import './CollectionDetailPage.scss';

const COLLECTION_TAB_PATHS = {
  QUESTIONS: 'questions',
  ANALYTICS: 'analytics',
  QUIZZES: 'quizzes',
  SETTINGS: 'settings',
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

const QuizzesTabItem = () => (
  <div>
    <FolderOpenOutlined />
    Quizzes
  </div>
);

const SettingsTabItem = () => (
  <div>
    <SettingOutlined />
    Settings
  </div>
);

const collectionTabs: Array<any> = [
  {
    label: <QuestionsTabItem />,
    path: COLLECTION_TAB_PATHS.QUESTIONS,
  },
  {
    label: <AnalyticsTabItem />,
    path: COLLECTION_TAB_PATHS.ANALYTICS,
  },
  {
    label: <QuizzesTabItem />,
    path: COLLECTION_TAB_PATHS.QUIZZES,
  },
  {
    label: <SettingsTabItem />,
    path: COLLECTION_TAB_PATHS.SETTINGS,
  },
];

const CollectionDetailPage: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState(COLLECTION_TAB_PATHS.QUESTIONS);

  return (
    <div className="collection-detail-page">
      <Tabs
        defaultActiveKey={COLLECTION_TAB_PATHS.QUESTIONS}
        onChange={(tab) => setSelectedTab(tab)}
        type="card"
        items={collectionTabs.map(({ path, label }) => ({
          label,
          key: path,
        }))}
      />

      <MyCard className="card-content">
        {selectedTab === COLLECTION_TAB_PATHS.QUESTIONS ? (<QuestionListTab />) : null}
        {selectedTab === COLLECTION_TAB_PATHS.ANALYTICS ? (<AnalyticsTab />) : null}
        {selectedTab === COLLECTION_TAB_PATHS.QUIZZES ? (<QuizzesTab />) : null}
        {selectedTab === COLLECTION_TAB_PATHS.SETTINGS ? (<SettingsTab />) : null}
      </MyCard>
    </div>
  );
};

export default CollectionDetailPage;
