import { CheckSquareFilled, CloseSquareFilled, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Image, Modal, Space, Table, Tag, Tooltip } from 'antd';
import { isEmpty, isEqual } from 'lodash';
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import QuestionDetail from '@/components/app/Library/QuestionDetail/QuestionDetail';
import MyPagination from '@/components/common/MyPagination/MyPagination';
import { LevelColorEnums, QuestionLevelEnums, QuestionType, QuestionTypeEnums } from '@/constants/constants';
import { Collection } from '@/types/collection';
import { Question } from '@/types/question';
import { convertLabel } from '@/utilities/helpers';
import './CollectionDetail.scss';

const defaultQuestion = {
  title: 'Untitled Question',
  type: 'multiple_choice' as 'text' | 'multiple_choice',
  level: 1,
  keys: [],
  options: [
    {
      content: 'Option 1',
    },
  ],
};

const CollectionDetail = forwardRef< any, {collection?: Collection, filter: any}>(({ collection, filter }, ref) => {
  const [open, setOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<Question>();
  const [questions, setQuestions] = useState <Array<Question>>(collection?.questions || []);
  const [pagination, setPagination] = useState<any>({ page: 1, pageSize: 10 });

  const paginationRef = useRef<any>();
  const questionsRef = useRef<any>();
  const actionRef = useRef<any>();
  const tableRef = useRef<any>(null);
  const filterRef = useRef<any>();

  const scrollToEnd = () => {
    if (tableRef.current) {
      const tableNode = tableRef.current.querySelector('.ant-table-body');
      if (tableNode) {
        tableNode.scrollTop = tableNode.scrollHeight;
      }
    }
  };

  const scrollToTop = () => {
    if (tableRef.current) {
      const tableNode = tableRef.current.querySelector('.ant-table-body');
      if (tableNode) {
        tableNode.scrollTop = 0;
      }
    }
  };

  const handleOk = (callback) => {
    callback && callback();
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const createNewQuestion = () => {
    actionRef.current = 'CREATE';
    setSelectedQuestion(undefined);
    setTimeout(() => {
      setOpen(true);
    }, 50);
  };

  // TODO: handle delete question
  const handleQuestionDelete = (question) => {
    console.log('delete', question);
  };

  const handlePaginationChange = (page, pageSize) => {
    setPagination({ page, pageSize });
  };

  const setPaginationToLastPage = ({ total, pageSize }) => {
    const lastPage = Math.ceil(total / pageSize);
    setPagination(prev => ({ ...prev, page: lastPage }));
  };

  const columns: any = useMemo(() => [
    {
      title: 'Question',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Answers',
      dataIndex: 'keys',
      key: 'keys',
      ellipsis: true,
      render: (answers) => <Tooltip placement="topLeft" title={answers.join(', ')}>{answers.join(', ')}</Tooltip>,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      width: 180,
      render: (v) => convertLabel(v, QuestionTypeEnums),
    },
    {
      title: 'Level',
      dataIndex: 'level',
      key: 'level',
      width: 140,
      render: (level) => (
        <Tag color={convertLabel(level, LevelColorEnums)}>
          {convertLabel(level, QuestionLevelEnums)}
        </Tag>
      ),
    },
    {
      title: 'Image',
      dataIndex: 'questionMedia',
      key: 'questionMedia',
      width: 140,
      render: (media) => (<Image src={media?.url} style={{ height: 40 }} />),
    },
    {
      title: 'Action',
      key: 'action',
      width: 250,
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            ghost
            onClick={() => {
              setSelectedQuestion(record);
              setTimeout(() => {
                setOpen(true);
              }, 50);
            }}
          >
            <EditOutlined />
            Edit
          </Button>
          <Button
            danger
            onClick={() => handleQuestionDelete(record)}
          >
            <DeleteOutlined />
            Delete
          </Button>
        </Space>
      ),
    },
  ], []);

  const expandedRowRender = useCallback((props) => {
    const data :any = props?.options || [];
    const { keys } = props;
    const columns: any = [
      { title: 'Option', dataIndex: 'content', key: 'content' },
      { title: 'Correct answer',
        dataIndex: 'isCorrectAnswer',
        key: 'isCorrectAnswer',
        width: 160,
        render: (_, record) => (
          (keys.includes(record.content))
            ? <CheckSquareFilled style={{ color: '#52c41a', fontSize: 24 }} />
            : <CloseSquareFilled style={{ color: '#e65061', fontSize: 24 }} />),
      },
      { title: 'Media',
        dataIndex: 'media',
        key: 'media',
        width: 200,
        render: (media) => (<Image src={media?.url} style={{ height: 36 }} />),
      },
      {
        title: 'Action',
        width: 250,
        dataIndex: 'operation',
        key: 'operation',
        render: () => (
          <Space size="middle">
            <Button
              danger
            >
              <DeleteOutlined />
              Delete
            </Button>
          </Space>
        ),
      },
    ];

    return (
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        rowKey={record => record.content}
      />
    );
  }, []);

  useImperativeHandle(ref, () => ({
    createNewQuestion,
  }));

  useEffect(() => {
    const { page, pageSize } = pagination;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const newQuestions = (collection?.questions || []).slice(startIndex, endIndex);

    if (isEmpty(newQuestions)) {
      return;
    }

    if (actionRef.current === 'CREATE') {
      setPaginationToLastPage({ total: (collection?.questions || []).length, pageSize });
      actionRef.current = 'SCROLL';
      return;
    }

    if (actionRef.current === 'SCROLL') {
      console.log('scroll to end table', newQuestions);
      scrollToEnd();
      actionRef.current = '';
    }

    if (!isEqual(questionsRef.current, newQuestions) || !isEqual(pagination, paginationRef.current)) {
      setQuestions(newQuestions);
      paginationRef.current = pagination;
      questionsRef.current = newQuestions;
    }
  }, [collection?.questions, pagination]);

  useEffect(() => {
    if (!isEqual(filter, filterRef.current)) {
      scrollToTop();
      setPagination({ page: 1, pageSize: 10 });
      filterRef.current = filter;
    }
  }, [filter]);

  return (
    <div className="collection-detail">
      <Table
        scroll={{ y: 530, x: 1300 }}
        columns={columns}
        dataSource={questions}
        rowKey={(item) => item._id || ''}
        pagination={false}
        ref={tableRef}
        expandable={{ expandedRowRender, rowExpandable: (record) => record.type === QuestionType.MULTIPLE_CHOICE }}
      />

      <MyPagination
        total={(collection?.questions || []).length}
        willUpdateQuery={false}
        onChange={handlePaginationChange}
        customPagination={pagination}
      />

      <Modal
        className="question-detail-modal"
        title={selectedQuestion ? 'Edit question' : 'New question'}
        open={open}
        onOk={handleOk}
        onCancel={handleCancel}
        destroyOnClose
        footer={null}
      >
        <QuestionDetail
          selectedQuestion={selectedQuestion || defaultQuestion}
          onCancel={handleCancel}
          editType={selectedQuestion ? 'UPDATE' : 'CREATE'}
        />
      </Modal>
    </div>
  );
});

export default React.memo(CollectionDetail, (prev, next) => isEqual(prev, next));
