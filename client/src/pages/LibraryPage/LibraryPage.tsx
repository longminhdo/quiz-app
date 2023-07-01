import React, { useEffect, useRef, useState } from 'react';
import { FormOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Input, Tabs, message } from 'antd';
import { getCollections } from '@/actions/collection';
import CollectionList from '@/components/app/Library/CollectionList/CollectionList';
import MyCard from '@/components/common/MyCard/MyCard';
import { UNEXPECTED_ERROR_MESSAGE } from '@/constants/message';
import useDispatchAsyncAction from '@/hooks/useDispatchAsyncAction';
import useUpdateUrlQuery from '@/hooks/useUpdateUrlQuery';
import { Collection } from '@/types/collection';
import './LibraryPage.scss';

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

const LibraryPage = () => {
  const [search, setSearch] = useState<string>(() => new URLSearchParams(window.location.search).get('search') || '');
  const [selectedTab, setSelectedTab] = useState('1');
  const [collections, setCollections] = useState<Array<Collection>>([]);
  const [total, setTotal] = useState<number>(0);

  const debounce = useRef<any>();

  const [run, loading] = useDispatchAsyncAction();
  const { updateQuery, currentParams } = useUpdateUrlQuery();
  const [messageApi] = message.useMessage();


  const handleSearchChange = (e) => {
    const searchValue = e.target.value;

    setSearch(searchValue);
    updateQuery({
      query: {
        search: searchValue,
      },
    });
  };

  useEffect(() => {
    (() => {
      clearTimeout(debounce.current);

      debounce.current = setTimeout(async () => {
        try {
          const params = { ...currentParams };
          params?.timestamp && delete params.timestamp;

          const response = await run(getCollections({ ...params }));
          if (response?.statusCode === 200) {
            setCollections(response.data.data || []);
            setTotal(response.data.pagination?.total);
          }
        } catch (error) {
          messageApi.error(UNEXPECTED_ERROR_MESSAGE);
        }
      }, 250);
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messageApi, run, window.location.href, selectedTab]);

  return (
    <div className="library-page">
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
            placeholder="Search collections"
            prefix={<SearchOutlined />}
            allowClear
            value={search}
            onChange={handleSearchChange}
          />
          <Button type="primary">
            <FormOutlined />
            New collection
          </Button>
        </div>

        <CollectionList data={collections} total={total} tableLoading={loading} />
      </MyCard>
    </div>
  );
};

export default LibraryPage;
