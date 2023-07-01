import React from 'react';
import { DownloadOutlined, LoadingOutlined } from '@ant-design/icons';
import { Spin, message } from 'antd';
import moment from 'moment';
import { useParams } from 'react-router-dom';
import { MyTooltipIcon } from '@/components/common';
import { DOWNLOAD_PREPARING_MESSAGE, NO_QUESTIONS_EXISTED_MESSAGE } from '@/constants/message';
import useDispatchAsyncAction from '@/hooks/useDispatchAsyncAction';
import { exportExcelFile, nonAccentVietnamese } from '@/utilities/helpers';
import './ExportExcelButton.scss';

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const ExportExcelButton = () => {
  const params = useParams();
  const formId = params.id;
  const [run] = useDispatchAsyncAction();
  const [preparing, setPreparing] = React.useState(false);
  const formTitle = 'Untitled Form';


  const handleExportClick = async () => {
    setPreparing(true);
    message.info(DOWNLOAD_PREPARING_MESSAGE);

    setPreparing(false);

    return null;
  };

  return (
    <div className="export-excel-button">
      <MyTooltipIcon
        title="Download responses"
        onClick={handleExportClick}
      >
        <DownloadOutlined />
      </MyTooltipIcon>

      { preparing && <Spin spinning={preparing} indicator={antIcon} /> }
    </div>
  );
};

export default ExportExcelButton;
