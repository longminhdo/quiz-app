import { FormOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Input, Tabs } from 'antd';
import { isEmpty, isEqual } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getCollectionById } from '@/actions/collection';
import CollectionDetail from '@/components/app/Library/CollectionDetail/CollectionDetail';
import MyCard from '@/components/common/MyCard/MyCard';
import useDispatchAsyncAction from '@/hooks/useDispatchAsyncAction';
import useTypedSelector from '@/hooks/useTypedSelector';
import { setLoading } from '@/modules/redux/slices/appReducer';
import './CollectionDetailPage.scss';
import { Collection } from '@/types/collection';

const libraryTabs: Array<any> = [
  {
    label: 'My collections',
    path: 'my-collection',
    id: 1,
  },
  {
    label: 'Shared with me',
    path: 'shared-with-me',
    id: 2,
  },
];

const CollectionDetailPage = () => {
  const [selectedTab, setSelectedTab] = useState('1');
  const [search, setSearch] = useState<string>(() => new URLSearchParams(window.location.search).get('search') || '');
  const [run] = useDispatchAsyncAction();
  const { currentCollection } = useTypedSelector((state) => state.collection);
  const { collectionId } = useParams();
  const [collection, setCollection] = useState<Collection>();
  const collectionRef = useRef<any>();

  const handleSearchChange = (e) => {
    const searchValue = e.target.value;

    setSearch(searchValue);
  };

  useEffect(() => {
    if (!collectionId) {
      return;
    }

    (async () => {
      run(setLoading(true));
      await run(getCollectionById(collectionId));
      run(setLoading(false));
    })();
  }, [collectionId, run]);

  useEffect(() => {
    if (isEmpty(currentCollection) || isEqual(currentCollection, collectionRef.current)) {
      return;
    }
    setCollection(currentCollection);
    collectionRef.current = { ...currentCollection };
  }, [currentCollection]);

  return (
    <div className="collection-detail-page">
      <Tabs
        onChange={(tab) => setSelectedTab(tab)}
        type="card"
        items={libraryTabs.map(({ id, label }) => ({
          label,
          key: id,
        }))}
      />

      <MyCard className="card-content">
        <div className="toolbar">
          <Input
            placeholder="Search questions"
            prefix={<SearchOutlined />}
            allowClear
            value={search}
            onChange={handleSearchChange}
          />
          <Button type="primary">
            <FormOutlined />
            New question
          </Button>
        </div>

        <CollectionDetail collection={collection} />
      </MyCard>
    </div>
  );
};

export default CollectionDetailPage;