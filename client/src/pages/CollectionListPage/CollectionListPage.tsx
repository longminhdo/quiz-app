import { FormOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Input, Modal, Tabs, message } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCollection, getCollections } from '@/actions/collection';
import CollectionList from '@/components/app/Library/CollectionList/CollectionList';
import MyCard from '@/components/common/MyCard/MyCard';
import { UNEXPECTED_ERROR_MESSAGE } from '@/constants/message';
import { routePaths } from '@/constants/routePaths';
import useDispatchAsyncAction from '@/hooks/useDispatchAsyncAction';
import useUpdateUrlQuery from '@/hooks/useUpdateUrlQuery';
import { Collection } from '@/types/collection';
import './CollectionListPage.scss';

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

const CollectionListPage = () => {
  const [search, setSearch] = useState<string>(() => new URLSearchParams(window.location.search).get('search') || '');
  const [selectedTab, setSelectedTab] = useState('1');
  const [collections, setCollections] = useState<Array<Collection>>([]);
  const [total, setTotal] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCollectionTitle, setNewCollectionTitle] = useState('');

  const debounce = useRef<any>();
  const inputRef = useRef<any>();

  const [run, loading] = useDispatchAsyncAction();
  const { updateQuery, currentParams } = useUpdateUrlQuery();
  const [messageApi] = message.useMessage();
  const navigate = useNavigate();

  const handleNewCollectionClick = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setNewCollectionTitle('');
    setIsModalOpen(false);
  };

  const handleOk = async () => {
    const res = await run(createCollection({ title: newCollectionTitle }));
    if (res.statusCode === 201) {
      const newCollectionId = res.data.data._id;

      navigate(routePaths.COLLECTION_DETAIL.replace(':collectionId', newCollectionId));
    }

    setIsModalOpen(false);
    setNewCollectionTitle('');
  };

  const handleKeyDown = (e) => {
    if (e.keyCode === 13 && newCollectionTitle) {
      e.preventDefault();
      handleOk();
    }
  };

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
    setTimeout(() => {
      inputRef.current?.focus();
    }, 20);
  }, [isModalOpen]);

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
          <Button type="primary" onClick={handleNewCollectionClick}>
            <FormOutlined />
            New collection
          </Button>
        </div>

        <CollectionList data={collections} total={total} tableLoading={loading} />
      </MyCard>

      <Modal
        forceRender
        confirmLoading={loading}
        title="New collection"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        wrapClassName="collection-list-modal"
        destroyOnClose
        okButtonProps={{ disabled: !newCollectionTitle }}
        closable={false}
      >
        <p>Please enter a new name for the new collection:</p>
        <Input
          value={newCollectionTitle}
          onKeyDown={handleKeyDown}
          onChange={(e) => setNewCollectionTitle(e.target.value)}
          ref={inputRef}
        />
      </Modal>
    </div>
  );
};

export default CollectionListPage;
