import { FormOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Input, Modal } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCollection } from '@/actions/collection';
import { routePaths } from '@/constants/routePaths';
import useDispatchAsyncAction from '@/hooks/useDispatchAsyncAction';
import useUpdateUrlQuery from '@/hooks/useUpdateUrlQuery';
import './CollectionListToolbar.scss';

const CollectionListToolbar: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState<string>(() => new URLSearchParams(window.location.search).get('search') || '');
  const [newCollectionTitle, setNewCollectionTitle] = useState('');

  const inputRef = useRef<any>();

  const { updateQuery } = useUpdateUrlQuery();
  const [run, loading] = useDispatchAsyncAction();

  const navigate = useNavigate();

  const handleNewCollectionClick = () => {
    setIsModalOpen(true);
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

  const handleCancel = () => {
    setNewCollectionTitle('');
    setIsModalOpen(false);
  };

  useEffect(() => {
    setTimeout(() => {
      inputRef.current?.focus();
    }, 20);
  }, [isModalOpen]);

  return (
    <div className="collection-list-toolbar">
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

export default CollectionListToolbar;