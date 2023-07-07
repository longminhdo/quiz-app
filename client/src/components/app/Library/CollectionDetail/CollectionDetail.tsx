import { DeleteOutlined, FontSizeOutlined } from '@ant-design/icons';
import { Button, Space, Table } from 'antd';
import { isEqual } from 'lodash';
import React, { useMemo } from 'react';
import { convertLabel } from '@/utilities/helpers';
import { Collection } from '@/types/collection';
import { QuestionLevelEnums } from '@/constants/constants';
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
      title: 'Level',
      dataIndex: 'level',
      key: 'level',
      render: (level) => convertLabel(level, QuestionLevelEnums),
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
            <FontSizeOutlined />
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
      <Table columns={columns} dataSource={questions} rowKey={(item) => item._id} />
    </div>
  );
};

export default React.memo(CollectionDetail, (prev, next) => isEqual(prev, next));