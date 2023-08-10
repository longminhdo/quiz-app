import { EditOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Input, Modal, Tag } from 'antd';
import React, { useCallback, useState } from 'react';
import { generateQuizCode } from '@/actions/quiz';
import QuizBuilder from '@/components/app/admin/QuizDetail/QuizBuilder/QuizBuilder';
import { BuilderType } from '@/constants';
import useDispatchAsyncAction from '@/hooks/useDispatchAsyncAction';
import useTypedSelector from '@/hooks/useTypedSelector';
import { copyToClipboard } from '@/utilities/helpers';
import { formatCode } from '@/utilities/quizHelpers';
import './QuestionListToolbar.scss';

interface QuestionListToolbarInterface {
  filter?: any;
  setFilter?: any;
}

const QuestionListToolbar: React.FC<QuestionListToolbarInterface> = ({ filter, setFilter }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [generating, setGenerating] = useState(false);
  const { currentQuiz } = useTypedSelector((state) => state.quiz);
  const [run] = useDispatchAsyncAction();

  const handleSearchChange = (e) => {
    const searchValue = e.target.value;
    setFilter(prev => ({ ...prev, search: searchValue }));
  };

  const handleEditQuiz = () => {
    setIsOpen(true);
  };

  const handleGenerateCode = async () => {
    setGenerating(true);
    await run(generateQuizCode(currentQuiz?._id));
    setGenerating(false);
  };

  const handleCodeTagClick = useCallback((code) => {
    copyToClipboard({ data: code, callbackMessage: 'Copied to clipboard' });
  }, []);

  const renderQuizCode = () => {
    if (!currentQuiz) {
      return null;
    }

    if (currentQuiz?.code) {
      return (
        <Tag
          onClick={() => handleCodeTagClick(formatCode(currentQuiz.code))}
          color="green"
          className="quiz-detail-code"
        >
          {currentQuiz.code}
        </Tag>
      );
    }

    return (
      <Button
        loading={generating}
        onClick={handleGenerateCode}
      >
        Generate code
      </Button>
    );
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

        {renderQuizCode()}
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
