import { BookOutlined, FolderOpenOutlined, FormOutlined, PieChartOutlined, SearchOutlined, SettingOutlined } from '@ant-design/icons';
import { Button, Input, Tabs } from 'antd';
import { isEmpty, isEqual } from 'lodash';
import { useEffect, useRef, useState } from 'react';
import React, { useParams } from 'react-router-dom';
import { flushCollection, getCollectionById } from '@/actions/collection';
import CollectionDetail from '@/components/app/Library/CollectionDetail/CollectionDetail';
import CollectionDetailAdvancedFilter from '@/components/app/Library/CollectionDetailAdvancedFilter/CollectionDetailAdvancedFilter';
import MyCard from '@/components/common/MyCard/MyCard';
import useDispatchAsyncAction from '@/hooks/useDispatchAsyncAction';
import useTypedSelector from '@/hooks/useTypedSelector';
import { setLoading } from '@/modules/redux/slices/appReducer';
import { Collection } from '@/types/collection';
import './CollectionDetailPage.scss';

const COLLECTION_TAB_PATHS = {
  QUESTIONS: 'questions',
  ANALYTICS: 'analytics',
  QUIZZES: 'quizzes',
  SETTINGS: 'settings',
};

const QuestionsTab = () => (
  <div>
    <BookOutlined />
    Questions
  </div>
);

const AnalyticsTab = () => (
  <div>
    <PieChartOutlined />
    Analytics
  </div>
);

const QuizzesTab = () => (
  <div>
    <FolderOpenOutlined />
    Quizzes
  </div>
);

const SettingsTab = () => (
  <div>
    <SettingOutlined />
    Settings
  </div>
);

const collectionTabs: Array<any> = [
  {
    label: <QuestionsTab />,
    path: COLLECTION_TAB_PATHS.QUESTIONS,
  },
  {
    label: <AnalyticsTab />,
    path: COLLECTION_TAB_PATHS.ANALYTICS,
  },
  {
    label: <QuizzesTab />,
    path: COLLECTION_TAB_PATHS.QUIZZES,
  },
  {
    label: <SettingsTab />,
    path: COLLECTION_TAB_PATHS.SETTINGS,
  },
];

const CollectionDetailPage = () => {
  const [selectedTab, setSelectedTab] = useState(COLLECTION_TAB_PATHS.QUESTIONS);
  const [collection, setCollection] = useState<Collection>();
  const [filter, setFilter] = useState<{search: string, type: Array<string>, level: Array<string>}>({ search: '', type: [], level: [] });

  const filterRef = useRef<any>();
  const collectionRef = useRef<any>();
  const childRef = useRef<any>();

  const { collectionId } = useParams();

  const { currentCollection } = useTypedSelector((state) => state.collection);
  const [run] = useDispatchAsyncAction();

  const handleSearchChange = (e) => {
    const searchValue = e.target.value;

    setFilter(prev => ({ ...prev, search: searchValue }));
  };

  const handleAddQuestion = () => {
    childRef?.current?.createNewQuestion && childRef.current.createNewQuestion();
  };

  useEffect(() => {
    if (!collectionId) {
      return () => undefined;
    }

    (async () => {
      run(setLoading(true));
      await run(getCollectionById(collectionId));
      run(setLoading(false));
    })();

    return () => {
      run(flushCollection());
      return undefined;
    };
  }, [collectionId, run]);

  useEffect(() => {
    if (isEmpty(currentCollection)) {
      return;
    }

    if (isEqual(filterRef.current, filter) && isEqual(currentCollection, collectionRef.current)) {
      return;
    }

    const { level, type, search } = filter;
    const newCollection = {
      ...currentCollection,
      questions: currentCollection?.questions?.filter(
        q => (isEmpty(level) ? true : level.includes(String(q.level)))
             && (isEmpty(type) ? true : type.includes(String(q.type)))
             && (isEmpty(search) ? true : q.title.toLowerCase().includes(search.toLowerCase())),
      ),
    };

    setCollection(newCollection);
    filterRef.current = filter;
    collectionRef.current = currentCollection;
  }, [currentCollection, filter, setCollection]);

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

      {selectedTab === COLLECTION_TAB_PATHS.QUESTIONS ? (
        <MyCard className="card-content">
          <div className="toolbar">
            <Input
              placeholder="Search questions"
              prefix={<SearchOutlined />}
              allowClear
              value={filter.search}
              onChange={handleSearchChange}
            />
            <Button type="primary" onClick={handleAddQuestion}>
              <FormOutlined />
              New question
            </Button>
          </div>
          <CollectionDetailAdvancedFilter setFilter={setFilter} filter={filter} />
          <CollectionDetail collection={collection} ref={childRef} filter={filter} />
        </MyCard>
      ) : null}

      {selectedTab === COLLECTION_TAB_PATHS.ANALYTICS ? (
        <MyCard className="card-content">
          ANALYTICS
        </MyCard>
      ) : null}

      {selectedTab === COLLECTION_TAB_PATHS.QUIZZES ? (
        <MyCard className="card-content">
          QUIZZES
        </MyCard>
      ) : null}

      {selectedTab === COLLECTION_TAB_PATHS.SETTINGS ? (
        <MyCard className="card-content">
          SETTINGS
        </MyCard>
      ) : null}
    </div>
  );
};

export default CollectionDetailPage;
