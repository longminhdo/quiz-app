import { DeleteOutlined, FontSizeOutlined } from '@ant-design/icons';
import { Button, Input, Modal, Space, Table, Tooltip } from 'antd';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteCollection, updateCollection } from '@/actions/collection';
import MyPagination from '@/components/common/MyPagination/MyPagination';
import { routePaths } from '@/constants/routePaths';
import useDispatchAsyncAction from '@/hooks/useDispatchAsyncAction';
import useUpdateUrlQuery from '@/hooks/useUpdateUrlQuery';
import { Collection } from '@/types/collection';
import { convertTime } from '@/utilities/helpers';
import './CollectionList.scss';
import useTypedSelector from '@/hooks/useTypedSelector';

const MODAL_TYPES = {
  DELETE: 'delete',
  RENAME: 'rename',
};

interface CollectionListProps {
  data: Array<Collection>;
  total: number;
  tableLoading?: boolean
}


const CollectionList: React.FC<CollectionListProps> = ({ data, total, tableLoading }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<string>('');
  const [selectedCollection, setSelectedCollection] = useState<Collection>();
  const { updateQuery } = useUpdateUrlQuery();
  const [run, loading] = useDispatchAsyncAction();
  const titleInputRef = useRef<any>();
  const navigate = useNavigate();

  const { _id: currentUserId } = useTypedSelector(state => state.user);


  useEffect(() => {
    setTimeout(() => {
      titleInputRef.current?.focus();
    }, 20);
  }, [isModalOpen]);

  const handleOk = async () => {
    if (modalType === MODAL_TYPES.RENAME) {
      const newTitle = selectedCollection?.title;
      if (!newTitle) {
        return;
      }

      await run(updateCollection({ _id: selectedCollection?._id, title: newTitle }));
    }

    if (modalType === MODAL_TYPES.DELETE) {
      await run(deleteCollection(selectedCollection?._id || ''));
    }

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
      render: (title, record) => (
        <a
          onClick={() => navigate(routePaths.COLLECTION_DETAIL.replace(':collectionId', record._id))}
        >
          {title}
        </a>
      ),
    },
    {
      title: 'Amount',
      dataIndex: 'questions',
      width: 150,
      render: (q) => <p>{q.length}</p>,
    },
    {
      title: 'Owner',
      dataIndex: 'owner',
      key: 'owner',
      width: 280,
      ellipsis: true,
      render: (v) => (
        <Tooltip destroyTooltipOnHide title={v?.email} placement="topLeft">
          <b>{v?.email}</b>
        </Tooltip>
      ),
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
            disabled={record?.viewers?.includes(currentUserId)}
            onClick={() => {
              setSelectedCollection(record);
              setModalType(MODAL_TYPES.RENAME);
              setTimeout(() => {
                setIsModalOpen(true);
              }, 0);
            }}
            type="primary"
            ghost
          >
            <FontSizeOutlined />
            Rename
          </Button>
          <Button
            disabled={record?.viewers?.includes(currentUserId)}
            danger
            onClick={() => {
              setSelectedCollection(record);
              setModalType(MODAL_TYPES.DELETE);
              setTimeout(() => {
                setIsModalOpen(true);
              }, 0);
            }}
          >
            <DeleteOutlined />
            Delete
          </Button>
        </Space>
      ),
    },
  ], [navigate]);

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
          ) : <p>Are you sure you want to delete this collection?</p>
        }

      </Modal>
    </div>
  );
};

export default CollectionList;
