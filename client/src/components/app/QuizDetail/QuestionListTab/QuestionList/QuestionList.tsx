import { CheckSquareFilled, CloseSquareFilled, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Image, Modal, Space, Table, Tag, Tooltip, message } from 'antd';
import { isEmpty, isEqual } from 'lodash';
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { deleteQuestion } from '@/actions/question';
import MyPagination from '@/components/common/MyPagination/MyPagination';
import { LevelColorEnums, QuestionLevelEnums, QuestionType, QuestionTypeEnums } from '@/constants';
import { NO_COLLECTION_ID } from '@/constants/message';
import useDispatchAsyncAction from '@/hooks/useDispatchAsyncAction';
import { setLoading } from '@/modules/redux/slices/appReducer';
import { Question } from '@/types/question';
import { convertLabel } from '@/utilities/helpers';
import './QuestionList.scss';
import EditQuestionForm from '@/components/app/QuizDetail/QuestionListTab/EditQuestionForm/EditQuestionForm';

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

interface QuestionListProps {
  initialQuestions?: Array<Question>;
  filter: any;
  tableLoading?: boolean
}

const QuestionList = forwardRef< any, QuestionListProps>(({ initialQuestions, filter, tableLoading = false }, ref) => {
  const [open, setOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<Question>();
  const [questions, setQuestions] = useState <Array<Question>>(initialQuestions || []);
  const [pagination, setPagination] = useState<any>({ page: 1, pageSize: 10 });

  const paginationRef = useRef<any>();
  const questionsRef = useRef<any>();
  const actionRef = useRef<any>();
  const tableRef = useRef<any>(null);
  const filterRef = useRef<any>();

  const { collectionId } = useParams();
  const [messageApi] = message.useMessage();
  const [run] = useDispatchAsyncAction();

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

  const handleQuestionDelete = useCallback(async(question) => {
    if (!collectionId) {
      messageApi.error(NO_COLLECTION_ID);
      return;
    }

    run(setLoading(true));
    await run(deleteQuestion({ collectionId, questionId: question._id }));
    run(setLoading(false));
  }, [collectionId, messageApi, run]);

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
  ], [handleQuestionDelete]);

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
    const newQuestions = (initialQuestions || []).slice(startIndex, endIndex);

    if (isEmpty(newQuestions)) {
      return;
    }

    if (actionRef.current === 'CREATE') {
      setPaginationToLastPage({ total: (initialQuestions || []).length, pageSize });
      actionRef.current = 'SCROLL_TO_END';
      return;
    }

    if (actionRef.current === 'SCROLL_TO_END') {
      scrollToEnd();
      actionRef.current = '';
    }

    if (!isEqual(questionsRef.current, newQuestions) || !isEqual(pagination, paginationRef.current)) {
      setQuestions(newQuestions);
      paginationRef.current = pagination;
      questionsRef.current = newQuestions;
    }
  }, [initialQuestions, pagination]);

  useEffect(() => {
    if (!isEqual(filter, filterRef.current)) {
      scrollToTop();
      setPagination({ page: 1, pageSize: 10 });
      filterRef.current = filter;
    }
  }, [filter]);

  return (
    <div className="question-list">
      <Table
        scroll={{ y: 530, x: 1300 }}
        loading={tableLoading}
        columns={columns}
        dataSource={questions}
        rowKey={(item) => item._id || ''}
        pagination={false}
        ref={tableRef}
        expandable={{ expandedRowRender, rowExpandable: (record) => record.type === QuestionType.MULTIPLE_CHOICE }}
      />

      <MyPagination
        total={(initialQuestions || []).length}
        willUpdateQuery={false}
        onChange={handlePaginationChange}
        customPagination={pagination}
      />

      <Modal
        className="question-edit-modal"
        title={selectedQuestion ? 'Edit question' : 'New question'}
        open={open}
        destroyOnClose
        footer={null}
      >
        <EditQuestionForm
          selectedQuestion={selectedQuestion || defaultQuestion}
          onCancel={handleCancel}
        />
      </Modal>
    </div>
  );
});

export default React.memo(QuestionList, (prev, next) => isEqual(prev, next));
