import { SearchOutlined } from '@ant-design/icons';
import { Input } from 'antd';
import React from 'react';
import './QuestionListToolbar.scss';

interface QuestionListToolbarInterface {
  filter?: any;
  setFilter?: any;
}

const QuestionListToolbar: React.FC<QuestionListToolbarInterface> = ({ filter, setFilter }) => {
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
      <div className="question-list-toolbar-actions" />
    </div>
  );
};

export default QuestionListToolbar;
