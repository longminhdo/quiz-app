import React, { HTMLAttributes, useMemo, useState } from 'react';
import { PictureOutlined, InboxOutlined } from '@ant-design/icons';
import './MyUploadImage.scss';
import { message, Modal, Tabs, Upload, UploadProps } from 'antd';
import MyTooltipIcon from '@/components/common/MyTooltipIcon/MyTooltipIcon';
import configs from '@/configuration';

const { Dragger } = Upload;

interface MyUploadImageProps
  extends React.DetailedHTMLProps<
    HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  uploadCallback?: any;
}

const MyUploadImage: React.FC<MyUploadImageProps> = ({
  uploadCallback,
  ...rest
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const props: UploadProps = useMemo(() => ({
    accept: 'image/png, image/jpeg',
    name: 'file',
    multiple: false,
    action: `${configs.BE_BASE_URL}/media`,
    onChange(info) {
      const { status } = info.file;

      if (status === 'done') {
        uploadCallback
            && uploadCallback(JSON.parse(info.file.xhr?.response).data[0]);
        message.success(`${info.file.name} file uploaded successfully.`);
        setIsModalOpen(false);
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  }), [uploadCallback]);

  const uploadImageFromFile = useMemo(
    () => (
      <Dragger {...props}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">
          Click or drag file to this area to upload
        </p>
        <p className="ant-upload-hint">
          Support for a single or bulk upload. Strictly prohibit from uploading
          company data or other band files
        </p>
      </Dragger>
    ),
    [props],
  );

  const uploadImageFromUrl = useMemo(() => <div>upload url</div>, []);

  return (
    <div className="my-upload-image" {...rest}>
      <MyTooltipIcon title="Upload an image" onClick={showModal}>
        <PictureOutlined />
      </MyTooltipIcon>

      <Modal
        title="Insert image"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        className="my-upload-image-modal"
        destroyOnClose
        footer={null}
      >
        <Tabs
          defaultActiveKey="1"
          items={[
            {
              label: 'Upload',
              key: '1',
              children: uploadImageFromFile,
            },
            {
              label: 'By URL',
              key: '2',
              children: uploadImageFromUrl,
            },
          ]}
        />
      </Modal>
    </div>
  );
};

export default MyUploadImage;
