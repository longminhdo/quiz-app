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

const MODAL_TYPES = {
  DELETE: 'delete',
  RENAME: 'rename',
};

const CollectionList = ({ data, total, tableLoading }:{data: Array<Collection>, total: number, tableLoading?: boolean}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<string>('');
  const [selectedCollection, setSelectedCollection] = useState<Collection>();
  const { updateQuery } = useUpdateUrlQuery();
  const [run, loading] = useDispatchAsyncAction();
  const titleInputRef = useRef<any>();

  useEffect(() => {
    setTimeout(() => {
      titleInputRef.current?.focus();
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
              setModalType(MODAL_TYPES.RENAME);
              setIsModalOpen(true);
            }}
            type="primary"
            ghost
          >
            <FontSizeOutlined />
            Rename
          </Button>
          <Button
            danger
            onClick={() => {
              setSelectedCollection(record);
              setModalType(MODAL_TYPES.DELETE);
              setIsModalOpen(true);
            }}
          >
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
        scroll={{ y: 530, x: 1300 }}
        pagination={false}
      />
      <MyPagination total={total} />

      <Modal
        forceRender
        confirmLoading={loading}
        title={modalType === MODAL_TYPES.RENAME ? 'Rename' : 'Delete collection'}
        okButtonProps={{ disabled: !selectedCollection?.title }}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        wrapClassName="collection-list-modal"
        destroyOnClose
        closable={false}
      >
        {
          modalType === MODAL_TYPES.RENAME ? (
            <>
              <p>Please enter a new name for the item:</p>
              <Input
                value={selectedCollection?.title}
                onKeyDown={handleKeyDown}
                onChange={handleTitleChange}
                ref={titleInputRef}
              />
            </>
          ) : <p>Are you sure you want to delete this question?</p>
        }

      </Modal>
    </div>
  );
};

export default CollectionList;