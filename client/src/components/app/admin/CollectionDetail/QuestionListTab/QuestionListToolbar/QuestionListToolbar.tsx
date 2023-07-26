
import { CloseOutlined, DownloadOutlined, FormOutlined, InboxOutlined, SearchOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Input, Modal, Spin, message } from 'antd';
import Dragger from 'antd/es/upload/Dragger';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { importQuestions } from '@/actions/question';
import useDispatchAsyncAction from '@/hooks/useDispatchAsyncAction';
import { Question } from '@/types/question';
import { exportExcelFile, readExcelFile } from '@/utilities/helpers';
import { transformSendingQuestion, validateQuestion } from '@/utilities/quizHelpers';
import './QuestionListToolbar.scss';

interface QuestionListToolbarInterface {
  handleImportQuestions?: any;
  handleAddQuestion?: any;
  filter?: any;
  setFilter?: any;
}

const QuestionListToolbar: React.FC<QuestionListToolbarInterface> = ({ handleImportQuestions, handleAddQuestion, filter, setFilter }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<any>(undefined);
  const [error, setError] = useState('');

  const { collectionId } = useParams();
  const [run] = useDispatchAsyncAction();

  useEffect(() => {
    setError('');
  }, [file]);

  const handleSearchChange = (e) => {
    const searchValue = e.target.value;
    setFilter(prev => ({ ...prev, search: searchValue }));
  };

  const handleExport = () => {
    exportExcelFile({
      data: [
        ['title', 'level', 'type',
          'option1', 'option2', 'option3', 'option4', 'option5',
          'key1', 'key2', 'key3', 'key4', 'key5'],
      ],
      title: 'import_question–template',
      sheetName: 'Sheet 1',
    });
  };

  const handleImport = () => {
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
    setFile(undefined);
    setError('');
  };

  const handleOk = () => {
    const execute = async (arr) => {
      if (!collectionId) {
        setLoading(false);
        return;
      }

      const data = arr?.filter((el) => el?.length > 1);
      const newQuestions: Array<Question> = [];

      for (let i = 1; i < data.length; i++) {
        const [title, level, type, option1, option2, option3, option4, option5, ...restKeys] = data[i];
        const options = [option1, option2, option3, option4, option5]
          .filter(o => o)
          .map(o => ({ content: String(o) }));
        const keys = restKeys.filter(k => k).map(k => String(k));
        const tmpQuestion = { title, level, type, options, keys };
        const validation = validateQuestion(tmpQuestion);

        if (!validation.isValid) {
          setError(`${validation.message} at row ${i + 1}`);
          setLoading(false);
          return;
        }

        newQuestions.push({ ...transformSendingQuestion(tmpQuestion), keys });
      }

      handleImportQuestions();
      await run(importQuestions({ newQuestions, collectionId }));

      handleCancel();
      setLoading(false);
    };

    setLoading(true);
    try {
      readExcelFile(file, execute);
    } catch (error) {
      setLoading(false);
      message.error('Có lỗi xảy ra!');
    }
  };

  const handleBeforeUpload = (file: any) => {
    setFile(file);
    return false;
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

      <Modal
        title="Import questions"
        open={open}
        footer={null}
        onCancel={handleCancel}
        className="upload-csv-modal"
        maskClosable={false}
        destroyOnClose
      >
        <Spin spinning={loading}>
          {!file ? (
            <Dragger
              listType="picture-card"
              accept=".txt, .csv, .xlsx"
              showUploadList={false}
              beforeUpload={handleBeforeUpload}
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Click or drag file to this area to upload
              </p>
              <p className="ant-upload-hint">
                Support for a single or bulk upload. Strictly prohibit from
                uploading company data or other band files
              </p>
            </Dragger>
          ) : (
            <div className="upload-file-display">
              <p className="heading">File</p>
              <p className="file-info">
                {file?.name}
                {' '}
                <CloseOutlined onClick={() => setFile(null)} />
              </p>
              <p className="heading">Size</p>
              <p className="file-info">
                {' '}
                {file?.size}
              </p>
              <br />
              { error && <h3 className="error-message">{error}</h3>}
              <div className="modal-footer">
                <Button type="primary" onClick={handleOk} disabled={!!error} loading={loading}>
                  Import
                </Button>
                <Button onClick={handleCancel}>Cancel</Button>
              </div>
            </div>
          )}
        </Spin>
      </Modal>
    </div>
  );
};

export default QuestionListToolbar;
