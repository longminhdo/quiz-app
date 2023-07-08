import { CopyOutlined, DeleteOutlined, WarningFilled } from '@ant-design/icons';
import { Button, Card, Input } from 'antd';
import React, { useEffect } from 'react';
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
}: {
  option: Option,
  setQuestion?: any;
  index?: number;
  options?: Array<Option>;
}) => {
  const [optionLocalData, setOptionLocalData] = React.useState<Option>(option);
  const [error, setError] = React.useState(false);

  // React.useEffect(() => {
  //   if (isEqual(option, optionLocalData)) {
  //     return;
  //   }

  //   setOptionLocalData(option);
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [option]);

  const optionContentArray = React.useMemo(
    () => options?.map((opt: Option) => opt.content),
    [options],
  );

  // React.useEffect(() => {
  //   const currentContent = optionLocalData?.content || '';

  //   const foundIndex = optionContentArray?.indexOf(currentContent);
  //   if (foundIndex !== -1 && foundIndex !== index) {
  //     return setError(true);
  //   }

  //   return setError(false);
  // }, [index, optionContentArray, optionLocalData?.content]);

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

  // TODO: update question with debounce
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

  const handleMediaChange = React.useCallback(
    (media: Media) => {
      setQuestion((prev: any) => {
        const newOptions = [...prev.options];
        newOptions[index] = {
          ...newOptions[index],
          media,
        };

        return { ...prev, options: newOptions };
      });
    },
    [index, setQuestion],
  );

  const handleDuplicateOption = () => {};

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
          ) : null}
        />
      </div>

      <MyUploadImage value={option?.media} onChange={handleMediaChange} />
    </Card>
  );
};
export default OptionDetail;
