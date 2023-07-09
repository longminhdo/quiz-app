import React from 'react';
import { FormOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Input } from 'antd';
import './QuestionListToolbar.scss';

interface QuestionListToolbarInterface {
  handleAddQuestion?: any;
  filter?: any;
  setFilter?: any;
}

const QuestionListToolbar: React.FC<QuestionListToolbarInterface> = ({ handleAddQuestion, filter, setFilter }) => {
  const handleSearchChange = (e) => {
    const searchValue = e.target.value;
    setFilter(prev => ({ ...prev, search: searchValue }));
  };

  return (
    <div className="question-list-toolbar">
      <Input
        placeholder="Search questions"
        prefix={<SearchOutlined />}
        allowClear
        value={filter.search}
        onChange={handleSearchChange}
      />
      <Button type="primary" onClick={handleAddQuestion}>
        <FormOutlined />
        <span>New question</span>
      </Button>
    </div>
  );
};

export default QuestionListToolbar;