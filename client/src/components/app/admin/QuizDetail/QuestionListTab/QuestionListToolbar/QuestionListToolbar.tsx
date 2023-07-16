import { EditOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Input, Modal } from 'antd';
import React, { useState } from 'react';
import QuizBuilder from '@/components/app/admin/QuizDetail/QuizBuilder/QuizBuilder';
import { BuilderType } from '@/constants';
import useTypedSelector from '@/hooks/useTypedSelector';
import './QuestionListToolbar.scss';

interface QuestionListToolbarInterface {
  filter?: any;
  setFilter?: any;
}

const QuestionListToolbar: React.FC<QuestionListToolbarInterface> = ({ filter, setFilter }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentQuiz } = useTypedSelector((state) => state.quiz);

  const handleSearchChange = (e) => {
    const searchValue = e.target.value;
    setFilter(prev => ({ ...prev, search: searchValue }));
  };

  const handleEditQuiz = () => {
    setIsOpen(true);
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
        <Button type="primary" onClick={handleEditQuiz}>
          <EditOutlined />
          Edit quiz
        </Button>
      </div>

      <Modal
        title="Edit quiz"
        open={isOpen}
        wrapClassName="quiz-builder-modal"
        destroyOnClose
        closable={false}
        footer={false}
      >
        <QuizBuilder initialQuiz={currentQuiz} builderType={BuilderType.UPDATE} setIsOpen={setIsOpen} />
      </Modal>
    </div>
  );
};

export default QuestionListToolbar;
