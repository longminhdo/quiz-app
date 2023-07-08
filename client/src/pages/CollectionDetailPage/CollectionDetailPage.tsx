import { FormOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Input, Tabs } from 'antd';
import { isEmpty, isEqual } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { flushCollection, getCollectionById } from '@/actions/collection';
import CollectionDetail from '@/components/app/Library/CollectionDetail/CollectionDetail';
import CollectionDetailToolbar from '@/components/app/Library/CollectionDetailToolbar/CollectionDetailToolbar';
import MyCard from '@/components/common/MyCard/MyCard';
import useDispatchAsyncAction from '@/hooks/useDispatchAsyncAction';
import useTypedSelector from '@/hooks/useTypedSelector';
import { setLoading } from '@/modules/redux/slices/appReducer';
import { Collection } from '@/types/collection';
import './CollectionDetailPage.scss';

// TODO: update tab
const collectionTabs: Array<any> = [
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
  const [collection, setCollection] = useState<Collection>();
  const [filter, setFilter] = useState<{search: string, type: Array<string>, level: Array<string>}>({ search: '', type: [], level: [] });

  const filterRef = useRef<any>();
  const collectionRef = useRef<any>();

  const { collectionId } = useParams();

  const { currentCollection } = useTypedSelector((state) => state.collection);
  const [run] = useDispatchAsyncAction();

  const handleSearchChange = (e) => {
    const searchValue = e.target.value;

    setFilter(prev => ({ ...prev, search: searchValue }));
  };

  // TODO: add question
  const handleAddQuestion = () => {
    console.log('create question');
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
    if (isEmpty(currentCollection) || isEqual(filterRef.current, filter)) {
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
    filterRef.current = { ...filter };
  }, [currentCollection, filter, setCollection]);

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
        items={collectionTabs.map(({ id, label }) => ({
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
            value={filter.search}
            onChange={handleSearchChange}
          />
          <Button type="primary" onClick={handleAddQuestion}>
            <FormOutlined />
            New question
          </Button>
        </div>

        <CollectionDetailToolbar setFilter={setFilter} filter={filter} />

        <CollectionDetail collection={collection} />
      </MyCard>
    </div>
  );
};

export default CollectionDetailPage;