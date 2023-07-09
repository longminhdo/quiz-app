import { Tabs } from 'antd';
import React, { useState } from 'react';
import MyCollectionTab from '@/components/app/CollectionList/MyCollectionsTab';
import SharedWithMeTab from '@/components/app/CollectionList/SharedWithMeTab';
import MyCard from '@/components/common/MyCard/MyCard';
import './CollectionListPage.scss';

const LIBRARY_TAB_PATHS = {
  MY_COLLECTION: 'my-collection',
  SHARED_WITH_ME: 'shared-with-me',
};

const libraryTabs: Array<any> = [
  {
    label: 'My collections',
    path: LIBRARY_TAB_PATHS.MY_COLLECTION,
  },
  {
    label: 'Shared with me',
    path: LIBRARY_TAB_PATHS.SHARED_WITH_ME,
  },
];

const CollectionListPage: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState(LIBRARY_TAB_PATHS.MY_COLLECTION);

  return (
    <div className="collection-list-page">
      <Tabs
        defaultActiveKey={LIBRARY_TAB_PATHS.MY_COLLECTION}
        onChange={(tab) => setSelectedTab(tab)}
        type="card"
        items={libraryTabs.map(({ path, label }) => ({
          label,
          key: path,
        }))}
      />

      <MyCard className="card-content">
        {selectedTab === LIBRARY_TAB_PATHS.MY_COLLECTION ? (<MyCollectionTab />) : null}
        {selectedTab === LIBRARY_TAB_PATHS.SHARED_WITH_ME ? (<SharedWithMeTab />) : null}
      </MyCard>
    </div>
  );
};

export default CollectionListPage;
