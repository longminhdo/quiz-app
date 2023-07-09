import { DeleteOutlined, FontSizeOutlined } from '@ant-design/icons';
import { Button, Input, Modal, Space, Table, Tag, Tooltip } from 'antd';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteQuiz, generateQuizCode, updateQuiz } from '@/actions/quiz';
import MyPagination from '@/components/common/MyPagination/MyPagination';
import { routePaths } from '@/constants/routePaths';
import useDispatchAsyncAction from '@/hooks/useDispatchAsyncAction';
import useUpdateUrlQuery from '@/hooks/useUpdateUrlQuery';
import { Quiz } from '@/types/quiz';
import { convertTime, copyToClipboard } from '@/utilities/helpers';
import './CDQuizList.scss';
import { formatCode } from '@/utilities/quizHelpers';

const MODAL_TYPES = {
  DELETE: 'delete',
  RENAME: 'rename',
};

interface CDQuizListProps {
  data: Array<Quiz>;
  total: number;
  tableLoading?: boolean
}

const CDQuizList: React.FC<CDQuizListProps> = ({ data, total, tableLoading }) => {
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz>();
  const [modalType, setModalType] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const titleInputRef = useRef<any>();

  const [run, loading] = useDispatchAsyncAction();
  const { updateQuery } = useUpdateUrlQuery();

  const navigate = useNavigate();

  const handleOk = async () => {
    if (modalType === MODAL_TYPES.RENAME) {
      const newTitle = selectedQuiz?.title;
      if (!newTitle) {
        return;
      }

      await run(updateQuiz({ _id: selectedQuiz?._id, title: newTitle }));
    }

    if (modalType === MODAL_TYPES.DELETE) {
      await run(deleteQuiz(selectedQuiz?._id || ''));
    }

    updateQuery({ query: { timestamp: Date.now() } });
    setIsOpen(false);
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  const handleKeyDown = (e) => {
    if (!selectedQuiz?.title) {
      return;
    }

    if (e.keyCode === 13) {
      e.preventDefault();
      handleOk();
    }
  };

  const handleTitleChange = (e) => {
    setSelectedQuiz((prev: any) => ({
      ...prev,
      title: e.target.value,
    }));
  };

  const handleGenerateCode = useCallback(async (quizId) => {
    setIsGenerating(true);
    await run(generateQuizCode(quizId));
    setIsGenerating(false);
    updateQuery({ query: { timestamp: Date.now() } });
  }, [run, updateQuery]);

  const handleCodeTagClick = useCallback((code) => {
    copyToClipboard({ data: code, callbackMessage: 'Copied to clipboard' });
  }, []);

  const columns: any = useMemo(() => [
    {
      title: 'Name',
      dataIndex: 'title',
      key: 'title',
      render: (title, record) => (
        <a
          onClick={() => navigate(routePaths.QUIZ_DETAIL.replace(':quizId', record._id))}
        >
          {title}
        </a>
      ),
    },
    {
      title: 'Code',
      dataIndex: 'code',
      width: 200,
      render: (code, record) => (code
        ? (
          <Tag
            onClick={() => handleCodeTagClick(formatCode(code))}
            color="green"
            style={{ userSelect: 'none', fontSize: 14, cursor: 'pointer' }}
          >
            {formatCode(code)}
          </Tag>
        ) : (
          <Button
            loading={isGenerating}
            onClick={() => handleGenerateCode(record._id)}
          >
            Generate code
          </Button>
        )),
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
      render: (_, record) => (
        <Tooltip destroyTooltipOnHide title={record?.ownerData?.email} placement="topLeft">
          <b>{record?.ownerData?.email}</b>
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
            onClick={() => {
              setSelectedQuiz(record);
              setModalType(MODAL_TYPES.RENAME);
              setTimeout(() => {
                setIsOpen(true);
              }, 0);
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
              setSelectedQuiz(record);
              setModalType(MODAL_TYPES.DELETE);
              setTimeout(() => {
                setIsOpen(true);
              }, 0);
            }}
          >
            <DeleteOutlined />
            Delete
          </Button>
        </Space>
      ),
    },
  ], [navigate, handleGenerateCode, handleCodeTagClick]);

  return (
    <div className="cd-quiz-list">
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
        title={modalType === MODAL_TYPES.RENAME ? 'Rename' : 'Delete quiz'}
        okButtonProps={{ disabled: !selectedQuiz?.title }}
        open={isOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        wrapClassName="cd-quiz-list-modal"
        destroyOnClose
        closable={false}
      >
        {
          modalType === MODAL_TYPES.RENAME ? (
            <>
              <p>Please enter a new name for the quiz:</p>
              <Input
                value={selectedQuiz?.title}
                onKeyDown={handleKeyDown}
                onChange={handleTitleChange}
                ref={titleInputRef}
              />
            </>
          ) : <p>Are you sure you want to delete this quiz?</p>
        }

      </Modal>
    </div>
  );
};

export default CDQuizList;
