import { LinkOutlined } from '@ant-design/icons';
import { Popover } from 'antd';
import React, { useState } from 'react';
import useTypedSelector from '@/hooks/useTypedSelector';
import MyTooltipIcon from '@/components/common/MyTooltipIcon/MyTooltipIcon';
import './LinkAttachment.scss';
import configs from '@/configuration';

const LinkAttachment = () => {
  const [open, setOpen] = useState(false);
  const formData = useTypedSelector((state) => state.collection.currentCollection);

  const handleOpenChange = (newOpen: boolean) => {
    if (!formData?._id) {
      return;
    }
    setOpen(newOpen);
  };

  const handleOpenFormResponse = (e) => {
    if (!formData?._id) {
      return;
    }
    e.preventDefault();
    window.open(`${configs.FE_BASE_URL}/forms/${formData._id}/viewform`, '_blank');
  };

  if (!formData) {
    return null;
  }

  return (
    <Popover
      overlayClassName="link-attachment-overlay"
      content={(
        <a
          href="*"
          onClick={handleOpenFormResponse}
          style={{ textOverflow: 'ellipsis', overflow: 'hidden', display: 'inline-block', width: '-webkit-fill-available' }}
        >
          {`${configs.FE_BASE_URL}/forms/${formData._id}/viewform`}
        </a>
      )}
      title="Your form response link:"
      trigger="click"
      open={open}
      onOpenChange={handleOpenChange}
      overlayStyle={{ width: 400 }}
      overlayInnerStyle={{ padding: 20, paddingTop: 16, paddingBottom: 10 }}
    >
      <div className="header-function-btn link-attachment-button">
        <MyTooltipIcon title="Response Link Attachment">
          <LinkOutlined />
        </MyTooltipIcon>
      </div>
    </Popover>
  );
};

export default LinkAttachment;
