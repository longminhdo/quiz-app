import React, { useEffect, useMemo, useRef, useState } from 'react';
import { DeleteOutlined, FontSizeOutlined } from '@ant-design/icons';
import { Button, Input, Modal, Space, Table } from 'antd';
import MyPagination from '@/components/common/MyPagination/MyPagination';
import useDispatchAsyncAction from '@/hooks/useDispatchAsyncAction';
import useUpdateUrlQuery from '@/hooks/useUpdateUrlQuery';
import { Collection } from '@/types/collection';
import { convertTime } from '@/utilities/helpers';
import './CollectionList.scss';
import { updateCollection } from '@/actions/collection';

const CollectionList = ({ data, total, tableLoading }:{data: Array<Collection>, total: number, tableLoading?: boolean}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState<Collection>();
  const { updateQuery } = useUpdateUrlQuery();
  const [run, loading] = useDispatchAsyncAction();
  const titleInputRef = useRef<any>();

  useEffect(() => {
    setTimeout(() => {
      titleInputRef.current.focus();
    }, 0);
  }, [isModalOpen]);

  const handleOk = async () => {
    const newTitle = selectedCollection?.title;

    if (!newTitle) {
      return;
    }

    await run(updateCollection({ _id: selectedCollection?._id, title: newTitle }));
    updateQuery({ query: { timestamp: Date.now() } });
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleKeyDown = (e) => {
    if (!selectedCollection?.title) {
      return;
    }

    if (e.keyCode === 13) {
      e.preventDefault();
      handleOk();
    }
  };

  const handleTitleChange = (e) => {
    setSelectedCollection((prev: any) => ({
      ...prev,
      title: e.target.value,
    }));
  };

  const columns: any = useMemo(() => [
    {
      title: 'Name',
      dataIndex: 'title',
      key: 'title',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Owner',
      dataIndex: 'owner',
      key: 'owner',
      render: (_, record) => <b>{record?.ownerData?.email}</b>,
    },
    {
      title: 'Last modified',
      dataIndex: 'updatedAt',
      width: 140,
      key: 'updatedAt',
      render: (time) => <p>{convertTime(time)}</p>,
    },
    {
      title: 'Action',
      key: 'action',
      width: 250,
      render: (_, record) => (
        <Space size="middle">
          <Button
            onClick={() => {
              setSelectedCollection(record);
              setIsModalOpen(true);
            }}
            type="primary"
            ghost
          >
            <FontSizeOutlined />
            Rename
          </Button>
          <Button danger>
            <DeleteOutlined />
            Delete
          </Button>
        </Space>
      ),
    },
  ], []);

  return (
    <div className="collection-list">
      <Table
        columns={columns}
        dataSource={data}
        rowKey="_id"
        loading={tableLoading}
        scroll={{ y: 500 }}
        pagination={false}
      />
      <MyPagination total={total} />

      <Modal
        forceRender
        confirmLoading={loading}
        title="Rename"
        okButtonProps={{ disabled: !selectedCollection?.title }}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        wrapClassName="form-rename-modal"
        destroyOnClose
      >
        <p>Please enter a new name for the item:</p>
        <Input
          value={selectedCollection?.title}
          onKeyDown={handleKeyDown}
          onChange={handleTitleChange}
          ref={titleInputRef}
        />
      </Modal>
    </div>
  );
};

export default CollectionList;