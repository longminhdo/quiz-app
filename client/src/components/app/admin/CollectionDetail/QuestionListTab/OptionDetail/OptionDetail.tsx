import { CopyOutlined, DeleteOutlined, WarningFilled } from '@ant-design/icons';
import { Button, Card, Checkbox, Input } from 'antd';
import React, { useCallback, useEffect } from 'react';
import { MyTooltipIcon, MyUploadImage } from '@/components/common';
import { DUPLICATED_OPTIONS_ERROR_MESSAGE } from '@/constants/message';
import { Media } from '@/types/media';
import { Option } from '@/types/option';
import { getNewOptionContent } from '@/utilities/helpers';
import './OptionDetail.scss';

const OptionDetail = ({
  option = { content: '' },
  index = 0,
  setQuestion,
  options,
  disableSubmit,
}: {
  option: Option,
  setQuestion?: any;
  index?: number;
  options?: Array<Option>;
  disableSubmit? : any
}) => {
  const [optionLocalData, setOptionLocalData] = React.useState<Option>(option);
  const [error, setError] = React.useState(false);

  const optionContentArray = React.useMemo(
    () => options?.map((opt: Option) => opt.content),
    [options],
  );

  useEffect(() => {
    const currentContent = optionLocalData?.content || '';

    const foundIndex = optionContentArray?.indexOf(currentContent);
    if (foundIndex !== -1 && foundIndex !== index) {
      disableSubmit(true);
      return setError(true);
    }

    disableSubmit(false);
    return setError(false);
  }, [disableSubmit, index, optionContentArray, optionLocalData?.content]);

  const handleContentChange = (e) => {
    const newContent = e.target.value;
    setOptionLocalData({ ...optionLocalData, content: newContent });

    setError(false);
    return null;
  };

  const handleContentBlur = (e) => {
    let newContent = e.target.value?.trim();
    if (!newContent) {
      newContent = getNewOptionContent(options);
    }

    setOptionLocalData((prev) => ({ ...prev, content: newContent }));
  };

  useEffect(() => {
    setQuestion((prev: any) => {
      const newOptions = [...prev.options];
      newOptions[index] = {
        ...optionLocalData,
      };

      return { ...prev, options: newOptions };
    });
  }, [index, optionLocalData, setQuestion]);

  const handleOptionDelete = () => {
    setQuestion((prev: any) => {
      const newOptions = [...prev.options];
      newOptions.splice(index, 1);

      return { ...prev, options: newOptions };
    });
  };

  const handleMediaChange = useCallback((media: Media) => {
    setOptionLocalData((prev: any) => ({ ...prev, media }));
  }, []);

  // TODO: duplicate option
  const handleDuplicateOption = () => {};

  const handleCheckboxChange = (e) => {
    const checked = e.target.checked;
    setOptionLocalData(prev => ({ ...prev, isCorrectAnswer: checked }));
  };

  const optionActions = [
    <Button type="text" key="duplicate" onClick={handleDuplicateOption}>
      <CopyOutlined />
    </Button>,
    <Button type="text" disabled={(options || []).length < 2} onClick={handleOptionDelete} key="remove">
      <DeleteOutlined />
    </Button>,
  ];

  return (
    <Card className="option-detail" actions={optionActions}>
      <div className="content-wrapper">
        <Input
          value={optionLocalData?.content}
          onChange={handleContentChange}
          onBlur={handleContentBlur}
          suffix={error ? (
            <MyTooltipIcon style={{ padding: 0 }} title={DUPLICATED_OPTIONS_ERROR_MESSAGE}>
              <WarningFilled className="option-content-warning" />
            </MyTooltipIcon>
          ) : <span />}
        />
      </div>

      <MyUploadImage value={option?.media} onChange={handleMediaChange} disableOnLoading={disableSubmit} />

      <Checkbox
        defaultChecked={option?.isCorrectAnswer}
        disabled={error}
        onChange={handleCheckboxChange}
        style={{ userSelect: 'none' }}
      >
        Mark this as the correct answer
      </Checkbox>
    </Card>
  );
};
export default OptionDetail;
