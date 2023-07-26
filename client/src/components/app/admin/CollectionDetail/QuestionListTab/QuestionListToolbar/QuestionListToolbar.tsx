import { DownloadOutlined, FormOutlined, SearchOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Input } from 'antd';
import React from 'react';
import './QuestionListToolbar.scss';
import { exportExcelFile } from '@/utilities/helpers';

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

  const handleExport = () => {
    console.log('export');
    exportExcelFile({
      data: [['title', 'level', 'image', 'type', 'option1', 'option2', 'option3', 'option4', 'option5', 'keys']],
      title: 'import_question–template',
      sheetName: 'Sheet 1',
    });
  };

  // TODO: import
  const handleImport = () => {
    console.log('import');
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
      <div className="question-list-toolbar-actions">
        <Button type="primary" onClick={handleAddQuestion}>
          <FormOutlined />
          <span>New question</span>
        </Button>

        <Button onClick={handleExport}>
          <DownloadOutlined />
          <span>Download template</span>
        </Button>

        <Button onClick={handleImport}>
          <UploadOutlined />
          <span>Import</span>
        </Button>
      </div>
    </div>
  );
};

export default QuestionListToolbar;