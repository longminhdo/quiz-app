import { Button, Col, Form, Input, Row, Table, Tag } from 'antd';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { isEmpty } from 'lodash';
import { Question } from '@/types/question';
import { convertLabel } from '@/utilities/helpers';
import { LevelColorEnums, QuestionLevelEnums, QuestionTypeEnums } from '@/constants/constants';

const { Item } = Form;

interface ManualQuizFormProps {
  quizPool: Array<Question>;
  setQuestions?: any;
}

const ManualQuizForm: React.FC<ManualQuizFormProps> = ({ quizPool, setQuestions }) => {
  const [search, setSearch] = useState('');
  const [source, setSource] = useState<Array<Question>>([]);
  const [destination, setDestination] = useState<Array<Question>>([]);
  const [filteredSrc, setFilteredSrc] = useState<Array<Question>>([]);
  const [filteredDes, setFilteredDes] = useState<Array<Question>>([]);

  useEffect(() => {
    if (isEmpty(quizPool)) {
      return;
    }

    setSource(quizPool);
  }, [quizPool]);

  useEffect(() => {
    if (!search) {
      setFilteredDes([]);
      setFilteredSrc([]);
      return;
    }

    setFilteredSrc(source?.filter(q => q?.title?.toLowerCase()?.includes(search.toLowerCase())));
    setFilteredDes(destination?.filter(q => q?.title?.toLowerCase()?.includes(search.toLowerCase())));
  }, [destination, search, source]);

  useEffect(() => {
    if (!setQuestions) {
      return;
    }

    if (isEmpty(destination)) {
      setQuestions([]);
    }

    setQuestions(destination);
  }, [destination, setQuestions]);

  const handleAddQuestion = (question: Question) => {
    setSource(prev => prev?.filter(q => q?._id !== question?._id));
    setDestination(prev => ([...prev, question]));
  };

  const handleRemoveQuestion = useCallback((question: Question) => {
    setDestination(prev => {
      const newDes = prev?.filter(q => q?._id !== question?._id);
      const newSrc = quizPool?.filter(q => !newDes?.map(q => q?._id)?.includes(q?._id));
      setSource(newSrc);
      return newDes;
    });
  }, [quizPool]);

  const sourceTableColumns = useMemo(() => [
    {
      title: 'Question',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
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
      title: 'Question Type',
      dataIndex: 'type',
      key: 'type',
      width: 140,
      ellipsis: true,
      render: (v) => convertLabel(v, QuestionTypeEnums),
    },
    {
      width: 110,
      title: 'Actions',
      dataIndex: 'action',
      key: 'action',
      render: (_, record) => (
        <Button
          type="primary"
          onClick={
            () => {
              handleAddQuestion(record);
            }
          }
        >
          Add
        </Button>
      ),
    },
  ], []);

  const destinationTableColumns = useMemo(() => [
    {
      title: 'Question',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
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
      title: 'Question Type',
      dataIndex: 'type',
      key: 'type',
      width: 140,
      ellipsis: true,
      render: (v) => convertLabel(v, QuestionTypeEnums),
    },
    {
      width: 110,
      title: 'Actions',
      dataIndex: 'action',
      key: 'action',
      render: (_, record) => (
        <Button
          type="primary"
          danger
          onClick={
            () => {
              handleRemoveQuestion(record);
            }
          }
        >
          Remove
        </Button>
      ),
    },
  ], [handleRemoveQuestion]);

  return (
    <div>
      <Row>
        <Col>
          <Item label="Search">
            <Input
              value={search}
              allowClear
              onChange={(e) => setSearch(e.target.value)}
            />
          </Item>
        </Col>
      </Row>

      <div className="select-section">
        <Table
          className="question-selection-table"
          dataSource={search ? filteredSrc : source}
          columns={sourceTableColumns}
          rowKey={(item) => item._id || ''}
          scroll={{ y: 494 }}
        />
        <Table
          className="question-selection-table"
          dataSource={search ? filteredDes : destination}
          columns={destinationTableColumns}
          rowKey={(item) => item._id || ''}
          scroll={{ y: 494 }}
          pagination={{ showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items` }}
        />
      </div>
    </div>
  );
};

export default ManualQuizForm;
