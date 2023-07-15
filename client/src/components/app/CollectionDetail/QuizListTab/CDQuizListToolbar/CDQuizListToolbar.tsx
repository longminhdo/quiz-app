import { FormOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Input, Modal } from 'antd';
import React, { useState } from 'react';
import QuizBuilder from '@/components/app/Quizzes/QuizBuilder/QuizBuilder';
import useTypedSelector from '@/hooks/useTypedSelector';
import useUpdateUrlQuery from '@/hooks/useUpdateUrlQuery';
import './CDQuizListToolbar.scss';

const CDQuizListToolbar: React.FC = () => {
  const [search, setSearch] = useState<string>(() => new URLSearchParams(window.location.search).get('search') || '');
  const [isOpen, setIsOpen] = useState(false);

  const { currentCollection } = useTypedSelector((state) => state.collection);
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

  return (
    <div className="cd-quizzes-list-toolbar">
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
        title="New collection"
        open={isOpen}
        wrapClassName="cd-quiz-create-modal"
        destroyOnClose
        closable={false}
        footer={false}
      >
        <QuizBuilder setIsOpen={setIsOpen} quizPool={currentCollection?.questions || []} />
      </Modal>
    </div>
  );
};

export default CDQuizListToolbar;