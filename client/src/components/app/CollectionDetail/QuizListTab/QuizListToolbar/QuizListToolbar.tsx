import { FormOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Input, Modal } from 'antd';
import React, { useState } from 'react';
import { createQuiz } from '@/actions/quiz';
import useDispatchAsyncAction from '@/hooks/useDispatchAsyncAction';
import useUpdateUrlQuery from '@/hooks/useUpdateUrlQuery';
import './QuizListToolbar.scss';

const QuizListToolbar: React.FC = () => {
  const [search, setSearch] = useState<string>(() => new URLSearchParams(window.location.search).get('search') || '');
  const [newQuizTitle, setNewQuizTitle] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const [run, loading] = useDispatchAsyncAction();
  const { updateQuery } = useUpdateUrlQuery();

  const handleSearchChange = (e) => {
    const searchValue = e.target.value;

    setSearch(searchValue);
    updateQuery({
      query: {
        search: searchValue,
      },
    });
  };

  const handleNewQuizClick = () => {
    setIsOpen(true);
  };

  const handleOk = async () => {
    const res = await run(createQuiz({ title: newQuizTitle }));
    if (res.statusCode === 201) {
      const newCollectionId = res.data.data._id;
    }

    setIsOpen(false);
  };

  const handleCancel = () => {
    setNewQuizTitle('');
    setIsOpen(false);
  };

  return (
    <div className="quizzes-tab-toolbar">
      <Input
        placeholder="Search collections"
        prefix={<SearchOutlined />}
        allowClear
        value={search}
        onChange={handleSearchChange}
      />
      <Button type="primary" onClick={handleNewQuizClick}>
        <FormOutlined />
        New quiz
      </Button>

      <Modal
        confirmLoading={loading}
        title="New collection"
        open={isOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        wrapClassName="collection-list-modal"
        destroyOnClose
        closable={false}
      >
        <p>Please enter a new name for the new quiz:</p>
        <Input
          value={newQuizTitle}
          onChange={(e) => setNewQuizTitle(e.target.value)}
        />
      </Modal>
    </div>
  );
};

export default QuizListToolbar;