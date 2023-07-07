import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Image, Space, Table, Tag, Tooltip } from 'antd';
import { isEqual } from 'lodash';
import React, { useMemo } from 'react';
import { convertLabel } from '@/utilities/helpers';
import { Collection } from '@/types/collection';
import { LevelColorEnums, QuestionLevelEnums, QuestionTypeEnums } from '@/constants/constants';
import './CollectionDetail.scss';

const CollectionDetail = ({ collection } : { collection?: Collection}) => {
  const questions = collection?.questions || [];

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
      render: () => (
        <Space size="middle">
          <Button
            type="primary"
            ghost
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

  return (
    <div className="collection-detail">
      <Table
        scroll={{ y: 530, x: 1300 }}
        columns={columns}
        dataSource={questions}
        rowKey={(item) => item._id}
      />
    </div>
  );
};

export default React.memo(CollectionDetail, (prev, next) => isEqual(prev, next));
