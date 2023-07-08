import { DeleteOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Image, Upload, message } from 'antd';
import type { UploadChangeParam } from 'antd/es/upload';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';
import { isEqual } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { Media } from '@/types/media';
import configs from '@/configuration';
import MyTooltipIcon from '@/components/common/MyTooltipIcon/MyTooltipIcon';
import './MyUploadImage.scss';


interface MyUploadImageProps {
  value?: Media;
  onChange?: any
  disableOnLoading?: any;
}

const MyUploadImage: React.FC<MyUploadImageProps> = ({
  value = undefined, onChange = () => undefined, disableOnLoading = () => undefined,
}) => {
  const [media, setMedia] = useState<Media>();
  const [loading, setLoading] = useState(false);

  const mediaRef = useRef<Media>();

  useEffect(() => {
    if (!isEqual(mediaRef.current, value)) {
      setMedia(value);
      mediaRef.current = value;
    }
  }, [value]);

  const beforeUpload = (file: any) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  };

  const handleChange: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      disableOnLoading && disableOnLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      const receivedMedia = JSON.parse(info.file.xhr?.response).data[0];
      setMedia(receivedMedia);
      onChange && onChange(receivedMedia);
      setLoading(false);
      disableOnLoading && disableOnLoading(false);
      message.success(`${info.file.name} file uploaded successfully.`);
    }
    if (info.file.status === 'error') {
      setMedia(mediaRef.current);
      onChange && onChange(mediaRef.current);
      setLoading(false);
      disableOnLoading && disableOnLoading(false);
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  const handleFilenameClick = () => {
    window.open(media?.url);
  };

  const handleMediaDelete = () => {
    onChange && onChange(undefined);
    setMedia(undefined);
  };

  return (
    <div className="my-upload-image">
      { media?.url ? null : (
        <Upload
          listType="picture-card"
          showUploadList={false}
          action={`${configs.BE_BASE_URL}/media`}
          beforeUpload={beforeUpload}
          multiple={false}
          name="file"
          onChange={handleChange}
        >
          <div>
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Upload</div>
          </div>
        </Upload>
      )}

      {media?.url ? (
        <div className="media-container">
          <div className="media">
            <div className="img-wrapper">
              <Image src={media?.url} alt={media?.filename} />
            </div>
            <Button style={{ padding: 0 }} type="link" onClick={handleFilenameClick}>
              {media?.filename}
            </Button>
          </div>

          <MyTooltipIcon title="Delete image" onClick={handleMediaDelete}>
            <DeleteOutlined />
          </MyTooltipIcon>
        </div>
      ) : null}
    </div>
  );
};

export default MyUploadImage;
