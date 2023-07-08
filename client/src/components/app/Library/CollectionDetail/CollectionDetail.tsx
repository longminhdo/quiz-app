import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Image, Modal, Space, Table, Tag, Tooltip } from 'antd';
import { isEqual } from 'lodash';
import React, { useCallback, useMemo, useState } from 'react';
import QuestionDetail from '@/components/app/Library/QuestionDetail/QuestionDetail';
import { LevelColorEnums, QuestionLevelEnums, QuestionType, QuestionTypeEnums } from '@/constants/constants';
import { Collection } from '@/types/collection';
import { Question } from '@/types/question';
import { convertLabel } from '@/utilities/helpers';
import './CollectionDetail.scss';

const CollectionDetail = ({ collection } : { collection?: Collection}) => {
  const [open, setOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<Question>();

  const questions = collection?.questions || [];

  const handleOk = (callback) => {
    callback && callback();
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
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
      render: (media) => (<Image src={media?.url} style={{ height: 60 }} />),
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
    const columns: any = [
      { title: 'Option', dataIndex: 'content', key: 'content' },
      { title: 'Media',
        dataIndex: 'media',
        key: 'media',
        width: 200,
        render: (media) => (<Image src={media?.url} style={{ height: 40 }} />),
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

  return (
    <div className="collection-detail">
      <Table
        scroll={{ y: 530, x: 1300 }}
        columns={columns}
        dataSource={questions}
        rowKey={(item) => item._id}
        expandable={{ expandedRowRender, rowExpandable: (record) => record.type === QuestionType.MULTIPLE_CHOICE }}
      />

      <Modal
        className="question-detail-modal"
        title={selectedQuestion ? selectedQuestion?.title : 'New question'}
        open={open}
        onOk={handleOk}
        onCancel={handleCancel}
        destroyOnClose
        footer={null}
      >
        { selectedQuestion && <QuestionDetail selectedQuestion={selectedQuestion} />}
      </Modal>
    </div>
  );
};

export default React.memo(CollectionDetail, (prev, next) => isEqual(prev, next));
